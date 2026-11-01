# Fornaio App

App per iOS e Android che calcola dosi e guida la preparazione di impasti per pizza, pane, torte e biscotti.

Prototipo (passo 2 del piano): calcolatore con percentuali del panettiere, sei ricette base e conversioni.

## Provarla sul telefono

1. Installa **Expo Go** dall'App Store o da Google Play.
2. Sul computer, con Node.js installato:

   ```bash
   npm install
   npx expo start
   ```

3. Inquadra il QR code che compare nel terminale (con la fotocamera su iPhone, con Expo Go su Android).

## Struttura

- `src/engine/` – formule: dosi da pezzi o da peso base, temperatura dell'acqua, conversioni del lievito.
- `src/data/recipes.ts` – le ricette base, in percentuali sulla farina (o sulle uova per il pan di Spagna).
- `src/app/` – le schermate: Ricette, Calcolatore, Conversioni.

## Controlli

```bash
npm test           # test delle formule
npm run typecheck  # controllo dei tipi TypeScript
```

Le percentuali delle ricette, soprattutto il lievito, sono valori di partenza da verificare con prove reali.
