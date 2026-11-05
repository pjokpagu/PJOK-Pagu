import {
  HeroData,
  ClientPartner,
  TeacherProfile,
  ServiceItem,
  ProgramKKG,
  LearningMaterial,
  ArticleInfo,
  ActivityPhoto,
  AgendaItem,
  Testimonial,
  SiteSettings
} from '../types';

export const initialHero: HeroData = {
  badge: "Pusat Kolaborasi Guru Olahraga Sekolah Dasar",
  title: "Papan Informasi & Transformasi Pembelajaran PJOK",
  highlightedText: "Kecamatan Pagu",
  description: "Wadah profesional guru Pendidikan Jasmani, Olahraga, dan Kesehatan tingkat Sekolah Dasar se-Kecamatan Pagu, Kabupaten Kediri. Mengembangkan kurikulum merdeka, modul ajar interaktif, kebugaran jasmani, dan prestasi atlet usia dini.",
  ctaPrimaryText: "Lihat Program KKG",
  ctaSecondaryText: "Download Perangkat Ajar",
  ctaPrimaryLink: "program-kkg",
  ctaSecondaryLink: "perangkat-pembelajaran",
  heroImage: "https://lh3.googleusercontent.com/d/1GOWwScQYH4d91HvenSm7BOxulSUsYp58",
  sportsHighlights: [],

  // Default Page Hero Banners:
  pengurusHeroImage: "https://lh3.googleusercontent.com/d/1DuKGEOwJsC92t8--IC_XvB7E-cWMziQi",
  pengurusBadge: "Struktur Organisasi Resmi KKG PJOK SD Kecamatan Pagu",
  pengurusTitle: "Susunan Pengurus & Keanggotaan",
  pengurusDescription: "Wadah silaturahmi, kolaborasi, dan pengembangan keprofesian berkelanjutan guru Pendidikan Jasmani, Olahraga, dan Kesehatan tingkat Sekolah Dasar se-Kecamatan Pagu, Kabupaten Kediri.",

  programHeroImage: "https://lh3.googleusercontent.com/d/1DuKGEOwJsC92t8--IC_XvB7E-cWMziQi",
  programBadge: "Agenda & Kegiatan KKG",
  programTitle: "Program Kerja KKG PJOK SD Kecamatan Pagu",
  programDescription: "Rangkaian bimtek kurikulum merdeka, seleksi atletik usia dini, dan agenda kebugaran jasmani terintegrasi Google Drive.",

  perangkatHeroImage: "https://lh3.googleusercontent.com/d/1DuKGEOwJsC92t8--IC_XvB7E-cWMziQi",
  perangkatBadge: "Bank Kurikulum & Modul Ajar",
  perangkatTitle: "Perangkat Ajar PJOK SD Kurikulum Merdeka",
  perangkatDescription: "Bank perangkat ajar gratis dan resmi yang disusun oleh guru-guru PJOK se-Kecamatan Pagu. Siap diadaptasi untuk Fase A, B, dan C."
};

export const initialPartners: ClientPartner[] = [];

