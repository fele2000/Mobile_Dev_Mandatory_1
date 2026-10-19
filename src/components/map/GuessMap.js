/**
 * GuessMap.js – Kortet, hvor man sætter en markør (pin).
 *
 * Bruges to steder:
 *  - GameScreen: spilleren sætter sit gæt; efter "Lock in" vises også det rigtige sted.
 *  - AddLocationScreen: brugeren markerer, hvor et nyt foto er taget.
 *
 * Komponenten er "kontrolleret": den gemmer ikke selv markørens position i state.
 * Forælder-skærmen ejer positionen og sender den ind via `guess`; når brugeren
 * trykker på kortet, meldes den nye koordinat tilbage via `onLocationChange`.
 * Derfor kan samme kort genbruges begge steder.
 *
 * Opfylder opgavens features: (1) appen viser et kort og (2) brugeren kan
 * tilføje en markør ved at long-presse på kortet (her virker et alm. tryk også).
 *
 * Props:
 *  - guess:            { latitude, longitude } for den blå markør, eller null.
 *  - answer:           den aktuelle runde (med latitude/longitude) – det rigtige svar.
 *  - showAnswer:       true = vis den grønne markør for det rigtige sted.
 *  - disabled:         true = ignorér tryk (fx når gættet allerede er låst).
 *  - onLocationChange: kaldes med den nye koordinat, når brugeren trykker på kortet.
 */
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { INITIAL_REGION } from '../../constants/map';

// Fast punkt for KEA's hovedindgang. Vises altid som rød markør til orientering.
const KEA_LOCATION = {
  latitude: 55.691513,
  longitude: 12.555128,
};

// Standardværdier (= null, = false, = () => {}) gør, at kortet virker, selvom en prop ikke sendes med.
export default function GuessMap({
  guess = null,
  answer = null,
  showAnswer = false,
  disabled = false,
  onLocationChange = () => {},
}) {
  // Kaldes ved tryk og long-press. react-native-maps lægger koordinaten i event.nativeEvent.coordinate.
  const handleLocationChange = (event) => {
    if (disabled) return; // Kortet er låst – gør ingenting.
    onLocationChange(event.nativeEvent.coordinate); // Send { latitude, longitude } op til skærmen.
  };

  return (
    // Ydre View giver kortet fast højde og runde hjørner (MapView kan ikke selv klippe hjørnerne).
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="hybrid" // Satellitbillede med vejnavne – gør det lettere at genkende bygninger.
        initialRegion={INITIAL_REGION} // Kun startpositionen; brugeren kan frit zoome/panorere bagefter.
        onPress={handleLocationChange} // Almindeligt tryk sætter markøren.
        onLongPress={handleLocationChange} // Long-press sætter også markøren (opgavens krav).
      >

        {/* Brugerens markør – vises kun, når der er et gæt (&& = "hvis venstre side er sand, vis højre"). */}
        {guess && (
          <Marker
            coordinate={guess}
            pinColor="blue"
          />
        )}

        {/* Det rigtige sted – kun efter gættet er låst, og kun hvis der findes et svar. */}
        {showAnswer && answer && (
          <Marker
            // Runden indeholder flere felter (id, imageUrl ...), så vi plukker kun koordinaterne ud.
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
    height: 280, // Fast højde, fordi kortet ligger inde i en ScrollView (flex: 1 ville give højde 0).
    borderRadius: 18,
    overflow: 'hidden', // Klipper kortet, så de runde hjørner faktisk ses.
  },
  map: { flex: 1 }, // Kortet fylder hele containeren.
});
