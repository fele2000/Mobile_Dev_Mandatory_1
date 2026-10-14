# KEA GeoGuesser

KEA GeoGuesser er en skoleopgave på valgfaget mobiludvikling på KEA i København. Spilleren skal gætte, hvor på campus et foto er taget, ved at trykke længe på et kort og får point efter afstanden til det rigtige sted. Senere skal runder gemmes i Firebase Firestore og fotos i Firebase Storage, og brugeren skal kunne tilføje steder med kort og fotobibliotek. Dette projekt er kun et JavaScript-skelet med tomme pladsholdere uden spilfunktioner, navigation eller Firebase-forbindelse.

## Kom i gang

```sh
npm install
npx expo start
```

Scan QR-koden med Expo Go på Android. Appen viser foreløbig en tom skærm.
Installér nye pakker med `npx expo install <pakke>`, så versionerne passer til Expo SDK 57. Brug kun biblioteker, der virker i Expo Go uden et development build.

## Mappestruktur

```text
App.js                              Render kun AppNavigator
index.js                            Genereret Expo-indgangspunkt
src/
  navigation/
    AppNavigator.js                 Plads til stacknavigation mellem de to skærme
  screens/
    GameScreen.js                   Spiltilstand og samling af kort, foto og score
    AddLocationScreen.js            Ny runde med kort, fotovælger og upload
  components/
    map/
      GuessMap.js                   Kort over KEA, lange tryk og markører
    game/
      PhotoCard.js                  Den aktuelle rundes foto
      ScorePanel.js                 Afstand, point, samlet score og næste runde
  services/
    firebase.js                     Firebase-webkonfiguration, Firestore og Storage
    roundsService.js                Læsning og lagring af runder og fotos
  utils/
    scoring.js                      Rene funktioner til afstand og point
  constants/
    map.js                          Kortkonstanter og startregion over KEA
  data/
    mockRounds.js                   Testrunder med det fælles dataformat
assets/
  rounds/
    .gitkeep                        Plads til lokale testfotos
```

Hver fil har ét ansvar. Skærme holder tilstand og samler komponenter; komponenter viser data og kalder funktioner fra props. Ren logik hører til i `utils`, og al Firebase-kontakt hører til i `services`. Del filer op, hvis de vokser ud over cirka 150 linjer. Brug engelske navne, danske kommentarer og funktionskomponenter med hooks, ikke klassekomponenter.

## Fælles dataformat

```js
// En runde ser sådan ud:
// {
//   id: string,
//   imageUrl: string,     // URL fra Firebase Storage, eller lokal require() under test
//   latitude: number,
//   longitude: number,
// }
```

`mockRounds.js` eksporterer foreløbig et tomt array. Firebase-webkonfigurationen skal senere indsættes i `src/services/firebase.js`; intet Firebase-projekt er oprettet her.

## Arbejdsfordeling

- **Kort** — Navn: __________ — `GuessMap`, `constants/map`
- **Spil** — Navn: __________ — `GameScreen`, `PhotoCard`, `ScorePanel`, `scoring`, `mockRounds`
- **Firebase** — Navn: __________ — `firebase.js`, `roundsService`, `AddLocationScreen`

## Git-workflow

Brug én branch per person og små pull requests. Hold `App.js` lille, og test altid i Expo Go før merge.
