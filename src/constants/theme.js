/**
 * theme.js – Fælles farver og afstande (design tokens).
 *
 * Alle komponenter importerer farver og afstande herfra i stedet for at skrive
 * hex-koder direkte. Så kan hele appens udseende ændres ét sted, og designet
 * bliver ensartet på tværs af skærmene.
 */

// Farvepalet brugt i hele appen.
export const COLORS = {
  background: '#F4F6F8', // Lys grå baggrund bag alle skærme.
  surface: '#FFFFFF', // Hvid baggrund på kort/paneler.
  ink: '#17212B', // Primær tekstfarve (næsten sort).
  muted: '#667482', // Sekundær/dæmpet tekst, fx hjælpetekster.
  line: '#E2E8ED', // Tynde skillelinjer.
  brand: '#0E7490', // Appens hovedfarve (petrol), bruges på primære knapper.
  brandDark: '#155E75', // Mørkere variant af hovedfarven.
  brandLight: '#E2F3F6', // Lys variant, bruges som baggrund på sekundære knapper.
  success: '#16805D', // Grøn – fx point og "PIN SET".
  warning: '#B46917', // Orange – reserveret til advarsler (ikke brugt endnu).
  danger: '#B84646', // Rød – reserveret til fejl (ikke brugt endnu).
};

// Faste afstande i pixels, så margener og padding er ens overalt.
export const SPACING = {
  screen: 20, // Vandret padding i siderne af hver skærm.
  card: 16,
  small: 8,
  medium: 12,
  large: 24,
};
