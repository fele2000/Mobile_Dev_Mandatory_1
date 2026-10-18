/**
 * app.config.js – Dynamisk Expo-konfiguration.
 *
 * Expo læser først den statiske app.json og sender den ind her som `config`.
 * Her kan vi så udvide konfigurationen med værdier, der ikke må stå i app.json,
 * fx hemmelige nøgler fra miljøvariabler.
 *
 * Formålet her: Google Maps på Android kræver en API-nøgle. Nøglen ligger i
 * miljøvariablen EXPO_PUBLIC_GOOGLE_MAPS_API_KEY (fx i en lokal .env-fil, som
 * ikke committes til Git). Findes nøglen, tilføjes react-native-maps-pluginet
 * med nøglen; findes den ikke, bygges appen uden – så alle i gruppen stadig kan
 * starte projektet, selvom de ikke har en nøgle.
 */
module.exports = ({ config }) => {
  // Læs API-nøglen fra miljøet (undefined hvis den ikke er sat).
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  return {
    // Behold alt fra app.json uændret.
    ...config,
    plugins: [
      // Behold eventuelle plugins, som allerede er defineret i app.json (?? [] = tom liste hvis ingen).
      ...(config.plugins ?? []),
      // Tilføj kun react-native-maps-pluginet, hvis vi faktisk har en nøgle.
      ...(googleMapsApiKey
        ? [
            [
              'react-native-maps',
              { androidGoogleMapsApiKey: googleMapsApiKey },
            ],
          ]
        : []),
    ],
  };
};
