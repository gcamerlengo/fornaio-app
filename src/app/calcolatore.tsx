import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, Chip, ChipRow, NumberField, Screen, SectionTitle, parseNumber } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { RECIPES, findRecipe, type Recipe } from '@/data/recipes';
import { computeDough, formatGrams, WASTE_FACTOR, type Ingredient } from '@/engine/dough';
import { useTheme } from '@/hooks/use-theme';

type Mode = 'pieces' | 'base';

function percentText(n: number): string {
  return String(n).replace('.', ',');
}

export default function CalcolatoreScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ ricetta?: string }>();
  const [recipe, setRecipe] = useState<Recipe>(() => findRecipe(params.ricetta) ?? RECIPES[0]);
  const [mode, setMode] = useState<Mode>('pieces');
  const [pro, setPro] = useState(false);
  const [pieces, setPieces] = useState(String(recipe.defaultPieces));
  const [pieceWeight, setPieceWeight] = useState(String(recipe.defaultPieceWeight));
  const [baseWeight, setBaseWeight] = useState('1000');
  const [percents, setPercents] = useState<Record<string, string>>(() => initialPercents(recipe));

  // Quando si arriva dal ricettario con una ricetta diversa, la selezioniamo.
  useEffect(() => {
    const fromParams = findRecipe(params.ricetta);
    if (fromParams && fromParams.id !== recipe.id) selectRecipe(fromParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.ricetta]);

  function selectRecipe(next: Recipe) {
    setRecipe(next);
    setPieces(String(next.defaultPieces));
    setPieceWeight(String(next.defaultPieceWeight));
    setPercents(initialPercents(next));
  }

  const ingredients: Ingredient[] = useMemo(
    () =>
      recipe.ingredients.map((i) => {
        if (i.isBase || !pro) return i;
        const p = parseNumber(percents[i.key] ?? '');
        return { ...i, percent: Number.isFinite(p) && p >= 0 ? p : i.percent };
      }),
    [recipe, pro, percents],
  );

  const result = useMemo(() => {
    const n = parseNumber(pieces);
    const w = parseNumber(pieceWeight);
    const b = parseNumber(baseWeight);
    if (mode === 'pieces') {
      if (!Number.isFinite(n) || !Number.isFinite(w)) return null;
      return computeDough(ingredients, { mode: 'pieces', pieces: n, pieceWeight: w });
    }
    if (!Number.isFinite(b)) return null;
    return computeDough(ingredients, { mode: 'base', baseWeight: b });
  }, [ingredients, mode, pieces, pieceWeight, baseWeight]);

  const base = recipe.ingredients.find((i) => i.isBase);
  const hydration = ingredients.find((i) => i.key === 'acqua');

  return (
    <Screen title="Calcolatore" subtitle="Dosi calcolate con le percentuali del panettiere.">
      <SectionTitle>Ricetta</SectionTitle>
      <ChipRow>
        {RECIPES.map((r) => (
          <Chip key={r.id} label={r.name} selected={r.id === recipe.id} onPress={() => selectRecipe(r)} />
        ))}
      </ChipRow>

      <SectionTitle>Quanto ne vuoi</SectionTitle>
      <ChipRow>
        <Chip label={`Per ${recipe.pieceLabel}`} selected={mode === 'pieces'} onPress={() => setMode('pieces')} />
        <Chip label={`Da ${base?.name.toLowerCase() ?? 'base'}`} selected={mode === 'base'} onPress={() => setMode('base')} />
        <Chip label="Modalità Pro" selected={pro} onPress={() => setPro(!pro)} />
      </ChipRow>

      <Card>
        {mode === 'pieces' ? (
          <View style={styles.fields}>
            <NumberField label={`Numero di ${recipe.pieceLabel}`} value={pieces} onChangeText={setPieces} />
            <NumberField label="Peso di ognuno" value={pieceWeight} onChangeText={setPieceWeight} suffix="g" />
          </View>
        ) : (
          <NumberField label={`${base?.name ?? 'Base'} totale`} value={baseWeight} onChangeText={setBaseWeight} suffix="g" />
        )}
        {mode === 'pieces' ? (
          <ThemedText type="small" themeColor="textSecondary">
            Include un {Math.round((WASTE_FACTOR - 1) * 100)}% in più per l’impasto che resta su ciotola e mani.
          </ThemedText>
        ) : null}
      </Card>

      {pro ? (
        <>
          <SectionTitle>Percentuali (base = 100%)</SectionTitle>
          <Card>
            <View style={styles.fields}>
              {recipe.ingredients
                .filter((i) => !i.isBase)
                .map((i) => (
                  <NumberField
                    key={i.key}
                    label={i.name}
                    value={percents[i.key] ?? ''}
                    onChangeText={(t) => setPercents((prev) => ({ ...prev, [i.key]: t }))}
                    suffix="%"
                  />
                ))}
            </View>
          </Card>
        </>
      ) : null}

      <SectionTitle>Ingredienti</SectionTitle>
      <Card>
        {result ? (
          <>
            {result.ingredients.map((i) => (
              <View key={i.key} style={styles.ingredientRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText>{i.name}</ThemedText>
                  {pro ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      {percentText(i.percent)}%
                    </ThemedText>
                  ) : null}
                </View>
                <ThemedText style={styles.grams}>{formatGrams(i.grams)}</ThemedText>
              </View>
            ))}
            <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
              <ThemedText type="smallBold">Totale impasto</ThemedText>
              <ThemedText type="smallBold">{formatGrams(result.totalWeight)}</ThemedText>
            </View>
            {hydration ? (
              <ThemedText type="small" themeColor="textSecondary">
                Idratazione {percentText(hydration.percent)}%
              </ThemedText>
            ) : null}
          </>
        ) : (
          <ThemedText themeColor="textSecondary">Inserisci le quantità per vedere le dosi.</ThemedText>
        )}
      </Card>

      <SectionTitle>Procedimento</SectionTitle>
      <Card>
        {recipe.steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <ThemedText type="smallBold" style={{ color: theme.accent, width: 22 }}>
              {index + 1}.
            </ThemedText>
            <ThemedText type="small" style={{ flex: 1 }}>
              {step}
            </ThemedText>
          </View>
        ))}
        {recipe.notes ? (
          <ThemedText type="small" themeColor="textSecondary">
            {recipe.notes}
          </ThemedText>
        ) : null}
      </Card>

      <ThemedText type="small" themeColor="textSecondary">
        Valori di partenza da verificare in cucina: il lievito, in particolare, dipende molto dalla temperatura.
      </ThemedText>
    </Screen>
  );
}

function initialPercents(recipe: Recipe): Record<string, string> {
  return Object.fromEntries(recipe.ingredients.map((i) => [i.key, percentText(i.percent)]));
}

const styles = StyleSheet.create({
  fields: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.one },
  grams: { fontSize: 18, fontWeight: 700 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
    marginTop: Spacing.one,
  },
  step: { flexDirection: 'row', gap: Spacing.two },
});
