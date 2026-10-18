/**
 * AppNavigator.js – Navigation mellem appens skærme.
 *
 * Vi bruger React Navigations "native stack": skærme lægges oven på hinanden
 * som en stak kort. navigation.navigate('AddLocation') lægger en ny skærm
 * øverst, og navigation.goBack() fjerner den igen, så man er tilbage på Game.
 *
 * Appen har to skærme:
 *  - Game:        selve spillet, hvor man gætter hvor et foto er taget.
 *  - AddLocation: her opretter man en ny runde (foto + markør på kortet).
 */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import GameScreen from '../screens/GameScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import { COLORS } from '../constants/theme';

// Opretter et stack-objekt med en Navigator- og en Screen-komponent.
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    // <> ... </> er et React Fragment: grupperer elementer uden at lave en ekstra View.
    <>
      {/* Mørk tekst/ikoner i telefonens statuslinje, da vores baggrund er lys. */}
      <StatusBar style="dark" />
      {/* NavigationContainer holder styr på navigationens tilstand og skal omslutte alle navigators. */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Game" // Skærmen der vises, når appen åbner.
          screenOptions={{
            headerShown: false, // Vi skjuler standard-headeren og bruger vores egen ScreenHeader.
            contentStyle: { backgroundColor: COLORS.background }, // Fælles baggrundsfarve på alle skærme.
            animation: 'slide_from_right', // Nye skærme glider ind fra højre.
          }}
        >
          {/* "name" er det navn, vi bruger i navigation.navigate(...). */}
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="AddLocation" component={AddLocationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
