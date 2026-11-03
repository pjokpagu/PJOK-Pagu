import React from 'react';
import { useApp } from '../context/AppContext';
import { NavPage } from '../types';
import { Mail, Phone, Clock, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedItemId, settings } = useApp();

  const handleNav = (page: NavPage) => {
    setSelectedItemId(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Organization Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                <img
                  src="./assets/aistudio/1_00b40b6c.png"
                  alt="Logo Resmi KKG PJOK Pagu Kab. Kediri"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">KKG PJOK SD PAGU</h3>
                <p className="text-xs text-slate-400">Kecamatan Pagu · Kab. Kediri</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wadah resmi peningkatan kompetensi dan profesionalisme guru Pendidikan Jasmani, Olahraga, dan Kesehatan tingkat Sekolah Dasar se-Kecamatan Pagu, Kabupaten Kediri, Jawa Timur.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                19 Sekolah Dasar Binaan
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-rose-300 border border-slate-700">
                Kurikulum Merdeka
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('beranda')} className="hover:text-blue-400 transition-colors">
                  Beranda Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tentang-kami')} className="hover:text-blue-400 transition-colors">
                  Susunan Pengurus KKG
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('program-kkg')} className="hover:text-blue-400 transition-colors">
                  Program Kerja & Jadwal KKG
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('perangkat-pembelajaran')} className="hover:text-blue-400 transition-colors">
                  Bank Perangkat Ajar & Modul (Kelas 1-6)
                </button>
              </li>

              <li>
                <button onClick={() => handleNav('kegiatan')} className="hover:text-blue-400 transition-colors">
                  Dokumentasi Foto Kegiatan
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('agenda')} className="hover:text-blue-400 transition-colors">
                  Agenda & Kalender Pertemuan
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Secretariat */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Sekretariat & Kontak</h4>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{settings.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{settings.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.workingHours}</span>
            </div>
          </div>

          {/* Column 4: Links & Drive Repository */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Akses Cepat & Tautan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arsip berkas silabus, instrumen TKJI, dan materi presentasi tersinkronisasi langsung dengan repositori Google Drive KKG.
            </p>
            <div className="space-y-2">
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <span>Google Drive KKG PJOK</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
              </a>
              <button
                onClick={() => handleNav('admin')}
                className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-rose-950/60 border border-rose-800/60 text-xs font-medium text-rose-200 hover:bg-rose-900/80 transition-colors"
              >
                <span>Portal Pengurus / Admin</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
