import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  School, 
  UserCheck, 
  FolderDown, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Info,
  Plus,
  Search,
  Check,
  RotateCcw,
  Edit3,
  Trash2,
  X,
  Sparkles,
  Filter
} from 'lucide-react';
import { AgendaItem } from '../types';

export const AgendaPage: React.FC = () => {
  const { agenda, setAgenda, showToast } = useApp();
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaItem | null>(agenda[0] || null);

  useEffect(() => {
    if (selectedAgenda && !agenda.some(a => a.id === selectedAgenda.id)) {
      setSelectedAgenda(agenda[0] || null);
    }
  }, [agenda, selectedAgenda]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Akan Datang' | 'Sudah Terlaksana'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Adding / Editing Agenda
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAgenda, setCurrentAgenda] = useState<AgendaItem>({
    id: '',
    title: '',
    category: 'Bimtek Guru',
    date: '',
    time: '',
    venue: '',
    hostSchool: '',
    speaker: '',
    dressCode: 'Seragam Olahraga Resmi KKG',
    status: 'Akan Datang',
    description: '',
    registrationOpen: true
  });

  const notulenDriveLink = "https://drive.google.com/drive/folders/1DV1pTbtF3WO3wnk7CKWoZemHkKyBNvlG?usp=sharing";

  // Filtered Agenda List
  const filteredAgenda = agenda.filter((item) => {
    // Normalisasi status
    const itemStatus = (item.status === 'Sudah Terlaksana' || item.status === 'Selesai')
      ? 'Sudah Terlaksana'
      : 'Akan Datang';

    const matchesStatus = statusFilter === 'Semua' || itemStatus === statusFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Count totals
  const countAkanDatang = agenda.filter(a => a.status === 'Akan Datang' || a.status === 'Mendatang' || a.status === 'Berlangsung').length;
  const countSudahTerlaksana = agenda.filter(a => a.status === 'Sudah Terlaksana' || a.status === 'Selesai').length;

  // Quick Toggle Status between Akan Datang and Sudah Terlaksana
  const handleToggleStatus = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = agenda.map(item => {
      if (item.id === id) {
        const isCurrentUpcoming = item.status === 'Akan Datang' || item.status === 'Mendatang';
        const newStatus = isCurrentUpcoming ? 'Sudah Terlaksana' : 'Akan Datang';
        showToast(
          `Status agenda "${item.title}" diubah menjadi: ${newStatus}`,
          'success'
        );
        return {
          ...item,
          status: newStatus,
          registrationOpen: !isCurrentUpcoming
        };
      }
      return item;
    });
    setAgenda(updated);
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentAgenda({
      id: 'ag-' + Date.now(),
      title: '',
      category: 'Bimtek Guru',
      date: '',
      time: '08.00 - 12.00 WIB',
      venue: '',
      hostSchool: '',
      speaker: 'Tim Pengurus KKG PJOK',
      dressCode: 'Seragam Olahraga Resmi KKG',
      status: 'Akan Datang',
      description: '',
      registrationOpen: true
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (e: React.MouseEvent, item: AgendaItem) => {
    e.stopPropagation();
    setIsEditing(true);
    setCurrentAgenda({
      ...item,
      status: (item.status === 'Sudah Terlaksana' || item.status === 'Selesai') ? 'Sudah Terlaksana' : 'Akan Datang'
    });
    setIsModalOpen(true);
  };

  // Delete Agenda
  const handleDeleteAgenda = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Hapus agenda kegiatan "${title}"?`)) {
      setAgenda(agenda.filter(a => a.id !== id));
      showToast(`Agenda "${title}" berhasil dihapus`, 'success');
      if (selectedAgenda?.id === id) {
        setSelectedAgenda(agenda.find(a => a.id !== id) || null);
      }
    }
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAgenda.title || !currentAgenda.date || !currentAgenda.venue) {
      showToast('Harap lengkapi judul, tanggal, dan tempat pelaksanaan', 'error');
      return;
    }

    if (isEditing) {
      setAgenda(agenda.map(a => a.id === currentAgenda.id ? currentAgenda : a));
      showToast(`Agenda "${currentAgenda.title}" berhasil diperbarui`, 'success');
    } else {
      setAgenda([currentAgenda, ...agenda]);
      showToast(`Agenda baru "${currentAgenda.title}" berhasil ditambahkan`, 'success');
    }

    setIsModalOpen(false);
    setSelectedAgenda(currentAgenda);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Agenda & Jadwal Kegiatan', active: true }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          Kalender Pendidikan Olahraga
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Jadwal Kegiatan KKG PJOK SD Pagu
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Daftar agenda kegiatan yang akan datang maupun yang telah selesai terlaksana, lengkap dengan tanggal, waktu, dan lokasi tempat pelaksanaan.
        </p>
      </div>

      {/* 2 Kolom: Agenda List & Notulen Rapat Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Kolom Kiri: Agenda Section */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Bar: Status Filter & Tambah Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Status Tabs */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setStatusFilter('Semua')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  statusFilter === 'Semua'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Semua</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                  {agenda.length}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter('Akan Datang')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  statusFilter === 'Akan Datang'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Akan Datang</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                  {countAkanDatang}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter('Sudah Terlaksana')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  statusFilter === 'Sudah Terlaksana'
                    ? 'bg-white text-blue-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Sudah Terlaksana</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
                  {countSudahTerlaksana}
                </span>
              </button>
            </div>

            {/* Tambah Agenda Button */}
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda</span>
            </button>

          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan berdasarkan nama, tempat, tanggal, pemateri..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 shadow-2xs"
            />
          </div>

          {/* Agenda Cards List */}
          <div className="space-y-4">
            {filteredAgenda.length === 0 ? (
              <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">Tidak Ada Agenda Kegiatan</h3>
                <p className="text-xs text-slate-500">
                  {searchQuery ? 'Tidak ditemukan agenda yang cocok dengan pencarian Anda.' : 'Belum ada agenda dalam kategori ini.'}
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="mt-2 text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Kegiatan Sekarang</span>
                </button>
              </div>
            ) : (
              filteredAgenda.map((item) => {
                const isSelected = selectedAgenda?.id === item.id;
                const isUpcoming = item.status === 'Akan Datang' || item.status === 'Mendatang';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAgenda(item)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : isUpcoming
                        ? 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    
                    {/* Top Row: Category & Status Badge */}
                    <div className="flex items-center justify-between gap-3 text-xs mb-3 flex-wrap">
                      <span className="font-bold text-rose-600 px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-200/60">
                        {item.category}
                      </span>
                      
                      {/* Status Indicator */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                        isUpcoming
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {isUpcoming ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Akan Datang</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Sudah Terlaksana</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Info Grid: Tanggal, Waktu, Tempat */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-200/80 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-900">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{item.venue}</span>
                      </div>
                      {item.hostSchool && (
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span className="truncate">Tuan Rumah: {item.hostSchool}</span>
                        </div>
                      )}
                      {item.speaker && (
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">Narasumber: {item.speaker}</span>
                        </div>
                      )}
                    </div>

                    {item.dressCode && (
                      <div className="mt-3 pt-2 text-[11px] text-slate-500 border-t border-dashed border-slate-200">
                        <strong>Pakaian:</strong> {item.dressCode}
                      </div>
                    )}

                    {/* Bottom Action Bar: Toggle Status, Edit, Delete */}
                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
                      
                      {/* One-Click Status Toggle Button */}
                      <button
                        onClick={(e) => handleToggleStatus(e, item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                          isUpcoming
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                        title={isUpcoming ? "Klik untuk menandai kegiatan ini telah selesai dilaksanakan" : "Klik untuk menandai kegiatan ini sebagai Akan Datang"}
                      >
                        {isUpcoming ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-blue-700" />
                            <span>Tandai Sudah Terlaksana</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Tandai Akan Datang</span>
                          </>
                        )}
                      </button>

                      {/* Edit & Delete Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleOpenEditModal(e, item)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-blue-700 hover:bg-slate-50 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                          title="Edit Agenda"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteAgenda(e, item.id, item.title)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Agenda"
                          aria-label="Hapus Agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Kolom Kanan: NOTULEN RAPAT KKG PJOK */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  Arsip & Dokumen Resmi
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Google Drive
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                NOTULEN RAPAT KKG PJOK
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Akses berkas notulensi rapat bulanan, berita acara musyawarah kerja guru, dan laporan evaluasi KKG PJOK SD Kecamatan Pagu.
              </p>
            </div>

            {/* Embedded Google Drive Folder Preview */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-64 sm:h-72 relative shadow-2xs">
              <iframe
                src="https://drive.google.com/embeddedfolderview?id=1DV1pTbtF3WO3wnk7CKWoZemHkKyBNvlG#grid"
                title="Notulen Rapat KKG PJOK Google Drive"
                className="w-full h-full border-0 bg-white"
                allow="autoplay"
              />
            </div>

            {/* Tombol Utama Menuju Link GDrive */}
            <a
              href={notulenDriveLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 inline-flex items-center justify-center gap-2 group"
            >
              <FolderDown className="w-4 h-4" />
              <span>Akses NOTULEN RAPAT KKG PJOK di Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Daftar Konten Berkas Notulensi */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs text-slate-700">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Isi Berkas Notulensi yang Tersedia:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600 pl-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Notulensi Rapat Koordinasi Rutin Bulanan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Berita Acara & Daftar Hadir Dewan Guru</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Laporan Evaluasi Program Kerja Semester</span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Notulensi rapat otomatis diperbarui secara berkala di Google Drive setiap kali pertemuan selesai diselenggarakan.
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* MODAL: TAMBAH & EDIT AGENDA KEGIATAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveModal}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEditing ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Lengkapi jadwal tanggal, waktu, dan tempat pelaksanaan kegiatan.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              
              {/* Judul Kegiatan */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nama / Judul Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={currentAgenda.title}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, title: e.target.value })}
                  placeholder="Contoh: Bimtek Pembuatan Modul Ajar PJOK"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>

              {/* Status & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Status Pelaksanaan *
                  </label>
                  <select
                    value={currentAgenda.status}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs font-semibold"
                  >
                    <option value="Akan Datang">🟢 Akan Datang</option>
                    <option value="Sudah Terlaksana">🔵 Sudah Terlaksana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Kategori Kegiatan
                  </label>
                  <input
                    type="text"
                    value={currentAgenda.category}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, category: e.target.value })}
                    placeholder="Contoh: Bimtek Guru / Rapat Rutin"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Hari & Tanggal *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentAgenda.date}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, date: e.target.value })}
                    placeholder="Contoh: Sabtu, 14 November 2026"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Waktu Pelaksanaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentAgenda.time}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, time: e.target.value })}
                    placeholder="Contoh: 08.00 - 13.00 WIB"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Tempat & Tuan Rumah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Tempat / Lokasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentAgenda.venue}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, venue: e.target.value })}
                    placeholder="Contoh: Aula SDN Pagu 1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Sekolah Penyelenggara / Tuan Rumah
                  </label>
                  <input
                    type="text"
                    value={currentAgenda.hostSchool}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, hostSchool: e.target.value })}
                    placeholder="Contoh: SDN Pagu 1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Narasumber & Dress Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Narasumber / Pemateri
                  </label>
                  <input
                    type="text"
                    value={currentAgenda.speaker}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, speaker: e.target.value })}
                    placeholder="Contoh: Pengawas / Tim Kurikulum"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Pakaian / Seragam
                  </label>
                  <input
                    type="text"
                    value={currentAgenda.dressCode}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, dressCode: e.target.value })}
                    placeholder="Contoh: Kaos Olahraga Resmi KKG"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Deskripsi Kegiatan */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Uraian & Deskripsi Kegiatan
                </label>
                <textarea
                  rows={3}
                  value={currentAgenda.description}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, description: e.target.value })}
                  placeholder="Keterangan singkat tentang materi atau agenda yang akan dibahas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-600/20"
              >
                {isEditing ? 'Simpan Perubahan' : 'Tambahkan ke Jadwal'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