export const initialTeachers: TeacherProfile[] = [
  {
    id: "t-1",
    name: "KASENO",
    role: "Pendamping",
    school: "Kepala SDN TENGGER 1",
    nip: "19680415 199303 1 005",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300",
    bio: "Kepala Sekolah Pendamping dan Pembina teknis pengembangan kurikulum keolahragaan sekolah dasar di lingkungan Gugus Pagu.",
    specialization: "Manajemen Sekolah & Kepramukaan"
  },
  {
    id: "t-2",
    name: "Candra",
    role: "Pendamping",
    school: "Kepala SDN PAGU 3",
    nip: "19720918 199702 2 001",
    gender: "Perempuan",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    bio: "Kepala Sekolah Pendamping penguatan kebugaran jasmani terpadu dan pembinaan atlet usia dini sekolah dasar.",
    specialization: "Pendidikan Jasmani Adaptif & Supervisi"
  },
  {
    id: "t-3",
    name: "Eko Santoso",
    role: "Ketua",
    school: "SDN Tengger 2",
    nip: "19840212 200902 1 003",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    bio: "Ketua KKG PJOK SD Kecamatan Pagu. Mengkoordinasikan sinkronisasi kurikulum, perangkat ajar, dan program kerja se-Kecamatan.",
    specialization: "Kurikulum Merdeka & Kids Athletics"
  },
  {
    id: "t-4",
    name: "Ivan Bakti",
    role: "Wakil Ketua",
    school: "SDN Jagung",
    nip: "19870605 201101 1 008",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    bio: "Wakil Ketua KKG PJOK SD Kecamatan Pagu. Bertanggung jawab atas operasional dan kemitraan antar gugus.",
    specialization: "Bola Voli Mini & Futsal SD"
  },
  {
    id: "t-5",
    name: "Tri Sujatmiko",
    role: "Sekretaris 1",
    school: "SDN Wonosari 2",
    nip: "19910324 201903 2 012",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    bio: "Sekretaris 1 KKG PJOK SD Kecamatan Pagu. Mengelola administrasi persuratan, agenda rapat, dan arsip digital KKG.",
    specialization: "Administrasi Pembelajaran & Senam SKJ"
  },
  {
    id: "t-6",
    name: "M. Fahrur Rozi",
    role: "Sekretaris 2",
    school: "SDN Pagu 2",
    nip: "-",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    bio: "Sekretaris 2 KKG PJOK SD Kecamatan Pagu. Membantu dokumentasi, publikasi, dan kehumasan kegiatan KKG.",
    specialization: "Media Digital & Bulu Tangkis"
  },
  {
    id: "t-7",
    name: "Aris Setiyawan",
    role: "Bendahara 1",
    school: "SD EMAUS",
    nip: "-",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    bio: "Bendahara 1 KKG PJOK SD Kecamatan Pagu. Mengelola anggaran kas organisasi, transparansi iuran, dan pembiayaan program.",
    specialization: "Manajemen Keuangan & Renang Dasar"
  },
  {
    id: "t-8",
    name: "Ratna Wulandari",
    role: "Bendahara 2",
    school: "SDN Pagu 1",
    nip: "19890814 201502 2 004",
    gender: "Perempuan",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    bio: "Bendahara 2 KKG PJOK SD Kecamatan Pagu. Mengelola pembukuan dan administrasi iuran kegiatan gugus.",
    specialization: "Senam Artistik & Pembukuan"
  },
  {
    id: "t-9",
    name: "Agus Prasetyo",
    role: "Anggota",
    school: "SDN Sitimerto",
    nip: "19860517 201403 1 002",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Sitimerto. Aktif dalam pembinaan atletik dan program kebugaran siswa.",
    specialization: "Atletik & Sepak Bola"
  },
  {
    id: "t-10",
    name: "Bambang Hermanto",
    role: "Anggota",
    school: "SDN Tanjung",
    nip: "19851120 201001 1 015",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Tanjung. Koordinator cabang senam kesegaran jasmani.",
    specialization: "Senam SKJ & Tenis Meja"
  },
  {
    id: "t-11",
    name: "Rizki Anugerah",
    role: "Anggota",
    school: "SDN Menang",
    nip: "19940411 202221 1 006",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Menang. Pembina tim bola voli dan perlombaan Kids Athletics.",
    specialization: "Bola Voli & Kids Athletics"
  },
  {
    id: "t-12",
    name: "Siti Aminah",
    role: "Anggota",
    school: "SDN Semen Pagu",
    nip: "19900912 201903 2 011",
    gender: "Perempuan",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Semen Pagu. Mengembangkan gerak berirama dan kebugaran anak usia dini.",
    specialization: "Gerak Berirama & Kebugaran"
  },
  {
    id: "t-13",
    name: "Dedi Kurniawan",
    role: "Anggota",
    school: "SDN Kambingan",
    nip: "19881203 201701 1 007",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Kambingan. Instruktur permainan tradisional dan olahraga rekreasi.",
    specialization: "Olahraga Tradisional & Futsal"
  },
  {
    id: "t-14",
    name: "Wahyu Hidayat",
    role: "Anggota",
    school: "SDN Bulupasar",
    nip: "19920708 202012 1 009",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Bulupasar. Pembina renang dan ketangkasan fisik sekolah dasar.",
    specialization: "Renang & Atletik"
  },
  {
    id: "t-15",
    name: "Nurul Hidayati",
    role: "Anggota",
    school: "SDN Kampung Baru",
    nip: "19930115 202102 2 008",
    gender: "Perempuan",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Kampung Baru. Pengembang asesmen formatif Kurikulum Merdeka Fase A-B.",
    specialization: "Kurikulum Merdeka & Senam"
  },
  {
    id: "t-16",
    name: "Hendra Wijaya",
    role: "Anggota",
    school: "SDN Wates Pagu",
    nip: "-",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Wates Pagu. Pelatih cabang olahraga bulu tangkis dan catur SD.",
    specialization: "Bulu Tangkis & Catur"
  },
  {
    id: "t-17",
    name: "Ahmad Fauzi",
    role: "Anggota",
    school: "SDN Bendosari",
    nip: "19950319 202321 1 005",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Bendosari. Fasilitator media pembelajaran digital dan olahraga atletik.",
    specialization: "Media Digital & Atletik"
  },
  {
    id: "t-18",
    name: "Dian Permata",
    role: "Anggota",
    school: "MIS Pagu",
    nip: "-",
    gender: "Perempuan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK MIS Pagu. Penggiat olahraga kesehatan anak dan senam kebugaran madrasah.",
    specialization: "Kesehatan Anak & Senam"
  },
  {
    id: "t-19",
    name: "Joko Susilo",
    role: "Anggota",
    school: "SDN Bendo 1",
    nip: "19890422 201903 1 009",
    gender: "Laki-laki",
    avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=300",
    bio: "Guru PJOK SDN Bendo 1. Pembina pencak silat seni tunggal dan bola tangan mini.",
    specialization: "Pencak Silat & Bola Tangan"
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: "srv-1",
    slug: "workshop-kurikulum-merdeka-pjok",
    title: "Workshop & Bimtek Modul Ajar PJOK",
    category: "Kurikulum & Modul",
    summary: "Fasilitasi penyusunan modul ajar berdiferensiasi, Capaian Pembelajaran (CP), dan Alur Tujuan Pembelajaran (ATP) PJOK SD.",
    description: "Program berkala pendampingan guru PJOK di wilayah Kecamatan Pagu untuk menyusun perangkat ajar yang selaras dengan Kurikulum Merdeka. Membantu guru merancang asesmen diagnostik kebugaran, pembelajaran berdiferensiasi gerak, dan integrasi Profil Pelajar Pancasila dalam jam pelajaran olahraga.",
    benefits: [
      "Akses penuh bank modul ajar resmi kelas 1 sampai 6 SD format Microsoft Word & PDF",
      "Bimbingan langsung teknik merancang rubrik asesmen unjuk kerja psikomotorik",
      "Sertifikat kegiatan 32 JP yang diakui Dinas Pendidikan Kabupaten Kediri",
      "Template Alur Tujuan Pembelajaran (ATP) dan Program Semester siap pakai"
    ],
    gallery: [
      "./assets/images/kkg_teachers_meeting_1793250246883.jpg",
      "./assets/images/hero_sport_education_1793250246629.jpg"
    ],
    faqs: [
      {
        question: "Apakah guru non-PNS/PPPK bisa mengikuti workshop ini?",
        answer: "Ya, seluruh guru PJOK yang mengajar di Sekolah Dasar negeri maupun swasta se-Kecamatan Pagu wajib dan berhak mengikuti tanpa dipungut biaya registrasi tambahan."
      },
      {
        question: "Bagaimana cara mengunduh materi pasca workshop?",
        answer: "Peserta dapat langsung mengunduh materi melalui tab Perangkat Pembelajaran di portal ini atau folder Google Drive resmi KKG."
      }
    ],
    contactPerson: "Eko Santoso (Ketua KKG)",
    iconName: "BookOpen"
  },
  {
    id: "srv-2",
    slug: "pembinaan-dan-seleksi-o2sn-sd",
    title: "Pembinaan & Seleksi Kontingen O2SN SD",
    category: "Pelatihan Atletik & O2SN",
    summary: "Penyelenggaraan seleksi atletik, renang, bulu tangkis, dan pencak silat tingkat kecamatan menuju ajang O2SN Kabupaten Kediri.",
    description: "Kegiatan rutin tahunan untuk menjaring bibit atlet usia dini dari 19 Sekolah Dasar di Kecamatan Pagu. Dilengkapi dengan perangkat seleksi baku, timer elektronik standar, juri bersertifikat cabang olahraga, dan pembinaan berkala bagi kontingen terpilih.",
    benefits: [
      "Standar penjurian resmi mengacu pada juknis Pusat Prestasi Nasional (Puspresnas)",
      "Pencatatan rekor waktu dan jarak digital transparan bagi seluruh peserta sekolah",
      "Pendampingan psikologis dan gizi olahraga pra-kejuaraan tingkat kabupaten",
      "Piagam penghargaan resmi bertandatangan Koordinator Wilayah Pendidikan Pagu"
    ],
    gallery: [
      "./assets/images/elementary_sports_day_1793250248307.jpg",
      "./assets/images/gymnastics_field_pagu_1793250247785.jpg"
    ],
    faqs: [
      {
        question: "Apa saja cabang olahraga yang dipertandingkan dalam seleksi tingkat kecamatan?",
        answer: "Cabang wajib meliputi Kids Athletics (Formula 1 & Kanga's Escape), Renang Gaya Dada & Bebas 50m, Bulu Tangkis Tunggal Putra/Putri, dan Pencak Silat Seni Jurus Tunggal."
      },
      {
        question: "Berapa kuota peserta yang boleh dikirimkan oleh setiap SD?",
        answer: "Setiap sekolah diperbolehkan mengirimkan maksimal 2 perwakilan (1 putra dan 1 putri) pada masing-masing nomor cabang."
      }
    ],
    contactPerson: "Ivan Bakti (Wakil Ketua KKG)",
    iconName: "Trophy"
  },
  {
    id: "srv-3",
    slug: "klinik-asesmen-kebugaran-tkji-sd",
    title: "Klinik Asesmen Kebugaran Jasmani (TKJI)",
    category: "Konsultasi UKS & Kebugaran",
    summary: "Pelaksanaan dan konsultasi tes kebugaran jasmani Indonesia usia 6-12 tahun bekerjasama dengan Puskesmas Pagu.",
    description: "Membantu sekolah dasar di Kecamatan Pagu dalam mengukur indeks kebugaran jasmani peserta didik secara terstandar. Meliputi tes lari cepat, gantung siku tekuk, baring duduk 30 detik, loncat tegak, dan lari jarak sedang sesuai pedoman Kemenkes dan Kemendikbud.",
    benefits: [
      "Aplikasi kalkulator otomatis norma TKJI anak usia 6-9 tahun dan 10-12 tahun",
      "Rekomendasi intervensi aktivitas fisik bagi peserta didik kategori kurang bugar",
      "Sinergi pelaporan data kesehatan anak ke Usaha Kesehatan Sekolah (UKS) dan Puskesmas",
      "Laporan profil kebugaran per kelas untuk kebutuhan rapor pendidikan"
    ],
    gallery: [
      "./assets/images/gymnastics_field_pagu_1793250247785.jpg",
      "./assets/images/hero_sport_education_1793250246629.jpg"
    ],
    faqs: [
      {
        question: "Kapan periode pelaksanaan tes kebugaran jasmani diselenggarakan?",
        answer: "Dilaksanakan 2 kali setahun pada awal semester ganjil (bulan Agustus) dan awal semester genap (bulan Februari)."
      }
    ],
    contactPerson: "Tri Sujatmiko (Sekretaris KKG)",
    iconName: "HeartPulse"
  },
  {
    id: "srv-4",
    slug: "pendampingan-senam-dan-olahraga-tradisional",
    title: "Senam Bersama & Revitalisasi Olahraga Tradisional",
    category: "Pengembangan Profesi",
    summary: "Pelatihan Senam Kebugaran Jasmani (SKJ) Pelajar dan pelestarian gobak sodor, egrang, serta bentengan di sekolah.",
    description: "Gerakan pembiasaan hidup aktif dan sehat melalui senam pagi terstruktur serta pelestarian dolanan tradisional Jawa Timur yang sarat nilai gotong royong, ketangkasan, dan kebersamaan antar siswa.",
    benefits: [
      "Video panduan musik dan gerak SKJ Pelajar format Full HD bebas unduh",
      "Pedoman lapangan turnamen permainan tradisional antar kelas (Classmeeting)",
      "Peningkatan skor partisipasi fisik siswa perempuan dan laki-laki secara inklusif",
      "Penguatan dimensi kebhinekaan global dan gotong royong Profil Pelajar Pancasila"
    ],
    gallery: [
      "./assets/images/gymnastics_field_pagu_1793250247785.jpg",
      "./assets/images/elementary_sports_day_1793250248307.jpg"
    ],
    faqs: [
      {
        question: "Apakah peralatan olahraga tradisional disubsidi oleh KKG?",
        answer: "KKG menyediakan panduan pembuatan alat mandiri (misal egrang bambu dan bakiak kayu) serta meminjamkan sarana untuk event classmeeting gabungan."
      }
    ],
    contactPerson: "Aris Setiyawan (Bendahara KKG)",
    iconName: "Activity"
  }
];

