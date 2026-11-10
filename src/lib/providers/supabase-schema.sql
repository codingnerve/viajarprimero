-- Trips shown on /my-trips.
-- Run once in Supabase → SQL Editor → New query → Run.
--
-- Agents add one row per booking in Supabase → Table Editor → trips, using the
-- email address the customer signs in with.
--
-- Keep "Confirm email" switched ON in Supabase → Authentication → Sign In /
-- Providers → Email. The policy below trusts the account's email address, so
-- an unconfirmed address must never be able to sign in.

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  reference text not null,
  trip_type text not null default 'flight'
    check (trip_type in ('flight', 'hotel', 'car', 'cruise', 'private-jet', 'vacation', 'other')),
  title text not null,
  start_date date,
  end_date date,
  status text not null default 'confirmed',
  total_amount numeric(12, 2),
  currency text not null default 'USD',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists trips_customer_email_idx
  on public.trips (lower(customer_email));

alter table public.trips enable row level security;

drop policy if exists "Customers read their own trips" on public.trips;
create policy "Customers read their own trips"
  on public.trips for select
  to authenticated
  using (lower(customer_email) = lower(auth.jwt() ->> 'email'));
