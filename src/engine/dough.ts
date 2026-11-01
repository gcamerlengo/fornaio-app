/**
 * Motore di calcolo degli impasti basato sulle percentuali del panettiere.
 *
 * Ogni ricetta ha un ingrediente "base" che vale 100% (la farina per pizza,
 * pane e frolla; le uova per il pan di Spagna). Tutti gli altri ingredienti
 * sono espressi come percentuale del peso della base.
 */

export type Ingredient = {
  key: string;
  name: string;
  /** Percentuale rispetto all'ingrediente base (la base stessa vale 100). */
  percent: number;
  /** true per l'ingrediente base della ricetta. */
  isBase?: boolean;
};

export type DoughInput =
  | { mode: 'pieces'; pieces: number; pieceWeight: number }
  | { mode: 'base'; baseWeight: number };

export type IngredientAmount = Ingredient & { grams: number };

export type DoughResult = {
  /** Peso dell'ingrediente base, in grammi. */
  baseWeight: number;
  /** Peso totale dell'impasto prodotto, in grammi. */
  totalWeight: number;
  ingredients: IngredientAmount[];
};

/** Margine per l'impasto che resta su ciotola, mani e attrezzi. */
export const WASTE_FACTOR = 1.02;

export function sumPercent(ingredients: Ingredient[]): number {
  return ingredients.reduce((acc, i) => acc + i.percent, 0);
}

export function computeDough(ingredients: Ingredient[], input: DoughInput): DoughResult {
  const total = sumPercent(ingredients);
  if (!(total > 0)) {
    throw new Error('La somma delle percentuali deve essere maggiore di zero');
  }

  let baseWeight: number;
  if (input.mode === 'pieces') {
    if (input.pieces <= 0 || input.pieceWeight <= 0) {
      return { baseWeight: 0, totalWeight: 0, ingredients: ingredients.map((i) => ({ ...i, grams: 0 })) };
    }
    const target = input.pieces * input.pieceWeight * WASTE_FACTOR;
    baseWeight = (target * 100) / total;
  } else {
    baseWeight = Math.max(0, input.baseWeight);
  }

  const amounts = ingredients.map((i) => ({ ...i, grams: (baseWeight * i.percent) / 100 }));
  const totalWeight = amounts.reduce((acc, i) => acc + i.grams, 0);
  return { baseWeight, totalWeight, ingredients: amounts };
}

/**
 * Temperatura dell'acqua per ottenere l'impasto alla temperatura desiderata.
 * Regola del "fattore base": T_acqua = 3·T_impasto − T_farina − T_ambiente − T_attrito.
 */
export function waterTemperature(params: {
  doughTarget: number;
  flour: number;
  room: number;
  friction: number;
}): number {
  return 3 * params.doughTarget - params.flour - params.room - params.friction;
}

/** Arrotonda i grammi per la visualizzazione: un decimale sotto i 10 g, interi sopra. */
export function formatGrams(grams: number): string {
  // Formattazione manuale: Intl non è affidabile su tutti i motori JS mobili.
  if (grams === 0) return '0 g';
  if (grams < 10) {
    return `${grams.toFixed(1).replace('.', ',')} g`;
  }
  const whole = String(Math.round(grams)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${whole} g`;
}