export const initialPrograms: ProgramKKG[] = [
  {
    id: "prg-1",
    slug: "praktik-baik-dalam-pembelajaran-pjok",
    title: "PRAKTIK BAIK DALAM PEMBELAJARAN PJOK",
    category: "Praktik Baik",
    date: "14 November 2026",
    time: "08.00 - 13.00 WIB",
    location: "Aula Pertemuan SDN Pagu 1",
    driveLink: "https://drive.google.com/drive/folders/1hEZqNXe-OzoitFFhXzutpuGGyCorz_UL?usp=sharing",
    description: "Kegiatan Praktik Baik yag dilakukan setiap Minggu pertama setiap bulan (Kondisional), secara bergantian, dilakukan disekolah masing - masing dan dimulai pukul 10.00 WIB - Selesai.",
    status: "Akan Datang",
    targetParticipants: "Seluruh Guru PJOK SD Negeri & Swasta se-Kecamatan Pagu",
    materials: [
      { title: "Buku Pedoman CP & ATP PJOK Fase A-B-C.pdf", size: "4.2 MB", link: "https://drive.google.com" },
      { title: "Template Modul Ajar Berdiferensiasi.docx", size: "1.8 MB", link: "https://drive.google.com" },
      { title: "Rubrik Penilaian Unjuk Kerja Siswa SD.xlsx", size: "950 KB", link: "https://drive.google.com" }
    ],
    image: "./assets/images/kkg_teachers_meeting_1793250246883.jpg"
  },
  {
    id: "prg-2",
    slug: "seleksi-atletik-o2sn-sd-pagu-2026",
    title: "Seleksi Terbuka Kids Athletics & Cabang Olahraga O2SN SD 2026",
    category: "Kompetisi O2SN",
    date: "28 November 2026",
    time: "07.00 - 14.30 WIB",
    location: "Lapangan Sepak Bola Desa Menang, Kec. Pagu",
    driveLink: "https://drive.google.com/drive/folders/1ixRI2tvCigxfHSUZZ13LB_-1DTZb1qE7?usp=sharing",
    description: "Penyelenggaraan seleksi atletik tingkat sekolah dasar se-Kecamatan Pagu. Mempertandingkan nomor Kanga's Escape, Frog Jump, Turbo Throwing, dan Formula 1 lari halang rintang.",
    status: "Akan Datang",
    targetParticipants: "Kontingen Atlet Siswa Kelas 4 & 5 dari 19 SD",
    materials: [
      { title: "Juknis Resmi O2SN Tingkat Kecamatan Pagu.pdf", size: "2.6 MB", link: "https://drive.google.com" },
      { title: "Formulir Biodata Atlet & Surat Izin Wali.docx", size: "640 KB", link: "https://drive.google.com" },
      { title: "Daftar Jadwal Tanding & Drawing Peserta.pdf", size: "1.1 MB", link: "https://drive.google.com" }
    ],
    image: "./assets/images/elementary_sports_day_1793250248307.jpg"
  },
  {
    id: "prg-4",
    slug: "rapat-evaluasi-kinerja-kkg-pjok-tahunan",
    title: "Rapat Koordinasi & Evaluasi Program Kerja KKG PJOK Pagu",
    category: "Rapat Rutin",
    date: "Rabu, Minggu pertama dalam setiap bulan",
    time: "10.00 - Selesai",
    location: "SD Masing - masing",
    driveLink: "https://drive.google.com/drive/folders/1DV1pTbtF3WO3wnk7CKWoZemHkKyBNvlG?usp=sharing",
    description: "Rapat koordinasi dan kegiatan kelompok guru yang dilakukan setiap hari rabu.",
    status: "Akan Datang",
    targetParticipants: "Pengurus Harian & Anggota KKG PJOK Kec. Pagu",
    materials: [
      { title: "Laporan Pertanggungjawaban Kegiatan Semester Ganjil.pdf", size: "3.1 MB", link: "https://drive.google.com" },
      { title: "Draft Rencana Kerja Tahunan 2027.xlsx", size: "820 KB", link: "https://drive.google.com" }
    ],
    image: "./assets/images/kkg_teachers_meeting_1793250246883.jpg"
  }
];

