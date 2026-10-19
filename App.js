/**
 * App.js – Rod-komponenten for hele appen.
 *
 * Vi holder bevidst denne fil lille. Den pakker blot hele appen ind i:
 *  - SafeAreaProvider: giver resten af appen besked om telefonens "sikre områder"
 *    (notch, statuslinje, home-indikator), så indhold ikke gemmer sig bag dem.
 *  - AppNavigator: vores navigation, som bestemmer hvilken skærm der vises.
 */
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/theme';
import { auth } from './src/services/firebase';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Login skal altid være appens første skærm, også hvis Firebase har gemt
    // en tidligere session lokalt fra en tidligere app-start.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) await signOut(auth);
      } finally {
        setIsReady(true);
      }
    });

    return unsubscribe;
  }, []);

  return (
    // SafeAreaProvider skal ligge yderst, så SafeAreaView på skærmene kan læse målene.
    <SafeAreaProvider>
      {isReady ? (
        <AppNavigator />
      ) : (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color={COLORS.brand} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
