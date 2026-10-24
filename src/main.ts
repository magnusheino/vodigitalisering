import './style.css';
import scen from './scen.svg?raw';
import { KALENDERKANALEN_URL, UPPDRAG, type Uppdrag } from './innehall';
import { datumtext, idag, kalenderlage, luckansDag, luckansStatus, markning } from './kalender';
import { startaHandelser } from './handelser';
import { PLACERING } from './placering';

const IDAG = idag(new Date(), location.search);
const AR = UPPDRAG[0].datum.slice(0, 4);
const OPPNADE_NYCKEL = `julkalendern-${AR}-oppnade`;
const REGLER_NYCKEL = `julkalendern-${AR}-regler-visade`;
const DORRFARGER = ['#b3262e', '#1f6f4a', '#c9922e', '#24508f', '#8c2f5a'];

const yta = document.querySelector<HTMLElement>('#yta')!;
const luckor = document.querySelector<HTMLOListElement>('#luckor')!;
const uppdragsruta = document.querySelector<HTMLDialogElement>('#uppdragsruta')!;
const regelruta = document.querySelector<HTMLDialogElement>('#regelruta')!;
const notis = document.querySelector<HTMLElement>('#notis')!;

const reduceradRorelse = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Webbläsarens lagring kan saknas eller vara blockerad; sidan fungerar ändå, den minns bara inget.
function las(nyckel: string): string | null {
  try {
    return localStorage.getItem(nyckel);
  } catch {
    return null;
  }
}
function spara(nyckel: string, varde: string) {
  try {
    localStorage.setItem(nyckel, varde);
  } catch {
    /* inget att göra */
  }
}

const oppnade = new Set<string>(JSON.parse(las(OPPNADE_NYCKEL) ?? '[]'));

function el<K extends keyof HTMLElementTagNameMap>(
  tagg: K,
  egenskaper: Record<string, string> = {},
  ...barn: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagg);
  for (const [namn, varde] of Object.entries(egenskaper)) element.setAttribute(namn, varde);
  element.append(...barn);
  return element;
}

function visaLage() {
  document.querySelector('#ar')!.textContent = AR;
  const lage = kalenderlage(IDAG, UPPDRAG);
  const text = document.querySelector('#lage')!;
  if (lage.typ === 'före') {
    text.textContent =
      lage.dagarKvar === 1 ? 'Första luckan öppnar i morgon!' : `Första luckan öppnar om ${lage.dagarKvar} dagar`;
  } else if (lage.typ === 'slut') {
    text.textContent = 'God jul! 🎄 Tack för i år.';
  } else {
    const dagens = UPPDRAG.find((u) => u.datum === IDAG);
    const nasta = UPPDRAG.find((u) => u.datum > IDAG);
    text.textContent = dagens
      ? `Dagens lucka: ${datumtext(dagens.datum)}`
      : `Vilodag – nästa lucka öppnar ${datumtext(nasta!.datum)}`;
  }
}

function ritaLuckor() {
  UPPDRAG.forEach((uppdrag, i) => {
    const dag = luckansDag(uppdrag.datum);
    const plats = PLACERING[dag];
    const status = luckansStatus(uppdrag.datum, IDAG);
    const knapp = el(
      'button',
      {
        type: 'button',
        class: `lucka lucka--${plats.form}`,
        'data-status': status,
        'aria-label': `Lucka ${dag}${status === 'låst' ? ', låst' : ''}`,
        style: `--x:${plats.x};--y:${plats.y};--storlek:${plats.storlek};--farg:${DORRFARGER[i % DORRFARGER.length]}`,
      },
      el('span', { class: 'lucka__insida', 'aria-hidden': 'true' }, uppdrag.emoji),
      el('span', { class: 'lucka__dorr', 'aria-hidden': 'true' }, String(dag)),
    );
    if (oppnade.has(uppdrag.datum)) knapp.classList.add('lucka--oppnad');
    knapp.addEventListener('click', () => klickaLucka(knapp, uppdrag, status));
    luckor.append(el('li', {}, knapp));
  });
}

function klickaLucka(knapp: HTMLButtonElement, uppdrag: Uppdrag, status: ReturnType<typeof luckansStatus>) {
  if (status === 'låst') {
    knapp.classList.remove('lucka--skakar');
    void knapp.offsetWidth; // startar om skakanimationen
    knapp.classList.add('lucka--skakar');
    visaNotis(`Lucka ${luckansDag(uppdrag.datum)} öppnar ${datumtext(uppdrag.datum)}`);
    return;
  }
  const forstaGangen = !oppnade.has(uppdrag.datum);
  oppnade.add(uppdrag.datum);
  spara(OPPNADE_NYCKEL, JSON.stringify([...oppnade]));
  knapp.classList.add('lucka--oppnad');
  const fordrojning = forstaGangen && !reduceradRorelse() ? 550 : 0;
  setTimeout(() => visaUppdrag(uppdrag, status), fordrojning);
}

function kanalknapp(text: string): Node {
  return KALENDERKANALEN_URL
    ? el('a', { class: 'knapp', href: KALENDERKANALEN_URL, target: '_blank', rel: 'noopener' }, text)
    : el('p', { class: 'ruta__notering' }, 'Länken till kalenderkanalen kommer snart.');
}

