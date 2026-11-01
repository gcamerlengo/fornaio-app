import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, Screen, SectionTitle } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { CATEGORY_LABELS, RECIPES, type Category } from '@/data/recipes';
import { useTheme } from '@/hooks/use-theme';

const CATEGORIES: Category[] = ['pizza', 'pane', 'dolci'];

export default function RicetteScreen() {
  const theme = useTheme();

  return (
    <Screen title="Ricette" subtitle="Scegli una ricetta base: il calcolatore la adatta alle tue quantità.">
      {CATEGORIES.map((category) => (
        <View key={category} style={styles.group}>
          <SectionTitle>{CATEGORY_LABELS[category]}</SectionTitle>
          {RECIPES.filter((r) => r.category === category).map((recipe) => (
            <Pressable
              key={recipe.id}
              accessibilityRole="button"
              accessibilityHint="Apre la ricetta nel calcolatore"
              onPress={() => router.navigate({ pathname: '/calcolatore', params: { ricetta: recipe.id } })}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Card>
                <View style={styles.row}>
                  <ThemedText type="smallBold" style={styles.name}>
                    {recipe.name}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.accent }}>
                    Calcola ›
                  </ThemedText>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {recipe.description}
                </ThemedText>
              </Card>
            </Pressable>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 17 },
});
