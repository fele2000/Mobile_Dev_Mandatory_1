import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    // SafeAreaProvider skal ligge yderst, så SafeAreaView på skærmene kan finde ud af hvor notch osv. er
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
