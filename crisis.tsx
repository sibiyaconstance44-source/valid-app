import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CRISIS_RESOURCES, CRISIS_MESSAGE } from '@/constants/crisis';
import { Ionicons } from '@expo/vector-icons';

export default function CrisisScreen() {
  function callNumber(number: string) {
    Linking.openURL(`tel:${number.replace(/\s/g, '')}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Ionicons name="heart" size={28} color="#8B3A3A" />
          <Text style={styles.bannerText}>{CRISIS_MESSAGE}</Text>
        </View>

        {CRISIS_RESOURCES.map((r) => (
          <Pressable
            key={r.number}
            style={styles.card}
            onPress={() => callNumber(r.number)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{r.name}</Text>
              <Text style={styles.available}>{r.available}</Text>
            </View>
            <Text style={styles.number}>{r.number}</Text>
            <Text style={styles.desc}>{r.description}</Text>
            <Text style={styles.tap}>Tap to call</Text>
          </Pressable>
        ))}

        <Text style={styles.footer}>
          These numbers are for South Africa. If you are elsewhere, please contact your local emergency services.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F2' },
  content: { padding: 20, paddingBottom: 40 },
  banner: {
    backgroundColor: '#FDECEC',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bannerText: { flex: 1, fontSize: 15, color: '#5C2B2B', lineHeight: 22 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E2DB',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: '#2C2C2C', flex: 1 },
  available: { fontSize: 12, color: '#5B6B4F', fontWeight: '500' },
  number: { fontSize: 20, fontWeight: '700', color: '#5B6B4F', marginTop: 8, letterSpacing: 0.5 },
  desc: { fontSize: 13, color: '#6B6B6B', marginTop: 6, lineHeight: 18 },
  tap: { fontSize: 12, color: '#8A8A8A', marginTop: 10 },
  footer: { fontSize: 12, color: '#8A8A8A', textAlign: 'center', marginTop: 16, lineHeight: 18 },
});
