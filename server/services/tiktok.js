/**
 * WIRIS VIANA — TikTok Metrics Service
 *
 * Usa TikTok Display API v2 para buscar follower_count do creator autenticado.
 *
 * IMPORTANTE: A API oficial do TikTok requer aprovação de app.
 * O fluxo OAuth deve ser implementado separadamente para obter o access_token.
 *
 * Como configurar:
 * 1. Acesse https://developers.tiktok.com/
 * 2. Crie um app → solicite acesso à "Display API"
 * 3. Implemente o fluxo OAuth para o creator autorizar
 * 4. Adicione TIKTOK_ACCESS_TOKEN e TIKTOK_OPEN_ID no .env
 *
 * Nota: Access tokens do TikTok expiram em 24h; implemente refresh automático
 * usando o refresh_token quando necessário.
 */

'use strict';

const fetch = globalThis.fetch || require('node-fetch');

async function fetchTikTokFollowers() {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const openId = process.env.TIKTOK_OPEN_ID;

  if (!accessToken || !openId) {
    throw new Error('TIKTOK_ACCESS_TOKEN ou TIKTOK_OPEN_ID não configurados no .env');
  }

  // TikTok Display API v2 — User Info
  const url = 'https://open.tiktokapis.com/v2/user/info/';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    // query params via URL
  });

  // Tentar URL alternativa com query param fields
  const urlWithFields = 'https://open.tiktokapis.com/v2/user/info/?fields=follower_count,following_count,likes_count,video_count';
  const resp2 = await fetch(urlWithFields, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    timeout: 10000,
  });

  if (!resp2.ok) {
    const body = await resp2.text();
    throw new Error(`TikTok API HTTP ${resp2.status}: ${body.substring(0, 200)}`);
  }

  const data = await resp2.json();

  if (data.error && data.error.code && data.error.code !== 'ok') {
    throw new Error(`TikTok API error: ${data.error.message} (${data.error.code})`);
  }

  const userInfo = data.data?.user;
  if (!userInfo || typeof userInfo.follower_count !== 'number') {
    throw new Error('follower_count não encontrado na resposta da TikTok API');
  }

  const rawValue = userInfo.follower_count;

  return {
    platform: 'tiktok',
    metric: 'followers',
    value: rawValue,
    displayValue: formatDisplay(rawValue),
    lastUpdated: new Date().toISOString(),
    source: 'official-api',
    status: 'live',
  };
}

function formatDisplay(value) {
  if (typeof value !== 'number' || isNaN(value)) return '—';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return value.toLocaleString('pt-BR');
}

module.exports = { fetchTikTokFollowers };
