-- ==============================================================================
-- SCHEMA DATABASE SUPABASE UNTUK PORTAL KKG PJOK SD KECAMATAN PAGU (IDEMPOTEN)
-- ==============================================================================
-- Skrip ini dirancang aman dijalankan berulang kali (Idempotent) tanpa error
-- "policy already exists" atau "table already exists".
-- ==============================================================================

-- 1. TABEL UTAMA REALTIME SYNC (kkg_data)
create table if not exists public.kkg_data (
  id text primary key,
  data jsonb default '{}'::jsonb,
  items jsonb default '[]'::jsonb,
  last_updated timestamptz default timezone('utc'::text, now()) not null
);

comment on table public.kkg_data is 'Menyimpan dokumen dan koleksi data KKG PJOK Pagu secara realtime';

-- Aktifkan Row Level Security (RLS)
alter table public.kkg_data enable row level security;

-- Hapus policy lama jika ada untuk mencegah error 42710 (policy already exists)
drop policy if exists "Izinkan akses baca publik untuk kkg_data" on public.kkg_data;
drop policy if exists "Izinkan akses tulis publik untuk kkg_data" on public.kkg_data;
drop policy if exists "Izinkan akses update publik untuk kkg_data" on public.kkg_data;
drop policy if exists "Allow public read-write for kkg_data" on public.kkg_data;
drop policy if exists "Izinkan akses baca tulis untuk kkg_data" on public.kkg_data;

-- Buat ulang policy dengan akses baca & tulis untuk aplikasi
create policy "Izinkan akses baca publik untuk kkg_data"
  on public.kkg_data
  for select
  using (true);

create policy "Izinkan akses tulis publik untuk kkg_data"
  on public.kkg_data
  for insert
  with check (true);

create policy "Izinkan akses update publik untuk kkg_data"
  on public.kkg_data
  for update
  using (true)
  with check (true);

-- Tambahkan ke publikasi Realtime secara aman (hanya jika belum terdaftar)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
      and schemaname = 'public' 
      and tablename = 'kkg_data'
  ) then
    alter publication supabase_realtime add table public.kkg_data;
  end if;
end $$;


-- ==============================================================================
-- 2. TABEL RELASIONAL TAMBAHAN (DETAIL ENTITAS)
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
drop policy if exists "Public read write for teachers" on public.teachers;
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
drop policy if exists "Public read write for programs" on public.programs;
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
drop policy if exists "Public read write for materials" on public.materials;
create policy "Public read write for materials" on public.materials for all using (true) with check (true);

-- Tabel Artikel & Berita
create table if not exists public.articles (
  id text primary key,
  title text not null,
  category text not null,
  date text not null,
  author text default 'Admin KKG',
  image text default '',
  thumbnail text default '',
  excerpt text default '',
  content text default '',
  tags text[] default array[]::text[],
  views integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.articles enable row level security;
drop policy if exists "Public read write for articles" on public.articles;
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
drop policy if exists "Public read write for agenda" on public.agenda;
create policy "Public read write for agenda" on public.agenda for all using (true) with check (true);

-- Tabel Media Manager
create table if not exists public.media (
  id text primary key,
  name text not null,
  url text not null,
  category text default 'Dokumentasi',
  date text default '',
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.media enable row level security;
drop policy if exists "Public read write for media" on public.media;
create policy "Public read write for media" on public.media for all using (true) with check (true);

-- Tabel Pengaturan Website
create table if not exists public.settings (
  id text primary key default 'main',
  site_name text default 'KKG PJOK SD Kecamatan Pagu',
  phone text default '081330080340',
  whatsapp text default '6281330080340',
  email text default 'pjokkecpagu@gmail.com',
  address text default 'Kecamatan Pagu, Kabupaten Kediri, Jawa Timur',
  primary_color text default '#2563eb',
  accent_color text default '#dc2626',
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.settings enable row level security;
drop policy if exists "Public read write for settings" on public.settings;
create policy "Public read write for settings" on public.settings for all using (true) with check (true);