function inlamningsdel(uppdrag: Uppdrag, status: ReturnType<typeof luckansStatus>): HTMLElement {
  if (status === 'stängd') {
    return el(
      'div',
      { class: 'ruta__inlamning ruta__inlamning--stangd' },
      el('p', { class: 'ruta__deadline' }, `🔒 Inlämningen stängde ${datumtext(uppdrag.datum)} kl 23:59.`),
      kanalknapp('Se inlämningarna i kalenderkanalen'),
    );
  }
  const instruktion =
    uppdrag.inlamning === 'startinlägg'
      ? el('p', {}, 'Svara på arrangörens startinlägg i kalenderkanalen.')
      : markningsdel(uppdrag);
  return el(
    'div',
    { class: 'ruta__inlamning' },
    el('p', { class: 'ruta__deadline' }, '⏰ Lämna in i dag, senast kl 23:59.'),
    instruktion,
    kanalknapp('Öppna kalenderkanalen'),
  );
}

function markningsdel(uppdrag: Uppdrag): HTMLElement {
  const text = markning(uppdrag);
  const kod = el('code', {}, text);
  const kopiera = el('button', { type: 'button', class: 'markning__kopiera' }, 'Kopiera');
  kopiera.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      kopiera.textContent = 'Kopierat!';
    } catch {
      getSelection()?.selectAllChildren(kod);
      kopiera.textContent = 'Kopiera med Ctrl+C';
    }
  });
  return el(
    'div',
    {},
    el('p', {}, 'Börja ditt inlägg med:'),
    el('div', { class: 'markning' }, kod, kopiera),
  );
}

function visaUppdrag(uppdrag: Uppdrag, status: ReturnType<typeof luckansStatus>) {
  const stang = el('button', { class: 'ruta__stang', type: 'button', 'aria-label': 'Stäng' }, '✕');
  stang.addEventListener('click', () => uppdragsruta.close());
  const lank = uppdrag.lank?.url
    ? el('a', { class: 'knapp knapp--sekundar', href: uppdrag.lank.url, target: '_blank', rel: 'noopener' }, uppdrag.lank.text)
    : '';
  uppdragsruta.replaceChildren(
    stang,
    el('p', { class: 'ruta__datum' }, `Lucka ${luckansDag(uppdrag.datum)} · ${datumtext(uppdrag.datum)}`),
    el('div', { class: 'ruta__emoji', 'aria-hidden': 'true' }, uppdrag.emoji),
    el('h2', { class: 'ruta__rubrik', id: 'uppdragsrubrik' }, uppdrag.rubrik),
    ...uppdrag.beskrivning.map((stycke) => el('p', {}, stycke)),
    lank,
    inlamningsdel(uppdrag, status),
  );
  uppdragsruta.showModal();
}

let notisTimer: number | undefined;
function visaNotis(text: string) {
  notis.textContent = text;
  notis.classList.add('notis--synlig');
  clearTimeout(notisTimer);
  notisTimer = window.setTimeout(() => notis.classList.remove('notis--synlig'), 2600);
}

function stangVidKlickUtanfor(ruta: HTMLDialogElement) {
  ruta.addEventListener('click', (handelse) => {
    if (handelse.target === ruta) ruta.close();
  });
}

function startaRegler() {
  document.querySelector('#regelknapp')!.addEventListener('click', () => regelruta.showModal());
  regelruta.querySelectorAll('[data-stang]').forEach((knapp) => knapp.addEventListener('click', () => regelruta.close()));
  if (!las(REGLER_NYCKEL)) {
    regelruta.showModal();
    spara(REGLER_NYCKEL, 'ja');
  }
}

function snoa() {
  const sno = document.querySelector('#sno')!;
  for (let i = 0; i < 60; i++) {
    const flinga = el('span', {
      style: `--vanster:${Math.random() * 100}%;--storlek:${2 + Math.random() * 4}px;--tid:${8 + Math.random() * 10}s;--fordrojning:${-Math.random() * 18}s;--drift:${-30 + Math.random() * 60}px`,
    });
    sno.append(flinga);
  }
}

function vaxlaDygn() {
  const himlakropp = document.querySelector<SVGGElement>('.himlakropp')!;
  const vaxla = () => {
    const dag = document.body.classList.toggle('dag');
    himlakropp.setAttribute('aria-label', dag ? 'Låt solen gå ner' : 'Låt solen gå upp');
  };
  himlakropp.addEventListener('click', vaxla);
  himlakropp.addEventListener('keydown', (handelse) => {
    if (handelse.key !== 'Enter' && handelse.key !== ' ') return;
    handelse.preventDefault();
    vaxla();
  });
}

yta.insertAdjacentHTML('afterbegin', scen);
visaLage();
ritaLuckor();
stangVidKlickUtanfor(uppdragsruta);
stangVidKlickUtanfor(regelruta);
startaRegler();
snoa();
vaxlaDygn();
startaHandelser(yta.querySelector<SVGSVGElement>('.scen__bild')!);
