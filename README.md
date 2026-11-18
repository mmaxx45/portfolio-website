# portfolio-website

Selbstironisches Entwickler-Portfolio von Max (mmaxx45) mit Live-Übersicht der eigenen Server-Fleet, Terminal-Spielerei und No-as-a-Service-Ausreden. Gebaut mit Vite und Tailwind CSS, ohne Framework.

## Entwicklung

```bash
npm install     # Abhängigkeiten installieren
npm run dev     # Dev-Server auf http://localhost:3000
npm run build   # Produktions-Build nach dist/
```

## Datenquelle

Die Server-Karten lesen live aus der öffentlichen Beszel-View `systems_public` auf `https://monitor.spaghetti.wtf` (PocketBase-API, ohne Host, Port und Benutzer). Standort, RAM-Größe und Texte pro Server stehen in `src/config.js` unter `serverMeta`. Ist der Hub nicht erreichbar, zeigt die Seite einen Hinweis statt Server-Karten.
