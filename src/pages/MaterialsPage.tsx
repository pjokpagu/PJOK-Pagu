import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  Download, 
  FileText
} from 'lucide-react';
import { LearningMaterial } from '../types';

export const MaterialsPage: React.FC = () => {
  const { materials, hero, showToast } = useApp();
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua Kelas');

  const grades = ['Semua Kelas', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

  const filteredMaterials = materials.filter(item => {
    return selectedGrade === 'Semua Kelas' || item.grade === selectedGrade;
  });

  const handleDownload = (item: LearningMaterial) => {
    showToast(`Mengunduh berkas: ${item.title}...`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Perangkat Pembelajaran', active: true }]} />

      {/* Dynamic Hero Banner connected to Admin & Google Drive */}
      <div className="p-6 sm:p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-slate-800 bg-slate-950 group">
        {(hero.perangkatHeroImage || './assets/images/gymnastics_field_pagu_1793250247785.jpg') && (
          <div className="absolute inset-0 z-0">
            <img
              src={hero.perangkatHeroImage || './assets/images/gymnastics_field_pagu_1793250247785.jpg'}
              alt={hero.perangkatTitle || "Perangkat Pembelajaran"}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-40 mix-blend-luminosity filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-rose-950/70" />
          </div>
        )}
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-rose-200 backdrop-blur-md border border-white/15 shadow-xs">
            <FileText className="w-3.5 h-3.5 text-rose-300" />
            <span>{hero.perangkatBadge || 'Bank Kurikulum & Modul Ajar'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-sm">
            {hero.perangkatTitle || 'Perangkat Ajar PJOK SD Kurikulum Merdeka'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed drop-shadow-xs">
            {hero.perangkatDescription || 'Bank perangkat ajar gratis dan resmi yang disusun oleh guru-guru PJOK se-Kecamatan Pagu. Siap diadaptasi untuk Fase A, B, dan C.'}
          </p>
        </div>
      </div>

      {/* Filter by Grade (Kelas 1 - 6) */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              selectedGrade === grade
                ? 'bg-blue-700 text-white shadow-md shadow-blue-600/20 scale-105'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* Grid Perangkat Ajar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="h-44 relative overflow-hidden bg-slate-900">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-700 text-white shadow-xs">
                  {item.grade}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900 line-clamp-2 uppercase">
                  {item.title.startsWith('PERANGKAT PEMBELAJARAN') ? item.title : `PERANGKAT PEMBELAJARAN ${item.grade.toUpperCase()}`}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
              <a
                href={item.downloadUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleDownload(item)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Unduh ({item.fileSize})</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada perangkat ajar yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan pilihan tingkatan kelas di atas.</p>
        </div>
      )}

    </div>
  );
};
