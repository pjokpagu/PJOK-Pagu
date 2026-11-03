import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { GoogleSheetSchedule } from '../components/GoogleSheetSchedule';
import { 
  Search, 
  FolderDown, 
  ArrowLeft, 
  ChevronRight
} from 'lucide-react';

export const ProgramsPage: React.FC = () => {
  const { programs, selectedItemId, setSelectedItemId } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedProgram = programs.find(p => p.id === selectedItemId);

  const categories = [
    'Semua',
    'Praktik Baik',
    'Kompetisi O2SN',
    'Rapat Rutin'
  ];

  const filteredPrograms = programs
    .filter(prog => prog.id !== 'prg-3')
    .filter(prog => {
      const matchesCategory = activeCategory === 'Semua' || 
                              prog.category === activeCategory ||
                              (activeCategory === 'Praktik Baik' && (prog.category === 'Praktik Baik' || prog.category === 'Bimtek & Workshop'));
      const matchesSearch = prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prog.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prog.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  // DETAIL PROGRAM VIEW
  if (selectedProgram) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Breadcrumb 
          items={[
            { label: 'Program KKG', page: 'program-kkg' },
            { label: selectedProgram.title, active: true }
          ]} 
        />

        <div className="space-y-4">
          <button
            onClick={() => setSelectedItemId(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Program KKG</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {selectedProgram.category === 'Bimtek & Workshop' ? 'Praktik Baik' : selectedProgram.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {selectedProgram.title}
          </h1>
        </div>

        {/* 2 Kolom: Media di Kiri & Uraian di Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Foto / Gambar Kegiatan */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
            <img
              src={selectedProgram.image}
              alt={selectedProgram.title}
              className="w-full h-80 sm:h-96 lg:h-[400px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Kolom Kanan: Uraian & Sasaran Kegiatan / Notulen Rapat */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase">
                {selectedProgram.id === 'prg-4' ? 'NOTULEN RAPAT KKG PJOK' : 'Uraian & Sasaran Kegiatan'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mt-2">
                {selectedProgram.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <a
                href={selectedProgram.driveLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-md shadow-blue-600/20"
              >
                <FolderDown className="w-4 h-4" />
                <span>
                  {selectedProgram.id === 'prg-4' ? 'Buka NOTULEN RAPAT KKG PJOK' : 'Akses Folder Google Drive'}
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // LISTING VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Program KKG', active: true }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Agenda Kegiatan KKG
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Program Kerja KKG PJOK SD Kecamatan Pagu
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Rangkaian bimtek kurikulum merdeka, seleksi atletik usia dini, dan agenda kebugaran jasmani terintegrasi Google Drive.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 bg-slate-100/80 rounded-2xl border border-slate-200">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari program kerja KKG..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

      </div>

      {/* Real-time Google Spreadsheet Embed (Sheet 2: KKG PJOK) */}
      <GoogleSheetSchedule />

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrograms.map((prog) => {
          const isDirectDrive = prog.id === 'prg-1' || prog.id === 'prg-2' || prog.id === 'prg-4';
          const targetLink = prog.id === 'prg-1' 
            ? 'https://drive.google.com/drive/folders/1hEZqNXe-OzoitFFhXzutpuGGyCorz_UL?usp=sharing'
            : prog.id === 'prg-2'
            ? 'https://drive.google.com/drive/folders/1ixRI2tvCigxfHSUZZ13LB_-1DTZb1qE7?usp=sharing'
            : prog.id === 'prg-4'
            ? 'https://drive.google.com/drive/folders/13rj9CvRTNoH5zfgaGnPDWCdll7upKFmP?usp=sharing'
            : prog.driveLink;

          return (
            <div
              key={prog.id}
              className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {isDirectDrive ? (
                  <a
                    href={targetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-48 relative overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-700 text-white">
                      {prog.category === 'Bimtek & Workshop' ? 'Praktik Baik' : prog.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500 text-white shadow-xs">
                      {prog.status}
                    </div>
                  </a>
                ) : (
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-700 text-white">
                      {prog.category === 'Bimtek & Workshop' ? 'Praktik Baik' : prog.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500 text-white shadow-xs">
                      {prog.status}
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-3">
                  {isDirectDrive ? (
                    <a
                      href={targetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:text-blue-700"
                    >
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer line-clamp-2">
                        {prog.title}
                      </h2>
                    </a>
                  ) : (
                    <h2
                      onClick={() => setSelectedItemId(prog.id)}
                      className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-2"
                    >
                      {prog.title}
                    </h2>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <a
                  href={targetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-700 transition-colors"
                >
                  <FolderDown className="w-4 h-4 text-blue-600" />
                  <span>Materi Drive</span>
                </a>

                {isDirectDrive ? (
                  <a
                    href={targetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedItemId(prog.id)}
                    className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
