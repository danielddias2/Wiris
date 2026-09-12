/**
 * WIRIS VIANA — Cache em Memória com TTL
 * Suporta acesso normal (valida TTL) e stale (fallback ignorando expiração)
 */

'use strict';

const CACHE_TTL_MS = (parseInt(process.env.CACHE_TTL_SECONDS, 10) || 300) * 1000;

/** @type {Map<string, {value: any, timestamp: number}>} */
const store = new Map();

const cache = {
  /**
   * Retorna o valor se ainda válido, null se expirado ou inexistente.
   */
  get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      // Mantém no store para uso stale; apenas sinaliza expirado
      return null;
    }
    return entry;
  },

  /**
   * Armazena um valor com timestamp atual.
   */
  set(key, value) {
    store.set(key, { value, timestamp: Date.now() });
  },

  /**
   * Retorna o valor mesmo que expirado — usado como fallback quando a API falha.
   */
  getStale(key) {
    return store.get(key) || null;
  },

  /**
   * Remove uma entrada específica.
   */
  invalidate(key) {
    store.delete(key);
  },

  /**
   * Limpa todo o cache.
   */
  clear() {
    store.clear();
  },

  /**
   * Retorna estatísticas para debugging.
   */
  stats() {
    const now = Date.now();
    const entries = [];
    store.forEach((entry, key) => {
      const ageMs = now - entry.timestamp;
      entries.push({
        key,
        ageSeconds: Math.round(ageMs / 1000),
        isStale: ageMs > CACHE_TTL_MS,
        lastUpdated: new Date(entry.timestamp).toISOString(),
      });
    });
    return {
      entries,
      ttlSeconds: Math.round(CACHE_TTL_MS / 1000),
    };
  },
};

module.exports = cache;
