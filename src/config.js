/**
 * Max (mmaxx45) Portfolio & Server Fleet Configuration
 */

export const config = {
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
      ramTotal: 96,
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
    stack: 'Debian / Docker / Caddy / Beszel',
    serverType: 'VPS & Bare-Metal Multi-Cluster',
    uptimeEstimate: '99.9%',
  },
};
