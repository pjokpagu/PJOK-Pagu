-- ==============================================================================
-- SCHEMA DATABASE SUPABASE UNTUK PORTAL KKG PJOK SD KECAMATAN PAGU
-- ==============================================================================
-- Jalankan skrip SQL ini di "SQL Editor" pada dashboard Supabase Anda:
-- https://app.supabase.com/project/_/sql
-- ==============================================================================

-- 1. Tabel Utama kkg_data (Realtime Store untuk Sinkronisasi Lintas Perangkat)
create table if not exists public.kkg_data (
  id text primary key,
  data jsonb default '{}'::jsonb,
  items jsonb default '[]'::jsonb,
  last_updated timestamptz default timezone('utc'::text, now()) not null
);

-- Memberi deskripsi tabel
comment on table public.kkg_data is 'Menyimpan dokumen dan koleksi data KKG PJOK Pagu secara realtime';

-- Aktifkan Row Level Security (RLS)
alter table public.kkg_data enable row level security;

-- Policy agar aplikasi web dapat membaca (SELECT) data secara publik
create policy "Izinkan akses baca publik untuk kkg_data"
  on public.kkg_data
  for select
  using (true);

-- Policy agar aplikasi web / admin dapat menambahkan dan memperbarui (INSERT/UPDATE/UPSERT) data
create policy "Izinkan akses tulis publik untuk kkg_data"
  on public.kkg_data
  for insert
  with check (true);

create policy "Izinkan akses update publik untuk kkg_data"
  on public.kkg_data
  for update
  using (true)
  with check (true);

-- Aktifkan Supabase Realtime untuk tabel kkg_data
-- Supaya perubahan data di admin langsung terupdate seketika di semua perangkat (laptop/HP) tanpa reload
alter publication supabase_realtime add table public.kkg_data;

-- ==============================================================================
-- 2. TABEL RELASIONAL TAMBAHAN (OPSIONAL JIKA INGIN STRUKTUR RELASIONAL LENGKAP)
-- ==============================================================================

-- Tabel Guru & Pengurus
create table if not exists public.teachers (
  id text primary key,
  name text not null,
  role text not null,
  school text not null,
  nip text default '-',
  gender text default 'Laki-laki',
  avatar text default '',
  bio text default '',
  specialization text default '',
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.teachers enable row level security;
create policy "Public read write for teachers" on public.teachers for all using (true) with check (true);

-- Tabel Program Kerja
create table if not exists public.programs (
  id text primary key,
  title text not null,
  category text not null,
  description text default '',
  schedule text default '',
  target text default '',
  status text default 'Terlaksana',
  image text default '',
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.programs enable row level security;
create policy "Public read write for programs" on public.programs for all using (true) with check (true);

-- Tabel Perangkat Ajar & Modul
create table if not exists public.materials (
  id text primary key,
  title text not null,
  grade text not null,
  semester text not null,
  category text not null,
  file_format text default 'PDF',
  size text default '',
  download_url text default '',
  downloads integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.materials enable row level security;
create policy "Public read write for materials" on public.materials for all using (true) with check (true);

-- Tabel Artikel & Berita
create table if not exists public.articles (
  id text primary key,
  title text not null,
  category text not null,
  date text not null,
  author text default 'Admin KKG',
  image text default '',
  excerpt text default '',
  content text default '',
  tags text[] default array[]::text[],
  views integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.articles enable row level security;
create policy "Public read write for articles" on public.articles for all using (true) with check (true);

-- Tabel Agenda Kegiatan
create table if not exists public.agenda (
  id text primary key,
  title text not null,
  date text not null,
  time text default '',
  location text default '',
  description text default '',
  status text default 'Mendatang',
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.agenda enable row level security;
create policy "Public read write for agenda" on public.agenda for all using (true) with check (true);

-- Tabel Media Manager
create table if not exists public.media (
  id text primary key,
  name text not null,
  url text not null,
  category text default 'Umum',
  date text default '',
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.media enable row level security;
create policy "Public read write for media" on public.media for all using (true) with check (true);
