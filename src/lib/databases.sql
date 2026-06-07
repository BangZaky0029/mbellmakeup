-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.images (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  title character varying NOT NULL DEFAULT '25'::character varying,
  category character varying NOT NULL DEFAULT '50'::character varying,
  imageUrl character varying DEFAULT '255'::character varying,
  description character varying DEFAULT '500'::character varying,
  details character varying DEFAULT '500'::character varying,
  CONSTRAINT images_pkey PRIMARY KEY (id)
);

CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  role character varying,
  content text NOT NULL,
  image_url text,
  is_approved boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- ============================================================
-- BOOKINGS TABLE
-- Menyimpan data reservasi client dari form "Get In Touch"
-- 1 hari = 1 booking (UNIQUE constraint pada booking_date)
-- ============================================================
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_name character varying NOT NULL,
  service character varying NOT NULL,
  booking_date date NOT NULL UNIQUE,  -- 1 hari hanya 1 booking
  address text,
  message text,
  status character varying NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 2. Public (anon) bisa SELECT booking_date & service saja untuk kalender
CREATE POLICY "Public can view booking dates"
  ON public.bookings
  FOR SELECT
  TO anon
  USING (status = 'confirmed');

-- 3. Public (anon) bisa INSERT booking baru
CREATE POLICY "Public can insert bookings"
  ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Hanya authenticated user (pemilik) yg bisa UPDATE/DELETE
CREATE POLICY "Owner can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Owner can delete bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- SITE LICENSE TABLE
-- Satu baris saja (id=1) untuk kontrol status website.
-- Developer toggle is_active + expires_at untuk lock/unlock.
-- ============================================================
CREATE TABLE public.site_license (
  id integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT false,
  activated_at timestamp with time zone,
  expires_at timestamp with time zone,
  note text DEFAULT 'Maintenance subscription control',
  CONSTRAINT site_license_pkey PRIMARY KEY (id),
  CONSTRAINT single_row CHECK (id = 1)  -- hanya boleh ada 1 baris
);

-- Insert baris awal (default: terkunci)
INSERT INTO public.site_license (id, is_active)
VALUES (1, false);

-- ============================================================
-- RLS POLICIES untuk site_license
-- ============================================================
ALTER TABLE public.site_license ENABLE ROW LEVEL SECURITY;

-- Public (anon) hanya bisa SELECT is_active & expires_at
CREATE POLICY "Public can read license status"
  ON public.site_license
  FOR SELECT
  TO anon
  USING (id = 1);

-- Public (anon) bisa UPDATE untuk aktivasi via password frontend
-- (field dibatasi oleh aplikasi, bukan oleh policy ini)
CREATE POLICY "Public can activate license"
  ON public.site_license
  FOR UPDATE
  TO anon
  USING (id = 1)
  WITH CHECK (id = 1);

-- Hanya authenticated (owner Supabase) yang bisa INSERT/DELETE
CREATE POLICY "Owner can manage license"
  ON public.site_license
  FOR ALL
  TO authenticated
  USING (true);