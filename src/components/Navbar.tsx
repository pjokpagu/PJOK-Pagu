import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavPage } from '../types';
import { Menu, X, Shield, Phone, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, setSelectedItemId, settings, isAdminLoggedIn, setIsLoginModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavPage; label: string }> = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'tentang-kami', label: 'Pengurus' },
    { id: 'program-kkg', label: 'Program KKG' },
    { id: 'perangkat-pembelajaran', label: 'Perangkat Ajar' },
    { id: 'kegiatan', label: 'Kegiatan' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (page: NavPage) => {
    setSelectedItemId(null);
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      handleNavClick('admin');
    } else {
      setIsLoginModalOpen(true);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links) — Zone 3 (Action) */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('beranda')}
              className="flex items-center gap-3 text-left group focus:outline-hidden"
              aria-label="Kembali ke Beranda"
            >
              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
                <img
                  src="./assets/aistudio/1_00b40b6c.png"
                  alt="Logo Resmi KKG PJOK Pagu Kab. Kediri"
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap">
                  KKG PJOK PAGU
                </span>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:block whitespace-nowrap">
                  Kecamatan Pagu · Kab. Kediri
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean single line typography) */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-700">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 hover:text-blue-700 ${
                    isActive ? 'text-blue-700 font-semibold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action (Dashboard Admin & Contact Quick Link) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleAdminClick}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 shadow-xs cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              title="Akses Dashboard Admin"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={handleAdminClick}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Akses Dashboard Admin</span>
            </button>

            <a
              href={`https://wa.me/${settings.whatsapp}?text=Halo%20Pengurus%20KKG%20PJOK%20Pagu`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Sekretariat</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
