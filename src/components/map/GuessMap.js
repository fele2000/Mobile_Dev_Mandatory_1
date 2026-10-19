import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { INITIAL_REGION } from '../../constants/map';

const KEA_LOCATION = {
  latitude: 55.691513,
  longitude: 12.555128,
};

export default function GuessMap({
  guess = null,
  answer = null,
  showAnswer = false,
  disabled = false,
  onLocationChange = () => {},
}) {
  const handleLocationChange = (event) => {
    if (disabled) return;
    onLocationChange(event.nativeEvent.coordinate);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="hybrid"
        initialRegion={INITIAL_REGION}
        onPress={handleLocationChange}
        onLongPress={handleLocationChange}
      >
        {guess && (
          <Marker
            coordinate={guess}
            pinColor="blue"
          />
        )}

        {showAnswer && answer && (
          <Marker
            coordinate={{ latitude: answer.latitude, longitude: answer.longitude }}
            title="Photo location"
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
    height: 280,
    borderRadius: 18,
    overflow: 'hidden',
  },
  map: { flex: 1 },
});
