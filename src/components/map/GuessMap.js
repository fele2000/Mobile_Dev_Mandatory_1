import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { INITIAL_REGION } from '../../constants/map';

// Bruges både i spillet og når man tilføjer et nyt sted.
// Kortet gemmer ikke selv markøren i state. Skærmen ejer positionen og sender den
// ind som guess, og når man trykker sendes den nye position op via onLocationChange.
export default function GuessMap({
  guess = null,
  answer = null,
  showAnswer = false,
  disabled = false,
  onLocationChange = () => {},
}) {
  // react-native-maps giver koordinaten i event.nativeEvent.coordinate ({ latitude, longitude })
  const handlePress = (event) => {
    if (disabled) return;
    onLocationChange(event.nativeEvent.coordinate);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="hybrid" // satellit + vejnavne, så man kan genkende bygningerne
        initialRegion={INITIAL_REGION} // kun hvor kortet starter, man kan stadig zoome rundt
        onPress={handlePress}
        onLongPress={handlePress} // long press sætter en markør
      >
        {/* Markører tegnes som børn af MapView */}
        {guess && <Marker coordinate={guess} pinColor="blue" />}

        {showAnswer && answer && (
          <Marker
            coordinate={{ latitude: answer.latitude, longitude: answer.longitude }}
            title="Fotosted"
            pinColor="green"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 280, // skal have fast højde fordi den ligger i en ScrollView
    borderRadius: 18,
    overflow: 'hidden', // ellers bliver kortet ikke klippet til de runde hjørner
  },
  map: { flex: 1 },
});
