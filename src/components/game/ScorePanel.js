import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import ActionButton from '../ui/ActionButton';

// One panel guides the player before a guess and explains the result afterward.
export default function ScorePanel({
  guessPlaced,
  result,
  totalScore,
  onSubmitGuess,
  onNextRound,
  isLastRound,
}) {
  return (
    <View style={styles.card}>
      {result ? (
        <>
          <Text style={styles.eyebrow}>ROUND RESULT</Text>
          <View style={styles.resultRow}>
            <View>
              <Text style={styles.points}>+{result.points}</Text>
              <Text style={styles.label}>points earned</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.distance}>{formatDistance(result.distance)}</Text>
              <Text style={styles.label}>from the spot</Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.total}>{totalScore}</Text>
              <Text style={styles.totalLabel}>TOTAL</Text>
            </View>
          </View>
          <ActionButton title={isLastRound ? 'See final score' : 'Next location'} onPress={onNextRound} />
        </>
      ) : (
        <>
          <Text style={styles.eyebrow}>MAKE YOUR GUESS</Text>
          <Text style={styles.instruction}>
            {guessPlaced ? 'Marker placed. Ready to lock in your guess?' : 'Tap or press and hold the map to place your guess.'}
          </Text>
          <ActionButton title="Lock in my guess" onPress={onSubmitGuess} disabled={!guessPlaced} />
        </>
      )}
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
