# Julkalendern

En julkalender för kollegorna: en lucka per arbetsdag fram till julafton, med ett AI-fritt uppdrag bakom varje. Deltagarna lämnar in i kalenderkanalen i Teams samma dag. Begreppen finns i [GLOSSARY.md](GLOSSARY.md).

## Ändra innehållet

- **Uppdrag och Teams-länk:** `src/innehall.ts`
- **Luckornas placering i bilden:** `src/placering.ts`

`npm test` kontrollerar att varje uppdrag ligger på en vardag 1–23 december och har en placering.

## Utveckla och förhandsgranska

```sh
npm install
npm run dev
```

Lägg till `?datum=2026-12-10` i adressen för att se kalendern som den ser ut ett visst datum.

## Publicera

`npm run build` skapar mappen `dist/` (en `index.html` och en `assets/`-mapp). Kopiera hela mappen till valfri webbplats. Sidan behöver serveras av en webbserver; att dubbelklicka på `index.html` fungerar inte.

Varje push till `main` publiceras automatiskt på GitHub Pages via `.github/workflows/pages.yml`.
