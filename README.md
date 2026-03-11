# Trade Tracker – Pokémon GO

Behalte den Überblick über deine Pokémon GO Trades.

**Live:** [pokemon-go-trading-overview.vercel.app](https://pokemon-go-trading-overview.vercel.app)

---

## Features

- Trades erfassen mit Pokémon, Datum, Typ und Notizen
- Pokémon-Suche mit Autocomplete via PokéAPI
- Unterstützung für Varianten, Formen und Tags (Shadow, Purified, Shiny, etc.)
- Dynamax & Gigantamax
- Dark Mode UI
- PWA – als App auf Desktop und Homescreen installierbar

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [PokéAPI](https://pokeapi.co)
- Deployed on [Vercel](https://vercel.com)

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Deploy

```bash
npm run build
```

Der Build stampt automatisch den Service Worker Cache Key, sodass alte Caches bei jedem Deploy invalidiert werden.
