/**
 * Conversioni approssimative tra tipi di lievito, usando il lievito di birra
 * fresco come riferimento. Sono valori di partenza da tarare con prove reali.
 */

export type YeastType = 'fresh' | 'activeDry' | 'instant';

export const YEAST_LABELS: Record<YeastType, string> = {
  fresh: 'Lievito di birra fresco',
  activeDry: 'Lievito secco attivo',
  instant: 'Lievito secco istantaneo',
};

/** Grammi di ciascun tipo equivalenti a 1 g di lievito fresco. */
export const FRESH_EQUIVALENT: Record<YeastType, number> = {
  fresh: 1,
  activeDry: 0.4,
  instant: 0.33,
};

export function convertYeast(grams: number, from: YeastType, to: YeastType): number {
  if (grams <= 0) return 0;
  const fresh = grams / FRESH_EQUIVALENT[from];
  return fresh * FRESH_EQUIVALENT[to];
}

/**
 * Composizione del lievito madre: restituisce farina e acqua contenute,
 * data l'idratazione della madre (50 = madre solida, 100 = licoli).
 */
export function starterComposition(grams: number, hydrationPercent: number): { flour: number; water: number } {
  if (grams <= 0) return { flour: 0, water: 0 };
  const flour = grams / (1 + hydrationPercent / 100);
  return { flour, water: grams - flour };
}
