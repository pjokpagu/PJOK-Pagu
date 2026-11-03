import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Link as LinkIcon, 
  CheckCircle2, 
  Table, 
  Calendar
} from 'lucide-react';

interface GoogleSheetScheduleProps {
  initialUrl?: string;
  onUrlChange?: (newUrl: string) => void;
}

// Data jadwal standar KKG PJOK berdasarkan berkas CSV yang diunggah
const defaultScheduleRows = [
  { no: 1, bulan: 'JULI 2026', hariTanggal: 'Sabtu, 25 Juli 2026', waktu: '08.00 - 12.00', tempat: 'SDN Pagu 1', kegiatan: 'Rapat Kerja Awal Tahun & Penyusunan Program KKG PJOK', target: 'Guru PJOK SD se-Kecamatan', narasumber: 'Ketua & Pengurus KKG', status: 'Terlaksana', ket: 'Tahun Ajaran Baru' },
  { no: 2, bulan: 'AGUSTUS 2026', hariTanggal: 'Sabtu, 15 Agustus 2026', waktu: '07.30 - 12.00', tempat: 'Lapangan Desa Menang', kegiatan: 'Sosialisasi & Latihan Senam SKJ Pelajar Kebugaran Bersama', target: 'Perwakilan Guru PJOK', narasumber: 'Tim Instruktur KKG', status: 'Terlaksana', ket: 'HUT RI ke-81' },
  { no: 3, bulan: 'SEPTEMBER 2026', hariTanggal: 'Sabtu, 19 Sept 2026', waktu: '08.00 - 13.00', tempat: 'SDN Sitimerto', kegiatan: 'Workshop Asesmen Kebugaran Jasmani Indonesia (TKJI SD)', target: '19 Sekolah Dasar', narasumber: 'Puskesmas & Tim TKJI', status: 'Terlaksana', ket: 'Data Rapor Siswa' },
  { no: 4, bulan: 'OKTOBER 2026', hariTanggal: 'Sabtu, 17 Okt 2026', waktu: '08.00 - 13.00', tempat: 'SDN Jagung', kegiatan: 'Penyusunan Modul Ajar PJOK Berdiferensiasi Fase A, B, C', target: 'Semua Guru PJOK Pagu', narasumber: 'Pengawas & Guru Inti', status: 'Terlaksana', ket: 'Kurikulum Merdeka' },
  { no: 5, bulan: 'NOPEMBER 2026', hariTanggal: 'Sabtu, 14 Nov 2026', waktu: '08.00 - 13.00', tempat: 'Aula SDN Pagu 1', kegiatan: 'Bimtek Modul Ajar PJOK & Media Pembelajaran Berbasis Digital', target: '16 Guru PJOK SD', narasumber: 'Eko Santoso, S.Pd.', status: 'Akan Datang', ket: 'Praktik Baik' },
  { no: 6, bulan: 'DESEMBER 2026', hariTanggal: 'Sabtu, 19 Des 2026', waktu: '09.00 - 12.00', tempat: 'SDN Tengger 2', kegiatan: 'Rapat Evaluasi Program Semester Ganjil & Laporan KKG', target: 'Pengurus Harian KKG', narasumber: 'Pengawas SD Pagu', status: 'Akan Datang', ket: 'Evaluasi Semester 1' },
  { no: 7, bulan: 'JANUARI 2027', hariTanggal: 'Sabtu, 16 Jan 2027', waktu: '08.00 - 12.00', tempat: 'SDN Wonosari 2', kegiatan: 'Bedah Alur Tujuan Pembelajaran (ATP) Semester Genap', target: 'Guru PJOK Fase A, B, C', narasumber: 'Tim Kurikulum KKG', status: 'Akan Datang', ket: 'Persiapan KBM Genap' },
  { no: 8, bulan: 'FEBRUARI 2027', hariTanggal: 'Sabtu, 20 Feb 2027', waktu: '08.00 - 13.00', tempat: 'SDN Semen Pagu', kegiatan: 'Pelatihan Wasit & Juri Cabang Olahraga Tradisional SD', target: 'Guru PJOK & Pembina', narasumber: 'KORMI Kab. Kediri', status: 'Akan Datang', ket: 'Dolanan Jawa Timur' },
  { no: 9, bulan: 'MARET 2027', hariTanggal: 'Sabtu, 13 Maret 2027', waktu: '07.00 - 14.30', tempat: 'Lapangan Desa Menang', kegiatan: 'Seleksi Terbuka Kids Athletics & Cabang Olahraga O2SN SD 2027', target: 'Kontingen Atlet 19 SD', narasumber: 'Panitia Seleksi O2SN', status: 'Akan Datang', ket: 'O2SN Kecamatan' },
  { no: 10, bulan: 'APRIL 2027', hariTanggal: 'Sabtu, 17 April 2027', waktu: '08.00 - 12.00', tempat: 'SDN Tanjung', kegiatan: 'Diseminasi Praktik Baik Pembelajaran PJOK & Berbagi Karya', target: 'Seluruh Anggota KKG', narasumber: 'Guru Penggerak Pagu', status: 'Akan Datang', ket: 'Karya Inovatif' },
  { no: 11, bulan: 'MEI 2027', hariTanggal: 'Sabtu, 22 Mei 2027', waktu: '08.00 - 12.30', tempat: 'SD Emaus', kegiatan: 'Simulasi & Standarisasi Penilaian Akhir Jenjang (US PJOK)', target: 'Guru PJOK Kelas 6', narasumber: 'Tim Evaluasi KKG', status: 'Akan Datang', ket: 'Kelulusan Kelas 6' },
  { no: 12, bulan: 'JUNI 2027', hariTanggal: 'Sabtu, 19 Juni 2027', waktu: '08.30 - 13.00', tempat: 'SDN Menang Pagu', kegiatan: 'Rapat Pleno Akhir Tahun Ajaran & Laporan Pertanggungjawaban', target: 'Pengurus & Anggota', narasumber: 'Ketua & Pendamping', status: 'Akan Datang', ket: 'Tutup Buku 2026/2027' },
];

