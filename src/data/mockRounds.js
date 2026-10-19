/**
 * mockRounds.js – Lokale testrunder, indtil Firebase er klar.
 *
 * roundsService.js bruger dette array som startindhold. Tilføjer man runder
 * her, er de med fra start hver gang appen åbner – praktisk under test.
 *
 * En runde ser sådan ud (vores fælles dataformat, se README):
 * {
 *   id: string,
 *   imageUrl: string,     // URL fra Firebase Storage, eller lokal require() under test
 *   latitude: number,     // Breddegrad for hvor fotoet er taget
 *   longitude: number,    // Længdegrad for hvor fotoet er taget
 * }
 */

// Tomt array = ingen forudindlæste runder; brugeren opretter selv runder i appen.
export default [];