export const initialMaterials: LearningMaterial[] = [
  {
    id: "mat-1",
    grade: "Kelas 1",
    category: "Modul Ajar",
    title: "PERANGKAT PEMBELAJARAN KELAS 1",
    summary: "Panduan pembelajaran berjalan, berlari, melompat, dan meloncat dengan permainan menyenangkan berbasis karakter Profil Pelajar Pancasila.",
    author: "Rini Astutik, S.Pd.",
    schoolOrigin: "SDN Menang Pagu",
    date: "12 Oktober 2026",
    fileSize: "2.8 MB",
    downloadUrl: "https://drive.google.com/drive/folders/14uYvN7lKzIRqIvP4BkiXhAPyIe7sNp5a?usp=sharing",
    thumbnail: "./assets/images/hero_sport_education_1793250246629.jpg",
    downloadsCount: 184
  },
  {
    id: "mat-2",
    grade: "Kelas 2",
    category: "Modul Ajar",
    title: "PERANGKAT PEMBELAJARAN KELAS 2",
    summary: "Aktivitas lempar tangkap bola kecil dan bola besar berpasangan serta dalam lingkaran untuk mengasah koordinasi mata dan tangan anak.",
    author: "Dimas Prasetyo, S.Pd.",
    schoolOrigin: "SDN Semen Pagu",
    date: "16 Oktober 2026",
    fileSize: "3.1 MB",
    downloadUrl: "https://drive.google.com/drive/folders/1HbHCeDj8yUDnFdTfG6RMWZ4ftnUnP1nY?usp=drive_link",
    thumbnail: "./assets/images/elementary_sports_day_1793250248307.jpg",
    downloadsCount: 162
  },
  {
    id: "mat-3",
    grade: "Kelas 3",
    category: "ATP & CP",
    title: "PERANGKAT PEMBELAJARAN KELAS 3",
    summary: "Pemetaan Capaian Pembelajaran (CP) elemen keterampilan gerak, pengetahuan gerak, pemanfaatan gerak, dan pengembangan karakter.",
    author: "Bambang Sudarsono, S.Pd.Jas.",
    schoolOrigin: "SDN Pagu 1",
    date: "20 Oktober 2026",
    fileSize: "1.9 MB",
    downloadUrl: "https://drive.google.com/drive/folders/1P8moWhBddKXYbQHJ9GFxR5r9XIZk_p5M?usp=drive_link",
    thumbnail: "./assets/images/kkg_teachers_meeting_1793250246883.jpg",
    downloadsCount: 215
  },
  {
    id: "mat-4",
    grade: "Kelas 4",
    category: "Modul Ajar",
    title: "PERANGKAT PEMBELAJARAN KELAS 4",
    summary: "Teknik dasar passing bawah bola voli mini dengan pendekatan game-based learning, pembentukan sikap saling percaya dan kekompakan tim.",
    author: "Ahmad Zainuri, S.Pd.Or.",
    schoolOrigin: "SDN Sitimerto",
    date: "22 Oktober 2026",
    fileSize: "4.5 MB",
    downloadUrl: "https://drive.google.com/drive/folders/1gHwTMKeuLVATatm_ZuVPwV9SAw-stDoe?usp=drive_link",
    thumbnail: "./assets/images/hero_sport_education_1793250246629.jpg",
    downloadsCount: 198
  },
  {
    id: "mat-5",
    grade: "Kelas 5",
    category: "Instrumen Tes Kebugaran",
    title: "PERANGKAT PEMBELAJARAN KELAS 5",
    summary: "Blanko penilaian otomatis norma kebugaran jasmani anak usia 10-12 tahun. Mengkonversi otomatis nilai lari 40m, pull-up, sit-up, vertical jump, dan lari 600m.",
    author: "Nurul Hidayati, S.Pd.SD.",
    schoolOrigin: "SDN Tanjung",
    date: "25 Oktober 2026",
    fileSize: "1.2 MB",
    downloadUrl: "https://drive.google.com/drive/folders/1VYvDiXYHGNqjye8oL9-a5KjPr5SkVEwp?usp=drive_link",
    thumbnail: "./assets/images/gymnastics_field_pagu_1793250247785.jpg",
    downloadsCount: 247
  },
  {
    id: "mat-6",
    grade: "Kelas 6",
    category: "Modul P5 PJOK",
    title: "PERANGKAT PEMBELAJARAN KELAS 6",
    summary: "Projek penguatan Profil Pelajar Pancasila tematik kesehatan diri, pencegahan anemia, pemilihan jajanan sehat sekolah, dan kebiasaan cuci tangan.",
    author: "Eko Cahyono, S.Pd.",
    schoolOrigin: "SDN Jagung",
    date: "27 Oktober 2026",
    fileSize: "3.7 MB",
    downloadUrl: "https://drive.google.com/drive/folders/14pbErI2diJ-lKFIjfogDfhZXKYDap6Fm?usp=drive_link",
    thumbnail: "./assets/images/kkg_teachers_meeting_1793250246883.jpg",
    downloadsCount: 173
  }
];

