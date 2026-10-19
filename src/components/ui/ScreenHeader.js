import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

// Vores egen header (standard-headeren er slået fra i AppNavigator).
// Får man onBack med vises en tilbage-pil, ellers logoet
export default function ScreenHeader({ onBack, actionLabel, onAction }) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Gå tilbage">
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.mark}><Text style={styles.markText}>K</Text></View>
      )}
      <Text style={styles.brandName}>KEA GEO</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} style={styles.action} accessibilityRole="button">
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', marginBottom: 18 }, // logo, titel og knap på én vandret linje
  mark: { width: 38, height: 38, borderRadius: 13, backgroundColor: COLORS.brand, alignItems: 'center', justifyContent: 'center' },
  markText: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  brandName: { flex: 1, marginLeft: 10, color: COLORS.ink, fontWeight: '800', fontSize: 15, letterSpacing: 0.8 }, // flex: 1 fylder pladsen så knappen ryger helt til højre
  back: { width: 38, height: 38, borderRadius: 13, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  backText: { color: COLORS.ink, fontSize: 32, lineHeight: 34, marginTop: -4 },
  action: { paddingHorizontal: 13, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.brandLight },
  actionText: { color: COLORS.brandDark, fontSize: 13, fontWeight: '700' },
});
