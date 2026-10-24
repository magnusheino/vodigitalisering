// Kalenderns regler: vilket datum det är i Sverige och vad det betyder för varje lucka.
// Alla datum hanteras som strängar ÅÅÅÅ-MM-DD så att jämförelser blir tidszonsfria.

import type { Uppdrag } from './innehall';
import type { Placering } from './placering';

export type Status = 'låst' | 'öppen' | 'stängd';

export type Kalenderlage =
  | { typ: 'före'; dagarKvar: number }
  | { typ: 'pågår' }
  | { typ: 'slut' };

const DATUM = /^\d{4}-\d{2}-\d{2}$/;

/** Dagens datum i svensk tid, oavsett vilken tidszon enheten har. */
export function idagIStockholm(nu: Date): string {
  const delar = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(nu);
  const del = (typ: string) => delar.find((d) => d.type === typ)!.value;
  return `${del('year')}-${del('month')}-${del('day')}`;
}

/** Dagens datum, eller det låtsade datumet i förhandsgranskningsparametern ?datum=ÅÅÅÅ-MM-DD. */
export function idag(nu: Date, sokstrang: string): string {
  const latsat = new URLSearchParams(sokstrang).get('datum');
  return latsat && DATUM.test(latsat) ? latsat : idagIStockholm(nu);
}

/** En lucka är låst före sitt datum, öppen för inlämning under sitt datum och stängd därefter. */
export function luckansStatus(datum: string, idag: string): Status {
  if (idag < datum) return 'låst';
  if (idag === datum) return 'öppen';
  return 'stängd';
}

export function dagarMellan(fran: string, till: string): number {
  return (tillUtc(till) - tillUtc(fran)) / 86_400_000;
}

export function kalenderlage(idag: string, uppdrag: Uppdrag[]): Kalenderlage {
  const datum = uppdrag.map((u) => u.datum).sort();
  const forsta = datum[0];
  const sista = datum[datum.length - 1];
  if (idag < forsta) return { typ: 'före', dagarKvar: dagarMellan(idag, forsta) };
  if (idag > sista) return { typ: 'slut' };
  return { typ: 'pågår' };
}

/** Luckans nummer är dagen i december. */
export function luckansDag(datum: string): number {
  return Number(datum.slice(8, 10));
}

/** T.ex. "måndag 7 december". */
export function datumtext(datum: string): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(tillUtc(datum)));
}

/** Raden deltagarna inleder sitt inlägg med, så att kalenderkanalen går att följa. */
export function markning(uppdrag: Uppdrag): string {
  return `🎄 Lucka ${luckansDag(uppdrag.datum)} – ${uppdrag.rubrik}`;
}

/** Fel i innehållet som skulle ge en trasig kalender. En tom lista betyder att allt är i ordning. */
export function valideraKalender(uppdrag: Uppdrag[], placering: Record<number, Placering>): string[] {
  const fel: string[] = [];
  const dagar = new Set<number>();
  for (const u of uppdrag) {
    if (!DATUM.test(u.datum)) {
      fel.push(`"${u.rubrik}": datumet ${u.datum} är inte på formen ÅÅÅÅ-MM-DD`);
      continue;
    }
    const dag = luckansDag(u.datum);
    const veckodag = new Date(tillUtc(u.datum)).getUTCDay();
    if (u.datum.slice(5, 7) !== '12' || dag > 23) fel.push(`"${u.rubrik}": ${u.datum} ligger inte 1–23 december`);
    if (veckodag === 0 || veckodag === 6) fel.push(`"${u.rubrik}": ${u.datum} är en helgdag`);
    if (dagar.has(dag)) fel.push(`"${u.rubrik}": det finns redan ett uppdrag den ${dag} december`);
    if (!placering[dag]) fel.push(`"${u.rubrik}": lucka ${dag} saknar placering i placering.ts`);
    if (!u.rubrik.trim() || u.beskrivning.length === 0) fel.push(`Lucka ${dag} saknar rubrik eller beskrivning`);
    dagar.add(dag);
  }
  if (new Set(uppdrag.map((u) => u.datum.slice(0, 4))).size > 1) fel.push('Uppdragen ligger i olika år');
  for (const dag of Object.keys(placering).map(Number)) {
    if (!dagar.has(dag)) fel.push(`placering.ts har lucka ${dag}, men det finns inget uppdrag den dagen`);
  }
  return fel;
}

function tillUtc(datum: string): number {
  const [ar, manad, dag] = datum.split('-').map(Number);
  return Date.UTC(ar, manad - 1, dag);
}
