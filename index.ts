export type UserRole = 'user' | 'facility_admin' | 'professional';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_verified: boolean;
  owner_id: string | null;
  distance_km?: number; // computed client-side
}

export interface Professional {
  id: string;
  facility_id: string;
  full_name: string;
  title: string;
  specialties: string[] | null;
  bio: string | null;
  is_available: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  professional_id: string;
  facility_id: string;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reference_code: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}
