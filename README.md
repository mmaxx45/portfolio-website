# Max (mmaxx45) - Self-Ironic Portfolio & Server Fleet 🚀

Eine moderne, interaktive und selbstironische Portfolio-Website für Max (`mmaxx45`), basierend auf dem GitHub-Profil-README.

## ✨ Features

- **Typing Hero**: Animierte Zitate aus dem GitHub-README mit Live-Cursor.
- **🖥️ Server Fleet & Uptime Monitor**:
  - Live-Metriken (CPU, RAM, Speicher, Latenz, Uptime).
  - **100% IP-Schutz**: Keine IP-Adressen oder interne Hostnames im Frontend sichtbar.
  - **Beszel Hub & Uptime Kuma Anbindung**: Live-Echtzeitmetriken von Beszel Agenten (`monitor.spaghetti.wtf`) oder Uptime Kuma.
  - Animierter **"Ping Fleet"**-Button.
- **💸 Live Server-Geldverbrenner**: Berechnet in Echtzeit die Kosten für idle VPS-Instanzen während des Webseitenbesuchs.
- **🚨 "Reboot und alles wird gut" Notfallbutton**: Fullscreen CRT-Glitch mit Linux Kernel Reboot-Logs und Konfetti.
- **🛠️ Interaktive Gimmicks**:
  - **2-Uhr-Nachts Ausreden-Generator** (No-as-a-Service Style).
  - **Java Boilerplate Generator** (`AbstractSingletonProxyFactoryBean`).
  - **Freedom Unit Converter** (Meter in Football-Felder, Waschmaschinen und Bananen).
- **💻 Mini CLI Terminal**: Vollwertiger Terminal-Emulator am Seitenende mit Commands wie `help`, `servers`, `lab`, `reboot`, `coffee`, `sudo`.
- **📦 Ehrlicher Projekt-Showcase**: Repositories (`ServerStack`, `No-as-a-Service`, `Freedom Unit Converter`, `Zipline` etc.) mit Ehrlichkeitsscores.
- **🐳 Docker & Caddy ready**: `Dockerfile` und `Caddyfile` für unkompliziertes Hosting.

---

## 🚀 Schnellstart (Entwicklung)

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Seite läuft dann unter `http://localhost:3000`.

---

## 🔌 Live Server Monitoring (Beszel Hub & Uptime Kuma)

Öffne `src/config.js` und passe die Einstellungen nach Wunsch an:

```javascript
export const config = {
  // 'beszel' | 'kuma' | 'simulated'
  provider: 'beszel',
  useBeszel: true,

  beszel: {
    baseUrl: 'https://monitor.spaghetti.wtf', // PocketBase Beszel Hub
    refreshIntervalMs: 15000,
  },

  kuma: {
    baseUrl: 'https://status.example.com',
    slug: 'servers',
    refreshIntervalMs: 30000,
  }
};
```

---

## 🐳 Docker Deployment

```bash
# Docker Image bauen
docker build -t mmaxx45-portfolio .

# Container starten (Port 80)
docker run -d -p 80:80 --name mmaxx-web mmaxx45-portfolio
```
