import { config } from '../config.js';
import { fetchBeszelStats } from './beszel.js';
import { fetchKumaStats, getSimulatedServerStats } from './uptimeKuma.js';

/**
 * Unified Server Fleet Service
 * 
 * Supports:
 * - 'beszel': Real-time agent metrics from Beszel Hub (monitor.spaghetti.wtf)
 * - 'kuma': Uptime Kuma status page metrics
 * - 'simulated': Simulated realistic fleet data
 */
export async function fetchServerStats() {
  if (config.provider === 'beszel' || config.useBeszel) {
    try {
      const stats = await fetchBeszelStats();
      if (stats && stats.length > 0) return stats;
    } catch (e) {
      console.warn('[ServerService] Beszel fetch error, falling back:', e.message);
    }
  } else if (config.provider === 'kuma' || config.useUptimeKuma) {
    try {
      const stats = await fetchKumaStats();
      if (stats && stats.length > 0) return stats;
    } catch (e) {
      console.warn('[ServerService] Kuma fetch error, falling back:', e.message);
    }
  }

  return getSimulatedServerStats();
}

export { getSimulatedServerStats };
