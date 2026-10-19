/**
 * map.js – Konstanter til kortet.
 *
 * Samles her, så alle kort i appen starter samme sted, og så man kun skal
 * ændre ét sted, hvis startområdet skal flyttes.
 */

// Startregion over KEA's campus i Guldbergsgade, København.
// En "region" i react-native-maps består af et midtpunkt + hvor meget der er synligt.
export const INITIAL_REGION = {
  latitude: 55.6902, // Breddegrad for kortets midtpunkt (nord/syd).
  longitude: 12.5562, // Længdegrad for kortets midtpunkt (øst/vest).
  latitudeDelta: 0.008, // Hvor mange breddegrader kortet viser i højden (mindre tal = mere zoom).
  longitudeDelta: 0.008, // Hvor mange længdegrader kortet viser i bredden.
};
