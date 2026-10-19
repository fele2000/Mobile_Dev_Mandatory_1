// Google Maps nøglen ligger i .env så den ikke kommer på GitHub.
// Uden nøgle bygger appen bare uden maps-pluginet.
module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      ...(googleMapsApiKey
        ? [['react-native-maps', { androidGoogleMapsApiKey: googleMapsApiKey }]]
        : []),
    ],
  };
};
