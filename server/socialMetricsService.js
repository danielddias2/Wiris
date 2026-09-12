/**
 * WIRIS VIANA — Social Metrics Aggregator
 *
 * Fluxo:
 *   Plataforma → API Oficial → Normalização → Cache → Frontend
 *
 * Modos:
 *   METRICS_MODE=manual → usa MANUAL_VALUES (sem chamadas às APIs)
 *   METRICS_MODE=live   → busca das APIs reais com cache e fallback em cascata
 *
 * Fallback em cascata:
 *   1. Cache válido (TTL não expirado)
 *   2. Valor da API
 *   3. Cache stale (mesmo expirado)
 *   4. Valor manual configurado
 */

'use strict';

const cache = require('./cache');
const { fetchYouTubeSubscribers }  = require('./services/youtube');
const { fetchTikTokFollowers }     = require('./services/tiktok');
const { fetchInstagramFollowers }  = require('./services/instagram');
const { fetchKwaiFollowers }       = require('./services/kwai');

// ── VALORES MANUAIS ──────────────────────────────────────────
// Atualize estes valores enquanto as APIs ainda não estão ativas.
// Quando METRICS_MODE=live, estes valores são usados apenas como último fallback.
const MANUAL_VALUES = {
  youtube: {
    platform: 'youtube',
    metric: 'subscribers',
    value: 12800,          // [PLACEHOLDER] — atualize com o valor real
    displayValue: '12.8K',
    source: 'manual',
    status: 'manual',
  },
  tiktok: {
    platform: 'tiktok',
    metric: 'followers',
    value: 78421,          // [PLACEHOLDER] — atualize com o valor real
    displayValue: '78.4K',
    source: 'manual',
    status: 'manual',
  },
  instagram: {
    platform: 'instagram',
    metric: 'followers',
    value: 45200,          // [PLACEHOLDER] — atualize com o valor real
    displayValue: '45.2K',
    source: 'manual',
    status: 'manual',
  },
  kwai: {
    platform: 'kwai',
    metric: 'followers',
    value: 0,              // [PLACEHOLDER] — atualize com o valor real
    displayValue: '[Em breve]',
    source: 'manual',
    status: 'manual',
  },
};

const METRICS_MODE = process.env.METRICS_MODE || 'manual';
const PLATFORMS = ['youtube', 'tiktok', 'instagram', 'kwai'];

// Mapa de funções de busca por plataforma
const FETCHERS = {
  youtube:   fetchYouTubeSubscribers,
  tiktok:    fetchTikTokFollowers,
  instagram: fetchInstagramFollowers,
  kwai:      fetchKwaiFollowers,
};

/**
 * Busca métrica de uma plataforma com cache e fallback.
 * @param {string} platform
 * @returns {Promise<object>}
 */
async function fetchPlatformMetric(platform) {
  if (!PLATFORMS.includes(platform)) {
    throw new Error(`Plataforma desconhecida: ${platform}`);
  }

  const cacheKey = `metric:${platform}`;

  // Modo manual: retornar valor configurado sem chamar APIs
  if (METRICS_MODE === 'manual') {
    return {
      ...MANUAL_VALUES[platform],
      lastUpdated: new Date().toISOString(),
    };
  }

  // Tentar cache válido primeiro
  const cached = cache.get(cacheKey);
  if (cached) {
    const ageSeconds = Math.round((Date.now() - cached.timestamp) / 1000);
    return {
      ...cached.value,
      status: 'cached',
      cacheAgeSeconds: ageSeconds,
    };
  }

  // Buscar da API oficial
  try {
    const fetcher = FETCHERS[platform];
    const result = await fetcher();

    // Salvar resultado válido no cache
    cache.set(cacheKey, result);
    console.log(`[metrics] ✓ ${platform}: ${result.displayValue} (live)`);
    return result;

  } catch (error) {
    console.error(`[metrics] ✗ ${platform}: ${error.message}`);

    // Fallback 1: cache stale (mesmo expirado é melhor que nada)
    const stale = cache.getStale(cacheKey);
    if (stale) {
      const ageSeconds = Math.round((Date.now() - stale.timestamp) / 1000);
      console.warn(`[metrics] → ${platform}: usando cache stale (${ageSeconds}s)`);
      return {
        ...stale.value,
        status: 'cached',
        cacheAgeSeconds: ageSeconds,
        warning: 'Dados podem estar desatualizados',
      };
    }

    // Fallback 2: valor manual
    console.warn(`[metrics] → ${platform}: usando valor manual`);
    return {
      ...MANUAL_VALUES[platform],
      lastUpdated: new Date().toISOString(),
      status: 'fallback',
      warning: 'API temporariamente indisponível',
    };
  }
}

/**
 * Busca todas as plataformas em paralelo.
 * @returns {Promise<{metrics: object, fetchedAt: string, mode: string}>}
 */
async function fetchAllMetrics() {
  const results = await Promise.allSettled(
    PLATFORMS.map(p => fetchPlatformMetric(p))
  );

  const metrics = {};
  results.forEach((result, i) => {
    const platform = PLATFORMS[i];
    if (result.status === 'fulfilled') {
      metrics[platform] = result.value;
    } else {
      // Último recurso: valor manual mesmo com erro
      metrics[platform] = {
        ...MANUAL_VALUES[platform],
        lastUpdated: new Date().toISOString(),
        status: 'error',
      };
      console.error(`[metrics] CRITICAL ${platform}:`, result.reason?.message);
    }
  });

  return {
    metrics,
    fetchedAt: new Date().toISOString(),
    mode: METRICS_MODE,
    cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS, 10) || 300,
  };
}

/**
 * Força atualização de todas as métricas (chamado pelo cron).
 */
async function refreshAllMetrics() {
  console.log('[metrics] Executando refresh agendado...');
  // Invalidar cache para forçar busca nova
  PLATFORMS.forEach(p => cache.invalidate(`metric:${p}`));
  const result = await fetchAllMetrics();
  const summary = PLATFORMS.map(p =>
    `${p}:${result.metrics[p]?.displayValue || '?'}`
  ).join(' | ');
  console.log(`[metrics] Refresh completo — ${summary}`);
  return result;
}

module.exports = { fetchAllMetrics, fetchPlatformMetric, refreshAllMetrics };
