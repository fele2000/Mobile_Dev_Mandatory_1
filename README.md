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
