import { describe, expect, it } from 'vitest';
import { UPPDRAG } from './innehall';
import {
  datumtext,
  idag,
  idagIStockholm,
  kalenderlage,
  luckansStatus,
  markning,
  valideraKalender,
} from './kalender';
import { PLACERING } from './placering';

describe('innehållet', () => {
  it('ger en hel kalender utan fel', () => {
    expect(valideraKalender(UPPDRAG, PLACERING)).toEqual([]);
  });

  it('har en lucka för varje vardag 1–23 december 2026', () => {
    expect(UPPDRAG.map((u) => u.datum.slice(8))).toEqual([
      '01', '02', '03', '04', '07', '08', '09', '10', '11',
      '14', '15', '16', '17', '18', '21', '22', '23',
    ]);
  });
});

describe('valideraKalender', () => {
  const uppdrag = (datum: string) => ({ datum, emoji: '⭐', rubrik: 'Test', beskrivning: ['x'] });
  const plats = { x: 0, y: 0, storlek: 5, form: 'kvadrat' as const };

  it('underkänner helgdagar, julafton och dubbletter', () => {
    const fel = valideraKalender(
      [uppdrag('2026-12-05'), uppdrag('2026-12-24'), uppdrag('2026-12-07'), uppdrag('2026-12-07')],
      { 5: plats, 7: plats, 24: plats },
    );
    expect(fel).toEqual([
      '"Test": 2026-12-05 är en helgdag',
      '"Test": 2026-12-24 ligger inte 1–23 december',
      '"Test": det finns redan ett uppdrag den 7 december',
    ]);
  });

  it('underkänner luckor utan placering och placeringar utan lucka', () => {
    const fel = valideraKalender([uppdrag('2026-12-01')], { 2: plats });
    expect(fel).toEqual([
      '"Test": lucka 1 saknar placering i placering.ts',
      'placering.ts har lucka 2, men det finns inget uppdrag den dagen',
    ]);
  });
});

describe('idagIStockholm', () => {
  it('räknar i svensk tid även när UTC fortfarande är på föregående dag', () => {
    expect(idagIStockholm(new Date('2026-12-06T23:30:00Z'))).toBe('2026-12-07');
  });

  it('byter dag vid midnatt svensk tid', () => {
    expect(idagIStockholm(new Date('2026-12-07T22:59:59Z'))).toBe('2026-12-07');
    expect(idagIStockholm(new Date('2026-12-07T23:00:00Z'))).toBe('2026-12-08');
  });
});

describe('idag', () => {
  const nu = new Date('2026-10-24T10:00:00Z');

  it('använder förhandsgranskningsdatumet när det finns', () => {
    expect(idag(nu, '?datum=2026-12-10')).toBe('2026-12-10');
  });

  it('ignorerar ett felaktigt förhandsgranskningsdatum', () => {
    expect(idag(nu, '?datum=imorgon')).toBe('2026-10-24');
  });
});

describe('luckansStatus', () => {
  it('är låst före, öppen under och stängd efter luckans datum', () => {
    expect(luckansStatus('2026-12-07', '2026-12-04')).toBe('låst');
    expect(luckansStatus('2026-12-07', '2026-12-07')).toBe('öppen');
    expect(luckansStatus('2026-12-07', '2026-12-08')).toBe('stängd');
  });
});

describe('kalenderlage', () => {
  it('räknar ner före första luckan', () => {
    expect(kalenderlage('2026-10-24', UPPDRAG)).toEqual({ typ: 'före', dagarKvar: 38 });
  });

  it('pågår från första till sista luckan, även på helger', () => {
    expect(kalenderlage('2026-12-01', UPPDRAG)).toEqual({ typ: 'pågår' });
    expect(kalenderlage('2026-12-13', UPPDRAG)).toEqual({ typ: 'pågår' });
    expect(kalenderlage('2026-12-23', UPPDRAG)).toEqual({ typ: 'pågår' });
  });

  it('är slut från julafton', () => {
    expect(kalenderlage('2026-12-24', UPPDRAG)).toEqual({ typ: 'slut' });
  });
});

describe('texter', () => {
  it('skriver luckans datum med veckodag', () => {
    expect(datumtext('2026-12-07')).toBe('måndag 7 december');
  });

  it('märker inlägg med luckans nummer och rubrik', () => {
    expect(markning(UPPDRAG[4])).toBe('🎄 Lucka 7 – Vem är koppen?');
  });
});
