/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { AgendaPage } from './pages/AgendaPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

const MainContent: React.FC = () => {
  const { currentPage, settings } = useApp();

  // Dynamic document title update based on current page
  useEffect(() => {
    let title = settings.siteName;
    switch (currentPage) {
      case 'beranda':
        title = `${settings.siteName} – Portal Resmi & Papan Informasi Guru Olahraga`;
        break;
      case 'tentang-kami':
        title = `Tentang Kami & Susunan Pengurus – ${settings.siteName}`;
        break;
      case 'program-kkg':
        title = `Program Kerja & Jadwal KKG – ${settings.siteName}`;
        break;
      case 'perangkat-pembelajaran':
        title = `Bank Perangkat Ajar & Modul (Kelas 1-6) – ${settings.siteName}`;
        break;
      case 'kegiatan':
        title = `Dokumentasi Foto Kegiatan – ${settings.siteName}`;
        break;
      case 'agenda':
        title = `Agenda & Kalender Pertemuan – ${settings.siteName}`;
        break;
      case 'kontak':
        title = `Kontak & Sekretariat – ${settings.siteName}`;
        break;
      case 'admin':
        title = `Dashboard Admin – ${settings.siteName}`;
        break;
    }
    document.title = title;
  }, [currentPage, settings.siteName]);

  const renderPage = () => {
    switch (currentPage) {
      case 'beranda':
        return <HomePage />;
      case 'tentang-kami':
        return <AboutPage />;
      case 'program-kkg':
        return <ProgramsPage />;
      case 'perangkat-pembelajaran':
        return <MaterialsPage />;
      case 'kegiatan':
        return <ActivitiesPage />;
      case 'agenda':
        return <AgendaPage />;
      case 'kontak':
        return <ContactPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  const isAdmin = currentPage === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {!isAdmin && <Navbar />}
      
      <main className="flex-1">
        {renderPage()}
      </main>

      {!isAdmin && <Footer />}
      <AdminLoginModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
