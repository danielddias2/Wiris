/**
 * WIRIS VIANA — Kwai Metrics Service
 *
 * Usa Kwai Open Platform API para buscar fans_count do creator.
 *
 * Documentação oficial: https://open.kwai.com/ability/5/54
 *
 * REQUISITOS:
 * - App aprovado na Kwai Open Platform
 * - KWAI_ACCESS_TOKEN obtido via fluxo OAuth do creator
 * - KWAI_OPEN_ID do creator autenticado
 *
 * Como configurar:
 * 1. Acesse https://open.kwai.com/
 * 2. Registre um app e solicite as permissões de leitura de perfil
 * 3. Implemente o fluxo OAuth para o creator autorizar:
 *    GET /oauth2/authorize → POST /oauth2/access_token
 * 4. Adicione KWAI_ACCESS_TOKEN e KWAI_OPEN_ID no .env
 */

'use strict';

const fetch = globalThis.fetch || require('node-fetch');

async function fetchKwaiFollowers() {
  const accessToken = process.env.KWAI_ACCESS_TOKEN;
  const openId = process.env.KWAI_OPEN_ID;

  if (!accessToken || !openId) {
    throw new Error('KWAI_ACCESS_TOKEN ou KWAI_OPEN_ID não configurados no .env');
  }

  // Kwai Open Platform — User Profile API
  const url = 'https://open.kwai.com/openapi/user/profile';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      open_id: openId,
      access_token: accessToken,
      fields: ['fans_count', 'following_count', 'photo_count'],
    }),
    timeout: 10000,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Kwai API HTTP ${response.status}: ${body.substring(0, 200)}`);
  }

  const data = await response.json();

  // A Kwai API retorna result=1 para sucesso
  if (data.result !== 1) {
    throw new Error(`Kwai API error: ${data.error_msg || `result=${data.result}`}`);
  }

  const fansCount = data.data?.fans_count;

  if (typeof fansCount !== 'number') {
    throw new Error('fans_count não encontrado na resposta da Kwai API');
  }

  return {
    platform: 'kwai',
    metric: 'followers',
    value: fansCount,
    displayValue: formatDisplay(fansCount),
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

module.exports = { fetchKwaiFollowers };
