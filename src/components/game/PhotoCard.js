/**
 * PhotoCard.js – Viser fotoet for den aktuelle runde.
 *
 * Er der intet billede, vises en pladsholder i stedet, så layoutet ikke
 * "hopper", og brugeren forstår, hvad der mangler.
 *
 * Props:
 *  - imageUrl:    billedets kilde (URI-tekst eller et lokalt require()-tal).
 *  - roundNumber: nummeret på den aktuelle runde (starter ved 1).
 *  - totalRounds: hvor mange runder der er i alt.
 */
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function PhotoCard({ imageUrl, roundNumber, totalRounds }) {
  // <Image> kræver forskellig "source" afhængig af billedtypen:
  //  - require('./foto.jpg') giver et tal (lokalt bundlet billede) → bruges direkte.
  //  - en URL/sti-tekst skal pakkes ind som { uri: ... }.
  const imageSource = typeof imageUrl === 'number' ? imageUrl : { uri: imageUrl };

  return (
    <View style={styles.card}>
      {/* Overskrift til venstre og rundetæller ("2 / 5") til højre. */}
      <View style={styles.heading}>
        <View>
          <Text style={styles.title}>Hvor blev dette taget?</Text>
        </View>
        <Text style={styles.counter}>{roundNumber} / {totalRounds}</Text>
      </View>
      {/* Ternary (betingelse ? A : B): vis billedet hvis det findes, ellers pladsholderen. */}
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
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, // Række: tekst venstre, tæller højre.
  eyebrow: { color: COLORS.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 }, // Lille overtekst over titlen.
  title: { color: COLORS.ink, fontSize: 18, fontWeight: '700', marginTop: 4 },
  counter: { color: COLORS.muted, fontSize: 13, fontWeight: '600' },
  image: { width: '100%', height: 210, borderRadius: 14, backgroundColor: '#E8EEF1' }, // Grå baggrund mens billedet loader.
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
