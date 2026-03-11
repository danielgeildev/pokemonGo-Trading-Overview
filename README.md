# Trade Tracker – Pokémon GO

Keep track of your Pokémon GO trades.

**Live:** [pokemon-go-trading-overview.vercel.app](https://pokemon-go-trading-overview.vercel.app)

---

## Features

- Log trades with Pokémon, date, type and notes
- Pokémon search with autocomplete via PokéAPI
- Support for variants, forms and tags (Shadow, Purified, Shiny, etc.)
- Dynamax & Gigantamax
- Dark mode UI
- PWA – installable as an app on desktop and mobile home screen

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [PokéAPI](https://pokeapi.co)
- Deployed on [Vercel](https://vercel.com)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

The build automatically stamps the service worker cache key, ensuring old caches are invalidated on every deploy.
