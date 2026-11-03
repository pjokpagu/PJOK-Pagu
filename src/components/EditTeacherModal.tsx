import React, { useState, useEffect, useRef } from 'react';
import { TeacherProfile } from '../types';
import { 
  X, 
  Upload, 
  Camera, 
  User, 
  Building2, 
  Briefcase, 
  Check, 
  Trash2, 
  AlertCircle,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile | null;
  isNew?: boolean;
  onSave: (teacher: TeacherProfile) => void;
  onDelete?: (id: string) => void;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

const STANDARD_ROLES = [
  'Pendamping',
  'Ketua',
  'Wakil Ketua',
  'Sekretaris 1',
  'Sekretaris 2',
  'Bendahara 1',
  'Bendahara 2',
  'Koordinator',
  'Anggota',
  'Lainnya (Kustom)'
];

export const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  isOpen,
  onClose,
  teacher,
  isNew = false,
  onSave,
  onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [role, setRole] = useState('Anggota');
  const [customRole, setCustomRole] = useState('');
  const [school, setSchool] = useState('');
  const [avatar, setAvatar] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (teacher) {
      setName(teacher.name || '');
      setNip(teacher.nip && teacher.nip !== '-' ? teacher.nip : '');
      const isKnownRole = STANDARD_ROLES.includes(teacher.role);
      if (isKnownRole) {
        setRole(teacher.role);
        setCustomRole('');
      } else {
        setRole('Lainnya (Kustom)');
        setCustomRole(teacher.role);
      }
      setSchool(teacher.school || '');
      setAvatar(teacher.avatar || DEFAULT_AVATAR);
      setGender(teacher.gender || 'Laki-laki');
      setBio(teacher.bio || '');
      setSpecialization(teacher.specialization || '');
      setUrlInput(teacher.avatar || '');
    } else {
      setName('');
      setNip('');
      setRole('Anggota');
      setCustomRole('');
      setSchool('');
      setAvatar(DEFAULT_AVATAR);
      setGender('Laki-laki');
      setBio('');
      setSpecialization('');
      setUrlInput('');
    }
    setErrorMsg('');
    setShowUrlInput(false);
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload & convert to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('File yang dipilih harus berupa gambar (JPG, PNG, WebP).');
      return;
    }

    // Limit size to ~3MB before base64
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
        setUrlInput(result);
        setErrorMsg('');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file foto.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setAvatar(urlInput.trim());
    setShowUrlInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama lengkap guru tidak boleh kosong!');
      return;
    }
    if (!school.trim()) {
      setErrorMsg('Satuan pendidikan (asal sekolah) tidak boleh kosong!');
      return;
    }

    const finalRole = role === 'Lainnya (Kustom)' ? (customRole.trim() || 'Anggota') : role;
    const finalNip = nip.trim() ? nip.trim() : '-';

    const updatedProfile: TeacherProfile = {
      id: teacher?.id || `t-${Date.now()}`,
      name: name.trim(),
      role: finalRole,
      school: school.trim(),
      nip: finalNip,
      gender,
      avatar: avatar || DEFAULT_AVATAR,
      bio: bio.trim(),
      specialization: specialization.trim()
    };

    onSave(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 w-full shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Formulir Data Pendidik KKG PJOK
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {isNew ? 'Tambah Pengurus / Pendamping / Anggota' : 'Edit Data Pengurus & Anggota'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* SECTION 1: FOTO PROFIL */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Foto Pendidik / Guru
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatar || DEFAULT_AVATAR}
                  alt={name || 'Preview Foto'}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-md bg-white"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity"
                  title="Ganti Foto"
                >
                  <Camera className="w-5 h-5 mb-1" />
                  <span>Ubah Foto</span>
                </button>
              </div>

              {/* Photo Actions */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto dari Perangkat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 inline-flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Input URL Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAvatar(DEFAULT_AVATAR);
                      setUrlInput('');
                    }}
                    className="px-2.5 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                    title="Reset ke Foto Bawaan"
                  >
                    Reset Foto
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dukung format JPG, PNG, atau WebP. Gambar langsung disimpan secara aman di perangkat.
                </p>

                {/* Collapsible URL Input */}
                {showUrlInput && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Masukkan URL gambar (https://...)"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold"
                    >
                      Terapkan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: IDENTITAS UTAMA (Nama, NIP, Satuan Pendidikan) */}
          <div className="space-y-4">
            
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Nama Lengkap & Gelar *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Eko Santoso, S.Pd."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Satuan Pendidikan / Asal Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Satuan Pendidikan (Asal Sekolah) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Contoh: SDN Pagu 1, Kepala SDN TENGGER 1"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* NIP & Quick Action */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Nomor Induk Pegawai (NIP)
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Contoh: 19840212 200902 1 003"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setNip('-')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-center transition-colors"
                >
                  Set Non-ASN / (-)
                </button>
              </div>
            </div>

            {/* Jabatan & Custom Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Jabatan / Peran di Organisasi *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {STANDARD_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('Laki-laki')}
                    className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      gender === 'Laki-laki'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>♂ Laki-laki</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Perempuan')}
                    className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      gender === 'Perempuan'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>♀ Perempuan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom role field if selected */}
            {role === 'Lainnya (Kustom)' && (
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Nama Jabatan Kustom *
                </label>
                <input
                  type="text"
                  required
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Contoh: Koordinator Bidang IT & Publikasi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            )}

            {/* Spesialisasi Cabang Olahraga / Keahlian */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Keahlian / Cabang Olahraga Spesialisasi
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Contoh: Atletik, Bola Voli, Senam SKJ, Kurikulum Merdeka"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Bio / Deskripsi Singkat */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Catatan Singkat / Bio Pendidik
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Deskripsi tugas atau peranan di KKG..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

          </div>

        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            {!isNew && onDelete && teacher && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus data "${teacher.name}"?`)) {
                    onDelete(teacher.id);
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Data</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold inline-flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
