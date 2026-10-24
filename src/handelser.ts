// Små händelser i scenen: något händer strax efter att sidan öppnats, sedan då och då.
// Varje händelse ritas som en SVG-grupp, flyttas med Web Animations och tas bort när den är klar.

type Lager = { himmel: SVGGElement; mark: SVGGElement };
type Handelse = { namn: string; bara?: 'natt' | 'dag'; spela: (lager: Lager, kant: Kant) => Promise<void> };
type Kant = { vanster: number; hoger: number };

const SVG_NS = 'http://www.w3.org/2000/svg';

const slump = (min: number, max: number) => min + Math.random() * (max - min);
const valj = <T>(lista: T[]) => lista[Math.floor(Math.random() * lista.length)];
const arDag = () => document.body.classList.contains('dag');

function grupp(lager: SVGGElement, innehall: string, vand = false): SVGGElement {
  const g = document.createElementNS(SVG_NS, 'g');
  g.innerHTML = vand ? `<g transform="scale(-1 1)">${innehall}</g>` : innehall;
  lager.append(g);
  return g;
}

async function spela(g: SVGGElement, steg: Keyframe[], tid: number, lattnad = 'linear') {
  await g.animate(steg, { duration: tid, easing: lattnad, fill: 'forwards' }).finished.catch(() => {});
  g.remove();
}

const flytt = (x: number, y: number, extra: Keyframe = {}): Keyframe => ({ transform: `translate(${x}px, ${y}px)`, ...extra });

// ---------- Figurerna, ritade med origo vid fötterna och ansiktet åt höger ----------

const ren = (x: number, y: number, nos: string) => `
  <g transform="translate(${x} ${y})">
    <g stroke="#4a2e17" stroke-width="3.5" stroke-linecap="round">
      <path class="ben" d="M-14 6L-18 24"/><path class="ben ben--andra" d="M-8 6L-6 24"/>
      <path class="ben ben--andra" d="M10 6L8 24"/><path class="ben" d="M16 6L20 24"/>
    </g>
    <path d="M-22 -2L-28 -7" stroke="#7a4f2a" stroke-width="5" stroke-linecap="round"/>
    <ellipse rx="23" ry="10" fill="#7a4f2a"/>
    <path d="M12 -5L24 -19L31 -16L22 2Z" fill="#7a4f2a"/>
    <ellipse cx="32" cy="-19" rx="10" ry="6" fill="#7a4f2a"/>
    <path d="M27 -24L23 -38M23 -38L17 -42M23 -38L28 -45M24 -31L18 -33" stroke="#e2cfa4" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${nos}
  </g>`;

const SLADE = `
  <g transform="scale(1.15)">
    <path d="M58 -14L250 -26" stroke="#c9922e" stroke-width="1.6"/>
    ${ren(250, -24, '<circle cx="42" cy="-18" r="7" fill="#ff4a3d" opacity="0.4"/><circle cx="42" cy="-18" r="3.5" fill="#ff3b30"/>')}
    ${ren(180, -16, '<circle cx="42" cy="-18" r="2.5" fill="#2b1d14"/>')}
    ${ren(110, -8, '<circle cx="42" cy="-18" r="2.5" fill="#2b1d14"/>')}
    <path d="M-46 -26C-58 -44 -40 -60 -28 -52C-22 -62 -8 -56 -12 -42C-8 -34 -16 -24 -30 -22Z" fill="#8b5a2b"/>
    <path d="M-30 -48L-18 -36" stroke="#c9922e" stroke-width="3"/>
    <path d="M-6 -18C-10 -34 -2 -44 8 -44C20 -44 24 -32 20 -18Z" fill="#c8102e"/>
    <path d="M14 -34L46 -20" stroke="#c8102e" stroke-width="6" stroke-linecap="round"/>
    <circle cx="8" cy="-52" r="8" fill="#f1c7a3"/>
    <path d="M0 -51C-1 -36 17 -36 16 -51C12 -46 4 -46 0 -51Z" fill="#fff"/>
    <path d="M-1 -56C2 -72 16 -74 24 -64L17 -57Z" fill="#c8102e"/>
    <rect x="-2" y="-59" width="20" height="5" rx="2.5" fill="#fff"/>
    <circle cx="25" cy="-64" r="3.5" fill="#fff"/>
    <path d="M-50 -2L-54 -28C-54 -35 -46 -37 -42 -32L-34 -18H30L42 -26L46 -6C46 0 42 4 36 4H-42Z" fill="#b3262e"/>
    <path d="M-30 4V12M22 4V12" stroke="#ffd77a" stroke-width="3"/>
    <path d="M-56 12H48C62 12 66 -2 60 -12" fill="none" stroke="#ffd77a" stroke-width="4" stroke-linecap="round"/>
  </g>`;

