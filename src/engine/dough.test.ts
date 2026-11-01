import { describe, expect, it } from 'vitest';

import { computeDough, formatGrams, waterTemperature, type Ingredient } from './dough';
import { convertYeast, starterComposition } from './yeast';
import { RECIPES } from '../data/recipes';

const pizza: Ingredient[] = [
  { key: 'farina', name: 'Farina', percent: 100, isBase: true },
  { key: 'acqua', name: 'Acqua', percent: 65 },
  { key: 'sale', name: 'Sale', percent: 2.8 },
];

describe('computeDough', () => {
  it('calcola le dosi dal numero di pezzi (esempio del documento)', () => {
    const r = computeDough(pizza, { mode: 'pieces', pieces: 6, pieceWeight: 250 });
    expect(r.totalWeight).toBeCloseTo(1530, 6);
    expect(Math.round(r.baseWeight)).toBe(912);
    expect(Math.round(r.ingredients[1].grams)).toBe(593);
    expect(Math.round(r.ingredients[2].grams)).toBe(26);
  });

  it('calcola le dosi partendo dal peso della base', () => {
    const r = computeDough(pizza, { mode: 'base', baseWeight: 1000 });
    expect(r.ingredients.map((i) => i.grams)).toEqual([1000, 650, 28]);
    expect(r.totalWeight).toBe(1678);
  });

  it('restituisce zero con quantità nulle invece di valori negativi', () => {
    const r = computeDough(pizza, { mode: 'pieces', pieces: 0, pieceWeight: 250 });
    expect(r.totalWeight).toBe(0);
    expect(computeDough(pizza, { mode: 'base', baseWeight: -5 }).baseWeight).toBe(0);
  });

  it('rifiuta una ricetta senza percentuali', () => {
    expect(() => computeDough([], { mode: 'base', baseWeight: 100 })).toThrow();
  });
});

describe('ricette base', () => {
  it('ogni ricetta ha una sola base al 100%', () => {
    for (const recipe of RECIPES) {
      const bases = recipe.ingredients.filter((i) => i.isBase);
      expect(bases, recipe.id).toHaveLength(1);
      expect(bases[0].percent, recipe.id).toBe(100);
    }
  });

  it('gli id sono unici', () => {
    const ids = RECIPES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('altre formule', () => {
  it('temperatura dell’acqua', () => {
    expect(waterTemperature({ doughTarget: 25, flour: 20, room: 22, friction: 3 })).toBe(30);
  });

  it('conversioni del lievito', () => {
    expect(convertYeast(10, 'fresh', 'activeDry')).toBeCloseTo(4);
    expect(convertYeast(4, 'activeDry', 'fresh')).toBeCloseTo(10);
    expect(convertYeast(10, 'fresh', 'instant')).toBeCloseTo(3.3);
  });

  it('composizione del lievito madre al 50%', () => {
    const c = starterComposition(150, 50);
    expect(c.flour).toBeCloseTo(100);
    expect(c.water).toBeCloseTo(50);
  });

  it('formattazione dei grammi', () => {
    expect(formatGrams(1.84)).toBe('1,8 g');
    expect(formatGrams(1530.4)).toBe('1.530 g');
  });
});
