import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function PhotoCard({ imageUrl, roundNumber, totalRounds }) {
  // require() giver et tal, billeder fra telefonen er en uri
  const imageSource = typeof imageUrl === 'number' ? imageUrl : { uri: imageUrl };

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Text style={styles.title}>Hvor blev dette taget?</Text>
        <Text style={styles.counter}>{roundNumber} / {totalRounds}</Text>
      </View>
      {imageUrl ? (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderTitle}>Dit foto vises her</Text>
          <Text style={styles.placeholderText}>Tilføj et sted for at begynde at et spil.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 16, gap: 14 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
