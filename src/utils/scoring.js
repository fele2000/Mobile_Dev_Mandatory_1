/**
 * scoring.js – Ren spillogik: afstand og point.
 *
 * "Rene" funktioner: samme input giver altid samme output, og de rører hverken
 * state, UI eller netværk. Derfor er de lette at teste og genbruge.
 */

// Beregner afstanden i meter mellem to punkter ({ latitude, longitude })
// med Haversine-formlen, som tager højde for, at Jorden er rund.
export function calculateDistance(first, second) {
  // Mangler et af punkterne, kan der ikke regnes – returnér 0 i stedet for at crashe.
  if (!first || !second) return 0;

  // Trigonometriske funktioner i JavaScript arbejder i radianer, ikke grader.
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDifference = toRadians(second.latitude - first.latitude);
  const longitudeDifference = toRadians(second.longitude - first.longitude);
  const latitudeOne = toRadians(first.latitude);
  const latitudeTwo = toRadians(second.latitude);
  // "a" i Haversine-formlen: kvadratet af halvdelen af korde-længden mellem punkterne.
  const value =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitudeOne) *
      Math.cos(latitudeTwo) *
      Math.sin(longitudeDifference / 2) ** 2;

  // 6371000 = Jordens radius i meter. atan2-delen giver vinklen mellem punkterne,
  // og radius * vinkel = afstanden langs jordoverfladen.
  return 6371000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

// Omsætter en afstand i meter til point. Simple "bånd" gør det let at justere
// sværhedsgraden her uden at røre spilskærmen.
export function calculatePoints(distanceMetres) {
  if (distanceMetres <= 25) return 1000; // Inden for 25 m: fuld pot.
  if (distanceMetres <= 50) return 750;
  if (distanceMetres <= 75) return 500;
  if (distanceMetres <= 100) return 250;
  return 0; // Mere end 100 m væk: ingen point.
}
