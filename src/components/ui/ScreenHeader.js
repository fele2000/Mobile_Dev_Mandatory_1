import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function ScreenHeader({ onBack, actionLabel, onAction }) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.mark}><Text style={styles.markText}>K</Text></View>
      )}
      <View style={styles.brand}>
        <Text style={styles.brandName}>KEA GEO</Text>
        <Text style={styles.brandSub}>CAMPUS EXPLORER</Text>
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} style={styles.action} accessibilityRole="button">
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : <View style={styles.actionSpace} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  mark: { width: 38, height: 38, borderRadius: 13, backgroundColor: COLORS.brand, alignItems: 'center', justifyContent: 'center' },
  markText: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  brand: { marginLeft: 10, flex: 1 },
  brandName: { color: COLORS.ink, fontWeight: '800', fontSize: 15, letterSpacing: 0.8 },
  brandSub: { color: COLORS.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 2 },
  back: { width: 38, height: 38, borderRadius: 13, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  backText: { color: COLORS.ink, fontSize: 32, lineHeight: 34, marginTop: -4 },
  action: { paddingHorizontal: 13, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.brandLight },
  actionText: { color: COLORS.brandDark, fontSize: 13, fontWeight: '700' },
  actionSpace: { width: 12 },
});