export const GoogleSheetSchedule: React.FC<GoogleSheetScheduleProps> = ({ 
  initialUrl = '', 
  onUrlChange 
}) => {
  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    return localStorage.getItem('kkg_pjok_sheet_url') || initialUrl || '';
  });
  const [inputUrl, setInputUrl] = useState<string>(sheetUrl);
  const [showConfig, setShowConfig] = useState<boolean>(() => {
    const saved = localStorage.getItem('kkg_pjok_sheet_url') || initialUrl || '';
    return !saved;
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'embed' | 'table'>('embed');
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [gid, setGid] = useState<string>(() => {
    return localStorage.getItem('kkg_pjok_sheet_gid') || '';
  });

  // Sinkronkan prop initialUrl jika berubah dan state masih kosong
  useEffect(() => {
    if (initialUrl && !sheetUrl) {
      setSheetUrl(initialUrl);
      setInputUrl(initialUrl);
    }
  }, [initialUrl, sheetUrl]);

  // Fungsi untuk memformat link Google Spreadsheet agar hanya menampilkan sheet 2 (KKG PJOK)
  const formatEmbedUrl = (rawUrl: string, selectedGid?: string) => {
    if (!rawUrl.trim()) return '';

    let url = rawUrl.trim();

    // Deteksi ID sheet dari hash atau query param jika ada
    let detectedGid = selectedGid || '';
    if (!detectedGid) {
      const gidMatch = url.match(/[?&#]gid=([0-9]+)/);
      if (gidMatch && gidMatch[1]) {
        detectedGid = gidMatch[1];
      }
    }

    // Jika berupa link "publish to the web" (pubhtml)
    if (url.includes('/pubhtml')) {
      const baseUrl = url.split('?')[0];
      const params = new URLSearchParams();
      if (detectedGid) {
        params.set('gid', detectedGid);
      }
      params.set('single', 'true');
      params.set('widget', 'false');
      params.set('headers', 'false');
      params.set('chrome', 'false');
      return `${baseUrl}?${params.toString()}`;
    }

    // Jika berupa link Google Spreadsheet standar (/spreadsheets/d/ID/...)
    const docIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (docIdMatch && docIdMatch[1]) {
      const docId = docIdMatch[1];
      const params = new URLSearchParams();
      if (detectedGid) {
        params.set('gid', detectedGid);
      }
      params.set('single', 'true'); // Memastikan HANYA sheet ini yang tampil tanpa tab lain
      params.set('widget', 'false');
      params.set('headers', 'false');
      params.set('chrome', 'false');
      return `https://docs.google.com/spreadsheets/d/${docId}/htmlembed?${params.toString()}`;
    }

    // Fallback URL jika sudah disesuaikan
    return url;
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim();
    setSheetUrl(cleanUrl);
    localStorage.setItem('kkg_pjok_sheet_url', cleanUrl);
    if (gid) {
      localStorage.setItem('kkg_pjok_sheet_gid', gid);
    }
    if (onUrlChange) {
      onUrlChange(cleanUrl);
    }
    setShowConfig(false);
    setIframeKey(Date.now());
  };

  const handleRefresh = () => {
    setIframeKey(Date.now());
  };

  const embedUrl = formatEmbedUrl(sheetUrl, gid);

  return (
    <div 
      className={`rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col bg-white border-2 border-blue-600' : 'relative my-8'
      }`}
    >
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time Google Sheets
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/20">
              Sheet 2 : KKG PJOK
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>JADWAL KEGIATAN KKG PJOK KEC. PAGU (T.A. 2026/2027)</span>
          </h2>
          <p className="text-xs text-slate-300">
            Terhubung langsung dengan spreadsheet agenda resmi kegiatan KKG PJOK se-Kecamatan Pagu.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* View Mode Toggle */}
          <div className="bg-white/10 p-0.5 rounded-xl border border-white/10 flex items-center">
            <button
              onClick={() => setViewMode('embed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'embed' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Live Sheet</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabel Ringkasan</span>
            </button>
          </div>

          {/* Config URL Button */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/15 transition-colors flex items-center gap-1.5"
            title="Pengaturan Tautan Spreadsheet"
          >
            <LinkIcon className="w-3.5 h-3.5 text-blue-300" />
            <span>{sheetUrl ? 'Ubah Link' : 'Tautkan Link'}</span>
          </button>

          {/* Refresh Button */}
          {sheetUrl && viewMode === 'embed' && (
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/15 transition-colors"
              title="Muat Ulang Spreadsheet"
            >
              <RefreshCw className="w-4 h-4 text-slate-200 hover:rotate-180 transition-transform duration-500" />
            </button>
          )}

          {/* External Link */}
          {sheetUrl && (
            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              title="Buka di tab baru Google Sheets"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Dokumen</span>
            </a>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/15 transition-colors"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Config Modal / Bar */}
      {showConfig && (
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSaveUrl} className="space-y-4 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan Google Spreadsheet (URL)
                </label>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 font-mono"
                  required
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GID Sheet ke-2 (Opsional jika di link belum ada)
                </label>
                <input
                  type="text"
                  value={gid}
                  onChange={(e) => setGid(e.target.value)}
                  placeholder="Contoh: 123456789 atau kosongkan"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Terapkan Spreadsheet</span>
              </button>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content: Iframe Embed OR Native Table */}
      <div className={`w-full ${isFullscreen ? 'flex-1 h-full' : 'h-[620px] sm:h-[680px]'} bg-slate-50 relative overflow-hidden`}>
        {viewMode === 'embed' ? (
          sheetUrl ? (
            <iframe
              key={iframeKey}
              src={embedUrl}
              title="Google Spreadsheet Jadwal Kegiatan KKG PJOK Pagu"
              className="w-full h-full border-0 bg-white"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  Google Spreadsheet Siap Ditautkan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tempelkan link Google Spreadsheet Anda untuk menampilkan <strong>Sheet ke-2 (KKG PJOK)</strong> secara real-time. Anda juga dapat langsung melihat versi tabel ringkasan di bawah.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowConfig(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Masukkan Link Spreadsheet</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Table className="w-4 h-4 text-slate-600" />
                  <span>Buka Tabel Ringkasan</span>
                </button>
              </div>
            </div>
          )
        ) : (
          /* Native Table View mirroring the CSV Jadwal KKG PJOK 2026/2027 */
          <div className="h-full overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3 w-12 text-center">NO</th>
                    <th className="p-3 w-32">BULAN</th>
                    <th className="p-3 w-40">HARI / TANGGAL</th>
                    <th className="p-3 w-28">WAKTU</th>
                    <th className="p-3 w-40">TEMPAT</th>
                    <th className="p-3 min-w-[220px]">KEGIATAN</th>
                    <th className="p-3 w-40">TARGET / SASARAN</th>
                    <th className="p-3 w-44">FASILITATOR / NARASUMBER</th>
                    <th className="p-3 w-28 text-center">STATUS</th>
                    <th className="p-3 w-32">KETERANGAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {defaultScheduleRows.map((row) => (
                    <tr key={row.no} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-500">{row.no}</td>
                      <td className="p-3 font-bold text-blue-900">{row.bulan}</td>
                      <td className="p-3 text-slate-700 whitespace-nowrap">{row.hariTanggal}</td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{row.waktu} WIB</td>
                      <td className="p-3 text-slate-800 font-medium">{row.tempat}</td>
                      <td className="p-3 text-slate-900 font-semibold">{row.kegiatan}</td>
                      <td className="p-3 text-slate-600">{row.target}</td>
                      <td className="p-3 text-slate-700">{row.narasumber}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === 'Terlaksana' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">{row.ket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Signatures Section matching the document */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-8">
              <div className="text-right text-xs text-slate-600 font-medium">
                Kediri, 25 Juli 2026
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="font-semibold text-slate-600">Pendamping KKG PJOK</p>
                  <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
                    (Tanda Tangan Digital)
                  </div>
                  <p className="font-bold text-slate-900 uppercase">KASENO</p>
                  <p className="text-slate-500">NIP. 19680415 199303 1 005</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-600">Ketua KKG PJOK</p>
                  <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
                    (Tanda Tangan Digital)
                  </div>
                  <p className="font-bold text-slate-900 uppercase">EKO SANTOSO, S.Pd.</p>
                  <p className="text-slate-500">NIP. 19840212 200902 1 003</p>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-100 text-xs">
                <p className="text-slate-600 font-medium">Mengetahui,</p>
                <p className="font-semibold text-slate-800">Pengawas SD Kec. Pagu</p>
                <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
                  (Tanda Tangan Digital)
                </div>
                <p className="font-bold text-slate-900 underline">Ika Wulan Kusumaningrum, S.T.</p>
                <p className="text-slate-500">NIP. 198101022010012007</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Hint */}
      <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Agenda & Kalender Kerja Tahunan KKG PJOK SD Kecamatan Pagu 2026/2027</span>
        </div>
      </div>
    </div>
  );
};
