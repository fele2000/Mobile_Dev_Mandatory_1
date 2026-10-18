// Viser kortet over KEA og håndterer lange tryk og markører.
import { useState } from "react"
import { StyleSheet, View } from "react-native"
import MapView, { Marker } from "react-native-maps"

const EKLocation = {
  latitude: 55.691513,
  longitude: 12.555128
}


export default function GuessMap() {
  const [guess, setGuess] = useState(null)

  function handleGuess(event) {
    setGuess(event.nativeEvent.coordinate)
  }

  return (
    <View style= {styles.container}>
      <MapView 
      style={styles.map}
      initialRegion={{
      ...EKLocation,
      latitudeDelta: 0.0008,
      longitudeDelta: 0.0008 }}
      onPress={handleGuess}
      >
        <Marker coordinate={EKLocation}
        title="EK Guldbergsgade"
        description="Guldbergsgade 29N, 2200 København N"
        />

        {guess && (
          <Marker
          coordinate={guess}
          title="Dit gæt"
          pinColor="blue"
        />
        )
      }


      </MapView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
})
