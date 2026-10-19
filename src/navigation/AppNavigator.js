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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) {
    return <View style={styles.loadingScreen}><ActivityIndicator color={COLORS.brand} size="large" /></View>;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
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
