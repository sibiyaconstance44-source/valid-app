import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { cacheFacilities, getCachedFacilities } from '@/lib/storage';
import type { Facility } from '@/types';

const DEMO_FACILITIES: Facility[] = [
  {
    id: '1',
    name: 'Cape Town Mental Health Centre',
    description: 'Walk-in and booked counselling services.',
    address: '12 Long Street, Cape Town',
    city: 'Cape Town',
    latitude: -33.9249,
    longitude: 18.4241,
    phone: '+27 21 000 0000',
    email: null,
    website: null,
    is_verified: true,
    owner_id: null,
  },
  {
    id: '2',
    name: 'Hope Community Clinic',
    description: 'Psychologists and social workers available.',
    address: '45 Main Rd, Observatory',
    city: 'Cape Town',
    latitude: -33.94,
    longitude: 18.47,
    phone: '+27 21 111 1111',
    email: null,
    website: null,
    is_verified: true,
    owner_id: null,
  },
  {
    id: '3',
    name: 'Ubuntu Wellness',
    description: 'Trauma-informed care and group support.',
    address: '8 Wale Street, Cape Town',
    city: 'Cape Town',
    latitude: -33.9255,
    longitude: 18.419,
    phone: null,
    email: null,
    website: null,
    is_verified: false,
    owner_id: null,
  },
];

async function fetchFacilities(): Promise<Facility[]> {
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name');

    if (!error && data && data.length > 0) {
      await cacheFacilities(data);
      return data as Facility[];
    }
  } catch {
    // network or config error – fall through
  }

  // Fallback to cache
  const cached = await getCachedFacilities();
  if (cached?.data?.length) {
    return cached.data as Facility[];
  }

  // Final fallback: demo data
  await cacheFacilities(DEMO_FACILITIES);
  return DEMO_FACILITIES;
}

export function useFacilities() {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: fetchFacilities,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}