export const initialArticles: ArticleInfo[] = [
  {
    id: "art-1",
    slug: "sukses-seleksi-kids-athletics-o2sn-pagu",
    title: "Sukses Digelar, Seleksi Kids Athletics O2SN SD Pagu Jaring 12 Atlet Berbakat Menuju Kabupaten",
    category: "Praktik Baik",
    summary: "Sebanyak 19 Sekolah Dasar se-Kecamatan Pagu mengirimkan perwakilan atlet terbaik dalam ajang seleksi O2SN cabang Kids Athletics di Lapangan Desa Menang.",
    content: "Kecamatan Pagu menunjukkan komitmennya dalam mencetak atlet usia dini berprestasi melalui gelaran seleksi Kids Athletics O2SN tingkat SD tahun 2026. Kegiatan yang diselenggarakan oleh KKG PJOK SD Kecamatan Pagu di Lapangan Desa Menang ini diikuti oleh ratusan siswa dari 19 SD se-Kecamatan Pagu.\n\nNomor perlombaan yang dipertandingkan meliputi Kanga's Escape, Frog Jump, Turbo Throwing, dan Formula 1 lari halang rintang. Hasil seleksi ini menetapkan 12 siswa terbaik yang akan mewakili kontingen Pagu dalam ajang O2SN Kabupaten Kediri mendatang.",
    author: "Tim Humas KKG PJOK Pagu",
    date: "28 Oktober 2026",
    readTime: "4 menit",
    thumbnail: "./assets/images/elementary_sports_day_1793250248307.jpg",
    tags: ["O2SN SD", "Kids Athletics", "Prestasi Pagu", "Atlet Cilik"]
  },
  {
    id: "art-2",
    slug: "panduan-modul-ajar-berdiferensiasi-pjok-kurikulum-merdeka",
    title: "Implementasi Modul Ajar PJOK Berdiferensiasi Fase A-C di Seluruh Gugus Sekolah Pagu",
    category: "Sosialisasi Kurikulum",
    summary: "KKG PJOK Kecamatan Pagu membedah strategi penyusunan modul ajar berbasis kemampuan gerak aktual siswa SD sesuai Kurikulum Merdeka.",
    content: "Kurikulum Merdeka menuntut guru untuk memperhatikan keragaman kemampuan fisik dan motorik peserta didik. Melalui workshop berkala yang dihelat di SDN Pagu 1, dewan guru PJOK sepakat menyusun bank perangkat ajar berdiferensiasi yang memadukan asesmen awal gerak lokomotor, non-lokomotor, dan manipulatif.",
    author: "Eko Santoso (Ketua KKG)",
    date: "24 Oktober 2026",
    readTime: "5 menit",
    thumbnail: "./assets/images/kkg_teachers_meeting_1793250246883.jpg",
    tags: ["Kurikulum Merdeka", "Modul Ajar", "Diferensiasi Gerak", "Perangkat PJOK"]
  },
  {
    id: "art-3",
    slug: "kolaborasi-puskesmas-uji-kebugaran-jasmani-siswa",
    title: "Sinergi KKG PJOK dan Puskesmas Pagu dalam Pengukuran Tes Kebugaran Jasmani Indonesia (TKJI)",
    category: "Kesehatan & Gizi",
    summary: "Pemantauan status gizi anak dan kebugaran motorik dasar dilakukan serentak pada siswa kelas 4, 5, dan 6 guna mewujudkan profil pelajar sehat dan tangguh.",
    content: "Kebugaran jasmani merupakan pondasi penting kecerdasan kognitif anak. Berkolaborasi dengan Puskesmas Pagu, seluruh guru PJOK menginisiasi skrining kebugaran menggunakan instrumen TKJI. Data kebugaran ini diintegrasikan ke dalam rapor pendidikan sekolah dan evaluasi UKS.",
    author: "Divisi UKS KKG PJOK",
    date: "18 Oktober 2026",
    readTime: "3 menit",
    thumbnail: "./assets/images/gymnastics_field_pagu_1793250247785.jpg",
    tags: ["TKJI", "UKS", "Kesehatan Anak", "Puskesmas Pagu"]
  }
];

