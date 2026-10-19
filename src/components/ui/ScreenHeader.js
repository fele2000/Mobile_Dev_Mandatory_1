/**
 * ScreenHeader.js – Vores egen topbjælke (i stedet for navigationens standard-header).
 *
 * Layout: [venstre knap/logo]  [KEA GEO-titel]  [valgfri handlingsknap]
 *
 * Props:
 *  - onBack:      hvis sat, vises en tilbage-pil i venstre side i stedet for logoet "K".
 *  - actionLabel: tekst på en lille knap i højre side (fx "+ Add spot"). Udelades den, vises ingen knap.
 *  - onAction:    kaldes ved tryk på højre knap.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function ScreenHeader({ onBack, actionLabel, onAction }) {
  return (
    <View style={styles.row}>
      {/* Venstre side: tilbage-knap på underskærme, ellers app-logoet. */}
      {onBack ? (
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Gå tilbage">
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.mark}><Text style={styles.markText}>K</Text></View>
      )}
      {/* Midten: appens navn. flex: 1 gør, at den fylder pladsen mellem venstre og højre. */}
      <View style={styles.brand}>
        <Text style={styles.brandName}>KEA GEO</Text>
      </View>
      {/* Højre side: handlingsknap, eller en tom View så layoutet forbliver ens. */}
      {actionLabel ? (
        <Pressable onPress={onAction} style={styles.action} accessibilityRole="button">
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : <View style={styles.actionSpace} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', marginBottom: 18 }, // Vandret række.
  mark: { width: 38, height: 38, borderRadius: 13, backgroundColor: COLORS.brand, alignItems: 'center', justifyContent: 'center' },
  markText: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  brand: { marginLeft: 10, flex: 1 },
  brandName: { color: COLORS.ink, fontWeight: '800', fontSize: 15, letterSpacing: 0.8 },
  brandSub: { color: COLORS.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 2 },
  back: { width: 38, height: 38, borderRadius: 13, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  backText: { color: COLORS.ink, fontSize: 32, lineHeight: 34, marginTop: -4 }, // Negativ margin centrerer "‹"-tegnet visuelt.
  action: { paddingHorizontal: 13, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.brandLight },
  actionText: { color: COLORS.brandDark, fontSize: 13, fontWeight: '700' },
  actionSpace: { width: 12 },
});
