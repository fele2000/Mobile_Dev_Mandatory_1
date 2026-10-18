/**
 * AddLocationScreen.js – Opret en ny runde (et nyt "spot").
 *
 * Brugeren gør to ting:
 *  1. Vælger et foto fra telefonens fotobibliotek (expo-image-picker).
 *  2. Sætter en markør på kortet, der hvor fotoet er taget (GuessMap).
 * Når begge dele er gjort, kan runden gemmes via roundsService, og man sendes
 * tilbage til spilskærmen, hvor den nye runde straks kan spilles.
 *
 * Opfylder opgavens features: (1) kort, (2) markør via long-press og
 * (5) vælg et billede fra Photos. Fotoets URI gemmes sammen med markørens
 * GPS-koordinater, så de hænger sammen i én runde.
 *
 * Bemærk: runden gemmes indtil videre kun i hukommelsen (se roundsService.js).
 * photo.uri er en lokal sti på telefonen; når Firebase Storage kobles på,
 * skal billedet uploades og URL'en derfra gemmes i stedet.
 */
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../components/ui/ActionButton';
import ScreenHeader from '../components/ui/ScreenHeader';
import GuessMap from '../components/map/GuessMap';
import { COLORS, SPACING } from '../constants/theme';
import { addRound } from '../services/roundsService';

export default function AddLocationScreen({ navigation }) {
  const [photo, setPhoto] = useState(null); // Det valgte billede (et "asset" fra ImagePicker med bl.a. .uri).
  const [location, setLocation] = useState(null); // Markørens { latitude, longitude }.
  const [saving, setSaving] = useState(false); // true mens vi gemmer – viser spinner og forhindrer dobbelt-gem.
  const canSave = Boolean(photo && location); // Gem-knappen er kun aktiv, når både foto og markør er valgt.

  // Åbner telefonens fotobibliotek, så brugeren kan vælge et billede.
  const choosePhoto = async () => {
    // Spørg først om lov til at tilgå fotos (påkrævet på iOS og nyere Android).
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Allow photo library access to choose a campus photo.');
      return; // Stop her, hvis brugeren afviste.
    }

    // Åbn billedvælgeren. await venter, til brugeren har valgt et billede eller annulleret.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Kun billeder, ikke video.
      allowsEditing: true, // Lad brugeren beskære billedet.
      aspect: [4, 3], // Beskæringsforhold, så alle fotos passer ens i PhotoCard.
      quality: 0.8, // Lidt komprimering (0–1) giver mindre filer.
    });
    // Hvis brugeren ikke annullerede, gem det første (og eneste) valgte billede.
    if (!result.canceled) setPhoto(result.assets[0]);
  };

  // Gemmer runden og går tilbage til spillet.
  const saveLocation = async () => {
    if (!canSave || saving) return; // Ekstra sikkerhed mod gem uden data eller dobbelt-tryk.
    setSaving(true);
    try {
      // Gem i vores fælles dataformat: { imageUrl, latitude, longitude } (id tilføjes af servicen).
      await addRound({ imageUrl: photo.uri, latitude: location.latitude, longitude: location.longitude });
      navigation.goBack(); // Tilbage til GameScreen, som henter runderne igen via useFocusEffect.
    } catch (error) {
      Alert.alert('Could not save this spot', 'Please try again.');
    } finally {
      // finally kører altid – både ved succes og fejl – så spinneren altid stopper.
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Topbjælke med tilbage-knap (onBack gør, at ScreenHeader viser "‹" i stedet for logoet). */}
        <ScreenHeader onBack={() => navigation.goBack()} />
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>BUILD YOUR CAMPUS GAME</Text>
          <Text style={styles.title}>Add a location</Text>
          <Text style={styles.description}>Choose a photo, then mark the place where it was taken.</Text>
        </View>

        {/* ---------- Trin 1: vælg foto ---------- */}
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Choose a photo</Text>
            <Text style={styles.stepHint}>Pick an image from your library.</Text>
          </View>
        </View>
        {/* Er der valgt et foto, vises det med mulighed for at skifte; ellers kun en vælg-knap. */}
        {photo ? (
          <View style={styles.photoFrame}>
            <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
            <ActionButton title="Choose a different photo" variant="secondary" onPress={choosePhoto} />
          </View>
        ) : (
          <ActionButton title="＋  Select photo" variant="secondary" onPress={choosePhoto} />
        )}

        {/* ---------- Trin 2: sæt markør ---------- */}
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Mark the location</Text>
            <Text style={styles.stepHint}>Tap or press and hold the map to drop a pin.</Text>
          </View>
        </View>
        {/* Samme kortkomponent som i spillet – her gemmer markøren stedet for det nye foto. */}
        <GuessMap guess={location} onLocationChange={setLocation} />
        {/* Viser de valgte koordinater med 5 decimaler (ca. 1 meters præcision). */}
        <Text style={styles.locationStatus}>
          {location
            ? `Pin set · ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
            : 'No location selected yet'}
        </Text>

        {/* ---------- Gem ---------- */}
        <ActionButton title="Save location" onPress={saveLocation} disabled={!canSave} loading={saving} />
        {/* Forklarer hvorfor knappen er grå, indtil begge trin er udført. */}
        {!canSave && <Text style={styles.saveHint}>Add both a photo and a map pin to continue.</Text>}
        <Text style={styles.persistenceHint}>Spots stay available until you close the app.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.screen, paddingBottom: 30, gap: 16 },
  // Introtekst
  intro: { marginTop: 2, marginBottom: 3 },
  eyebrow: { color: COLORS.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: COLORS.ink, fontSize: 28, fontWeight: '800', marginTop: 5 },
  description: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 5 },
  // Trin-overskrifter (nummer i en boks + titel og hint)
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  stepNumber: { width: 30, height: 30, borderRadius: 10, backgroundColor: COLORS.brandLight, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: COLORS.brandDark, fontWeight: '800', fontSize: 14 },
  stepCopy: { marginLeft: 10 },
  stepTitle: { color: COLORS.ink, fontSize: 15, fontWeight: '700' },
  stepHint: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  // Foto-forhåndsvisning
  photoFrame: { gap: 10 },
  photo: { width: '100%', height: 210, borderRadius: 18, backgroundColor: '#E8EEF1' },
  // Små statustekster – negativ marginTop trækker dem tættere på elementet over (modvirker gap: 16).
  locationStatus: { color: COLORS.muted, fontSize: 12, marginTop: -8 },
  saveHint: { color: COLORS.muted, fontSize: 12, textAlign: 'center', marginTop: -8 },
  persistenceHint: { color: COLORS.muted, fontSize: 11, textAlign: 'center', marginTop: -8 },
});
