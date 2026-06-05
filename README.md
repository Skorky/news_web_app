# CZ World Briefing

MVP webové aplikace pro český souhrn světových zpráv podle regionů a témat.

## Funkce

- Záložky: Svět, USA, Evropa, Asie, Česko
- Checkboxy témat: top zprávy, politika, ekonomika, finance, válka/bezpečnost, technologie, marketing/média, investigativa
- RSS zdroje konfigurované v `lib/config.ts`
- Karty článků se zdrojem, důležitostí, paywall štítkem, shrnutím a odkazem
- Automatická obnova na frontendu každých 30 minut
- Serverový endpoint `/api/news`

## Spuštění

```bash
npm install
npm run dev
```

Poté otevřít:

```text
http://localhost:3000
```

## Další kroky

1. Přidat OpenAI API sumarizaci do češtiny místo jednoduchého převzetí RSS popisku.
2. Přidat PostgreSQL a ukládat články, aby se daly deduplikovat a historicky prohledávat.
3. Přidat cron job / Vercel Cron pro aktualizaci feedů na pozadí.
4. Doplnit placené nebo oficiální API zdroje pro Reuters, NYT, Washington Post, Politico podle licence.
5. Přidat stránku detailu článku a denní briefing.

## Poznámka k autorským právům

Aplikace ukládá a zobrazuje pouze metadata, krátký popisek/shrnutí a odkaz. Nekopíruje celé články.
