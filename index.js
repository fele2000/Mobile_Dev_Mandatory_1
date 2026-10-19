/**
 * index.js – Appens tekniske indgangspunkt (genereret af Expo).
 *
 * Det er denne fil, som "main" i package.json peger på. Den gør kun én ting:
 * registrerer vores rod-komponent <App /> hos React Native, så den bliver vist
 * når appen starter. Al egentlig app-logik ligger i App.js og mappen src/.
 */
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent kalder AppRegistry.registerComponent('main', () => App).
// Den sørger også for, at miljøet er sat korrekt op, uanset om appen køres
// i Expo Go eller i et native build.
registerRootComponent(App);
