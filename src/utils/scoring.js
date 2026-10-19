// Afstand i meter mellem gættet og det rigtige sted.
// Haversine-formlen tager højde for at jorden er rund (6371000 = jordens radius i meter)
export function calculateDistance(first, second) {
  if (!first || !second) return 0;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDifference = toRadians(second.latitude - first.latitude);
  const longitudeDifference = toRadians(second.longitude - first.longitude);
  const latitudeOne = toRadians(first.latitude);
  const latitudeTwo = toRadians(second.latitude);
  const value =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitudeOne) *
      Math.cos(latitudeTwo) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6371000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

// Jo tættere på, jo flere point. Over 100 m giver 0
export function calculatePoints(distanceMetres) {
  if (distanceMetres <= 25) return 1000;
  if (distanceMetres <= 50) return 750;
  if (distanceMetres <= 75) return 500;
  if (distanceMetres <= 100) return 250;
  return 0;
}
