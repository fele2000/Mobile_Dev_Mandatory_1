import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GuessMap from '../components/map/GuessMap';
import PhotoCard from '../components/game/PhotoCard';
import ScorePanel from '../components/game/ScorePanel';
import ActionButton from '../components/ui/ActionButton';
import ScreenHeader from '../components/ui/ScreenHeader';
import { COLORS, SPACING } from '../constants/theme';
import { getRounds } from '../services/roundsService';
import { calculateDistance, calculatePoints } from '../utils/scoring';

export default function GameScreen({ navigation }) {
  const [rounds, setRounds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const currentRound = rounds[roundIndex];
  const sessionComplete = rounds.length > 0 && roundIndex >= rounds.length;

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getRounds().then((savedRounds) => {
        if (!active) return;
        setRounds(savedRounds);
        setRoundIndex((currentIndex) => (currentIndex >= savedRounds.length ? 0 : currentIndex));
      });
      return () => { active = false; };
    }, []),
  );

  const submitGuess = () => {
    if (!guess || !currentRound) return;
    const distance = calculateDistance(guess, currentRound);
    const points = calculatePoints(distance);
    setResult({ distance, points });
    setTotalScore((score) => score + points);
  };

  const nextRound = () => {
    setGuess(null);
    setResult(null);
    setRoundIndex((index) => index + 1);
  };

  const replay = () => {
    setRoundIndex(0);
    setGuess(null);
    setResult(null);
    setTotalScore(0);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          actionLabel="+ Add spot"
          onAction={() => navigation.navigate('AddLocation')}
        />

        {rounds.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Text style={styles.emptyEmoji}>📍</Text></View>
            <Text style={styles.emptyTitle}>Your campus game starts here</Text>
            <Text style={styles.emptyText}>
              Add a photo and mark where it was taken. Then your friends can guess the spot.
            </Text>
            <ActionButton title="Add your first spot" onPress={() => navigation.navigate('AddLocation')} />
            <Text style={styles.helper}>It only takes a photo and one map pin.</Text>
          </View>
        ) : sessionComplete ? (
          <View style={styles.completeCard}>
            <Text style={styles.completeEmoji}>🎉</Text>
            <Text style={styles.completeTitle}>Campus explored!</Text>
            <Text style={styles.completeText}>You scored {totalScore} points across {rounds.length} locations.</Text>
            <ActionButton title="Play again" onPress={replay} />
            <ActionButton title="Add another spot" variant="secondary" onPress={() => navigation.navigate('AddLocation')} />
          </View>
        ) : (
          <>
            <View style={styles.scoreStrip}>
              <View>
                <Text style={styles.stripLabel}>CURRENT SCORE</Text>
                <Text style={styles.stripScore}>{totalScore}</Text>
              </View>
              <View style={styles.roundBadge}>
                <Text style={styles.roundText}>ROUND {roundIndex + 1} OF {rounds.length}</Text>
              </View>
            </View>

            <PhotoCard
              imageUrl={currentRound?.imageUrl}
              roundNumber={roundIndex + 1}
              totalRounds={rounds.length}
            />

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>Choose a spot</Text>
                <Text style={styles.sectionHint}>
                  {result ? 'The green pin shows the photo location.' : 'Press and hold the map to drop a pin.'}
                </Text>
              </View>
              {guess && !result && <Text style={styles.pinStatus}>PIN SET</Text>}
            </View>

            <GuessMap
              guess={guess}
              answer={currentRound}
              showAnswer={Boolean(result)}
              disabled={Boolean(result)}
              onLocationChange={setGuess}
            />

            <ScorePanel
              guessPlaced={Boolean(guess)}
              result={result}
              totalScore={totalScore}
              onSubmitGuess={submitGuess}
              onNextRound={nextRound}
              isLastRound={roundIndex === rounds.length - 1}
            />
          </>
        )}
        <Text style={styles.footer}>KEA GULDBERGGSGADE · COPENHAGEN</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.screen, paddingBottom: 28, gap: 16 },
  emptyCard: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 28 },
  emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: COLORS.brandLight, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyEmoji: { fontSize: 32 },
  emptyTitle: { color: COLORS.ink, fontSize: 23, lineHeight: 29, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: COLORS.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10, marginBottom: 22 },
  helper: { color: COLORS.muted, fontSize: 12, marginTop: 12 },
  scoreStrip: { backgroundColor: COLORS.brandDark, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stripLabel: { color: '#C7E9EC', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  stripScore: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 3 },
  roundBadge: { backgroundColor: 'rgba(255,255,255,0.14)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  roundText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  sectionTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '800' },
  sectionHint: { color: COLORS.muted, fontSize: 13, marginTop: 3 },
  pinStatus: { color: COLORS.success, fontSize: 10, fontWeight: '800', letterSpacing: 0.7 },
  completeCard: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 28, gap: 13 },
  completeEmoji: { fontSize: 46 },
  completeTitle: { color: COLORS.ink, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  completeText: { color: COLORS.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 8 },
  footer: { color: COLORS.muted, textAlign: 'center', fontSize: 10, letterSpacing: 1.2, fontWeight: '700', marginTop: 6 },
});
