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
  Link as LinkIcon,
  Loader2,
  FolderUp
} from 'lucide-react';
import { convertGDriveToDirectImageUrl, extractGDriveFileId, isGDriveUrl } from '../utils/gdrive';

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile | null;
  isNew?: boolean;
  onSave: (teacher: TeacherProfile) => void;
  onDelete?: (id: string) => void;
}

// Inline SVG fallback avatar: 100% reliable, zero network dependency, impossible to loop onError
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f1f5f9'/%3E%3Ccircle cx='60' cy='48' r='22' fill='%23cbd5e1'/%3E%3Cpath d='M24 104c0-20 16-36 36-36s36 16 36 36' fill='%2394a3b8'/%3E%3C/svg%3E";

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

/**
 * Client-side image resizer & compressor using HTML5 Canvas.
 * Downsamples high-resolution smartphone photos (3-12MB) down to max 360x360 px (~20-35KB).
 * Prevents memory spikes, browser freezes, and localStorage QuotaExceededError crashes.
 */
const compressImageFile = (file: File, maxWidth = 360, maxHeight = 360, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Format file bukan gambar yang valid (gunakan JPG, PNG, atau WebP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar dari perangkat.'));
    reader.onload = (e) => {
      const src = e.target?.result;
      if (!src || typeof src !== 'string') {
        return reject(new Error('Isi file gambar kosong.'));
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Browser gagal merender elemen gambar.'));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // If canvas context fails for any reason, safely resolve with original string
            resolve(src);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress to JPEG with 0.82 quality: results in ~20KB-35KB image
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (canvasErr) {
          console.warn('Canvas resize failed, falling back to original data URL', canvasErr);
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
};

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
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showGdriveInput, setShowGdriveInput] = useState(false);
  const [gdriveUrl, setGdriveUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (teacher) {
      setName(typeof teacher.name === 'string' ? teacher.name : '');
      setNip(teacher.nip && teacher.nip !== '-' ? String(teacher.nip) : '');
      const currentRole = teacher.role || 'Anggota';
      const isKnownRole = STANDARD_ROLES.includes(currentRole);
      if (isKnownRole) {
        setRole(currentRole);
        setCustomRole('');
      } else {
        setRole('Lainnya (Kustom)');
        setCustomRole(currentRole);
      }
      setSchool(typeof teacher.school === 'string' ? teacher.school : '');
      setAvatar(typeof teacher.avatar === 'string' && teacher.avatar.trim() ? teacher.avatar : DEFAULT_AVATAR);
      setGender(teacher.gender === 'Perempuan' ? 'Perempuan' : 'Laki-laki');
      setBio(typeof teacher.bio === 'string' ? teacher.bio : '');
      setSpecialization(typeof teacher.specialization === 'string' ? teacher.specialization : '');
      setUrlInput(typeof teacher.avatar === 'string' && !teacher.avatar.startsWith('data:') ? teacher.avatar : '');
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
    setIsCompressing(false);
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload & downsample via canvas
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('File yang dipilih harus berupa gambar (JPG, PNG, WebP).');
      return;
    }

    setIsCompressing(true);
    setErrorMsg('');

    try {
      // Compress and resize image to lightweight 360x360 px data URL
      const compressedDataUrl = await compressImageFile(file, 360, 360, 0.82);
      setAvatar(compressedDataUrl);
      setUrlInput('');
    } catch (err: any) {
      console.error('Error compressing teacher avatar:', err);
      setErrorMsg(err.message || 'Gagal memproses file foto. Silakan coba gambar lain.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMsg('Harap masukkan URL foto yang valid.');
      return;
    }
    const finalUrl = convertGDriveToDirectImageUrl(trimmed);
    setAvatar(finalUrl);
    setShowUrlInput(false);
    setErrorMsg('');
  };

  const handleApplyGdrive = () => {
    const trimmed = gdriveUrl.trim();
    if (!trimmed) {
      setErrorMsg('Harap masukkan link Google Drive foto.');
      return;
    }
    const finalUrl = convertGDriveToDirectImageUrl(trimmed);
    if (!finalUrl || (finalUrl === trimmed && !trimmed.startsWith('https://'))) {
      setErrorMsg('Format link Google Drive tidak valid. Pastikan link diawali dengan https://drive.google.com/file/d/...');
      return;
    }
    setAvatar(finalUrl);
    setShowGdriveInput(false);
    setErrorMsg('');
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
      avatar: avatar && avatar.trim() ? avatar : DEFAULT_AVATAR,
      bio: bio.trim(),
      specialization: specialization.trim()
    };

    onSave(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
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
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* SECTION 1: FOTO PROFIL */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Foto Pendidik / Guru
              </label>
              {isCompressing && (
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mengompres & Mengoptimalkan Foto...
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatar || DEFAULT_AVATAR}
                  alt={name || 'Preview Foto'}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-md bg-white"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.fallback) {
                      img.dataset.fallback = 'true';
                      img.src = DEFAULT_AVATAR;
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing}
                  className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer disabled:opacity-0"
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
                  accept="image/jpeg,image/png,image/webp,image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    disabled={isCompressing}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-98"
                  >
                    {isCompressing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Upload Foto</span>
                  </button>

                  <button
                    type="button"
                    disabled={isCompressing}
                    onClick={() => {
                      setShowGdriveInput(!showGdriveInput);
                      if (!showGdriveInput) setShowUrlInput(false);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all ${
                      showGdriveInput
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <FolderUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Link Google Drive</span>
                  </button>

                  <button
                    type="button"
                    disabled={isCompressing}
                    onClick={() => {
                      setShowUrlInput(!showUrlInput);
                      if (!showUrlInput) setShowGdriveInput(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Input URL</span>
                  </button>

                  <button
                    type="button"
                    disabled={isCompressing}
                    onClick={() => {
                      setAvatar(DEFAULT_AVATAR);
                      setUrlInput('');
                      setGdriveUrl('');
                    }}
                    className="px-2.5 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer"
                    title="Reset ke Foto Bawaan"
                  >
                    Reset Foto
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dapat mengunggah file langsung dari HP/laptop atau menempelkan link sharing Google Drive.
                </p>

                {/* Collapsible Google Drive Input Panel */}
                {showGdriveInput && (
                  <div className="pt-2 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <FolderUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Ambil Foto dari Google Drive
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        Auto-Format GDrive
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="url"
                        value={gdriveUrl}
                        onChange={(e) => setGdriveUrl(e.target.value)}
                        placeholder="Tempel link file foto Google Drive: https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                        className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-mono"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-emerald-800 dark:text-emerald-300">
                        <span className="leading-tight">
                          *Pastikan akses file di Google Drive: <strong>"Siapa saja yang memiliki link"</strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleApplyGdrive}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Terapkan Foto GDrive</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Collapsible Standard URL Input */}
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
                      className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700"
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
                  placeholder="Contoh: 198501012010011001 atau kosongkan jika non-ASN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setNip('-')}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Set Non-ASN (-)
                </button>
              </div>
            </div>

          </div>

          {/* SECTION 3: JABATAN & JENIS KELAMIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Jabatan Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Jabatan Organisasi *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  aria-label="Pilih Jabatan Organisasi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {STANDARD_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {role === 'Lainnya (Kustom)' && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Tuliskan nama jabatan kustom..."
                    className="w-full px-3 py-2 rounded-xl border border-blue-400 dark:border-blue-600 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setGender('Laki-laki')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    gender === 'Laki-laki'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>♂ Laki-laki</span>
                  {gender === 'Laki-laki' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setGender('Perempuan')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    gender === 'Perempuan'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>♀ Perempuan</span>
                  {gender === 'Perempuan' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>

          {/* SECTION 4: SPESIALISASI & BIO / KUTIPAN */}
          <div className="space-y-4">
            
            {/* Spesialisasi */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Keahlian / Cabang Olahraga Unggulan (Opsional)
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Contoh: Senam Ritmik, Atletik & Kebugaran Jasmani, Renang"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Kutipan / Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Kata Motivasi / Catatan Pengurus (Opsional)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tuliskan kata motivasi olahraga atau moto hidup..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              {!isNew && teacher && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus data "${teacher.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
                      onDelete(teacher.id);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
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
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isCompressing}
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold inline-flex items-center gap-1.5 shadow-md shadow-blue-700/20 cursor-pointer active:scale-98 transition-all"
              >
                {isCompressing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-emerald-300" />}
                <span>{isNew ? 'Tambah ke Daftar' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