export const initialActivities: ActivityPhoto[] = [];

export const initialAgenda: AgendaItem[] = [
  {
    id: "ag-1",
    title: "Bimtek Pembuatan Modul Ajar Interaktif PJOK SD",
    category: "Bimtek Guru",
    date: "14 November 2026",
    time: "08.00 - 13.00 WIB",
    venue: "Aula SDN Pagu 1",
    hostSchool: "SDN Pagu 1",
    speaker: "Tim Pengembang Kurikulum PJOK Kab. Kediri",
    dressCode: "Seragam Olahraga Resmi KKG",
    status: "Akan Datang",
    description: "Fasilitasi penyusunan modul ajar digital, rubrik asesmen unjuk kerja psikomotorik, dan instrumen refleksi murid.",
    registrationOpen: true
  },
  {
    id: "ag-2",
    title: "Seleksi Terbuka Kontingen O2SN SD Pagu 2026",
    category: "Kompetisi Olahraga",
    date: "28 November 2026",
    time: "07.00 - 14.30 WIB",
    venue: "Lapangan Sepak Bola Desa Menang",
    hostSchool: "SDN Menang",
    speaker: "Koordinator Wasit & Panitia O2SN",
    dressCode: "Jersey Olahraga Sekolah Masing-Masing",
    status: "Akan Datang",
    description: "Penyelenggaraan seleksi cabor Kids Athletics, Renang, Bulutangkis, dan Senam Lantai menuju tingkat Kabupaten Kediri.",
    registrationOpen: true
  },
  {
    id: "ag-5",
    title: "Workshop Asesmen Kebugaran Jasmani Indonesia (TKJI SD)",
    category: "Pelatihan UKS",
    date: "19 September 2026",
    time: "08.00 - 13.00 WIB",
    venue: "Aula Pertemuan SDN Pagu 1",
    hostSchool: "SDN Pagu 1",
    speaker: "Tim Medis Puskesmas Pagu",
    dressCode: "Kaos Training Olahraga",
    status: "Sudah Terlaksana",
    description: "Pelatihan pengukuran indeks kebugaran siswa SD berbasis instrumen standar TKJI untuk integrasi rapor pendidikan.",
    registrationOpen: false
  },
  {
    id: "ag-6",
    title: "Sosialisasi & Latihan Senam SKJ Pelajar Kebugaran Bersama",
    category: "Senam Bersama",
    date: "15 Agustus 2026",
    time: "07.30 - 12.00 WIB",
    venue: "Lapangan Olahraga Desa Menang",
    hostSchool: "SDN Menang",
    speaker: "Tim Instruktur KKG PJOK",
    dressCode: "Kaos Olahraga Gugus",
    status: "Sudah Terlaksana",
    description: "Sosialisasi gerakan senam kebugaran pelajar terbaru bagi perwakilan guru dan pembina olahraga SD se-Kecamatan Pagu.",
    registrationOpen: false
  },
  {
    id: "ag-7",
    title: "Rapat Kerja Awal Tahun & Penyusunan Program KKG PJOK",
    category: "Rapat Rutin",
    date: "25 Juli 2026",
    time: "08.00 - 12.00 WIB",
    venue: "SDN Tengger 1",
    hostSchool: "SDN Tengger 1",
    speaker: "Ketua & Pengurus KKG PJOK Pagu",
    dressCode: "Baju Dinas Resmi",
    status: "Sudah Terlaksana",
    description: "Penyusunan kalender program kerja semester ganjil dan genap tahun ajaran baru bersama pengawas pembina.",
    registrationOpen: false
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Drs. H. Mulyadi, M.Pd.",
    role: "Pengawas SD Korwilcam Pagu",
    school: "Dinas Pendidikan Kab. Kediri",
    quote: "KKG PJOK Kecamatan Pagu adalah salah satu kelompok kerja guru paling progresif di Kabupaten Kediri. Inovasi bank modul ajar digital ini sangat memudahkan supervisi dan menjamin mutu pembelajaran fisik anak.",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200",
    rating: 5
  },
  {
    id: "test-2",
    name: "Sri Wahyuni, S.Pd., M.M.",
    role: "Kepala Sekolah",
    school: "SDN Pagu 1",
    quote: "Kolaborasi yang terjalin antar guru penjas di Pagu sangat solid. Anak-anak kami semakin antusias mengikuti jam olahraga karena materi yang disajikan selalu bervariasi dan penuh keceriaan.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    rating: 5
  },
  {
    id: "test-3",
    name: "Budi Santoso, S.Pd.",
    role: "Guru PJOK Anggota",
    school: "SDN Bendo Pagu",
    quote: "Sebagai guru muda, saya sangat terbantu dengan bimbingan senior di KKG Pagu. Modul dan ATP yang disediakan di portal ini sangat aplikatif untuk sekolah dengan lapangan terbatas sekalipun.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5
  }
];

