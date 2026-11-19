import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateReferenceCode } from '@/lib/booking';

export default function BookScreen() {
  const { professionalId } = useLocalSearchParams<{ professionalId: string }>();
  const router = useRouter();

  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBook() {
    setLoading(true);
    try {
      // In production: insert into Supabase bookings table
      // For now we generate a local reference code
      const referenceCode = generateReferenceCode();

      // Simulate network
      await new Promise((r) => setTimeout(r, 600));

      router.replace({
        pathname: '/booking-success',
        params: { reference: referenceCode, professionalId },
      });
    } catch (e) {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Request an appointment</Text>
          <Text style={styles.subtitle}>
            We’ll generate a reference code you can use at the clinic. No account required for this demo.
          </Text>

          <Text style={styles.label}>Preferred date (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2026-11-20"
            value={preferredDate}
            onChangeText={setPreferredDate}
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Preferred time (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Morning / Afternoon / 14:00"
            value={preferredTime}
            onChangeText={setPreferredTime}
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Anything you’d like them to know?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional notes…"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholderTextColor="#A0A0A0"
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleBook}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating reference…' : 'Get my reference code'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F2' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: '#2C2C2C' },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E2DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C2C2C',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 28,
    backgroundColor: '#5B6B4F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
