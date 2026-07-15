# OMSCS Wordle

Wordle for Georgia Tech's OMSCS program. Guess the 5-letter CS/OMSCS word of the day.

**Play it:** https://nkapila6.github.io/omscs-wordle/

## How it works

- **Word of day:** Deterministic seed based on UTC+4 date. No backend, no API. Same word for everyone on the same day.
- **Hard mode:** Only words in the curated list are valid guesses. Every guess is a CS/OMSCS word.
- **Hints:** 3 progressive tiers (letter reveal, repeated-letter info, full course reference). Tracked as "X/3 hints revealed" in share text.
- **Colors:** Georgia Tech themed. Old Gold for correct, Navy Blue for present.
- **Stats:** None. No accounts, no backend. Game state persists in localStorage per day.

## Word list

703 curated 5-letter words across 25+ categories, each with a course-specific hint:

- Operating Systems (CS 6200/6210)
- Computer Networks (CS 6250)
- Machine Learning (CS 7641)
- Deep Learning (CS 7643)
- NLP (CS 7650)
- Computer Vision (CS 6476)
- Algorithms (CS 6515)
- Security (CS 6035/6262)
- Databases (CS 6400)
- OMSCS Lore (Danny the llama, Klaus, Slack, etc.)
- ...and more

The list lives in `src/data/words.ts`. Add words there to extend the cycle.

## Tech

- Vite + React + TypeScript
- Plain CSS (dark mode only, GT themed)
- No dependencies beyond React
- Impeccable design principles applied
- Deployed via GitHub Pages (auto on push to master)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Project structure

```
src/
  data/words.ts        # curated wordlist (703 words)
  game/engine.ts       # word-of-day, guess eval, hints, share text
  game/types.ts        # shared types
  hooks/useGame.ts     # game state hook (localStorage persistence)
  components/          # Board, Keyboard, Header, HintPanel, GameOverModal
  styles/app.css       # all styling
```

## Deploy

Pushes to `master` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`.
