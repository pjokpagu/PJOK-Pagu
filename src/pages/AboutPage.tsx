import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { EditTeacherModal } from '../components/EditTeacherModal';
import { TeacherProfile } from '../types';
import { 
  School, 
  Search, 
  Users, 
  UserCheck, 
  Edit3, 
  Plus, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { 
    teachers, 
    setTeachers, 
    isAdminLoggedIn, 
    setIsLoginModalOpen, 
    showToast,
    setCurrentPage 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [genderFilter, setGenderFilter] = useState('Semua');

  // Modal editing state
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTeacher, setIsNewTeacher] = useState(false);

  const pendamping = teachers.filter(t => t.role === 'Pendamping');
  const pengurusInti = teachers.filter(t => t.role !== 'Pendamping' && t.role !== 'Anggota');

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.nip && teacher.nip.includes(searchQuery));
    
    let matchesRole = true;
    if (roleFilter === 'Pengurus') {
      matchesRole = teacher.role !== 'Anggota';
    } else if (roleFilter === 'Anggota') {
      matchesRole = teacher.role === 'Anggota';
    }

    let matchesGender = true;
    if (genderFilter !== 'Semua') {
      matchesGender = teacher.gender === genderFilter;
    }

    return matchesSearch && matchesRole && matchesGender;
  });

  const handleOpenEdit = (teacher: TeacherProfile) => {
    if (!isAdminLoggedIn) {
      showToast('Silakan login sebagai Admin terlebih dahulu untuk mengedit data pengurus & anggota.', 'info');
      setIsLoginModalOpen(true);
      return;
    }
    setSelectedTeacher(teacher);
    setIsNewTeacher(false);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    if (!isAdminLoggedIn) {
      showToast('Silakan login sebagai Admin terlebih dahulu untuk menambah pengurus/anggota baru.', 'info');
      setIsLoginModalOpen(true);
      return;
    }
    setSelectedTeacher(null);
    setIsNewTeacher(true);
    setIsModalOpen(true);
  };

  const handleSaveTeacher = (updated: TeacherProfile) => {
    if (isNewTeacher) {
      setTeachers(prev => [updated, ...prev]);
      showToast(`Data "${updated.name}" berhasil ditambahkan ke daftar!`, 'success');
    } else {
      setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
      showToast(`Data "${updated.name}" berhasil diperbarui!`, 'success');
    }
    setIsModalOpen(false);
    setSelectedTeacher(null);
    setIsNewTeacher(false);
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast('Data telah dihapus dari daftar.', 'info');
    setIsModalOpen(false);
    setSelectedTeacher(null);
    setIsNewTeacher(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumb & Admin Edit Bar */}
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Pengurus & Anggota KKG', active: true }]} />

        {/* Admin Action Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isAdminLoggedIn ? 'bg-emerald-600 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs'
            }`}>
              {isAdminLoggedIn ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>{isAdminLoggedIn ? 'Mode Edit Admin Aktif' : 'Manajemen Data Pengurus & Anggota'}</span>
                {isAdminLoggedIn && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    Terverifikasi
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {isAdminLoggedIn
                  ? 'Klik tombol "Edit Data" pada tiap kartu/tabel untuk memperbarui Foto, Nama, NIP, Jabatan, & Satuan Pendidikan.'
                  : 'Silakan login sebagai Admin untuk mengedit foto, nama, NIP, jabatan, dan satuan pendidikan pengurus serta anggota.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
            {isAdminLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-blue-700/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Guru / Pengurus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('admin')}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Dashboard Admin</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-blue-700/20 active:scale-95 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-blue-200" />
                <span>Login Admin untuk Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PENDAMPING KKG SECTION (2 Orang) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Pengawas & Pembina
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1 uppercase">
              Pendamping KKG PJOK SD Kecamatan Pagu
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendamping.map((teacher) => (
            <div
              key={teacher.id}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative group"
            >
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-blue-100 shadow-md shrink-0 bg-slate-100"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2.5 text-center sm:text-left min-w-0 flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200/80 uppercase tracking-wide">
                    {teacher.role}
                  </span>
                  {teacher.gender && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      teacher.gender === 'Perempuan' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {teacher.gender === 'Perempuan' ? '♀ P' : '♂ L'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                  {teacher.name}
                </h3>
                <div className="text-sm font-semibold text-slate-700 flex items-center justify-center sm:justify-start gap-2">
                  <School className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="uppercase">{teacher.school}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 tracking-wide">
                  NIP: {teacher.nip && teacher.nip !== '-' ? teacher.nip : 'Non-ASN / Belum Terdata'}
                </div>

                {/* Edit Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(teacher)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                    title="Edit Foto, Nama, NIP, Jabatan, Satuan Pendidikan"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit Data Pendamping</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUSUNAN PENGURUS INTI */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1 uppercase">
              Pengurus Harian KKG PJOK SD Kecamatan Pagu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Amanah kepengurusan yang menggerakkan program kerja dan pelayanan guru olahraga di 19 SD se-Kecamatan Pagu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pengurusInti.map((teacher) => (
            <div
              key={teacher.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1 uppercase space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-blue-700 text-white tracking-wide">
                      {teacher.role}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug truncate">
                      {teacher.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 truncate">
                      {teacher.school}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="text-[11px] font-mono text-slate-500">
                    NIP: {teacher.nip && teacher.nip !== '-' ? teacher.nip : 'Non-ASN / Belum Terdata'}
                  </div>
                  {teacher.bio && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {teacher.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Action row */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {teacher.gender === 'Perempuan' ? '♀ Perempuan' : '♂ Laki-laki'}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(teacher)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  title="Edit Foto, Nama, NIP, Jabatan, Satuan Pendidikan"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit Data</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DAFTAR LENGKAP ANGGOTA KKG KECAMATAN PAGU */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Keanggotaan Guru PJOK
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1 uppercase">
              Daftar Anggota KKG Kecamatan Pagu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Data guru Pendidikan Jasmani, Olahraga, dan Kesehatan dari Sekolah Dasar se-Kecamatan Pagu.
            </p>
          </div>

          {/* Stat Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800">
              Total: {teachers.length} Guru
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              ♂ Laki-laki: {teachers.filter(t => t.gender === 'Laki-laki').length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              ♀ Perempuan: {teachers.filter(t => t.gender === 'Perempuan').length}
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, NIP, atau SD..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {/* Filter Dropdowns & Add Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter berdasarkan jabatan"
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Semua">Semua Jabatan</option>
              <option value="Pengurus">Pengurus Inti & Pendamping</option>
              <option value="Anggota">Anggota</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              aria-label="Filter berdasarkan jenis kelamin"
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Semua">Semua Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki (♂)</option>
              <option value="Perempuan">Perempuan (♀)</option>
            </select>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Anggota</span>
            </button>
          </div>

        </div>

        {/* Tabel Desktop & Tablet */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-6">Foto & Nama Lengkap</th>
                <th className="py-3.5 px-6">Satuan Pendidikan</th>
                <th className="py-3.5 px-6">Jabatan</th>
                <th className="py-3.5 px-4 text-center w-28">Jenis Kelamin</th>
                <th className="py-3.5 px-6 text-center w-32">Aksi Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data anggota yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, idx) => (
                  <tr key={teacher.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-4 text-center font-semibold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 uppercase">
                            {teacher.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            {teacher.nip && teacher.nip !== '-' ? `NIP. ${teacher.nip}` : 'Non-ASN / NIP Belum Terdata'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700 uppercase">
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{teacher.school}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${
                        teacher.role === 'Pendamping'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : teacher.role === 'Ketua'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : teacher.role === 'Wakil Ketua'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : teacher.role.startsWith('Sekretaris')
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : teacher.role.startsWith('Bendahara')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {teacher.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        teacher.gender === 'Perempuan'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <span>{teacher.gender === 'Perempuan' ? '♀ P' : '♂ L'}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(teacher)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-blue-200/80"
                        title="Edit Foto, Nama, NIP, Jabatan, Satuan Pendidikan"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card View untuk Mobile */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {filteredTeachers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Tidak ditemukan data anggota yang sesuai dengan kriteria pencarian.
            </div>
          ) : (
            filteredTeachers.map((teacher, idx) => (
              <div key={teacher.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400">No. {idx + 1}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    teacher.role === 'Pendamping' ? 'bg-purple-100 text-purple-800' :
                    teacher.role === 'Ketua' ? 'bg-blue-100 text-blue-800' :
                    teacher.role === 'Wakil Ketua' ? 'bg-indigo-100 text-indigo-800' :
                    teacher.role.startsWith('Sekretaris') ? 'bg-amber-100 text-amber-800' :
                    teacher.role.startsWith('Bendahara') ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {teacher.role}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 uppercase text-xs truncate">
                      {teacher.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {teacher.nip && teacher.nip !== '-' ? `NIP. ${teacher.nip}` : 'Non-ASN / NIP Belum Terdata'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(teacher)}
                    className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0"
                    title="Edit Foto, Nama, NIP, Jabatan, Satuan Pendidikan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate uppercase font-medium">{teacher.school}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                    teacher.gender === 'Perempuan' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {teacher.gender === 'Perempuan' ? '♀ P' : '♂ L'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* REUSABLE EDIT TEACHER MODAL */}
      <EditTeacherModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTeacher(null);
          setIsNewTeacher(false);
        }}
        teacher={selectedTeacher}
        isNew={isNewTeacher}
        onSave={handleSaveTeacher}
        onDelete={handleDeleteTeacher}
      />

    </div>
  );
};
