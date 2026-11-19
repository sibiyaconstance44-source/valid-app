import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Demo professionals
const DEMO_PROS = [
  {
    id: 'p1',
    facility_id: '1',
    full_name: 'Dr. Amina Nkosi',
    title: 'Clinical Psychologist',
    specialties: ['Anxiety', 'Trauma', 'Depression'],
    bio: 'Specialises in trauma-informed care and adult therapy.',
    is_available: true,
  },
  {
    id: 'p2',
    facility_id: '1',
    full_name: 'Thabo Molefe',
    title: 'Social Worker',
    specialties: ['Family support', 'Crisis intervention'],
    bio: null,
    is_available: true,
  },
  {
    id: 'p3',
    facility_id: '2',
    full_name: 'Sarah Jacobs',
    title: 'Counselling Psychologist',
    specialties: ['Grief', 'Relationships'],
    bio: 'Warm, collaborative approach.',
    is_available: true,
  },
];

const DEMO_FACILITIES: Record<string, any> = {
  '1': {
    name: 'Cape Town Mental Health Centre',
    address: '12 Long Street, Cape Town',
    phone: '+27 21 000 0000',
    description: 'Walk-in and booked counselling services.',
  },
  '2': {
    name: 'Hope Community Clinic',
    address: '45 Main Rd, Observatory',
    phone: '+27 21 111 1111',
    description: 'Psychologists and social workers available.',
  },
  '3': {
    name: 'Ubuntu Wellness',
    address: '8 Wale Street, Cape Town',
    phone: null,
    description: 'Trauma-informed care and group support.',
  },
};

export default function FacilityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const facility = DEMO_FACILITIES[id || '1'] || DEMO_FACILITIES['1'];
  const professionals = DEMO_PROS.filter((p) => p.facility_id === id || id === '1');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.name}>{facility.name}</Text>
        <Text style={styles.address}>{facility.address}</Text>
        {facility.phone && (
          <Text style={styles.phone}>{facility.phone}</Text>
        )}
        {facility.description && (
          <Text style={styles.desc}>{facility.description}</Text>
        )}

        <Text style={styles.sectionTitle}>Available professionals</Text>

        {professionals.map((pro) => (
          <View key={pro.id} style={styles.proCard}>
            <View style={styles.proHeader}>
              <Text style={styles.proName}>{pro.full_name}</Text>
              {pro.is_available && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Available</Text>
                </View>
              )}
            </View>
            <Text style={styles.proTitle}>{pro.title}</Text>
            {pro.specialties && (
              <Text style={styles.specialties}>
                {pro.specialties.join(' · ')}
              </Text>
            )}
            {pro.bio && <Text style={styles.bio}>{pro.bio}</Text>}

            <Link href={`/book/${pro.id}`} asChild>
              <Pressable style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book appointment</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </Pressable>
            </Link>
          </View>
        ))}

        {professionals.length === 0 && (
          <Text style={styles.empty}>No professionals listed yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F2' },
  content: { padding: 20, paddingBottom: 40 },
  name: { fontSize: 24, fontWeight: '700', color: '#2C2C2C' },
  address: { fontSize: 15, color: '#6B6B6B', marginTop: 6 },
  phone: { fontSize: 15, color: '#5B6B4F', marginTop: 4 },
  desc: { fontSize: 15, color: '#5A5A5A', marginTop: 12, lineHeight: 22 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginTop: 28,
    marginBottom: 12,
  },
  proCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E2DB',
  },
  proHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  proName: { fontSize: 17, fontWeight: '600', color: '#2C2C2C', flex: 1 },
  badge: {
    backgroundColor: '#E8F0E3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { fontSize: 12, color: '#5B6B4F', fontWeight: '500' },
  proTitle: { fontSize: 14, color: '#6B6B6B', marginTop: 4 },
  specialties: { fontSize: 13, color: '#8A8A8A', marginTop: 6 },
  bio: { fontSize: 13, color: '#5A5A5A', marginTop: 8, lineHeight: 18 },
  bookBtn: {
    marginTop: 14,
    backgroundColor: '#5B6B4F',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bookBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  empty: { color: '#8A8A8A', textAlign: 'center', marginTop: 20 },
});
