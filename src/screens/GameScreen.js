/**
 * GameScreen.js – Selve spillet (appens startskærm).
 *
 * Spillets gang:
 *  1. Runderne hentes fra roundsService, hver gang skærmen kommer i fokus.
 *  2. Spilleren ser et foto (PhotoCard) og sætter en markør på kortet (GuessMap).
 *  3. "Lock in my guess" beregner afstanden til det rigtige sted og giver point.
 *  4. Det rigtige sted vises med en grøn markør, og man går videre til næste runde.
 *  5. Efter sidste runde vises en slutskærm med samlet score og mulighed for at spille igen.
 *
 * Skærmen viser én af tre tilstande:
 *  - Ingen runder endnu → opfordring til at tilføje et sted.
 *  - Alle runder spillet → slutskærm ("Campus explored!").
 *  - Ellers → selve spillet (score, foto, kort, scorepanel).
 *
 * Skærmen "ejer" al spillets state og sender data/funktioner ned til
 * komponenterne via props. Komponenterne viser kun det, de får.
 */
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

// "navigation" gives automatisk til alle skærme, der er registreret i AppNavigator.
export default function GameScreen({ navigation }) {
  // --- State (data der får skærmen til at gen-tegne, når de ændres) ---
  const [rounds, setRounds] = useState([]); // Alle runder, der kan spilles.
  const [roundIndex, setRoundIndex] = useState(0); // Index for den aktuelle runde (0 = første).
  const [guess, setGuess] = useState(null); // Spillerens markør { latitude, longitude } eller null.
  const [result, setResult] = useState(null); // { distance, points } når gættet er låst, ellers null.
  const [totalScore, setTotalScore] = useState(0); // Samlet score for hele spillet.

  // --- Afledte værdier (beregnes ud fra state ved hver render, gemmes ikke selv) ---
  const currentRound = rounds[roundIndex]; // undefined hvis vi er forbi sidste runde.
  const sessionComplete = rounds.length > 0 && roundIndex >= rounds.length; // Alle runder er spillet.

  // useFocusEffect kører, hver gang skærmen kommer i fokus – også når man vender
  // tilbage fra AddLocation. Derfor dukker nyoprettede runder op med det samme.
  // useCallback sikrer, at funktionen ikke genskabes ved hver render (ellers ville effekten køre igen og igen).
  useFocusEffect(
    useCallback(() => {
      // "active"-flaget forhindrer, at vi sætter state, hvis brugeren forlader
      // skærmen, før getRounds() er færdig (undgår opdatering af en skærm, der ikke vises).
      let active = true;
      getRounds().then((savedRounds) => {
        if (!active) return;
        setRounds(savedRounds);
        // Bevar den nuværende runde, men nulstil til 0, hvis indexet nu ligger uden for listen.
        setRoundIndex((currentIndex) => (currentIndex >= savedRounds.length ? 0 : currentIndex));
      });
      // Oprydning: kaldes når skærmen mister fokus.
      return () => { active = false; };
    }, []),
  );

  // Låser gættet: beregner afstand og point for den aktuelle runde.
  const submitGuess = () => {
    if (!guess || !currentRound) return; // Sikkerhedstjek – knappen burde allerede være deaktiveret.
    const distance = calculateDistance(guess, currentRound); // Meter mellem gæt og rigtigt sted.
    const points = calculatePoints(distance);
    setResult({ distance, points }); // Skifter ScorePanel til resultat-visning og viser grøn markør.
    // Funktions-formen (score => ...) bruger altid den nyeste værdi af state.
    setTotalScore((score) => score + points);
  };

  // Går til næste runde og rydder markør og resultat.
  const nextRound = () => {
    setGuess(null);
    setResult(null);
    // Efter sidste runde bliver index === rounds.length, hvilket gør sessionComplete sand.
    setRoundIndex((index) => index + 1);
  };

  // Starter spillet forfra fra slutskærmen.
  const replay = () => {
    setRoundIndex(0);
    setGuess(null);
    setResult(null);
    setTotalScore(0);
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Kunne ikke logge ud', 'Prøv igen om lidt.');
    }
  };

  return (
    // SafeAreaView med edges={['top']}: kun luft i toppen (notch/statuslinje); bunden håndteres af ScrollView.
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Topbjælke med knap til at oprette et nyt sted. */}
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

        {/* Indlejret ternary vælger én af tre tilstande: tom / færdig / spiller. */}
        {rounds.length === 0 ? (
          // Tilstand A: ingen runder endnu.
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Text style={styles.emptyEmoji}>📍</Text></View>
            <Text style={styles.emptyText}>
              Tilføj et foto, og markér hvor det blev taget. Så kan dine venner gætte stedet.
            </Text>
            <ActionButton title="Tilføj dit første sted" onPress={() => navigation.navigate('AddLocation')} />
          </View>
        ) : sessionComplete ? (
          // Tilstand B: alle runder er spillet – vis slutresultat.
          <View style={styles.completeCard}>
            <Text style={styles.completeText}>Du fik {totalScore} point på {rounds.length} sted(er).</Text>
            <ActionButton title="Spil igen" onPress={replay} />
            <ActionButton title="Tilføj endnu et sted" variant="secondary" onPress={() => navigation.navigate('AddLocation')} />
          </View>
        ) : (
          // Tilstand C: en runde er i gang.
          <>
            {/* Mørk bjælke med nuværende score og rundenummer. */}
            <View style={styles.scoreStrip}>
              <View>
                <Text style={styles.stripLabel}>NUVÆRENDE SCORE</Text>
                <Text style={styles.stripScore}>{totalScore}</Text>
              </View>
              <View style={styles.roundBadge}>
                {/* +1 fordi index starter ved 0, men mennesker tæller fra 1. */}
                <Text style={styles.roundText}>RUNDE {roundIndex + 1} AF {rounds.length}</Text>
              </View>
            </View>

            {/* Fotoet, der skal gættes. ?. (optional chaining) undgår fejl hvis currentRound er undefined. */}
            <PhotoCard
              imageUrl={currentRound?.imageUrl}
              roundNumber={roundIndex + 1}
              totalRounds={rounds.length}
            />

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>Vælg et sted</Text>
                {/* Hjælpeteksten skifter, når resultatet vises. */}
                <Text style={styles.sectionHint}>
                  {result ? 'Den grønne markør viser, hvor fotoet blev taget.' : 'Tryk eller hold fingeren på kortet for at sætte en markør.'}
                </Text>
              </View>
              {/* Lille statusmærke, når en markør er sat, men endnu ikke låst. */}
              {guess && !result && <Text style={styles.pinStatus}>MARKØR SAT</Text>}
            </View>

            {/* Kortet: viser gættet, og efter låsning det rigtige svar. Låses når resultatet vises. */}
            <GuessMap
              guess={guess}
              answer={currentRound}
              showAnswer={Boolean(result)} // Boolean(...) gør null/objekt til false/true.
              disabled={Boolean(result)}
              onLocationChange={setGuess} // Kortet kalder setGuess direkte med den nye koordinat.
            />

            {/* Panel med "Lock in"-knap eller rundens resultat. */}
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

// StyleSheet.create samler alle styles ét sted (og React Native kan optimere dem).
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.screen, paddingBottom: 28, gap: 16 }, // gap = afstand mellem alle børn.
  // Tom tilstand
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -12 },
  accountEmail: { flex: 1, color: COLORS.muted, fontSize: 12, marginRight: 12 },
  logOutButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  logOutText: { color: COLORS.brandDark, fontSize: 13, fontWeight: '700' },
  emptyCard: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 28 },
  emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: COLORS.brandLight, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyEmoji: { fontSize: 32 },
  emptyTitle: { color: COLORS.ink, fontSize: 23, lineHeight: 29, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: COLORS.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10, marginBottom: 22 },
  helper: { color: COLORS.muted, fontSize: 12, marginTop: 12 },
  // Scorebjælke
  scoreStrip: { backgroundColor: COLORS.brandDark, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stripLabel: { color: '#C7E9EC', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  stripScore: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 3 },
  roundBadge: { backgroundColor: 'rgba(255,255,255,0.14)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }, // Halvgennemsigtig hvid "pille".
  roundText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  // Overskrift over kortet
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  sectionTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '800' },
  sectionHint: { color: COLORS.muted, fontSize: 13, marginTop: 3 },
  pinStatus: { color: COLORS.success, fontSize: 10, fontWeight: '800', letterSpacing: 0.7 },
  // Slutskærm
  completeCard: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 28, gap: 13 },
  completeEmoji: { fontSize: 46 },
  completeTitle: { color: COLORS.ink, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  completeText: { color: COLORS.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 8 },
  footer: { color: COLORS.muted, textAlign: 'center', fontSize: 10, letterSpacing: 1.2, fontWeight: '700', marginTop: 6 },
});
