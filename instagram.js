/**
 * WIRIS VIANA — Instagram Metrics Service
 *
 * Usa Meta Graph API (Instagram Basic Display API ou Instagram Business API)
 * para buscar followers_count.
 *
 * REQUISITOS:
 * - Conta Instagram Business ou Creator conectada a uma Página do Facebook
 * - App Meta com permissões: instagram_basic, instagram_manage_insights
 * - Access token de longa duração (60 dias, renovável)
 *
 * Como configurar:
 * 1. Acesse https://developers.facebook.com/
 * 2. Crie um app do tipo "Business"
 * 3. Adicione o produto "Instagram Graph API"
 * 4. Conecte a conta Instagram Business
 * 5. Gere um User Access Token e troque por Long-lived token:
 *    GET /oauth/access_token?grant_type=fb_exchange_token&...
 * 6. Adicione INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID no .env
 *    O User ID está em: GET /me?fields=id&access_token=...
 */

'use strict';

const fetch = require('node-fetch');

async function fetchInstagramFollowers() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN ou INSTAGRAM_USER_ID não configurados no .env');
  }

  const fields = 'followers_count,media_count,name,username';
  const url = `https://graph.instagram.com/v18.0/${userId}?fields=${fields}&access_token=${accessToken}`;

  const response = await fetch(url, { timeout: 10000 });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Instagram API HTTP ${response.status}: ${body.substring(0, 200)}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Instagram API error ${data.error.code}: ${data.error.message}`);
  }

  const rawValue = data.followers_count;

  if (typeof rawValue !== 'number') {
    throw new Error('followers_count não encontrado na resposta da Instagram API');
  }

  return {
    platform: 'instagram',
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

module.exports = { fetchInstagramFollowers };
