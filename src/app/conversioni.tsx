import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, Chip, ChipRow, NumberField, Screen, SectionTitle, parseNumber } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { formatGrams, waterTemperature } from '@/engine/dough';
import { convertYeast, starterComposition, YEAST_LABELS, type YeastType } from '@/engine/yeast';

const YEASTS: YeastType[] = ['fresh', 'activeDry', 'instant'];

function formatNumber(n: number): string {
  return (Math.round(n * 10) / 10).toString().replace('.', ',');
}

export default function ConversioniScreen() {
  const [from, setFrom] = useState<YeastType>('fresh');
  const [yeastGrams, setYeastGrams] = useState('10');

  const [starterGrams, setStarterGrams] = useState('200');
  const [starterHydration, setStarterHydration] = useState('50');

  const [doughTarget, setDoughTarget] = useState('25');
  const [flourTemp, setFlourTemp] = useState('20');
  const [roomTemp, setRoomTemp] = useState('22');
  const [friction, setFriction] = useState('3');

  const y = parseNumber(yeastGrams);
  const sg = parseNumber(starterGrams);
  const sh = parseNumber(starterHydration);
  const starter = Number.isFinite(sg) && Number.isFinite(sh) ? starterComposition(sg, sh) : null;
  const temps = [doughTarget, flourTemp, roomTemp, friction].map(parseNumber);
  const water = temps.every(Number.isFinite)
    ? waterTemperature({ doughTarget: temps[0], flour: temps[1], room: temps[2], friction: temps[3] })
    : null;

  return (
    <Screen title="Conversioni" subtitle="Lievito, lievito madre e temperatura dell’acqua.">
      <SectionTitle>Lievito</SectionTitle>
      <ChipRow>
        {YEASTS.map((t) => (
          <Chip key={t} label={YEAST_LABELS[t]} selected={t === from} onPress={() => setFrom(t)} />
        ))}
      </ChipRow>
      <Card>
        <NumberField label={`Grammi di ${YEAST_LABELS[from].toLowerCase()}`} value={yeastGrams} onChangeText={setYeastGrams} suffix="g" />
        {Number.isFinite(y)
          ? YEASTS.filter((t) => t !== from).map((t) => (
              <View key={t} style={styles.row}>
                <ThemedText style={{ flex: 1 }}>{YEAST_LABELS[t]}</ThemedText>
                <ThemedText style={styles.value}>{formatGrams(convertYeast(y, from, t))}</ThemedText>
              </View>
            ))
          : null}
        <ThemedText type="small" themeColor="textSecondary">
          Equivalenze approssimative: secco attivo ≈ fresco × 0,4; istantaneo ≈ fresco × 0,33.
        </ThemedText>
      </Card>

      <SectionTitle>Lievito madre</SectionTitle>
      <Card>
        <View style={styles.fields}>
          <NumberField label="Peso lievito madre" value={starterGrams} onChangeText={setStarterGrams} suffix="g" />
          <NumberField label="Idratazione madre" value={starterHydration} onChangeText={setStarterHydration} suffix="%" />
        </View>
        {starter ? (
          <>
            <View style={styles.row}>
              <ThemedText style={{ flex: 1 }}>Farina contenuta</ThemedText>
              <ThemedText style={styles.value}>{formatGrams(starter.flour)}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText style={{ flex: 1 }}>Acqua contenuta</ThemedText>
              <ThemedText style={styles.value}>{formatGrams(starter.water)}</ThemedText>
            </View>
          </>
        ) : null}
        <ThemedText type="small" themeColor="textSecondary">
          Togli questa farina e quest’acqua da quelle della ricetta. 50% = madre solida, 100% = licoli.
        </ThemedText>
      </Card>

      <SectionTitle>Temperatura dell’acqua</SectionTitle>
      <Card>
        <View style={styles.fields}>
          <NumberField label="Impasto desiderato" value={doughTarget} onChangeText={setDoughTarget} suffix="°C" />
          <NumberField label="Farina" value={flourTemp} onChangeText={setFlourTemp} suffix="°C" />
          <NumberField label="Ambiente" value={roomTemp} onChangeText={setRoomTemp} suffix="°C" />
          <NumberField label="Attrito" value={friction} onChangeText={setFriction} suffix="°C" />
        </View>
        {water !== null ? (
          <View style={styles.row}>
            <ThemedText style={{ flex: 1 }}>Acqua a</ThemedText>
            <ThemedText style={styles.value}>{formatNumber(water)} °C</ThemedText>
          </View>
        ) : null}
        <ThemedText type="small" themeColor="textSecondary">
          Attrito: circa 2–4 °C impastando a mano, di più con l’impastatrice.
        </ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.one },
  value: { fontSize: 18, fontWeight: 700 },
});
