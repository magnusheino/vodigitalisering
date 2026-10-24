# Julkalendern – spec

Beslut från designgenomgången 2026-10-24. Begreppen definieras i [GLOSSARY.md](../GLOSSARY.md); uppdragen själva finns i `src/innehall.ts`.

## Syfte

Ett lättsamt kollegaskoj i december: varje arbetsdag fram till julafton öppnas en lucka med ett uppdrag som deltagarna utför och lämnar in i kalenderkanalen i Teams. Sidan är statisk och kan kopieras till valfri webbplats ([ADR-0001](adr/0001-statisk-sida-med-las-pa-heder.md)).

## Luckor och datum

- En lucka per vardag 1–23 december; ingen lucka på julafton och inga luckor på helger. 2026 ger 17 luckor: 1–4, 7–11, 14–18, 21–23.
- Luckan numreras med datumet ("Lucka 7" = 7 december).
- Datumen står uttryckligen i innehållsfilen; sidan räknar inte ut arbets- eller helgdagar själv. Inför ett nytt år byts datum och uppdrag i filen.
- "I dag" räknas alltid i svensk tid (Europe/Stockholm), oavsett enhetens tidszon.

## Status och deadline

- **Låst** före sitt datum. Klick ger en skakning och en notis om när luckan öppnar.
- **Öppen** under sitt datum. Inlämning samma dag, senast kl 23:59.
- **Stängd** därefter: går att öppna och läsa, men märkt "Inlämningen stängd" med länk för att se inlämningarna.
- Före första luckan visas en nedräkning; under helger "Vilodag – nästa lucka öppnar …"; efter sista luckan "God jul!".
- Låsning och deadline gäller på heder – sidan kan inte hindra någon från att kika i källkoden eller posta i Teams.

## Uppdrag

- Ett uppdrag per lucka: emoji, rubrik, en till tre korta stycken och vid behov en länk (t.ex. instruktionsvideo).
- AI-fria: inlämningen är ett foto eller ljud av något fysiskt, eller bygger på kunskap bara arbetsplatsen har.
- Ska gå att göra både hemma och på kontoret, på ungefär tio minuter, med saker man redan har.
- Rubriken får inte avslöja lösningen på ett pussel.
- Där det går skapar deltagarna själva gåtorna (t.ex. egna makrobilder och ljud som de andra gissar på) i stället för att arrangören förbereder dem.
- Material som rör enskilda kollegor (t.ex. koppfotona 7/12) postas bara i Teams, aldrig på den publika sidan.

## Inlämning i Teams

- Allt sker i en särskild kalenderkanal, utan en tråd per dag.
- Deltagarna inleder sitt inlägg med luckans märkning, t.ex. "🎄 Lucka 7 – Vem är koppen?", som luckan visar med en kopieringsknapp.
- Gissningar och kommentarer skrivs som svar på inlägget.
- Uppdrag med startinlägg (7/12, 23/12): arrangören postar ett inlägg och deltagarna svarar på det; luckan visar då ingen märkning.
- Länken till kalenderkanalen läggs in i `src/innehall.ts`. Saknas den visar luckan "Länken till kalenderkanalen kommer snart".
- Inga poäng, topplistor eller vinnare på sidan; eventuell tävling sköts i Teams.

## Utseende

- Helskärmsscen: vinternatt med Gävlebocken (egen SVG-illustration, ingen officiell bild eller logga).
- Klick på månen gör det dag: solen går upp, himlen ljusnar och stjärnorna slocknar. Klick på solen gör det natt igen. Sidan minns inte valet.
- Något händer i scenen ett par sekunder efter att sidan öppnats och sedan var 15–30:e sekund. Händelsen slumpas, och samma händelse kommer aldrig två gånger i rad: tomten med renarna flyger förbi, nissar springer över snön, en nisse kikar fram bakom bocken och vinkar, eller en hare skuttar förbi. Bara på natten finns stjärnfall och norrsken, bara på dagen fåglar. Med reducerad rörelse händer inget.
- Luckorna ligger utspridda och osymmetriskt runt bocken, på fasta handplacerade platser (`src/placering.ts`), i olika storlekar och former. 23/12 är störst.
- Dagens lucka glöder. Öppnade luckor visas med dörren uppslagen; sidan minns dem i webbläsaren.
- Klick på en upplåst lucka: dörren svänger upp och uppdraget visas i en ruta ovanpå.
- Reglerna ligger bakom knappen "Så funkar det" och öppnas automatiskt vid första besöket.
- Eget juligt tema utan kommunens logga eller grafiska profil. Ingen veckoindelning eller veckoteman.
- Byggd för dator först. Under 700 px bredd blir bilden ett sidhuvud och luckorna ett rutnät.
- Reducerad rörelse stänger av snöfall, puls och animationer.

## Teknik och publicering

- Vite och vanlig TypeScript utan ramverk. `npm run build` ger `dist/` med en `index.html` och några filer i `assets/`, med relativa sökvägar så att mappen fungerar var den än kopieras. Den måste serveras av en webbserver.
- `npm test` testar datumlogiken och validerar innehållet (vardagar 1–23 december, inga dubbletter, placering för varje lucka).
- Förhandsgranskning med den odokumenterade parametern `?datum=ÅÅÅÅ-MM-DD`.
- Publiceras på GitHub Pages från ett publikt repo via en GitHub Action vid push till `main`. Innehållet ska därför vara fritt från känslig information.
