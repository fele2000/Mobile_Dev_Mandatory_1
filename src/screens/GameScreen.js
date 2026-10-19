import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import GuessMap from '../components/map/GuessMap';
import PhotoCard from '../components/game/PhotoCard';
import ScorePanel from '../components/game/ScorePanel';
import ActionButton from '../components/ui/ActionButton';
import ScreenHeader from '../components/ui/ScreenHeader';
import { COLORS, SPACING } from '../constants/theme';
import { getRounds } from '../services/roundsService';
import { calculateDistance, calculatePoints } from '../utils/scoring';
import { auth } from '../services/firebase';

// navigation-prop'en får alle skærme automatisk fra Stack.Navigator
export default function GameScreen({ navigation }) {
  // Al spillets state ligger her og sendes ned til komponenterne som props
  const [rounds, setRounds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  const currentRound = rounds[roundIndex];
  const sessionComplete = rounds.length > 0 && roundIndex >= rounds.length;

  // useFocusEffect (fra React Navigation) kører hver gang skærmen kommer i fokus,
  // ikke kun første gang som useEffect. Så kommer nye steder fra AddLocation med
  // når man går tilbage. useCallback er påkrævet, ellers kører den ved hver render.
  useFocusEffect(
    useCallback(() => {
      // active forhindrer at vi sætter state hvis man forlader skærmen før data er hentet
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

  // Efter signOut skifter AppNavigator selv tilbage til login (via onAuthStateChanged)
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Kunne ikke logge ud', 'Prøv igen om lidt.');
    }
  };

  return (
    // SafeAreaView holder indholdet fri af notch og statuslinje.
    // ScrollView fordi kort + foto + panel ikke kan være på skærmen på små telefoner.
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          actionLabel="+ Tilføj sted"
          onAction={() => navigation.navigate('AddLocation')}
        />
        <View style={styles.accountRow}>
          <Text style={styles.accountEmail} numberOfLines={1}>{auth.currentUser?.email}</Text>
          <Pressable onPress={logOut} accessibilityRole="button" style={styles.logOutButton}>
            <Text style={styles.logOutText}>Log ud</Text>
          </Pressable>
        </View>

        {/* Tre tilstande: ingen runder / spillet er færdigt / runde i gang */}
        {rounds.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Text style={styles.emptyEmoji}>📍</Text></View>
            <Text style={styles.emptyText}>
              Tilføj et foto, og markér hvor det blev taget. Så kan dine venner gætte stedet.
            </Text>
            <ActionButton title="Tilføj dit første sted" onPress={() => navigation.navigate('AddLocation')} />
          </View>
        ) : sessionComplete ? (
          <View style={styles.completeCard}>
            <Text style={styles.completeText}>Du fik {totalScore} point på {rounds.length} sted(er).</Text>
            <ActionButton title="Spil igen" onPress={replay} />
            <ActionButton title="Tilføj endnu et sted" variant="secondary" onPress={() => navigation.navigate('AddLocation')} />
          </View>
        ) : (
          <>
            <View style={styles.scoreStrip}>
              <View>
                <Text style={styles.stripLabel}>NUVÆRENDE SCORE</Text>
                <Text style={styles.stripScore}>{totalScore}</Text>
              </View>
              <View style={styles.roundBadge}>
                <Text style={styles.roundText}>RUNDE {roundIndex + 1} AF {rounds.length}</Text>
              </View>
            </View>

            <PhotoCard
              imageUrl={currentRound?.imageUrl}
              roundNumber={roundIndex + 1}
              totalRounds={rounds.length}
            />

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>Vælg et sted</Text>
                <Text style={styles.sectionHint}>
                  {result ? 'Den grønne markør viser, hvor fotoet blev taget.' : 'Tryk eller hold fingeren på kortet for at sætte en markør.'}
                </Text>
              </View>
              {guess && !result && <Text style={styles.pinStatus}>MARKØR SAT</Text>}
            </View>

            {/* Når gættet er låst vises det rigtige sted, og kortet kan ikke trykkes på mere */}
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
        <Text style={styles.footer}>KEA GULDBERGSGADE · KØBENHAVN</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.screen, paddingBottom: 28, gap: 16 }, // gap giver afstand mellem alle elementerne
  // flexDirection: 'row' lægger tingene vandret, space-between skubber dem ud til hver side
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -12 },
  accountEmail: { flex: 1, color: COLORS.muted, fontSize: 12, marginRight: 12 },
  logOutButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  logOutText: { color: COLORS.brandDark, fontSize: 13, fontWeight: '700' },
  emptyCard: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 28 },
  emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: COLORS.brandLight, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyEmoji: { fontSize: 32 },
  emptyText: { color: COLORS.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10, marginBottom: 22 },
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
  completeText: { color: COLORS.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 8 },
  footer: { color: COLORS.muted, textAlign: 'center', fontSize: 10, letterSpacing: 1.2, fontWeight: '700', marginTop: 6 },
});
