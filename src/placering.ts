// Var luckorna sitter i bilden. Scenen är 16:9 och bocken står i mitten
// (ungefär x 37–71 %, y 7–93 %), så luckorna är utspridda runt den.

export type Form = 'kvadrat' | 'hög' | 'bred' | 'rund';

export type Placering = {
  /** Luckans mittpunkt i procent av scenens bredd. */
  x: number;
  /** Luckans mittpunkt i procent av scenens höjd. */
  y: number;
  /** Luckans storlek i procent av scenens bredd. */
  storlek: number;
  form: Form;
};

/** Nyckeln är luckans dag i december. */
export const PLACERING: Record<number, Placering> = {
  1: { x: 9, y: 33, storlek: 7, form: 'kvadrat' },
  2: { x: 24, y: 27, storlek: 6, form: 'rund' },
  3: { x: 87, y: 30, storlek: 6, form: 'hög' },
  4: { x: 74, y: 19, storlek: 6.5, form: 'kvadrat' },
  7: { x: 33, y: 86, storlek: 5.5, form: 'kvadrat' },
  8: { x: 32, y: 44, storlek: 6, form: 'kvadrat' },
  9: { x: 90, y: 53, storlek: 6, form: 'rund' },
  10: { x: 75, y: 43, storlek: 7, form: 'kvadrat' },
  11: { x: 8, y: 86, storlek: 6.5, form: 'bred' },
  14: { x: 41, y: 14, storlek: 6, form: 'bred' },
  15: { x: 28, y: 64, storlek: 6, form: 'hög' },
  16: { x: 77, y: 88, storlek: 5.5, form: 'rund' },
  17: { x: 88, y: 80, storlek: 7, form: 'kvadrat' },
  18: { x: 22, y: 85, storlek: 5.5, form: 'rund' },
  21: { x: 46, y: 56, storlek: 5.5, form: 'kvadrat' },
  22: { x: 77, y: 64, storlek: 6, form: 'bred' },
  23: { x: 14, y: 60, storlek: 11, form: 'kvadrat' },
};
