import { config } from '../config.js';

/**
 * Uptime Kuma Service
 * 
 * Fetches monitors from a public Uptime Kuma Status Page or simulates
 * live metrics with realistic jitter and self-ironic annotations.
 */

// Helper to remove any IP-like patterns from string names just in case
function sanitizeName(name) {
  if (!name) return 'Server Node';
  return name.replace(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, '[ANONYMIZED-IP]');
}

// Generate slight dynamic jitter for simulated stats so they feel alive
function jitter(val, min, max, delta = 2) {
  const change = (Math.random() * (delta * 2) - delta);
  return Math.min(max, Math.max(min, Math.round(val + change)));
}

export async function fetchKumaStats() {
  if (config.kuma?.baseUrl && config.kuma?.slug) {
    try {
      const baseUrl = config.kuma.baseUrl.replace(/\/$/, '');
      const slug = config.kuma.slug;

      // Attempt to fetch monitor names from status page config if available
      let monitorNames = {};
      try {
        const pageRes = await fetch(`${baseUrl}/api/status-page/${slug}`);
        if (pageRes.ok) {
          const pageData = await pageRes.json();
          if (pageData && Array.isArray(pageData.publicGroupList)) {
            for (const group of pageData.publicGroupList) {
              if (Array.isArray(group.monitorList)) {
                for (const m of group.monitorList) {
                  if (m.id && m.name) {
                    monitorNames[m.id] = m.name;
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        // Fallback silently if status-page endpoint is not accessible
      }

      const url = `${baseUrl}/api/status-page/heartbeat/${slug}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      // Parse Kuma heartbeat payload
      // Uptime Kuma returns { heartbeatList: { [monitorId]: [ { status, ping, time } ] }, uptimeList: { [monitorId_24]: 1 } }
      if (data && data.heartbeatList) {
        return parseKumaData(data, monitorNames);
      }
    } catch (err) {
      console.warn('[UptimeKuma] Could not fetch live status page, falling back to dummy mode:', err.message);
    }
  }

  // Return dynamic dummy data with live jitter
  return getSimulatedServerStats();
}

export async function fetchServerStats() {
  return fetchKumaStats();
}

function parseKumaData(kumaData, monitorNames = {}) {
  const monitorIds = Object.keys(kumaData.heartbeatList || {});
  return monitorIds.map((id, index) => {
    const heartbeats = kumaData.heartbeatList[id] || [];
    const latest = heartbeats[heartbeats.length - 1] || {};
    const isUp = latest.status === 1;
    const ping = latest.ping || Math.round(10 + Math.random() * 25);
    const uptime24Key = `${id}_24`;
    const uptimePercent = kumaData.uptimeList?.[uptime24Key] 
      ? (kumaData.uptimeList[uptime24Key] * 100).toFixed(2) 
      : (isUp ? '99.9' : '0.0');

    const displayName = monitorNames[id] || `Node #${index + 1} (Kuma Monitor)`;

    return {
      id: `kuma-${id}`,
      name: sanitizeName(displayName),
      role: 'Monitored Service • Debian/Docker',
      location: 'Production Server 🇩🇪',
      status: isUp ? 'up' : 'down',
      uptimePercent: parseFloat(uptimePercent),
      pingMs: ping,
      cpuPercent: Math.round(5 + Math.random() * 15),
      ramPercent: Math.round(60 + Math.random() * 25),
      ramDetail: 'Dynamic Uptime Kuma Feed',
      storagePercent: 65,
      storageDetail: 'Storage Online',
      uptimeDays: Math.floor(20 + index * 45),
      honestNote: isUp ? 'Läuft wie geschmiert (vorerst).' : 'Alarm! Schnall den Neustart-Button um.',
      badges: ['Uptime Kuma', isUp ? 'Operational' : 'Incident', 'Auto-Monitored']
    };
  });
}

export function getSimulatedServerStats() {
  return config.dummyServers.map(server => ({
    ...server,
    pingMs: jitter(server.pingMs, 5, 120, 3),
    cpuPercent: jitter(server.cpuPercent, 1, 95, 2),
    ramPercent: jitter(server.ramPercent, 15, 98, 1),
  }));
}
