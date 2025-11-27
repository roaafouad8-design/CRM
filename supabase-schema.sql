-- Supabase auth users table is managed automatically.
-- This script creates a simple profiles table linked to auth.users
-- for storing user metadata after signup/login.

create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email text unique,
  full_name text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Allow users to select their own profile
create policy "Allow select own profile" on public.profiles
  for select using (auth.uid() = id);

-- Allow users to insert their own profile (only once)
create policy "Allow insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Allow users to update their own profile
create policy "Allow update own profile" on public.profiles
  for update using (auth.uid() = id);
