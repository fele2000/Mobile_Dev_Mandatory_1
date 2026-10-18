/**
 * ScorePanel.js – Panelet under kortet på spilskærmen.
 *
 * Panelet har to tilstande:
 *  1. Før gættet er låst (result er null): instruktion + knappen "Lock in my guess".
 *  2. Efter gættet er låst (result findes): point, afstand, samlet score og "Next location".
 *
 * Komponenten har ingen egen state – den viser blot de data, den får fra
 * GameScreen, og kalder GameScreens funktioner, når der trykkes på knapperne.
 *
 * Props:
 *  - guessPlaced:   true hvis spilleren har sat en markør.
 *  - result:        { distance, points } efter gættet er låst, ellers null.
 *  - totalScore:    samlet score indtil nu.
 *  - onSubmitGuess: kaldes ved "Lock in my guess".
 *  - onNextRound:   kaldes ved "Next location" / "See final score".
 *  - isLastRound:   true på sidste runde (ændrer knappens tekst).
 */
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import ActionButton from '../ui/ActionButton';

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
        // Tilstand 2: resultatet af runden.
        <>
          <Text style={styles.eyebrow}>ROUND RESULT</Text>
          <View style={styles.resultRow}>
            {/* Optjente point i denne runde. */}
            <View>
              <Text style={styles.points}>+{result.points}</Text>
              <Text style={styles.label}>points earned</Text>
            </View>
            <View style={styles.divider} />
            {/* Afstanden fra gættet til det rigtige sted. */}
            <View>
              <Text style={styles.distance}>{formatDistance(result.distance)}</Text>
              <Text style={styles.label}>from the spot</Text>
            </View>
            {/* Samlet score, skubbet ud til højre kant. */}
            <View style={styles.totalBox}>
              <Text style={styles.total}>{totalScore}</Text>
              <Text style={styles.totalLabel}>TOTAL</Text>
            </View>
          </View>
          {/* På sidste runde fører knappen til slutskærmen i stedet for næste runde. */}
          <ActionButton title={isLastRound ? 'See final score' : 'Next location'} onPress={onNextRound} />
        </>
      ) : (
        // Tilstand 1: spilleren skal sætte/låse sit gæt.
        <>
          <Text style={styles.eyebrow}>MAKE YOUR GUESS</Text>
          <Text style={styles.instruction}>
            {guessPlaced ? 'Marker placed. Ready to lock in your guess?' : 'Tap or press and hold the map to place your guess.'}
          </Text>
          {/* Knappen er deaktiveret, indtil der er sat en markør. */}
          <ActionButton title="Lock in my guess" onPress={onSubmitGuess} disabled={!guessPlaced} />
        </>
      )}
    </View>
  );
}

// Hjælpefunktion: viser meter under 1 km ("42 m") og ellers kilometer med én decimal ("1.3 km").
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
  divider: { width: 1, height: 38, backgroundColor: COLORS.line }, // Tynd lodret streg mellem tallene.
  totalBox: { marginLeft: 'auto', alignItems: 'flex-end' }, // marginLeft: 'auto' skubber boksen helt til højre.
  total: { color: COLORS.ink, fontSize: 18, fontWeight: '800' },
  totalLabel: { color: COLORS.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
});
