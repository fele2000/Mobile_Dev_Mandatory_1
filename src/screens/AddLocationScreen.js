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

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Allow photo library access to choose a campus photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0]);
  };

  const saveLocation = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await addRound({ imageUrl: photo.uri, latitude: location.latitude, longitude: location.longitude });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save this spot', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader onBack={() => navigation.goBack()} />
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>BUILD YOUR CAMPUS GAME</Text>
          <Text style={styles.title}>Add a location</Text>
          <Text style={styles.description}>Choose a photo, then mark the place where it was taken.</Text>
        </View>

        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Choose a photo</Text>
            <Text style={styles.stepHint}>Pick an image from your library.</Text>
          </View>
        </View>
        {photo ? (
          <View style={styles.photoFrame}>
            <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover" />
            <ActionButton title="Choose a different photo" variant="secondary" onPress={choosePhoto} />
          </View>
        ) : (
          <ActionButton title="＋  Select photo" variant="secondary" onPress={choosePhoto} />
        )}

        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
          <View style={styles.stepCopy}>
            <Text style={styles.stepTitle}>Mark the location</Text>
            <Text style={styles.stepHint}>Press and hold the map to drop a pin.</Text>
          </View>
        </View>
        <GuessMap selectedLocation={location} onLocationChange={setLocation} />
        <Text style={styles.locationStatus}>
          {location
            ? `Pin set · ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
            : 'No location selected yet'}
        </Text>

        <ActionButton title="Save location" onPress={saveLocation} disabled={!canSave} loading={saving} />
        {!canSave && <Text style={styles.saveHint}>Add both a photo and a map pin to continue.</Text>}
        <Text style={styles.persistenceHint}>Spots stay available until you close the app.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.screen, paddingBottom: 30, gap: 16 },
  intro: { marginTop: 2, marginBottom: 3 },
  eyebrow: { color: COLORS.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
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
  persistenceHint: { color: COLORS.muted, fontSize: 11, textAlign: 'center', marginTop: -8 },
});
