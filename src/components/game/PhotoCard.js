import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

// Shows the round photo or a clear placeholder before any rounds are added.
export default function PhotoCard({ imageUrl, roundNumber, totalRounds }) {
  const imageSource = typeof imageUrl === 'number' ? imageUrl : { uri: imageUrl };

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.eyebrow}>YOUR CHALLENGE</Text>
          <Text style={styles.title}>Where was this taken?</Text>
        </View>
        <Text style={styles.counter}>{roundNumber} / {totalRounds}</Text>
      </View>
      {imageUrl ? (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderTitle}>Your photo goes here</Text>
          <Text style={styles.placeholderText}>Add a location to start building your game.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 16, gap: 14 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: COLORS.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: COLORS.ink, fontSize: 18, fontWeight: '700', marginTop: 4 },
  counter: { color: COLORS.muted, fontSize: 13, fontWeight: '600' },
  image: { width: '100%', height: 210, borderRadius: 14, backgroundColor: '#E8EEF1' },
  placeholder: {
    height: 170,
    borderRadius: 14,
    backgroundColor: COLORS.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  placeholderIcon: { fontSize: 28, marginBottom: 8 },
  placeholderTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '700' },
  placeholderText: { color: COLORS.muted, fontSize: 13, textAlign: 'center', marginTop: 5 },
});
