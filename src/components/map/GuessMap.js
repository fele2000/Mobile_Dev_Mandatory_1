import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { INITIAL_REGION } from '../../constants/map';
import { COLORS } from '../../constants/theme';

// Long-press the map to place a guess or choose a photo's location.
export default function GuessMap({
  guess,
  answer,
  onLocationChange,
  showAnswer = false,
  disabled = false,
  selectedLocation,
}) {
  const activeMarker = selectedLocation || guess;

  return (
    <View style={styles.frame}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        onLongPress={disabled ? undefined : (event) => onLocationChange?.(event.nativeEvent.coordinate)}
        showsCompass
        toolbarEnabled={false}
        accessibilityLabel="KEA campus map. Long press to place a marker."
      >
        {activeMarker && <Marker coordinate={activeMarker} pinColor={COLORS.brand} />}
        {showAnswer && answer && (
          <Marker coordinate={answer} pinColor={COLORS.success} title="Correct location" />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 280,
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#E8EEF1',
  },
});
