import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  School, 
  Search, 
  Users, 
  ShieldCheck, 
  Award,
  BookOpen
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { teachers } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [genderFilter, setGenderFilter] = useState('Semua');

  const pendamping = teachers.filter(t => t.role === 'Pendamping');
  const pengurusInti = teachers.filter(t => t.role !== 'Pendamping' && t.role !== 'Anggota');

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.nip && teacher.nip.includes(searchQuery));
    
    let matchesRole = true;
    if (roleFilter === 'Pendamping') {
      matchesRole = teacher.role === 'Pendamping';
    } else if (roleFilter === 'Pengurus') {
      matchesRole = teacher.role !== 'Pendamping' && teacher.role !== 'Anggota';
    } else if (roleFilter === 'Anggota') {
      matchesRole = teacher.role === 'Anggota';
    }

    let matchesGender = true;
    if (genderFilter !== 'Semua') {
      matchesGender = teacher.gender === genderFilter;
    }

    return matchesSearch && matchesRole && matchesGender;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumb & Section Header Banner */}
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Pengurus & Anggota KKG', active: true }]} />

        {/* Informative Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Struktur Organisasi Resmi KKG PJOK SD Kecamatan Pagu</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
              Susunan Pengurus & Keanggotaan
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Wadah silaturahmi, kolaborasi, dan pengembangan keprofesian berkelanjutan guru Pendidikan Jasmani, Olahraga, dan Kesehatan tingkat Sekolah Dasar se-Kecamatan Pagu, Kabupaten Kediri.
            </p>

            <div className="pt-2 flex items-center gap-3 sm:gap-6 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 font-bold px-3 py-1 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-400/30">
                <Award className="w-4 h-4 text-purple-300" />
                <span>Tim Pendamping ({pendamping.length})</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold px-3 py-1 rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/30">
                <Users className="w-4 h-4 text-blue-300" />
                <span>Tim Pengurus Harian ({pengurusInti.length})</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>Tim Anggota Guru ({teachers.filter(t => t.role === 'Anggota').length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. TIM PENDAMPING KKG SECTION (THEME: UNGU / PURPLE) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-purple-700" />
              <span>Tim Pengawas & Pembina</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">
              Pendamping KKG PJOK SD Kecamatan Pagu
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendamping.map((teacher) => (
            <div
              key={teacher.id}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-purple-50/25 to-purple-50/50 border-2 border-purple-200/90 shadow-md hover:shadow-xl hover:border-purple-400 transition-all flex flex-col sm:flex-row items-center gap-6 relative group"
            >
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-300 shadow-md shrink-0 bg-slate-100 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
                {/* Role & Gender Badges */}
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-extrabold bg-purple-700 text-white shadow-xs border border-purple-800 uppercase tracking-wide">
                    {teacher.role}
                  </span>
                  {teacher.gender && (
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                      teacher.gender === 'Perempuan' 
                        ? 'bg-rose-100 text-rose-900 border-rose-300' 
                        : 'bg-purple-100 text-purple-900 border-purple-300'
                    }`}>
                      {teacher.gender === 'Perempuan' ? '♀ Perempuan' : '♂ Laki-laki'}
                    </span>
                  )}
                </div>

                {/* 1. NAMA */}
                <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight uppercase">
                  {teacher.name}
                </h3>

                {/* 2. NIP LANGSUNG DI BAWAH NAMA (TEKS SAJA TANPA BLOK WARNA) */}
                <div className="text-xs font-mono font-medium text-slate-600">
                  NIP. {teacher.nip && teacher.nip !== '-' ? teacher.nip : 'Non-ASN / Belum Terdata'}
                </div>

                {/* 3. SATUAN PENDIDIKAN (SEKOLAH) */}
                <div className="text-sm font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <School className="w-4 h-4 text-purple-700 shrink-0" />
                  <span className="uppercase text-slate-800">{teacher.school}</span>
                </div>

                {/* Bio jika ada */}
                {teacher.bio && (
                  <p className="text-xs text-purple-900/90 bg-white/80 border border-purple-200/80 p-2.5 rounded-xl italic mt-1 leading-relaxed">
                    "{teacher.bio}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TIM PENGURUS HARIAN KKG SECTION (THEME: BIRU / ROYAL BLUE) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-blue-700" />
              <span>Tim Pengurus Harian</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">
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
              className="p-6 rounded-3xl bg-gradient-to-br from-white via-blue-50/20 to-blue-50/40 border-2 border-blue-200/80 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    {/* Role Badge */}
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase tracking-wide text-white shadow-2xs ${
                      teacher.role === 'Ketua' ? 'bg-blue-700' :
                      teacher.role === 'Wakil Ketua' ? 'bg-indigo-700' :
                      teacher.role.startsWith('Sekretaris') ? 'bg-amber-600' :
                      teacher.role.startsWith('Bendahara') ? 'bg-emerald-600' :
                      'bg-blue-800'
                    }`}>
                      {teacher.role}
                    </span>

                    {/* 1. NAMA */}
                    <h3 className="text-base sm:text-lg font-black text-black leading-snug truncate uppercase">
                      {teacher.name}
                    </h3>

                    {/* 2. NIP LANGSUNG DI BAWAH NAMA (TEKS SAJA TANPA BLOK WARNA) */}
                    <div className="text-[11px] font-mono font-medium text-slate-600">
                      NIP. {teacher.nip && teacher.nip !== '-' ? teacher.nip : 'Non-ASN / Belum Terdata'}
                    </div>
                  </div>
                </div>

                {/* 3. SATUAN PENDIDIKAN (SEKOLAH) */}
                <div className="pt-2 border-t border-blue-100/80 flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase">
                  <School className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span className="truncate">{teacher.school}</span>
                </div>

                {/* Bio jika ada */}
                {teacher.bio && (
                  <p className="text-xs text-slate-700 line-clamp-2 italic bg-white/70 p-2 rounded-xl border border-blue-100/80">
                    "{teacher.bio}"
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-3 border-t border-blue-100/80 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  teacher.gender === 'Perempuan' 
                    ? 'bg-rose-100 text-rose-900 border-rose-300' 
                    : 'bg-blue-100 text-blue-900 border-blue-300'
                }`}>
                  {teacher.gender === 'Perempuan' ? '♀ Perempuan' : '♂ Laki-laki'}
                </span>
                <span className="text-[10px] font-extrabold text-blue-900 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-md">
                  Pengurus Resmi
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TIM ANGGOTA GURU KKG SECTION (THEME: HIJAU / EMERALD) */}
      <div className="space-y-6 pt-6 border-t-2 border-slate-200">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Daftar Seluruh Pendidik & Anggota</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">
              Daftar Anggota KKG Kecamatan Pagu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Data lengkap guru Pendidikan Jasmani, Olahraga, dan Kesehatan dari 19 Sekolah Dasar se-Kecamatan Pagu.
            </p>
          </div>

          {/* Stat Badges Menyesuaikan Team */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs">
              Total: {teachers.length} Guru
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-100 border border-purple-300 text-xs font-bold text-purple-900 shadow-2xs">
              Pendamping: {pendamping.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-100 border border-blue-300 text-xs font-bold text-blue-900 shadow-2xs">
              Pengurus: {pengurusInti.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 shadow-2xs">
              Anggota: {teachers.filter(t => t.role === 'Anggota').length}
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, NIP, atau SD..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter berdasarkan jabatan"
              className="px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
            >
              <option value="Semua">Semua Tim & Jabatan</option>
              <option value="Pendamping">Tim Pendamping (Ungu)</option>
              <option value="Pengurus">Tim Pengurus Harian (Biru)</option>
              <option value="Anggota">Tim Anggota Guru (Hijau)</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              aria-label="Filter berdasarkan jenis kelamin"
              className="px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-bold"
            >
              <option value="Semua">Semua Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki (♂)</option>
              <option value="Perempuan">Perempuan (♀)</option>
            </select>
          </div>

        </div>

        {/* Tabel Desktop & Tablet */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-black text-slate-800 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-6">Foto, Nama Lengkap & NIP</th>
                <th className="py-3.5 px-6">Satuan Pendidikan (SD)</th>
                <th className="py-3.5 px-6">Tim / Jabatan</th>
                <th className="py-3.5 px-6 text-center w-36">Jenis Kelamin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                    Tidak ditemukan data pendidik yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, idx) => (
                  <tr key={teacher.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-4 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5">
                          {/* 1. NAMA */}
                          <div className="font-black text-black uppercase text-xs sm:text-sm tracking-tight">
                            {teacher.name}
                          </div>
                          {/* 2. NIP LANGSUNG DI BAWAH NAMA (TEKS SAJA TANPA BLOK WARNA) */}
                          <div className="text-[11px] font-mono font-medium text-slate-600">
                            NIP. {teacher.nip && teacher.nip !== '-' ? teacher.nip : 'Non-ASN / Belum Terdata'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 uppercase">
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4 text-blue-700 shrink-0" />
                        <span>{teacher.school}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide shadow-2xs border ${
                        teacher.role === 'Pendamping'
                          ? 'bg-purple-100 text-purple-950 border-purple-300'
                          : teacher.role === 'Ketua'
                          ? 'bg-blue-700 text-white border-blue-800'
                          : teacher.role === 'Wakil Ketua'
                          ? 'bg-indigo-700 text-white border-indigo-800'
                          : teacher.role.startsWith('Sekretaris')
                          ? 'bg-amber-600 text-white border-amber-700'
                          : teacher.role.startsWith('Bendahara')
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      }`}>
                        {teacher.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                        teacher.gender === 'Perempuan'
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : 'bg-blue-100 text-blue-900 border-blue-300'
                      }`}>
                        <span>{teacher.gender === 'Perempuan' ? '♀ Perempuan' : '♂ Laki-laki'}</span>
                      </span>
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
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Tidak ditemukan data pendidik yang sesuai dengan kriteria pencarian.
            </div>
          ) : (
            filteredTeachers.map((teacher, idx) => (
              <div 
                key={teacher.id} 
                className={`p-4 rounded-2xl bg-white border-2 space-y-3 shadow-xs ${
                  teacher.role === 'Pendamping' ? 'border-purple-200 bg-purple-50/20' :
                  teacher.role !== 'Anggota' ? 'border-blue-200 bg-blue-50/20' :
                  'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-slate-500">No. {idx + 1}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border shadow-2xs ${
                    teacher.role === 'Pendamping' ? 'bg-purple-100 text-purple-950 border-purple-300' :
                    teacher.role === 'Ketua' ? 'bg-blue-700 text-white border-blue-800' :
                    teacher.role === 'Wakil Ketua' ? 'bg-indigo-700 text-white border-indigo-800' :
                    teacher.role.startsWith('Sekretaris') ? 'bg-amber-600 text-white border-amber-700' :
                    teacher.role.startsWith('Bendahara') ? 'bg-emerald-600 text-white border-emerald-700' :
                    'bg-emerald-100 text-emerald-950 border-emerald-300'
                  }`}>
                    {teacher.role}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    {/* 1. NAMA */}
                    <div className="font-black text-black uppercase text-xs truncate">
                      {teacher.name}
                    </div>
                    {/* 2. NIP TEPAT DI BAWAH NAMA (TEKS SAJA TANPA BLOK WARNA) */}
                    <div className="text-[11px] font-mono font-medium text-slate-600">
                      NIP. {teacher.nip && teacher.nip !== '-' ? teacher.nip : 'Non-ASN / Belum Terdata'}
                    </div>
                  </div>
                </div>

                {/* 3. SATUAN PENDIDIKAN DI BAWAH NIP */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <School className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span className="truncate uppercase font-bold text-slate-900">{teacher.school}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                    teacher.gender === 'Perempuan' 
                      ? 'bg-rose-100 text-rose-900 border-rose-300' 
                      : 'bg-blue-100 text-blue-900 border-blue-300'
                  }`}>
                    {teacher.gender === 'Perempuan' ? '♀ P' : '♂ L'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
