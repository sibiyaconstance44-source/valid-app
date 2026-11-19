import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function BookingSuccessScreen() {
  const { reference } = useLocalSearchParams<{ reference: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={64} color="#5B6B4F" />
        </View>

        <Text style={styles.title}>Your reference is ready</Text>
        <Text style={styles.subtitle}>
          Show this code when you arrive or when the clinic contacts you.
        </Text>

        <View style={styles.codeBox}>
          <Text style={styles.code}>{reference || 'XXXXXXXX'}</Text>
        </View>

        <Text style={styles.note}>
          Save a screenshot or write it down. You can also find it later in the app once accounts are connected.
        </Text>

        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Back to home</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F2' },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: { marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C2C2C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B6B6B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  codeBox: {
    marginTop: 28,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#5B6B4F',
  },
  code: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
    color: '#2C2C2C',
  },
  note: {
    fontSize: 13,
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
    maxWidth: 280,
  },
  button: {
    marginTop: 36,
    backgroundColor: '#5B6B4F',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
