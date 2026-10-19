import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import ActionButton from '../ui/ActionButton';

// Har ingen state selv, viser bare det GameScreen sender med som props.
// Før gættet er låst vises "Lås mit gæt", bagefter point og afstand.
export default function ScorePanel({
  guessPlaced,
  result,
  totalScore,
  onSubmitGuess,
  onNextRound,
  isLastRound,
}) {
  if (result) {
    return (
      <View style={styles.card}>
        <Text style={styles.eyebrow}>RESULTAT</Text>
        <View style={styles.resultRow}>
          <View>
            <Text style={styles.points}>+{result.points}</Text>
            <Text style={styles.label}>optjente point</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.distance}>{formatDistance(result.distance)}</Text>
            <Text style={styles.label}>fra stedet</Text>
          </View>
          <View style={styles.totalBox}>
            <Text style={styles.total}>{totalScore}</Text>
            <Text style={styles.totalLabel}>I ALT</Text>
          </View>
        </View>
        <ActionButton title={isLastRound ? 'Se slutresultatet' : 'Næste sted'} onPress={onNextRound} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>SÆT DIT GÆT</Text>
      <Text style={styles.instruction}>
        {guessPlaced ? 'Markør sat. Er du klar til at låse dit gæt?' : 'Tryk eller hold fingeren på kortet for at placere dit gæt.'}
      </Text>
      <ActionButton title="Lås mit gæt" onPress={onSubmitGuess} disabled={!guessPlaced} />
    </View>
  );
}

function formatDistance(distance) {
  return distance < 1000 ? `${Math.round(distance)} m` : `${(distance / 1000).toFixed(1)} km`;
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 17, gap: 12 },
  eyebrow: { color: COLORS.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  instruction: { color: COLORS.ink, fontSize: 15, lineHeight: 22, fontWeight: '600' },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
  points: { color: COLORS.success, fontSize: 25, fontWeight: '800' },
  distance: { color: COLORS.ink, fontSize: 18, fontWeight: '800' },
  label: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  divider: { width: 1, height: 38, backgroundColor: COLORS.line },
  totalBox: { marginLeft: 'auto', alignItems: 'flex-end' },
  total: { color: COLORS.ink, fontSize: 18, fontWeight: '800' },
  totalLabel: { color: COLORS.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
});
