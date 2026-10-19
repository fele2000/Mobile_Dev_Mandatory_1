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
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [saving, setSaving] = useState(false);
  const canSave = Boolean(photo && location);

  // expo-image-picker: først skal brugeren give lov til fotos, så åbnes billedbiblioteket
  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Adgang til fotos er nødvendig', 'Giv adgang til dit fotobibliotek for at vælge et foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3], // samme format på alle billeder så de passer i PhotoCard
      quality: 0.8,
    });
    // result.assets er en liste, men vi vælger kun ét billede
    if (!result.canceled) setPhoto(result.assets[0]);
  };

  const saveLocation = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      // TODO: upload billedet til Firebase Storage i stedet for at gemme den lokale uri
      // Billedet og markørens koordinater gemmes sammen som én runde
      await addRound({ imageUrl: photo.uri, latitude: location.latitude, longitude: location.longitude });
      navigation.goBack(); // tilbage til GameScreen (popper skærmen af stacken)
    } catch (error) {
      Alert.alert('Kunne ikke gemme dette sted', 'Prøv venligst igen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader onBack={() => navigation.goBack()} />
        <View style={styles.intro}>
          <Text style={styles.title}>Tilføj et sted</Text>
          <Text style={styles.description}>Vælg et foto, og markér derefter stedet, hvor det blev taget.</Text>
        </View>

        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Vælg et foto</Text>
            <Text style={styles.stepHint}>Vælg et billede fra dit bibliotek.</Text>
          </View>
        </View>
        {photo ? (
          <View style={styles.photoFrame}>
            <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
            <ActionButton title="Vælg et andet foto" variant="secondary" onPress={choosePhoto} />
          </View>
        ) : (
          <ActionButton title="＋  Vælg foto" variant="secondary" onPress={choosePhoto} />
        )}

        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Markér stedet</Text>
            <Text style={styles.stepHint}>Tryk eller hold fingeren på kortet for at sætte en markør.</Text>
          </View>
        </View>
        {/* Samme kort som i spillet, her bruges markøren til at angive hvor billedet er taget */}
        <GuessMap guess={location} onLocationChange={setLocation} />
        {!location && <Text style={styles.locationStatus}>Intet sted valgt endnu</Text>}

        <ActionButton title="Gem sted" onPress={saveLocation} disabled={!canSave} loading={saving} />
        {!canSave && <Text style={styles.saveHint}>Tilføj både et foto og en markør på kortet for at fortsætte.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.screen, paddingBottom: 30, gap: 16 },
  intro: { marginTop: 2, marginBottom: 3 },
  title: { color: COLORS.ink, fontSize: 28, fontWeight: '800', marginTop: 5 },
  description: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 5 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  stepNumber: { width: 30, height: 30, borderRadius: 10, backgroundColor: COLORS.brandLight, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: COLORS.brandDark, fontWeight: '800', fontSize: 14 },
  stepCopy: { marginLeft: 10 },
  stepTitle: { color: COLORS.ink, fontSize: 15, fontWeight: '700' },
  stepHint: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  photoFrame: { gap: 10 },
  photo: { width: '100%', height: 210, borderRadius: 18, backgroundColor: '#E8EEF1' },
  locationStatus: { color: COLORS.muted, fontSize: 12, marginTop: -8 },
  saveHint: { color: COLORS.muted, fontSize: 12, textAlign: 'center', marginTop: -8 },
});
