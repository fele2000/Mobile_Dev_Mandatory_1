import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../components/ui/ActionButton';
import { COLORS, SPACING } from '../constants/theme';
import { auth } from '../services/firebase';

// Firebase sender fejlkoder tilbage, dem oversætter vi til danske beskeder
const firebaseMessages = {
  'auth/invalid-email': 'Skriv en gyldig e-mailadresse.',
  'auth/invalid-credential': 'E-mail eller adgangskode er forkert.',
  'auth/email-already-in-use': 'Der findes allerede en bruger med den e-mail.',
  'auth/weak-password': 'Adgangskoden skal være på mindst 6 tegn.',
  'auth/too-many-requests': 'For mange forsøg. Vent lidt og prøv igen.',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      Alert.alert('Skriv både e-mail og adgangskode, båtnakke');
      return;
    }
    setIsLoading(true);
    // Vi navigerer ikke selv videre her. Når login lykkes kalder Firebase
    // onAuthStateChanged i AppNavigator, som så skifter til spillet.
    try {
      if (isCreatingAccount) await createUserWithEmailAndPassword(auth, cleanEmail, password);
      else await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (error) {
      Alert.alert('Login lykkedes desværre ikke', firebaseMessages[error.code]);
    } finally {
      setIsLoading(false);
    }
  };

  const creating = isCreatingAccount;
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Skubber indholdet op så tastaturet ikke dækker inputfelterne (mest et problem på iOS) */}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logo}><Text style={styles.logoText}>K</Text></View>
          <Text style={styles.eyebrow}>KEA GEO</Text>
          <Text style={styles.title}>{creating ? 'Opret konto' : 'Log ind'}</Text>
          <View style={styles.form}>
            {/* Controlled inputs: value kommer fra state og onChangeText opdaterer state */}
            <Text style={styles.label}>E-mail</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="navn@eksempel.dk" placeholderTextColor={COLORS.muted} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" autoComplete="email" accessibilityLabel="E-mail" />
            <Text style={styles.label}>Adgangskode</Text>
            <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder="Mindst 6 tegn" placeholderTextColor={COLORS.muted} secureTextEntry textContentType={creating ? 'newPassword' : 'password'} autoComplete={creating ? 'new-password' : 'current-password'} accessibilityLabel="Adgangskode" />
            <ActionButton title={creating ? 'Opret konto' : 'Log ind'} onPress={submit} loading={isLoading} />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>{creating ? 'Har du allerede en konto?' : 'Ny?'}</Text>
            <Pressable onPress={() => setIsCreatingAccount((value) => !value)} accessibilityRole="button"><Text style={styles.switchLink}>{creating ? 'Log ind' : 'Opret konto'}</Text></Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safeArea: { flex: 1, backgroundColor: COLORS.background }, content: { flexGrow: 1, padding: SPACING.screen, justifyContent: 'center' },
  logo: { width: 68, height: 68, borderRadius: 22, backgroundColor: COLORS.brand, alignItems: 'center', justifyContent: 'center', marginBottom: 22 }, logoText: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  eyebrow: { color: COLORS.brand, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, title: { color: COLORS.ink, fontSize: 30, fontWeight: '800', marginTop: 7 }, description: { color: COLORS.muted, fontSize: 16, lineHeight: 24, marginTop: 8, maxWidth: 330 },
  form: { marginTop: 30, gap: 8 }, label: { color: COLORS.ink, fontSize: 14, fontWeight: '700', marginTop: 8 },
  input: { minHeight: 52, borderWidth: 1, borderColor: COLORS.line, borderRadius: 14, backgroundColor: COLORS.surface, paddingHorizontal: 15, color: COLORS.ink, fontSize: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 20 }, switchText: { color: COLORS.muted, fontSize: 14 }, switchLink: { color: COLORS.brandDark, fontSize: 14, fontWeight: '800' },
});
