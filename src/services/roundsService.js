/**
 * roundsService.js – Al læsning og lagring af runder.
 *
 * Skærmene snakker kun med denne fil og ved ikke, HVOR data gemmes.
 * Det betyder, at vi senere kan udskifte den midlertidige lagring nedenfor med
 * Firestore (runder) og Firebase Storage (fotos), uden at ændre i skærmene.
 *
 * Lige nu gemmes runderne kun i hukommelsen (en almindelig variabel), så de
 * forsvinder, når appen lukkes.
 *
 * Funktionerne er "async" (returnerer et Promise), selvom de ikke venter på
 * noget endnu. Det er med vilje: Firebase-kald er asynkrone, så skærmene
 * bruger allerede await/.then og skal ikke ændres, når Firebase kobles på.
 */
import mockRounds from '../data/mockRounds';

// Midlertidig lagring for denne session. Startes med eventuelle testrunder.
// [...mockRounds] laver en kopi, så vi ikke ændrer det importerede array.
let rounds = [...mockRounds];

// Henter alle runder. Returnerer en kopi, så kaldere ikke kan ændre vores interne liste direkte.
export async function getRounds() {
  return [...rounds];
}

// Gemmer en ny runde ({ imageUrl, latitude, longitude }) og returnerer den gemte runde inkl. id.
export async function addRound(round) {
  const savedRound = {
    ...round,
    // Brug det medsendte id, ellers lav et simpelt unikt id ud fra tidspunktet i millisekunder.
    id: round.id || `${Date.now()}`,
  };

  // Lav en ny liste i stedet for at bruge push – samme "immutable" stil som React-state.
  rounds = [...rounds, savedRound];
  return savedRound;
}
