/**
 * ActionButton.js – Genbrugelig knap til hele appen.
 *
 * Samler knappens udseende ét sted, så alle knapper ser ens ud.
 *
 * Props:
 *  - title:    teksten på knappen.
 *  - onPress:  funktion der kaldes ved tryk.
 *  - variant:  'primary' (fyldt hovedfarve) eller 'secondary' (lys baggrund).
 *  - disabled: true = knappen er grå og kan ikke trykkes.
 *  - loading:  true = viser en spinner i stedet for tekst og kan ikke trykkes (fx mens der gemmes).
 *  - style:    ekstra styling udefra, der lægges oven i standardstilen.
 */
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function ActionButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) {
  const secondary = variant === 'secondary';

  return (
    // Pressable er React Natives fleksible "trykbare" komponent.
    <Pressable
      accessibilityRole="button" // Fortæller skærmlæsere (VoiceOver/TalkBack), at det er en knap.
      onPress={onPress}
      disabled={disabled || loading} // Undgå dobbelt-tryk, mens noget loader.
      // style kan være en funktion, der får { pressed } – så kan knappen ændre udseende, mens man trykker.
      // Arrayet kombinerer flere styles; værdier som false ignoreres af React Native.
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.secondary : styles.primary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style, // Til sidst, så styling udefra kan overskrive standarden.
      ]}
    >
      {loading ? (
        // Spinnerens farve matcher knaptypen, så den er synlig på baggrunden.
        <ActivityIndicator color={secondary ? COLORS.brand : '#FFFFFF'} />
      ) : (
        <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52, // Stort trykfelt – lettere at ramme med tommelfingeren.
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: COLORS.brand },
  secondary: { backgroundColor: COLORS.brandLight },
  disabled: { opacity: 0.45 }, // Gennemsigtig = ser inaktiv ud.
  pressed: { opacity: 0.82 }, // Lille visuel feedback ved tryk.
  text: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryText: { color: COLORS.brandDark },
});
