import React, { useState } from 'react';
import { 
  FolderDown, 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  LayoutGrid, 
  List, 
  Images, 
  Sparkles,
  Info
} from 'lucide-react';

interface GoogleDriveCollageProps {
  folderId?: string;
  shareUrl?: string;
}

export const GoogleDriveCollage: React.FC<GoogleDriveCollageProps> = ({
  folderId = '1iyNy_3g4ZDVhA818HMFT2oTSuLNR8CyN',
  shareUrl = 'https://drive.google.com/drive/folders/1iyNy_3g4ZDVhA818HMFT2oTSuLNR8CyN?usp=sharing'
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#${viewMode}`;

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(Date.now());
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950/95 p-4 sm:p-6 overflow-hidden flex flex-col' : ''}`}>
      
      {/* Header & Controls Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Title & Live Sync Badge */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/20 shrink-0">
            <Images className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Kolase Foto & Galeri Dokumentasi Kegiatan
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Google Drive Live</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sinkronisasi foto dokumentasi langsung dari folder resmi Google Drive KKG PJOK Pagu
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* View Mode Toggle: Grid vs List */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => { setViewMode('grid'); handleRefresh(); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Kolase / Kisi Foto"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kolase</span>
            </button>
            <button
              onClick={() => { setViewMode('list'); handleRefresh(); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Daftar Berkas"
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors"
            title="Muat Ulang Galeri"
            aria-label="Muat Ulang Galeri"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors"
            title={isFullscreen ? "Keluar Layar Penuh" : "Tampilan Layar Penuh"}
            aria-label="Tampilan Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Direct Google Drive Open Button */}
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <FolderDown className="w-4 h-4" />
            <span>Buka di Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

        </div>

      </div>

      {/* Main Collage Viewer Container */}
      <div className={`relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/90 shadow-md ${isFullscreen ? 'flex-1 h-full' : 'h-[580px] sm:h-[680px]'}`}>
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3 pointer-events-none">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-300 animate-pulse">
              Memuat kolase galeri foto dari Google Drive...
            </p>
          </div>
        )}

        {/* Embedded Google Drive Folder View (Grid Collage) */}
        <iframe
          key={`${iframeKey}-${viewMode}`}
          src={embedUrl}
          title="Kolase Foto Dokumentasi Google Drive"
          className="w-full h-full border-0 bg-white"
          onLoad={() => setIsLoading(false)}
          allow="autoplay"
        />

        {/* Bottom Floating Info bar */}
        <div className="absolute bottom-3 left-3 right-3 py-2 px-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-300 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">
              Klik ganda (double-click) pada foto di atas untuk memperbesar dan melihat detail pratinjau.
            </span>
          </div>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0 hover:underline flex items-center gap-1"
          >
            <span>Buka Tab Baru</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>

      {/* Guidance Note */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-slate-700 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-blue-900">
            Penyimpanan Foto Terpusat di Cloud Google Drive
          </p>
          <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed">
            Semua foto kegiatan yang diunggah oleh pengurus atau guru ke dalam folder Google Drive akan langsung muncul di halaman ini secara real-time tanpa perlu mengunggah ulang ke website.
          </p>
        </div>
      </div>

    </div>
  );
};
