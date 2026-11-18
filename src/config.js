/**
 * Max (mmaxx45) Portfolio & Server Fleet Configuration
 */

export const config = {
  // Provider mode: 'beszel' (default) | 'kuma' | 'simulated'
  provider: 'beszel',
  useBeszel: true,
  useUptimeKuma: false,

  // Beszel Hub settings (PocketBase API)
  beszel: {
    baseUrl: 'https://monitor.spaghetti.wtf',
    collection: 'systems_public', // Public view collection (no host/port/users)
    refreshIntervalMs: 15000,
  },

  // Per-server metadata (keyed by Beszel system name)
  // Enriches live Beszel data with location, RAM, disk size, containers, and usecase
  serverMeta: {
    'crafty': {
      location: 'Frankfurt 🇩🇪',
      ramTotal: 32,
      containers: 3,
      usecase: 'Alter Minecraft Server (Crafty)',
      honestNote: 'Kann den Deal nicht gehen lassen',
      tags: ['Docker', 'Crafty', 'Java', 'Legacy'],
    },
    'mail.mlehrke.de': {
      location: 'Nürnberg 🇩🇪',
      ramTotal: 8,
      containers: 4,
      usecase: 'Mail Server',
      honestNote: 'Mein absolutes Heiligtum',
      tags: ['Docker', 'Mail', 'SMTP'],
    },
    'media': {
      location: 'Eygelshoven 🇳🇱',
      ramTotal: 32,
      containers: 12,
      usecase: 'Mediaserver',
      honestNote: 'Kampf den Streamingdiensten!',
      tags: ['Docker', 'Jellyfin', 'Media'],
    },
    'minecraft': {
      location: 'Frankfurt 🇩🇪',
      ramTotal: 8,
      containers: 1,
      usecase: 'Minecraft SMP (Fabric)',
      honestNote: 'Java gönnt sich Dickste',
      tags: ['Java 25', 'Fabric', 'Gameserver'],
    },
    'portfolio': {
      location: 'Berlin/TXL 🇩🇪',
      ramTotal: 4,
      containers: 3,
      usecase: 'This Website & more',
      honestNote: 'Joa, Titel.',
      tags: ['Docker', 'Caddy', 'Node.js'],
    },
    's3': {
      location: 'Düsseldorf 🇩🇪',
      ramTotal: 8,
      containers: 2,
      usecase: 'S3 Storage (Zipline)',
      honestNote: 'MinIO ist deprecated :(',
      tags: ['Docker', 'Garage', 'S3'],
    },
    'wings-private': {
      location: 'Frankfurt 🇩🇪',
      ramTotal: 8,
      containers: 1,
      usecase: 'Idle (Geldverbrenner)',
      honestNote: '2€ im Monat, da kannste nich meckern, wa',
      tags: ['Docker', 'Wings'],
    },
    'zipline': {
      location: 'Nürnberg 🇩🇪',
      ramTotal: 4,
      containers: 1,
      usecase: 'Zipline',
      honestNote: 'Cooles File Upload Tool.',
      tags: ['Docker', 'Zipline', 'Node.js'],
    },
  },

  // Uptime Kuma settings
  kuma: {
    baseUrl: 'https://status.example.com',
    slug: 'servers',
    refreshIntervalMs: 30000,
  },

  // No-as-a-Service (NaaS) Settings (German Fork by Max!)
  naas: {
    enabled: true, // Try live fetch first, fallback to offline pool if offline
    apiUrlDe: 'https://naas.spaghetti.wtf/nein', // or http://localhost:3000/nein
    apiUrlEn: 'https://naas.spaghetti.wtf/no',
    localUrl: 'http://localhost:3000/nein',
    currentLanguage: 'de', // 'de' | 'en'
  },

  // Developer Profile info
  profile: {
    name: 'Max',
    handle: 'mmaxx45',
    title: 'Hobby Entwickler mit zu viel Zeit, aber zu wenig Ideen',
    githubUrl: 'https://github.com/mmaxx45',
    mottos: [
      { text: "It doesn't work. I don't know why.", sub: "It works. I don't know why." },
      { text: "Reboot und alles wird gut.", sub: "Das Allheilmittel für 99.9% aller Server-Probleme" }
    ],
    serverCostPerHour: 0.125, // ~90€/month across various VPS
  },

  // Homelab & Self-Host Lab stats & config
  homelab: {
    stack: 'Debian 12 / Docker / Caddy / Beszel',
    serverType: 'VPS & Bare-Metal Multi-Cluster',
    uptimeEstimate: '99.9%',
  },

  // Dummy Server Fleet data (used when useUptimeKuma is false or as fallback)
  // Zero server IPs exposed anywhere!
  dummyServers: [
    {
      id: 'hetzner-cpx',
      name: 'Hetzner CPX21 („Der Geldverbrenner“)',
      role: 'Debian 12 • Docker Host • Prod',
      location: 'Nürnberg 🇩🇪',
      status: 'up',
      uptimePercent: 99.98,
      pingMs: 14,
      cpuPercent: 6,
      ramPercent: 89,
      ramDetail: '14.2 / 16 GB (JVM hat sich 12 GB geschnappt)',
      storagePercent: 78,
      storageDetail: '180 GB (110 GB Docker Logs)',
      uptimeDays: 342,
      honestNote: 'Bloß nicht neustarten, keiner weiß warum es läuft.',
      badges: ['Debian 12', 'Docker', 'Caddy', 'Java 21']
    },
    {
      id: 'vps-2am',
      name: 'VPS-02 („Der 2-Uhr-Nachts-Server“)',
      role: 'Debian 12 • Experimental Lab & NaaS',
      location: 'Falkenstein 🇩🇪',
      status: 'up',
      uptimePercent: 98.42,
      pingMs: 19,
      cpuPercent: 2,
      ramPercent: 44,
      ramDetail: '3.5 / 8 GB',
      storagePercent: 35,
      storageDetail: '28 / 80 GB',
      uptimeDays: 28,
      honestNote: 'Läuft aktuell nur 1 Cronjob und der NaaS German Fork.',
      badges: ['NaaS API', 'Python', 'Redis']
    },
    {
      id: 'gaming-node',
      name: 'Lab-Node („Experimental Sandbox“)',
      role: 'Debian 12 • Docker Swarm & Lab',
      location: 'Helsinki 🇫🇮',
      status: 'warning',
      uptimePercent: 96.80,
      pingMs: 31,
      cpuPercent: 12,
      ramPercent: 94,
      ramDetail: '15.1 / 16 GB (Docker Build Cache)',
      storagePercent: 62,
      storageDetail: '124 / 200 GB',
      uptimeDays: 12,
      honestNote: '0 Container aktiv, aber volle 16 GB RAM reserviert („man weiß ja nie“).',
      badges: ['Debian 12', 'Docker', 'Caddy', 'Node.js']
    },
    {
      id: 'caddy-gateway',
      name: 'Caddy Edge Proxy',
      role: 'Reverse Proxy • Auto HTTPS',
      location: 'Cloud Edge 🌐',
      status: 'up',
      uptimePercent: 100.0,
      pingMs: 8,
      cpuPercent: 1,
      ramPercent: 18,
      ramDetail: '360 MB / 2 GB',
      storagePercent: 12,
      storageDetail: '2.4 / 20 GB',
      uptimeDays: 418,
      honestNote: 'Einzige Komponente, die nie abstürzt. Danke Caddy.',
      badges: ['Caddy 2', 'TLS Auto', 'Zero Config']
    }
  ]
};
