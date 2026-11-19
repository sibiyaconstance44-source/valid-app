import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.header}>
            <Text style={styles.logo}>Valid</Text>
            <Text style={styles.tagline}>You're not alone. Help is closer than you think.</Text>
          </View>
          <Link href="/settings" asChild>
            <Pressable style={styles.settingsBtn} hitSlop={12}>
              <Ionicons name="settings-outline" size={24} color="#5A5A5A" />
            </Pressable>
          </Link>
        </View>

        {/* Crisis quick access */}
        <Link href="/crisis" asChild>
          <Pressable style={styles.crisisBanner}>
            <Ionicons name="heart" size={20} color="#8B3A3A" />
            <Text style={styles.crisisText}>Need immediate help? Tap here for crisis numbers</Text>
            <Ionicons name="chevron-forward" size={18} color="#8B3A3A" />
          </Pressable>
        </Link>

        <View style={styles.cards}>
          <Link href="/find-help" asChild>
            <Pressable style={[styles.card, styles.primaryCard]}>
              <Ionicons name="location" size={32} color="#fff" />
              <Text style={styles.cardTitleLight}>Find Help Nearby</Text>
              <Text style={styles.cardDescLight}>
                See the nearest clinics, psychologists and social workers. Book with a simple reference code.
              </Text>
            </Pressable>
          </Link>

          <Link href="/reflect" asChild>
            <Pressable style={styles.card}>
              <Ionicons name="chatbubbles-outline" size={28} color="#5B6B4F" />
              <Text style={styles.cardTitle}>Reflect</Text>
              <Text style={styles.cardDesc}>
                A quiet space for deep, honest questions — no advice, just room to feel.
              </Text>
            </Pressable>
          </Link>

          <Link href="/facility-register" asChild>
            <Pressable style={styles.card}>
              <Ionicons name="business-outline" size={28} color="#5B6B4F" />
              <Text style={styles.cardTitle}>I'm a Clinic / NGO</Text>
              <Text style={styles.cardDesc}>
                Register your facility and list the mental health professionals available.
              </Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.footerNote}>
          Offline-friendly where possible. Your location is only used to find the closest support. Add an AI key in Settings to power Reflect with a real model.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F2',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  header: {
    flex: 1,
    marginTop: 12,
    marginBottom: 20,
  },
  settingsBtn: {
    marginTop: 16,
    padding: 4,
  },
  logo: {
    fontSize: 42,
    fontWeight: '700',
    color: '#2C2C2C',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 17,
    color: '#5A5A5A',
    marginTop: 8,
    lineHeight: 24,
  },
  crisisBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  crisisText: {
    flex: 1,
    fontSize: 14,
    color: '#5C2B2B',
    fontWeight: '500',
  },
  cards: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E2DB',
  },
  primaryCard: {
    backgroundColor: '#5B6B4F',
    borderColor: '#5B6B4F',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginTop: 12,
  },
  cardTitleLight: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
  },
  cardDesc: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 6,
    lineHeight: 20,
  },
  cardDescLight: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    lineHeight: 20,
  },
  footerNote: {
    marginTop: 32,
    fontSize: 13,
    color: '#8A8A8A',
    textAlign: 'center',
    lineHeight: 18,
  },
});
