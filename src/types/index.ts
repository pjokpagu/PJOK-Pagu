export type NavPage = 
  | 'beranda'
  | 'tentang-kami'
  | 'program-kkg'
  | 'perangkat-pembelajaran'
  | 'informasi'
  | 'kegiatan'
  | 'agenda'
  | 'kontak'
  | 'admin';

export interface HeroData {
  badge: string;
  title: string;
  highlightedText: string;
  description: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryLink: string;
  heroImage: string;
  sportsHighlights?: Array<{
    name: string;
    icon: string;
    category: string;
    desc: string;
  }>;
}

export interface ClientPartner {
  id: string;
  name: string;
  role: string;
  logoText: string;
  tagline: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  role: 'Pendamping' | 'Ketua' | 'Wakil Ketua' | 'Sekretaris 1' | 'Sekretaris 2' | 'Bendahara 1' | 'Bendahara 2' | 'Koordinator' | 'Anggota' | string;
  school: string;
  nip?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  avatar?: string;
  bio?: string;
  specialization?: string;
  phone?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: 'Pengembangan Profesi' | 'Kurikulum & Modul' | 'Pelatihan Atletik & O2SN' | 'Konsultasi UKS & Kebugaran';
  summary: string;
  description: string;
  benefits: string[];
  gallery: string[];
  faqs: Array<{ question: string; answer: string }>;
  contactPerson: string;
  iconName: string;
}

export interface ProgramKKG {
  id: string;
  slug: string;
  title: string;
  category: 'Praktik Baik' | 'Rapat Rutin' | 'Bimtek & Workshop' | 'Kompetisi O2SN' | 'Senam & Kebugaran Massal' | 'Festival PJOK';
  date: string;
  time: string;
  location: string;
  driveLink: string;
  description: string;
  status: 'Akan Datang' | 'Berjalan' | 'Selesai';
  targetParticipants: string;
  materials: Array<{ title: string; size: string; link: string }>;
  image: string;
}

export interface LearningMaterial {
  id: string;
  grade: 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Kelas 4' | 'Kelas 5' | 'Kelas 6' | 'Semua Kelas';
  category: 'Modul Ajar' | 'ATP & CP' | 'Buku Panduan Guru' | 'Instrumen Tes Kebugaran' | 'Modul P5 PJOK' | 'Lembar Kerja Siswa';
  title: string;
  summary: string;
  author: string;
  schoolOrigin: string;
  date: string;
  fileSize: string;
  downloadUrl: string;
  thumbnail: string;
  downloadsCount?: number;
}

export interface ArticleInfo {
  id: string;
  slug: string;
  title: string;
  category: 'Praktik Baik' | 'Berita Prestasi' | 'Sosialisasi Kurikulum' | 'Kesehatan & Gizi' | 'Hasil Lomba';
  summary: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  thumbnail: string;
  tags: string[];
}

export interface ActivityPhoto {
  id: string;
  title: string;
  category: 'Workshop Guru' | 'Lomba O2SN SD' | 'Senam Bersama' | 'Pertemuan Rutin Gugus' | 'Uji Kebugaran Siswa';
  date: string;
  location: string;
  image: string;
  description: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  hostSchool: string;
  speaker: string;
  dressCode: string;
  status: 'Akan Datang' | 'Sudah Terlaksana' | 'Mendatang' | 'Selesai' | string;
  description: string;
  registrationOpen: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface SiteSettings {
  siteName: string;
  subTitle: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address?: string;
  workingHours?: string;
  primaryColor: string;
  accentColor: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  telegramUrl?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
