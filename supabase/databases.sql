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
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_name character varying NOT NULL,
  service character varying NOT NULL,
  booking_date date NOT NULL UNIQUE,
  address text,
  message text,
  status character varying NOT NULL DEFAULT 'confirmed'::character varying CHECK (status::text = ANY (ARRAY['confirmed'::character varying, 'cancelled'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.site_license (
  id integer NOT NULL DEFAULT 1 CHECK (id = 1),
  is_active boolean NOT NULL DEFAULT false,
  activated_at timestamp with time zone,
  expires_at timestamp with time zone,
  note text DEFAULT 'Maintenance subscription control'::text,
  CONSTRAINT site_license_pkey PRIMARY KEY (id)
);