const nisse = (paket: boolean, vinkar = false) => `
  <g transform="scale(1.4)">
    <g stroke="#3a2a1e" stroke-width="4" stroke-linecap="round">
      <path class="ben ben--snabb" d="M-4 -12L-6 0"/><path class="ben ben--snabb ben--andra" d="M4 -12L6 0"/>
    </g>
    <path d="M-12 -10C-13 -30 13 -30 12 -10Z" fill="#c8102e"/>
    <rect x="-12" y="-14" width="24" height="3" fill="#2b1d14"/>
    ${vinkar ? '<path class="vinka" d="M9 -22L20 -36" stroke="#c8102e" stroke-width="4.5" stroke-linecap="round"/><circle cx="20.5" cy="-37" r="3" fill="#f1c7a3"/>' : ''}
    <circle cx="2" cy="-31" r="7.5" fill="#f1c7a3"/>
    <path d="M-5 -30C-5 -19 10 -19 10 -30C6 -26 -1 -26 -5 -30Z" fill="#fff"/>
    <circle cx="9.5" cy="-31" r="2" fill="#e08b70"/>
    <path d="M-7 -34L10 -36L-18 -54Z" fill="#c8102e"/>
    <circle cx="-18" cy="-54" r="3" fill="#fff"/>
    ${paket ? '<rect x="8" y="-26" width="16" height="14" rx="1.5" fill="#1f6f4a"/><path d="M16 -26V-12M8 -19H24" stroke="#ffd77a" stroke-width="2.5"/>' : ''}
  </g>`;

const HARE = `
  <g transform="scale(1.3)">
    <path d="M10 -22L2 -42L8 -43L15 -23Z" fill="#8f7d69"/>
    <path d="M13 -22L10 -42L15 -42L17 -23Z" fill="#a08d78"/>
    <ellipse cy="-10" rx="15" ry="9.5" fill="#a08d78"/>
    <circle cx="13" cy="-17" r="7" fill="#a08d78"/>
    <circle cx="16" cy="-19" r="1.4" fill="#2b1d14"/>
    <circle cx="-15" cy="-13" r="4.5" fill="#fff"/>
    <path d="M-8 -2L-14 0M6 -2L10 0" stroke="#8f7d69" stroke-width="4" stroke-linecap="round"/>
  </g>`;

const FAGEL = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})"><path class="flaxa" d="M-14 -4Q-7 -10 0 0Q7 -10 14 -4" fill="none" stroke="#2b3a52" stroke-width="2.6" stroke-linecap="round"/></g>`;

// ---------- Händelserna ----------

