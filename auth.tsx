import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        Alert.alert(
          'Check your email',
          'We sent you a confirmation link. After confirming you can sign in.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.back();
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Something went wrong. Check your Supabase keys.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{isSignUp ? 'Create account' : 'Sign in'}</Text>
          <Text style={styles.subtitle}>
            Optional. Sign in to save bookings and manage a facility later. You can still use Find Help and Reflect without an account.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            placeholderTextColor="#A0A0A0"
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Please wait…' : isSignUp ? 'Sign up' : 'Sign in'}
            </Text>
          </Pressable>

          <Pressable onPress={() => setIsSignUp(!isSignUp)} style={styles.switch}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F2' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#2C2C2C' },
  subtitle: { fontSize: 14, color: '#6B6B6B', marginTop: 8, marginBottom: 24, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#2C2C2C', marginBottom: 6, marginTop: 12 },
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
  button: {
    marginTop: 28,
    backgroundColor: '#5B6B4F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  switch: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#5B6B4F', fontSize: 14 },
});
