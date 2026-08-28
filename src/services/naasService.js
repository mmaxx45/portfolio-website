import { config } from '../config.js';
import { excuses } from '../data/excuses.js';

/**
 * No-as-a-Service (NaaS) Client
 * Connects to live NaaS instance (my fork) or falls back to offline reasons.
 */

export async function fetchNaasReason(customUrl = null, lang = 'de') {
  const targetUrl = customUrl || (lang === 'de' ? config.naas.apiUrlDe : config.naas.apiUrlEn);

  if (config.naas.enabled && targetUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

      const res = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.reason) {
          return {
            reason: data.reason,
            source: 'live',
            url: targetUrl
          };
        }
      }
    } catch (err) {
      console.info('[NaaS Service] Live API unavailable or offline, using fallback reasons:', err.message);
    }
  }

  // Offline Fallback
  const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
  return {
    reason: randomExcuse,
    source: 'offline',
    url: targetUrl
  };
}
