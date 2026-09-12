/**
 * WIRIS VIANA — Metrics Backend Server
 *
 * Express server que:
 * - Expõe /api/metrics para o frontend consumir
 * - Nunca expõe credenciais de API para o cliente
 * - Atualiza métricas periodicamente via cron (a cada 5 min no modo live)
 * - Cache com TTL configurável
 *
 * Como iniciar:
 *   cd server
 *   npm install
 *   cp .env.example .env    # edite com suas credenciais
 *   npm start               # produção
 *   npm run dev             # desenvolvimento com hot-reload
 */

'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { fetchAllMetrics, fetchPlatformMetric, refreshAllMetrics } = require('./socialMetricsService');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const METRICS_MODE = process.env.METRICS_MODE || 'manual';

// ── SEGURANÇA ────────────────────────────────────────────────
app.disable('x-powered-by');
app.set('trust proxy', 1);

// ── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' }));

// ── ROUTES ───────────────────────────────────────────────────

/**
 * GET /api/metrics
 * Retorna métricas de todas as plataformas.
 * Response: { metrics: { youtube, tiktok, instagram, kwai }, fetchedAt, mode }
 */
app.get('/api/metrics', async (req, res) => {
  try {
    const data = await fetchAllMetrics();
    // Cache-Control: permite cache do browser por 60s
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(data);
  } catch (error) {
    console.error('[server] /api/metrics error:', error.message);
    res.status(500).json({
      error: 'Serviço temporariamente indisponível',
      fetchedAt: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/metrics/:platform
 * Retorna métrica de uma plataforma específica.
 * Platforms: youtube, tiktok, instagram, kwai
 */
app.get('/api/metrics/:platform', async (req, res) => {
  const VALID = ['youtube', 'tiktok', 'instagram', 'kwai'];
  const { platform } = req.params;

  if (!VALID.includes(platform)) {
    return res.status(400).json({
      error: `Plataforma inválida. Use: ${VALID.join(', ')}`,
    });
  }

  try {
    const data = await fetchPlatformMetric(platform);
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(data);
  } catch (error) {
    console.error(`[server] /api/metrics/${platform} error:`, error.message);
    res.status(500).json({ error: 'Serviço temporariamente indisponível' });
  }
});

/**
 * GET /health
 * Health check para monitoramento.
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mode: METRICS_MODE,
    uptime: Math.round(process.uptime()),
  });
});

// ── CRON: Atualização periódica ──────────────────────────────
// Executa a cada 5 minutos apenas no modo live
// Configuração: padrão cron '*/5 * * * *'
// Para alterar: ajuste a expressão cron abaixo
if (METRICS_MODE === 'live') {
  cron.schedule('*/5 * * * *', async () => {
    try {
      await refreshAllMetrics();
    } catch (err) {
      console.error('[cron] Erro no refresh:', err.message);
    }
  }, {
    scheduled: true,
    timezone: 'America/Sao_Paulo',
  });

  console.log('[cron] Agendamento de refresh a cada 5 minutos ativo');
}

// ── 404 ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ── ERROR HANDLER ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ── START ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🚀 Wiris Viana — Metrics Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Porta:   ${PORT}`);
  console.log(`  Modo:    ${METRICS_MODE}`);
  console.log(`  Metrics: http://localhost:${PORT}/api/metrics`);
  console.log(`  Health:  http://localhost:${PORT}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

module.exports = app; // para testes
