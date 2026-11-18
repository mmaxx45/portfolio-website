import { config } from '../config.js';
import { getSimulatedServerStats } from './uptimeKuma.js';

/**
 * Beszel Hub Service (PocketBase-backed API)
 *
 * Fetches real-time server metrics (CPU, RAM, Disk, Uptime) from the
 * Beszel Hub at monitor.spaghetti.wtf.
 *
 * Requirements:
 *   - A PocketBase view collection `systems_public` must exist with public
 *     List/View rules (created via the PocketBase Collections API).
 *   - The view query is: SELECT id, name, status, info, updated FROM systems
 *     which physically excludes host, port, and users at the database level.
 *
 * Beszel `info` field structure (JSON keys):
 *   cpu  - CPU usage %
 *   mp   - Memory usage %
 *   dp   - Disk usage %
 *   u    - Uptime in seconds
 *   b    - Bandwidth (bytes/s, legacy)
 *   bb   - Bandwidth (bytes/s, current)
 *   m    - CPU model string (NOT total RAM!)
 *   c    - CPU core count
 *   t    - CPU thread count
 *   h    - Hostname
 *   k    - Kernel version
 *   v    - Agent version
 *   dt   - Dashboard temperature
 *   la   - Load average [1m, 5m, 15m]
 */

// The systems_public view collection already excludes sensitive fields (host/port/users)
// at the database level, so no `fields` filter is needed.

function sanitizeName(name) {
  if (!name) return 'Server Node';
  return name.replace(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, '[REDACTED]');
}

function formatGB(gb) {
  return Math.round(gb) < 1000 ? `${Math.round(gb)} GB` : `${(gb / 1000).toFixed(1)} TB`;
}

export async function fetchBeszelStats() {
  if (!config.beszel?.baseUrl) {
    return getSimulatedServerStats();
  }

  try {
    const baseUrl = config.beszel.baseUrl.replace(/\/$/, '');
    const collection = config.beszel.collection || 'systems_public';
    const url = `${baseUrl}/api/collections/${collection}/records?sort=name`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const items = data.items || [];

    if (items.length === 0) {
      console.warn('[Beszel] API returned 0 items. Make sure the systems_public view collection exists with public List/View rules.');
      return getSimulatedServerStats();
    }

    return parseBeszelData(items);
  } catch (err) {
    console.warn('[Beszel] Failed to fetch live metrics from Beszel Hub, using fallback:', err.message);
    return getSimulatedServerStats();
  }
}

function parseBeszelData(items) {
  return items.map((sys, index) => {
    const isUp = sys.status === 'up';
    const isWarn = sys.status === 'paused' || sys.status === 'warning';

    const info = sys.info || {};

    // CPU usage percentage
    const cpu = typeof info.cpu === 'number' ? Math.round(info.cpu) : 0;

    // Memory usage percentage (info.mp) + RAM GB detail from config metadata
    const meta = config.serverMeta?.[sys.name] || {};
    const ram = typeof info.mp === 'number' ? Math.round(info.mp) : 0;
    const ramTotalGB = meta.ramTotal || 8;
    const ramUsedGB = Math.round((ramTotalGB * ram) / 100 * 10) / 10;
    const ramDetail = `${ramUsedGB} / ${ramTotalGB} GB (${ram}%)`;

    // Fallback: disk usage percentage (info.dp, root fs only) + optional total from config metadata
    let diskPercent = typeof info.dp === 'number' ? Math.round(info.dp) : 0;
    const diskTotalGB = meta.diskTotal || null;
    let diskDetail = `${diskPercent}%`;
    if (diskTotalGB) {
      const usedGB = Math.round((diskTotalGB * diskPercent) / 100);
      diskDetail = `${usedGB} / ${diskTotalGB} GB`;
    }

    // Live disk totals in GB (root + extra disks): { d: total, du: used }; may be null or a JSON string
    let disk = sys.disk;
    if (typeof disk === 'string') {
      try { disk = JSON.parse(disk); } catch { disk = null; }
    }
    if (disk && disk.d > 0 && typeof disk.du === 'number') {
      diskPercent = Math.round((disk.du / disk.d) * 100);
      diskDetail = `${formatGB(disk.du)} / ${formatGB(disk.d)}`;
    }

    // Uptime in seconds (info.u)
    let uptimeDays = 0;
    if (typeof info.u === 'number' && info.u > 0) {
      uptimeDays = Math.floor(info.u / 86400);
    }

    // CPU cores (info.c) and model (info.m)
    const cores = typeof info.c === 'number' ? info.c : null;
    const cpuModel = typeof info.m === 'string' ? info.m : null;

    // Agent version (info.v)
    const agentVersion = typeof info.v === 'string' ? info.v : null;

    const uptimePercent = isUp ? 99.9 : (isWarn ? 95.0 : 0.0);

    const displayName = sanitizeName(sys.name || `Node #${index + 1}`);

    // Location and usecase from config metadata
    const location = meta.location || 'Unknown';
    const usecase = meta.usecase || null;

    // Build role string from usecase and available info
    let role = usecase || 'Production Server';
    if (cpuModel) {
      role += ` • ${cpuModel}`;
    }
    if (cores) {
      role += ` (${cores}C)`;
    }

    // Use custom tags from config, or fall back to auto-generated badges
    const badges = Array.isArray(meta.tags) && meta.tags.length > 0
      ? [...meta.tags]
      : (() => {
          const auto = ['Beszel Agent'];
          if (agentVersion) auto.push(`v${agentVersion}`);
          if (cores) auto.push(`${cores} Cores`);
          return auto;
        })();

    return {
      id: sys.id || `beszel-${index}`,
      name: displayName,
      role,
      location,
      status: isUp ? 'up' : (isWarn ? 'warning' : 'down'),
      uptimePercent,
      cpuPercent: cpu,
      ramPercent: ram,
      ramDetail,
      ramUsedGB,
      ramTotalGB,
      containersCount: meta.containers || 1,
      storagePercent: diskPercent,
      storageDetail: diskDetail,
      uptimeDays,
      honestNote: !isUp ? 'Beszel meldet Node Offline!' : (meta.honestNote || 'Beszel Agent – Live-Daten'),
      badges
    };
  });
}

export async function fetchServerStats() {
  if (config.provider === 'beszel' || config.useBeszel) {
    return fetchBeszelStats();
  }
  return getSimulatedServerStats();
}
