import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import GameScreen from '../screens/GameScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import LoginScreen from '../screens/LoginScreen';
import { COLORS } from '../constants/theme';
import { auth } from '../services/firebase';

// Stack navigation: skærmene lægges oven på hinanden.
// navigate('AddLocation') lægger en ny skærm øverst, goBack() fjerner den igen.
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // onAuthStateChanged lytter på Firebase og kaldes ved login, logout og når appen starter.
  // Funktionen den returnerer bruges til at stoppe lytteren igen når komponenten forsvinder.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Vis en spinner indtil Firebase har svaret, ellers blinker login-skærmen kort
  if (isAuthLoading) {
    return <View style={styles.loadingScreen}><ActivityIndicator color={COLORS.brand} size="large" /></View>;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        {/* key nulstiller stacken ved login/logout, ellers kunne login-skærmen blive hængende */}
        <Stack.Navigator
          key={user?.uid ?? 'signed-out'}
          screenOptions={{
            headerShown: false, // vi bruger vores egen ScreenHeader i stedet
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          {/* Er man logget ind ser man spillet, ellers kun login-skærmen */}
          {user ? (
            <>
              <Stack.Screen name="Game" component={GameScreen} />
              <Stack.Screen name="AddLocation" component={AddLocationScreen} />
            </>
          ) : <Stack.Screen name="Login" component={LoginScreen} />}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
});
