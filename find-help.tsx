import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentPosition, distanceKm } from '@/lib/location';
import { saveLastLocation, getLastLocation } from '@/lib/storage';
import { useFacilities } from '@/hooks/useFacilities';
import type { Facility } from '@/types';

export default function FindHelpScreen() {
  const { data: facilities = [], isLoading: facilitiesLoading, isError } = useFacilities();
  const [withDistance, setWithDistance] = useState<(Facility & { distance_km?: number })[]>([]);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    loadLocationAndSort();
  }, [facilities]);

  async function loadLocationAndSort() {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const pos = await getCurrentPosition();
      setUserLocation(pos);
      await saveLastLocation(pos.latitude, pos.longitude);

      const sorted = facilities
        .map((f) => ({
          ...f,
          distance_km: distanceKm(pos.latitude, pos.longitude, f.latitude, f.longitude),
        }))
        .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));

      setWithDistance(sorted);
      setFromCache(false);
    } catch (e: any) {
      setLocationError(e.message || 'Could not get location');
      const last = await getLastLocation();
      if (last) {
        setUserLocation({ latitude: last.lat, longitude: last.lon });
        const sorted = facilities
          .map((f) => ({
            ...f,
            distance_km: distanceKm(last.lat, last.lon, f.latitude, f.longitude),
          }))
          .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
        setWithDistance(sorted);
        setFromCache(true);
      } else {
        setWithDistance(facilities);
      }
    } finally {
      setLocationLoading(false);
    }
  }

  const loading = facilitiesLoading || locationLoading;

  if (loading && withDistance.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B6B4F" />
        <Text style={styles.loadingText}>Finding support near you…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {(locationError || isError || fromCache) && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {locationError
              ? `${locationError}. ${fromCache ? 'Using last known location.' : 'Showing facilities without distance.'}`
              : isError
              ? 'Could not reach server. Showing cached or demo data.'
              : 'Using last known location (offline).'}
          </Text>
        </View>
      )}

      <FlatList
        data={withDistance}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.header}>
            {userLocation
              ? 'Nearest mental health support'
              : 'Mental health support'}
          </Text>
        }
        renderItem={({ item }) => (
          <Link href={`/facility/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                {item.is_verified && (
                  <Ionicons name="checkmark-circle" size={18} color="#5B6B4F" />
                )}
              </View>
              <Text style={styles.address}>{item.address}</Text>
              {item.distance_km !== undefined && (
                <Text style={styles.distance}>
                  {item.distance_km < 1
                    ? `${Math.round(item.distance_km * 1000)} m away`
                    : `${item.distance_km.toFixed(1)} km away`}
                </Text>
              )}
              {item.description && (
                <Text style={styles.desc} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No facilities found nearby yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F2' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5F2' },
  loadingText: { marginTop: 12, color: '#5A5A5A' },
  banner: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE69C',
  },
  bannerText: { color: '#664D03', fontSize: 13, textAlign: 'center' },
  list: { padding: 16, paddingBottom: 32 },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E2DB',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 17, fontWeight: '600', color: '#2C2C2C', flex: 1 },
  address: { fontSize: 14, color: '#6B6B6B', marginTop: 4 },
  distance: { fontSize: 13, color: '#5B6B4F', marginTop: 6, fontWeight: '500' },
  desc: { fontSize: 13, color: '#8A8A8A', marginTop: 8, lineHeight: 18 },
  empty: { textAlign: 'center', color: '#8A8A8A', marginTop: 40 },
});
