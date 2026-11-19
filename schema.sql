-- Valid App Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('user', 'facility_admin', 'professional')) default 'user',
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Facilities (clinics / NGOs)
create table public.facilities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  address text not null,
  city text,
  latitude double precision not null,
  longitude double precision not null,
  phone text,
  email text,
  website text,
  is_verified boolean default false,
  owner_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Professionals (psychologists, social workers, etc.)
create table public.professionals (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid references public.facilities(id) on delete cascade not null,
  full_name text not null,
  title text not null, -- e.g. Clinical Psychologist, Social Worker
  specialties text[], -- array of specialties
  bio text,
  is_available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Availability slots (simple version)
create table public.availability (
  id uuid primary key default uuid_generate_v4(),
  professional_id uuid references public.professionals(id) on delete cascade not null,
  day_of_week int check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now()
);

-- Bookings
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) not null,
  professional_id uuid references public.professionals(id) not null,
  facility_id uuid references public.facilities(id) not null,
  preferred_date date,
  preferred_time text,
  notes text,
  status text check (status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  reference_code text unique not null, -- the token / OTP / reference number
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for location queries (simple version - for production use PostGIS)
create index facilities_location_idx on public.facilities (latitude, longitude);
create index bookings_user_idx on public.bookings (user_id);
create index bookings_reference_idx on public.bookings (reference_code);

-- RLS Policies (basic - tighten for production)
alter table public.profiles enable row level security;
alter table public.facilities enable row level security;
alter table public.professionals enable row level security;
alter table public.availability enable row level security;
alter table public.bookings enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Facilities: public read, owners manage
create policy "Anyone can view facilities" on public.facilities
  for select using (true);
create policy "Owners can insert facilities" on public.facilities
  for insert with check (auth.uid() = owner_id);
create policy "Owners can update own facilities" on public.facilities
  for update using (auth.uid() = owner_id);

-- Professionals: public read
create policy "Anyone can view professionals" on public.professionals
  for select using (true);

-- Bookings: users manage their own
create policy "Users can view own bookings" on public.bookings
  for select using (auth.uid() = user_id);
create policy "Users can create bookings" on public.bookings
  for insert with check (auth.uid() = user_id);

-- Function to generate reference code
create or replace function generate_reference_code()
returns text as $$
begin
  return upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
end;
$$ language plpgsql;

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
