import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { GoogleDriveCollage } from '../components/GoogleDriveCollage';
import { 
  Calendar, 
  MapPin, 
  X, 
  ZoomIn
} from 'lucide-react';
import { ActivityPhoto } from '../types';

export const ActivitiesPage: React.FC = () => {
  const { activities } = useApp();
  const [activePhoto, setActivePhoto] = useState<ActivityPhoto | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Kegiatan & Dokumentasi', active: true }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Galeri Visual KKG
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Dokumentasi Kegiatan PJOK SD Pagu
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Potret Seputar Kegiatan Kelompok Kerja Guru dalam berbagai kegiatan
        </p>
      </div>

      {/* Google Drive Photo Collage Embed */}
      <GoogleDriveCollage 
        folderId="1iyNy_3g4ZDVhA818HMFT2oTSuLNR8CyN"
        shareUrl="https://drive.google.com/drive/folders/1iyNy_3g4ZDVhA818HMFT2oTSuLNR8CyN?usp=sharing"
      />

      {/* Additional Activities Grid (if any added) */}
      {activities.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Dokumentasi Tambahan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {activities.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden group cursor-pointer"
              onClick={() => setActivePhoto(act)}
            >
              <div className="h-64 sm:h-72 relative overflow-hidden bg-slate-900">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold bg-rose-600 text-white shadow-xs">
                  {act.category}
                </div>

                <div className="absolute bottom-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:scale-110 transition-transform">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {act.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {act.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{act.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{act.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-700">
            <div className="relative">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full max-h-[65vh] object-contain bg-black"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-blue-400 font-semibold">
                <span>{activePhoto.category}</span>
                <span>·</span>
                <span>{activePhoto.date}</span>
                <span>·</span>
                <span>{activePhoto.location}</span>
              </div>

              <h3 className="text-xl font-bold text-white">
                {activePhoto.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activePhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