const HANDELSER: Handelse[] = [
  {
    namn: 'tomten flyger förbi',
    spela: ({ himmel }, { vanster, hoger }) => {
      const atHoger = Math.random() < 0.6;
      const g = grupp(himmel, SLADE, !atHoger);
      const [start, slut] = atHoger ? [vanster - 400, hoger + 400] : [hoger + 400, vanster - 400];
      const hojd = slump(180, 300);
      const steg = Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        return flytt(start + (slut - start) * t, hojd - 110 * t + Math.sin(t * Math.PI * 3) * 22);
      });
      return spela(g, steg, 13000);
    },
  },
  {
    namn: 'nissar springer över snön',
    spela: async ({ mark }, { vanster, hoger }) => {
      const atHoger = Math.random() < 0.5;
      const antal = valj([1, 1, 2, 3]);
      const lopp = Array.from({ length: antal }, (_, i) => {
        const g = grupp(mark, nisse(i === 0 && Math.random() < 0.6), !atHoger);
        const y = slump(855, 885);
        const [start, slut] = atHoger ? [vanster - 60, hoger + 60] : [hoger + 60, vanster - 60];
        const steg = Array.from({ length: 41 }, (_, j) => flytt(start + ((slut - start) * j) / 40, y - (j % 2) * 7));
        return new Promise<void>((klar) => setTimeout(() => spela(g, steg, 8000).then(klar), i * slump(350, 900)));
      });
      await Promise.all(lopp);
    },
  },
  {
    namn: 'en nisse kikar fram bakom bocken',
    spela: ({ mark }) => {
      const [x, gomd, uppe] = valj([
        [700, 540, 456],
        [800, 540, 452],
        [1060, 300, 228],
      ]);
      const g = grupp(mark, nisse(false, true));
      return spela(
        g,
        [
          flytt(x, gomd, { offset: 0 }),
          flytt(x, gomd, { offset: 0.1 }),
          flytt(x, uppe, { offset: 0.2, easing: 'ease-out' }),
          flytt(x, uppe, { offset: 0.8 }),
          flytt(x, gomd, { offset: 0.92, easing: 'ease-in' }),
          flytt(x, gomd, { offset: 1 }),
        ],
        6000,
      );
    },
  },
  {
    namn: 'en hare skuttar förbi',
    spela: ({ mark }, { vanster, hoger }) => {
      const atHoger = Math.random() < 0.5;
      const g = grupp(mark, HARE, !atHoger);
      const [start, slut] = atHoger ? [vanster - 60, hoger + 60] : [hoger + 60, vanster - 60];
      const y = slump(790, 812);
      const skutt = Math.max(8, Math.round(Math.abs(slut - start) / 150));
      const steg: Keyframe[] = [];
      for (let i = 0; i <= skutt * 2; i++) {
        steg.push(flytt(start + ((slut - start) * i) / (skutt * 2), i % 2 ? y - 45 : y, { easing: i % 2 ? 'ease-in' : 'ease-out' }));
      }
      return spela(g, steg, skutt * 480);
    },
  },
  {
    namn: 'stjärnfall',
    bara: 'natt',
    spela: async ({ himmel }, { vanster, hoger }) => {
      const antal = valj([1, 2, 3]);
      const fall = Array.from({ length: antal }, (_, i) => {
        const g = grupp(
          himmel,
          '<path d="M-150 -64L0 0" stroke="url(#stjarnfall)" stroke-width="3" stroke-linecap="round"/><circle r="3" fill="#fff"/>',
        );
        const x = slump(vanster + 100, hoger - 500);
        const y = slump(-150, 200);
        return new Promise<void>((klar) =>
          setTimeout(
            () =>
              spela(
                g,
                [flytt(x, y, { opacity: 0 }), flytt(x + 120, y + 51, { opacity: 1, offset: 0.25 }), flytt(x + 520, y + 222, { opacity: 0 })],
                1300,
                'ease-in',
              ).then(klar),
            i * slump(600, 1800),
          ),
        );
      });
      await Promise.all(fall);
    },
  },
  {
    namn: 'norrsken',
    bara: 'natt',
    spela: ({ himmel }) => {
      const g = grupp(
        himmel,
        `<g filter="url(#mjuk)" fill="none" stroke-linecap="round">
          <path class="norrsken" d="M-900 180C-300 -40 300 280 900 60S2000 -40 2600 120" stroke="#3ee0a0" stroke-width="70"/>
          <path class="norrsken norrsken--andra" d="M-900 60C-200 -120 400 160 1000 -40S2100 -60 2600 20" stroke="#8f6cff" stroke-width="50"/>
        </g>`,
      );
      return spela(
        g,
        [flytt(-120, 0, { opacity: 0 }), flytt(-40, 0, { opacity: 0.55, offset: 0.3 }), flytt(40, 0, { opacity: 0.55, offset: 0.7 }), flytt(120, 0, { opacity: 0 })],
        16000,
        'ease-in-out',
      );
    },
  },
  {
    namn: 'fåglar flyger förbi',
    bara: 'dag',
    spela: ({ himmel }, { vanster, hoger }) => {
      const atHoger = Math.random() < 0.5;
      const flock = [
        [0, 0],
        [-36, -18],
        [-36, 20],
        [-72, -32],
        [-70, 36],
      ]
        .slice(0, valj([3, 4, 5]))
        .map(([x, y]) => FAGEL(x, y))
        .join('');
      const g = grupp(himmel, flock, !atHoger);
      const [start, slut] = atHoger ? [vanster - 150, hoger + 150] : [hoger + 150, vanster - 150];
      const y = slump(60, 320);
      return spela(g, [flytt(start, y), flytt((start + slut) / 2, y - 40), flytt(slut, y + 10)], 14000);
    },
  },
];

/** Den del av bildens koordinater som syns på skärmen i sidled. */
function synligKant(svg: SVGSVGElement): Kant {
  const omvand = svg.getScreenCTM()?.inverse();
  const rect = svg.getBoundingClientRect();
  if (!omvand) return { vanster: 0, hoger: 1600 };
  const vanster = new DOMPoint(Math.max(0, rect.left), 0).matrixTransform(omvand).x;
  const hoger = new DOMPoint(Math.min(innerWidth, rect.right), 0).matrixTransform(omvand).x;
  return { vanster, hoger };
}

export function startaHandelser(svg: SVGSVGElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lager: Lager = {
    himmel: svg.querySelector<SVGGElement>('#himmelslager')!,
    mark: svg.querySelector<SVGGElement>('#marklager')!,
  };
  let forra: Handelse | undefined;

  async function nasta() {
    const mojliga = HANDELSER.filter((h) => h !== forra && (!h.bara || h.bara === (arDag() ? 'dag' : 'natt')));
    forra = valj(mojliga);
    await forra.spela(lager, synligKant(svg));
    setTimeout(nasta, slump(15000, 30000));
  }

  setTimeout(nasta, slump(1200, 2500));
}
