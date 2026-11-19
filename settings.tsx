import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getLlmSettings, saveLlmSettings } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [model, setModel] = useState('gpt-4o-mini');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLlmSettings().then((s) => {
      if (s.apiKey) setApiKey(s.apiKey);
      setBaseUrl(s.baseUrl);
      setModel(s.model);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveLlmSettings({ apiKey: apiKey.trim(), baseUrl: baseUrl.trim(), model: model.trim() });
      Alert.alert('Saved', 'LLM settings stored securely on this device.');
    } catch {
      Alert.alert('Error', 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.back();
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Reflection AI</Text>
        <Text style={styles.hint}>
          Add your own API key so Reflect can use a real model. Works with OpenAI, Grok (xAI), Groq, or any OpenAI-compatible endpoint. The key stays on your device.
        </Text>

        <Text style={styles.label}>API Key</Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="sk-… or xai-…"
          autoCapitalize="none"
          secureTextEntry
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.label}>Base URL</Text>
        <TextInput
          style={styles.input}
          value={baseUrl}
          onChangeText={setBaseUrl}
          placeholder="https://api.openai.com/v1"
          autoCapitalize="none"
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.label}>Model</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="gpt-4o-mini"
          autoCapitalize="none"
          placeholderTextColor="#A0A0A0"
        />

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save AI settings'}</Text>
        </Pressable>

        <Text style={[styles.section, { marginTop: 36 }]}>Account</Text>
        {isAuthenticated ? (
          <>
            <Text style={styles.hint}>Signed in as {user?.email}</Text>
            <Pressable style={styles.secondaryBtn} onPress={handleSignOut}>
              <Text style={styles.secondaryBtnText}>Sign out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.hint}>Not signed in. Optional for bookings and facility management.</Text>
            <Pressable style={styles.secondaryBtn} onPress={() => router.push('/auth')}>
              <Text style={styles.secondaryBtnText}>Sign in / Sign up</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F2' },
  content: { padding: 20, paddingBottom: 40 },
  section: { fontSize: 18, fontWeight: '600', color: '#2C2C2C', marginBottom: 8 },
  hint: { fontSize: 13, color: '#6B6B6B', lineHeight: 19, marginBottom: 16 },
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
    marginTop: 24,
    backgroundColor: '#5B6B4F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#5B6B4F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#5B6B4F', fontSize: 15, fontWeight: '600' },
});
