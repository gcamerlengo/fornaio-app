import type { Ingredient } from '../engine/dough';

export type Category = 'pizza' | 'pane' | 'dolci';

export type Recipe = {
  id: string;
  name: string;
  category: Category;
  description: string;
  ingredients: Ingredient[];
  /** Valori proposti al primo calcolo. */
  defaultPieces: number;
  defaultPieceWeight: number;
  pieceLabel: string;
  steps: string[];
  notes?: string;
};

export const CATEGORY_LABELS: Record<Category, string> = {
  pizza: 'Pizza',
  pane: 'Pane e focacce',
  dolci: 'Torte e biscotti',
};

/**
 * Ricette base del prototipo. Le percentuali sono valori di partenza tipici,
 * da verificare con prove reali (soprattutto il lievito, che dipende molto
 * dalla temperatura).
 */
export const RECIPES: Recipe[] = [
  {
    id: 'napoletana',
    name: 'Pizza napoletana',
    category: 'pizza',
    description: 'Farina 00 media forza (W 250–300), lievitazione 8–24 ore.',
    ingredients: [
      { key: 'farina', name: 'Farina 00', percent: 100, isBase: true },
      { key: 'acqua', name: 'Acqua', percent: 62 },
      { key: 'sale', name: 'Sale', percent: 2.9 },
      { key: 'lievito', name: 'Lievito di birra fresco', percent: 0.2 },
    ],
    defaultPieces: 6,
    defaultPieceWeight: 260,
    pieceLabel: 'panetti',
    steps: [
      'Sciogli il sale in quasi tutta l’acqua, poi il lievito nell’acqua rimasta.',
      'Aggiungi la farina poco alla volta e impasta 15–20 minuti fino a un impasto liscio.',
      'Lascia riposare coperto 2 ore a temperatura ambiente (puntata).',
      'Dividi in panetti, chiudili bene e mettili in un contenitore coperto.',
      'Lascia lievitare 6–20 ore secondo la temperatura (appretto).',
      'Stendi a mano e cuoci nel forno più caldo possibile.',
    ],
  },
  {
    id: 'teglia',
    name: 'Pizza in teglia',
    category: 'pizza',
    description: 'Alta idratazione, maturazione 24 ore in frigo.',
    ingredients: [
      { key: 'farina', name: 'Farina 0 forte (W 300–350)', percent: 100, isBase: true },
      { key: 'acqua', name: 'Acqua', percent: 78 },
      { key: 'sale', name: 'Sale', percent: 2.5 },
      { key: 'lievito', name: 'Lievito di birra fresco', percent: 0.5 },
      { key: 'olio', name: 'Olio extravergine', percent: 2.5 },
    ],
    defaultPieces: 1,
    defaultPieceWeight: 750,
    pieceLabel: 'teglie',
    steps: [
      'Impasta farina, lievito e il 70% dell’acqua.',
      'Aggiungi il sale e il resto dell’acqua a filo, poi l’olio.',
      'Fai 2–3 giri di pieghe a distanza di 20 minuti.',
      'Copri e metti in frigo per 24 ore.',
      'Togli dal frigo 3 ore prima, stendi in teglia unta con le dita.',
      'Cuoci a 250 °C nella parte bassa del forno, poi condisci e finisci la cottura.',
    ],
    notes: 'Una teglia 40×30 cm richiede circa 700–800 g di impasto.',
  },
  {
    id: 'pane',
    name: 'Pane comune',
    category: 'pane',
    description: 'Pagnotta casalinga con lievito di birra, pronta in giornata.',
    ingredients: [
      { key: 'farina', name: 'Farina 0 o tipo 1', percent: 100, isBase: true },
      { key: 'acqua', name: 'Acqua', percent: 68 },
      { key: 'sale', name: 'Sale', percent: 2 },
      { key: 'lievito', name: 'Lievito di birra fresco', percent: 1.2 },
    ],
    defaultPieces: 2,
    defaultPieceWeight: 500,
    pieceLabel: 'pagnotte',
    steps: [
      'Sciogli il lievito in parte dell’acqua e impasta con la farina.',
      'Aggiungi il sale e il resto dell’acqua, impasta 10 minuti.',
      'Lascia lievitare coperto finché raddoppia (circa 1,5–2 ore).',
      'Dividi, forma le pagnotte e lascia lievitare ancora 1 ora.',
      'Incidi la superficie e cuoci a 230 °C con vapore per 35–40 minuti.',
    ],
  },
  {
    id: 'focaccia',
    name: 'Focaccia',
    category: 'pane',
    description: 'Morbida dentro, croccante sotto, con olio in impasto e in superficie.',
    ingredients: [
      { key: 'farina', name: 'Farina 0 media forza', percent: 100, isBase: true },
      { key: 'acqua', name: 'Acqua', percent: 72 },
      { key: 'sale', name: 'Sale', percent: 2.5 },
      { key: 'lievito', name: 'Lievito di birra fresco', percent: 1 },
      { key: 'olio', name: 'Olio extravergine', percent: 4 },
    ],
    defaultPieces: 1,
    defaultPieceWeight: 800,
    pieceLabel: 'teglie',
    steps: [
      'Impasta farina, acqua e lievito, poi aggiungi sale e olio.',
      'Lascia lievitare coperto 1,5 ore.',
      'Trasferisci in teglia ben unta e allarga con le dita.',
      'Lascia lievitare ancora 1 ora, poi fai le fossette e condisci con olio e sale grosso.',
      'Cuoci a 230 °C per 20–25 minuti.',
    ],
  },
  {
    id: 'pan-di-spagna',
    name: 'Pan di Spagna',
    category: 'dolci',
    description: 'Base per torte farcite, montato solo con l’aria delle uova.',
    ingredients: [
      { key: 'uova', name: 'Uova intere', percent: 100, isBase: true },
      { key: 'zucchero', name: 'Zucchero', percent: 50 },
      { key: 'farina', name: 'Farina 00', percent: 25 },
      { key: 'fecola', name: 'Fecola di patate', percent: 25 },
    ],
    defaultPieces: 1,
    defaultPieceWeight: 550,
    pieceLabel: 'stampi da 24 cm',
    steps: [
      'Monta uova e zucchero a temperatura ambiente per 15–20 minuti, finché l’impasto scrive.',
      'Setaccia farina e fecola e incorporale a mano dal basso verso l’alto.',
      'Versa nello stampo imburrato e infarinato.',
      'Cuoci a 170 °C per 35–40 minuti senza aprire il forno.',
      'Lascia raffreddare capovolto.',
    ],
    notes: 'Qui la base sono le uova: un uovo medio senza guscio pesa circa 55 g.',
  },
  {
    id: 'frolla',
    name: 'Frolla per biscotti',
    category: 'dolci',
    description: 'Pasta frolla classica, per biscotti e crostate.',
    ingredients: [
      { key: 'farina', name: 'Farina 00 debole', percent: 100, isBase: true },
      { key: 'burro', name: 'Burro freddo', percent: 60 },
      { key: 'zucchero', name: 'Zucchero a velo', percent: 40 },
      { key: 'uova', name: 'Uova intere', percent: 18 },
      { key: 'sale', name: 'Sale', percent: 0.3 },
    ],
    defaultPieces: 30,
    defaultPieceWeight: 20,
    pieceLabel: 'biscotti',
    steps: [
      'Lavora burro freddo e zucchero fino a una crema grossolana.',
      'Aggiungi le uova e il sale, poi la farina tutta insieme.',
      'Impasta velocemente, solo finché è compatto.',
      'Avvolgi nella pellicola e lascia in frigo almeno 1 ora.',
      'Stendi a 4–5 mm, taglia i biscotti e cuoci a 175 °C per 12–15 minuti.',
    ],
  },
];

export function findRecipe(id: string | undefined): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}
