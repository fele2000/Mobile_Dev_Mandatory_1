import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import GameScreen from '../screens/GameScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Game"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="AddLocation" component={AddLocationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