export const initialSettings: SiteSettings = {
  siteName: "KKG PJOK SD KECAMATAN PAGU",
  subTitle: "Kelompok Kerja Guru Pendidikan Jasmani Olahraga dan Kesehatan",
  tagline: "Sport Education, Kesehatan, Karakter, dan Prestasi Anak Sekolah Dasar",
  phone: "081330080340",
  whatsapp: "6281330080340",
  email: "pjokkecpagu@gmail.com",
  address: "Sekretariat KKG PJOK: SDN Pagu 1, Jl. Menang No. 12, Kec. Pagu, Kab. Kediri, Jawa Timur",
  workingHours: "Senin - Sabtu: 07.30 - 15.00 WIB",
  primaryColor: "#1D4ED8",
  accentColor: "#DC2626",
  facebookUrl: "https://facebook.com/kkgpjokpagu",
  instagramUrl: "https://instagram.com/kkgpjokpagu",
  youtubeUrl: "https://youtube.com/@kkgpjokpagu",
  telegramUrl: "https://t.me/kkgpjokpagu",
  metaTitle: "KKG PJOK SD KECAMATAN PAGU – Portal Resmi & Papan Informasi Guru Olahraga",
  metaDescription: "Portal Resmi Papan Informasi KKG PJOK SD Kecamatan Pagu, Kabupaten Kediri. Pusat download perangkat pembelajaran, modul ajar kurikulum merdeka, jadwal agenda, dan berita prestasi olahraga.",
  metaKeywords: "KKG PJOK, Guru PJOK Pagu, PJOK SD Kecamatan Pagu, Kabupaten Kediri, Modul Ajar PJOK, O2SN Pagu, Perangkat Pembelajaran PJOK"
};
