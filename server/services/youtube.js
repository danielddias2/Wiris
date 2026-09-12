/**
 * WIRIS VIANA — YouTube Metrics Service
 *
 * Usa YouTube Data API v3 para buscar contagem pública de inscritos.
 *
 * IMPORTANTE: O YouTube arredonda a contagem pública de inscritos.
 * Ex: 12.847 aparece como 12.000. Não tente adicionar precisão falsa.
 *
 * Como configurar:
 * 1. Acesse https://console.cloud.google.com/
 * 2. Crie um projeto → ative "YouTube Data API v3"
 * 3. Crie uma chave de API em "Credenciais"
 * 4. Adicione YOUTUBE_API_KEY e YOUTUBE_CHANNEL_ID no .env
 *    O Channel ID está na URL: youtube.com/channel/UC[ID]
 */

'use strict';

const fetch = globalThis.fetch || require('node-fetch');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

async function fetchYouTubeSubscribers() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    throw new Error('YOUTUBE_API_KEY ou YOUTUBE_CHANNEL_ID não configurados no .env');
  }

  let url;
  const trimmed = channelId.trim();

  // 1. Se contiver ID canônico do canal (ex: UCz2A8OXLR2xwYE63zWbu7IA)
  const ucMatch = trimmed.match(/UC[a-zA-Z0-9_-]{20,24}/);
  if (ucMatch) {
    url = `${YOUTUBE_API_BASE}/channels?part=statistics&id=${ucMatch[0]}&key=${apiKey}`;
  } else {
    // 2. Se for link com handle ou handle direto (ex: https://www.youtube.com/@WirisVianaofc ou @WirisVianaofc)
    const handleMatch = trimmed.match(/@([a-zA-Z0-9_.-]+)/);
    if (handleMatch) {
      url = `${YOUTUBE_API_BASE}/channels?part=statistics&forHandle=${encodeURIComponent(handleMatch[1])}&key=${apiKey}`;
    } else {
      url = `${YOUTUBE_API_BASE}/channels?part=statistics&id=${encodeURIComponent(trimmed)}&key=${apiKey}`;
    }
  }

  const response = await fetch(url, { timeout: 10000 });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API HTTP ${response.status}: ${body.substring(0, 200)}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`YouTube API error ${data.error.code}: ${data.error.message}`);
  }

  if (!data.items || data.items.length === 0) {
    throw new Error(`Canal não encontrado: ${channelId}`);
  }

  const stats = data.items[0].statistics;
  const rawValue = parseInt(stats.subscriberCount, 10);

  if (isNaN(rawValue)) {
    throw new Error('subscriberCount inválido na resposta da API');
  }

  return {
    platform: 'youtube',
    metric: 'subscribers',
    value: rawValue,
    displayValue: formatDisplay(rawValue),
    lastUpdated: new Date().toISOString(),
    source: 'official-api',
    status: 'live',
    note: stats.hiddenSubscriberCount ? 'count_hidden_by_creator' : null,
  };
}

function formatDisplay(value) {
  if (typeof value !== 'number' || isNaN(value)) return '—';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return value.toLocaleString('pt-BR');
}

module.exports = { fetchYouTubeSubscribers };
