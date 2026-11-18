export const projects = [
  {
    name: 'ServerStack',
    repo: 'mmaxx45/serverstack',
    url: 'https://github.com/mmaxx45/serverstack',
    description: 'Multi-provider Server Inventory & Cost Tracker. Hilft mir beim Überblick, wo mein ganzes Geld eigentlich hingeht.',
    honestComment: 'Wurde gebaut, weil eine Excel-Tabelle meine VPS-Kauflust nicht mehr akkurat visualisieren konnte.',
    tech: ['Debian', 'Docker', 'PostgreSQL', 'API'],
    metrics: {
      sinn: '95%',
      serverCount: 'Zu viele',
      kaufReue: '0%'
    },
    status: 'Aktiv im Einsatz'
  },
  {
    name: 'No-as-a-Service (German Fork)',
    repo: 'mmaxx45/no-as-a-service',
    url: 'https://github.com/mmaxx45/no-as-a-service',
    description: 'Fork des englischen Originals – erweitert um 1000+ deutsche Absage- und Ausredengründe mit /nein Endpoint.',
    honestComment: 'Weil das Original nur auf Englisch war und man Meetings auch auf Deutsch stilvoll ablehnen muss.',
    tech: ['Fork', 'Python / Node', 'FastAPI / Express', 'German NaaS'],
    metrics: {
      sinn: '100%',
      ausredenRate: '∞',
      meetingAbwehr: '99.8%'
    },
    status: 'Offizieller DE Fork'
  },
  {
    name: 'Freedom Unit Converter',
    repo: 'mmaxx45/Freedom-Unit-Converter-App',
    url: 'https://github.com/mmaxx45/Freedom-Unit-Converter-App',
    description: 'Konvertiert langweilige metrische Einheiten in echte Freedom Units (Football-Felder, Waschmaschinen, Bananen).',
    honestComment: 'Weil das metrische System einfach viel zu viel Sinn ergibt.',
    tech: ['Java / Web', 'Math', 'Chaos'],
    metrics: {
      sinn: '11%',
      bananenFaktor: '42x',
      freedomScore: '🦅 100'
    },
    status: 'Höchst wissenschaftlich'
  },
  {
    name: 'Rocketeer Bot',
    repo: 'mmaxx45/rocketeer-bot',
    url: 'https://github.com/mmaxx45/rocketeer-bot',
    description: 'Discord Bot gegen lästige Crossposts mit automatischem Warnsystem und Crossposting Detection.',
    honestComment: 'Weil Ordnung auf dem Discord-Server wichtiger ist als Schlaf.',
    tech: ['Python / JS', 'Discord API', 'Docker'],
    metrics: {
      sinn: '88%',
      spammerAbwehr: '100%',
      koffeinPegel: 'Hoch'
    },
    status: 'Wachsam'
  },
  {
    name: 'Zipline Selfhost',
    repo: 'mmaxx45/zipline',
    url: 'https://github.com/mmaxx45/zipline',
    description: 'ShareX / File Upload Server mit benutzerdefinierten Domains, schnellem Setup und Caddy Integration.',
    honestComment: 'Wozu Google Drive bezahlen, wenn man einen eigenen Server mit 500GB SSD vollpacken kann?',
    tech: ['Node.js', 'Docker', 'Caddy', 'ShareX'],
    metrics: {
      sinn: '90%',
      screenshots: '10k+',
      flexFaktor: 'Maximal'
    },
    status: 'Im Dauerbetrieb'
  },
  {
    name: 'Homelab Infrastructure & Beszel Fleet',
    repo: 'mmaxx45/homelab-fleet',
    url: 'https://github.com/mmaxx45',
    description: 'Verteilte Server-Infrastruktur mit Caddy Edge Proxies, Beszel Agent Monitoring und Garage S3 Storage.',
    honestComment: 'Wird bevorzugt um 2 Uhr nachts umgebaut, damit am nächsten Morgen wieder genau dasselbe wie vorher funktioniert.',
    tech: ['Debian 12', 'Docker', 'Caddy', 'Beszel', 'Garage S3'],
    metrics: {
      sinn: '100%',
      nodeCount: '8 Server',
      uptimeGoal: '99.9%'
    },
    status: 'Produktiv im Einsatz'
  }
];
