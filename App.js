/**
 * App.js – Rod-komponenten for hele appen.
 *
 * Vi holder bevidst denne fil lille (se README). Den pakker blot hele appen ind i:
 *  - SafeAreaProvider: giver resten af appen besked om telefonens "sikre områder"
 *    (notch, statuslinje, home-indikator), så indhold ikke gemmer sig bag dem.
 *  - AppNavigator: vores navigation, som bestemmer hvilken skærm der vises.
 */
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    // SafeAreaProvider skal ligge yderst, så SafeAreaView på skærmene kan læse målene.
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
