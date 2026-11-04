import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  UserCheck, 
  BookOpen, 
  Trophy, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Users, 
  FolderPlus, 
  Globe, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  Layers,
  ArrowLeft,
  X,
  Menu,
  ExternalLink,
  LogOut,
  Lock,
  Shield,
  EyeOff,
  AlertCircle,
  User,
  School,
  FolderUp
} from 'lucide-react';
import { convertGDriveToDirectImageUrl, extractGDriveFileId, isGDriveUrl } from '../utils/gdrive';
import { EditTeacherModal } from '../components/EditTeacherModal';
import { 
  ServiceItem, 
  ProgramKKG, 
  ArticleInfo, 
  LearningMaterial, 
  AgendaItem, 
  TeacherProfile, 
  ClientPartner, 
  Testimonial 
} from '../types';

type AdminTab = 
  | 'overview'
  | 'hero'
  | 'tentang'
  | 'layanan'
  | 'program'
  | 'artikel'
  | 'perangkat'
  | 'agenda'
  | 'media'
  | 'seo'
  | 'pengaturan';

export const AdminDashboard: React.FC = () => {
  const { 
    setCurrentPage, 
    hero, setHero,
    teachers, setTeachers,
    services, setServices,
    programs, setPrograms,
    articles, setArticles,
    materials, setMaterials,
    agenda, setAgenda,
    testimonials, setTestimonials,
    partners, setPartners,
    settings, setSettings,
    mediaList, addMediaItem, updateMediaItem, deleteMediaItem,
    isAdminDarkMode, setIsAdminDarkMode,
    isAdminLoggedIn, loginAdmin, logoutAdmin,
    resetAllData, exportDataJSON, importDataJSON,
    showToast
  } = useApp();

  // Media editing & GDrive states
  const [editingMedia, setEditingMedia] = useState<{ id: string; name: string; url: string; category: string } | null>(null);
  const [mediaSourceType, setMediaSourceType] = useState<'gdrive' | 'url'>('gdrive');
  const [gdriveInputMedia, setGdriveInputMedia] = useState('');
  const [heroBannerTab, setHeroBannerTab] = useState<'beranda' | 'pengurus' | 'program' | 'perangkat'>('beranda');

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Direct login state if accessed while unauthenticated
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginShowPass, setLoginShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const ok = loginAdmin(loginUser, loginPass);
    if (!ok) {
      setLoginError('Username atau Password yang Anda masukkan tidak valid. Silakan periksa kembali.');
    } else {
      setLoginPass('');
    }
  };

  // Modal edit states
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  const [editingProgram, setEditingProgram] = useState<ProgramKKG | null>(null);
  const [isNewProgram, setIsNewProgram] = useState(false);

  const [editingArticle, setEditingArticle] = useState<ArticleInfo | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);

  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [isNewMaterial, setIsNewMaterial] = useState(false);

  const [editingAgenda, setEditingAgenda] = useState<AgendaItem | null>(null);
  const [isNewAgenda, setIsNewAgenda] = useState(false);

  // Teacher modal edit states
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);
  const [isNewTeacher, setIsNewTeacher] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherRoleTab, setTeacherRoleTab] = useState<'Semua' | 'Pendamping' | 'Pengurus' | 'Anggota'>('Semua');

  const handleSaveTeacher = (updatedTeacher: TeacherProfile) => {
    if (isNewTeacher) {
      setTeachers(prev => [updatedTeacher, ...prev]);
      showToast(`Data "${updatedTeacher.name}" berhasil ditambahkan!`, 'success');
    } else {
      setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
      showToast(`Data "${updatedTeacher.name}" berhasil diperbarui!`, 'success');
    }
    setEditingTeacher(null);
    setIsNewTeacher(false);
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast('Data guru/pengurus telah dihapus', 'info');
    setEditingTeacher(null);
    setIsNewTeacher(false);
  };

  // New media upload simulation state
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState('Dokumentasi');

  // Import JSON ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSimulateImageUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceUrl = mediaSourceType === 'gdrive' ? gdriveInputMedia.trim() : newMediaUrl.trim();
    if (!newMediaName.trim() || !sourceUrl) {
      showToast('Harap masukkan judul gambar dan link / URL gambar', 'error');
      return;
    }
    const finalUrl = convertGDriveToDirectImageUrl(sourceUrl);
    addMediaItem({
      name: newMediaName.trim(),
      url: finalUrl,
      category: newMediaCategory
    });
    setNewMediaName('');
    setNewMediaUrl('');
    setGdriveInputMedia('');
  };

  const handleUpdateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    if (!editingMedia.name.trim() || !editingMedia.url.trim()) {
      showToast('Judul dan URL / Link GDrive foto tidak boleh kosong', 'error');
      return;
    }
    const finalUrl = convertGDriveToDirectImageUrl(editingMedia.url.trim());
    updateMediaItem({
      ...editingMedia,
      name: editingMedia.name.trim(),
      url: finalUrl
    });
    setEditingMedia(null);
  };

  // CRUD Handlers for Layanan
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (isNewService) {
      setServices(prev => [editingService, ...prev]);
      showToast('Layanan baru berhasil ditambahkan!', 'success');
    } else {
      setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
      showToast('Perubahan layanan berhasil disimpan!', 'success');
    }
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Yakin ingin menghapus layanan ini?')) {
      setServices(prev => prev.filter(s => s.id !== id));
      showToast('Layanan telah dihapus', 'info');
    }
  };

  // CRUD Handlers for Program KKG
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    const finalProgram = {
      ...editingProgram,
      image: convertGDriveToDirectImageUrl(editingProgram.image || '')
    };
    if (isNewProgram) {
      setPrograms(prev => [finalProgram, ...prev]);
      showToast('Program kerja baru berhasil ditambahkan!', 'success');
    } else {
      setPrograms(prev => prev.map(p => p.id === finalProgram.id ? finalProgram : p));
      showToast('Program kerja berhasil diperbarui!', 'success');
    }
    setEditingProgram(null);
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm('Yakin ingin menghapus program ini?')) {
      setPrograms(prev => prev.filter(p => p.id !== id));
      showToast('Program kerja telah dihapus', 'info');
    }
  };

  // CRUD Handlers for Artikel
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    const finalArticle = {
      ...editingArticle,
      thumbnail: convertGDriveToDirectImageUrl(editingArticle.thumbnail || '')
    };
    if (isNewArticle) {
      setArticles(prev => [finalArticle, ...prev]);
      showToast('Artikel baru berhasil diterbitkan!', 'success');
    } else {
      setArticles(prev => prev.map(a => a.id === finalArticle.id ? finalArticle : a));
      showToast('Artikel berhasil diperbarui!', 'success');
    }
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      setArticles(prev => prev.filter(a => a.id !== id));
      showToast('Artikel telah dihapus', 'info');
    }
  };

  // CRUD Handlers for Perangkat Ajar
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    const finalMaterial = {
      ...editingMaterial,
      thumbnail: convertGDriveToDirectImageUrl(editingMaterial.thumbnail || '')
    };
    if (isNewMaterial) {
      setMaterials(prev => [finalMaterial, ...prev]);
      showToast('Perangkat ajar baru berhasil diunggah!', 'success');
    } else {
      setMaterials(prev => prev.map(m => m.id === finalMaterial.id ? finalMaterial : m));
      showToast('Perangkat ajar berhasil diperbarui!', 'success');
    }
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm('Yakin ingin menghapus perangkat ajar ini?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
      showToast('Perangkat ajar telah dihapus', 'info');
    }
  };

  // CRUD Handlers for Agenda
  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgenda) return;
    if (isNewAgenda) {
      setAgenda(prev => [editingAgenda, ...prev]);
      showToast('Agenda baru berhasil dijadwalkan!', 'success');
    } else {
      setAgenda(prev => prev.map(a => a.id === editingAgenda.id ? editingAgenda : a));
      showToast('Agenda berhasil diperbarui!', 'success');
    }
    setEditingAgenda(null);
  };

  const handleDeleteAgenda = (id: string) => {
    if (confirm('Yakin ingin menghapus agenda ini?')) {
      setAgenda(prev => prev.filter(a => a.id !== id));
      showToast('Agenda telah dihapus', 'info');
    }
  };

  const menuItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Ringkasan Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'hero', label: 'Kelola Hero & Banner', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'tentang', label: 'Kelola Profil & Pengurus', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'program', label: 'Kelola Program KKG', icon: <Trophy className="w-4 h-4" /> },
    { id: 'artikel', label: 'Kelola Artikel & Berita', icon: <FileText className="w-4 h-4" /> },
    { id: 'perangkat', label: 'Kelola Perangkat Ajar', icon: <FolderPlus className="w-4 h-4" /> },
    { id: 'agenda', label: 'Kelola Agenda Kegiatan', icon: <Calendar className="w-4 h-4" /> },
    { id: 'media', label: 'Media Manager (Upload & GDrive)', icon: <Layers className="w-4 h-4" /> },
    { id: 'seo', label: 'Pengaturan SEO & Meta', icon: <Globe className="w-4 h-4" /> },
    { id: 'pengaturan', label: 'Pengaturan Website', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  if (!isAdminLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${isAdminDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-800'}`}>
        <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 shadow-xs mb-2">
              <Shield className="w-7 h-7 text-blue-700" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Login Dashboard Admin</h2>
            <p className="text-xs text-slate-500">
              Silakan login dengan Username dan Password resmi untuk mengakses Dashboard.
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleDirectLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Masukkan username admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={loginShowPass ? 'text' : 'password'}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setLoginShowPass(!loginShowPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {loginShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 active:scale-[0.99] transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-rose-300" />
                <span>Masuk ke Dashboard Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage('beranda')}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Website</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isAdminDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        className="hidden"
      />

      <div className="flex">
        
        {/* SIDEBAR */}
        <aside className={`w-72 shrink-0 border-r ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} min-h-screen p-4 flex flex-col justify-between hidden md:flex sticky top-0 h-screen overflow-y-auto`}>
          <div className="space-y-6">
            
            {/* Top Brand */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <img
                    src="./assets/aistudio/1_00b40b6c.png"
                    alt="Logo KKG PJOK Pagu"
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-sm tracking-tight">Admin KKG PJOK</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Cloud Sync Aktif</span>
                  </div>
                </div>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setIsAdminDarkMode(!isAdminDarkMode)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  isAdminDarkMode
                    ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700'
                    : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={isAdminDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              >
                {isAdminDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Menu List */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : isAdminDarkMode
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom actions: Back to Site & Backup */}
          <div className="pt-4 border-t border-slate-200/50 space-y-2">
            <button
              onClick={() => setCurrentPage('beranda')}
              className={`flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                isAdminDarkMode
                  ? 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Lihat Website Utama</span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                onClick={exportDataJSON}
                className="py-1.5 px-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold hover:bg-blue-100 flex items-center justify-center gap-1"
                title="Ekspor Seluruh Data JSON"
              >
                <Download className="w-3 h-3" />
                <span>Backup</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-1.5 px-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold hover:bg-rose-100 flex items-center justify-center gap-1"
                title="Impor File JSON"
              >
                <Upload className="w-3 h-3" />
                <span>Restore</span>
              </button>
            </div>

            <button
              onClick={logoutAdmin}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-2xs mt-2"
              title="Keluar dari sesi administrator"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Logout Admin</span>
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER OVERLAY */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Drawer Panel */}
            <div 
              className={`relative w-80 max-w-[85vw] ${
                isAdminDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
              } h-full p-4 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-left duration-200`}
            >
              <div className="space-y-4">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      <img
                        src="./assets/aistudio/1_00b40b6c.png"
                        alt="Logo KKG PJOK"
                        className="w-full h-full object-contain filter drop-shadow-xs"
                      />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs tracking-tight">Admin KKG PJOK</div>
                      <div className="text-[10px] text-slate-400">Pagu, Kab. Kediri</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Tutup menu admin"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tab Menu List */}
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Pilih Menu Kelola
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : isAdminDarkMode
                            ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Action inside Drawer */}
              <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setCurrentPage('beranda');
                    setMobileSidebarOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Lihat Website Utama</span>
                </button>

                <button
                  onClick={() => {
                    logoutAdmin();
                    setMobileSidebarOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar / Logout Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-6xl overflow-x-hidden min-w-0">
          
          {/* TOP MOBILE BAR & QUICK TABS */}
          <div className="md:hidden pb-3 mb-6 space-y-3 border-b border-slate-200/80 dark:border-slate-800">
            {/* Mobile Top Header */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Menu className="w-4 h-4" />
                <span>Menu Admin</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAdminDarkMode(!isAdminDarkMode)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  title={isAdminDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                >
                  {isAdminDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                </button>
                <button
                  onClick={() => setCurrentPage('beranda')}
                  className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Website
                </button>
                <button
                  onClick={logoutAdmin}
                  className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mobile Horizontal Quick Tabs Bar (Smooth Swipe / Tap) */}
            <div className="overflow-x-auto flex items-center gap-1.5 pb-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isAdminDarkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label.replace('Kelola ', '').replace('Manager (Upload)', '')}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Indicator Badge */}
            <div className="flex items-center justify-between text-[11px] px-1 text-slate-500 dark:text-slate-400">
              <span>Sedang membuka:</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {menuItems.find(m => m.id === activeTab)?.label}
              </span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl font-black tracking-tight">Ringkasan Sistem KKG PJOK</h1>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Cloud Realtime Sync Aktif</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Database Cloud Firestore terhubung secara real-time antar perangkat (Laptop, Komputer, HP, & Tablet).</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportDataJSON}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Data JSON</span>
                  </button>
                  <button
                    onClick={resetAllData}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
                  <div className="text-xs font-medium text-slate-400">Total Program KKG</div>
                  <div className="text-2xl font-black text-blue-600 mt-1 tabular-nums">{programs.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Kegiatan terjadwal</div>
                </div>
                <div className={`p-5 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
                  <div className="text-xs font-medium text-slate-400">Perangkat Ajar</div>
                  <div className="text-2xl font-black text-rose-600 mt-1 tabular-nums">{materials.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Modul & ATP Kelas 1-6</div>
                </div>
                <div className={`p-5 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
                  <div className="text-xs font-medium text-slate-400">Pengurus & Pendamping</div>
                  <div className="text-2xl font-black text-amber-500 mt-1 tabular-nums">{teachers.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Pendidik aktif</div>
                </div>
                <div className={`p-5 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
                  <div className="text-xs font-medium text-slate-400">Media Dokumentasi</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">{mediaList.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Foto kegiatan</div>
                </div>
              </div>

              {/* Quick Actions & Recent Updates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className={`p-6 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                  <h3 className="text-sm font-bold">Aksi Cepat Pengurus</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => {
                        setIsNewProgram(true);
                        setEditingProgram({
                          id: 'prg-' + Date.now(),
                          slug: 'program-baru-' + Date.now(),
                          title: '',
                          category: 'Bimtek & Workshop',
                          date: '10 November 2026',
                          time: '08.00 - 12.00 WIB',
                          location: 'SDN Pagu 1',
                          driveLink: 'https://drive.google.com',
                          description: '',
                          status: 'Akan Datang',
                          targetParticipants: 'Guru PJOK SD',
                          materials: [],
                          image: './assets/images/kkg_teachers_meeting_1793250246883.jpg'
                        });
                        setActiveTab('program');
                      }}
                      className="p-3 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 text-left hover:bg-blue-100 transition-colors"
                    >
                      + Tambah Program KKG
                    </button>
                    <button
                      onClick={() => {
                        setIsNewMaterial(true);
                        setEditingMaterial({
                          id: 'mat-' + Date.now(),
                          grade: 'Kelas 1',
                          category: 'Modul Ajar',
                          title: '',
                          summary: '',
                          author: 'Guru PJOK Pagu',
                          schoolOrigin: 'SDN Pagu',
                          date: '28 Oktober 2026',
                          fileSize: '2.5 MB',
                          downloadUrl: 'https://drive.google.com',
                          thumbnail: './assets/images/hero_sport_education_1793250246629.jpg',
                          downloadsCount: 0
                        });
                        setActiveTab('perangkat');
                      }}
                      className="p-3 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-200 text-left hover:bg-rose-100 transition-colors"
                    >
                      + Tambah Modul Ajar
                    </button>
                    <button
                      onClick={() => {
                        setIsNewArticle(true);
                        setEditingArticle({
                          id: 'art-' + Date.now(),
                          slug: 'berita-baru-' + Date.now(),
                          title: '',
                          category: 'Berita Prestasi',
                          summary: '',
                          content: '',
                          author: 'Humas KKG Pagu',
                          date: '28 Oktober 2026',
                          readTime: '3 menit baca',
                          thumbnail: './assets/images/elementary_sports_day_1793250248307.jpg',
                          tags: ['PJOK', 'Pagu']
                        });
                        setActiveTab('artikel');
                      }}
                      className="p-3 rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-200 text-left hover:bg-amber-100 transition-colors"
                    >
                      + Terbitkan Artikel
                    </button>
                    <button
                      onClick={() => setActiveTab('media')}
                      className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-left hover:bg-emerald-100 transition-colors"
                    >
                      + Upload Foto Media
                    </button>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                  <h3 className="text-sm font-bold">Informasi Hosting & Deployment</h3>
                  <div className="space-y-2 text-xs text-slate-500">
                    <p>
                      Seluruh data terenkapsulasi secara lokal di dalam folder project <code className="font-mono text-blue-600">/src/data/initialData.ts</code> dan tersinkronisasi otomatis dengan <code className="font-mono text-blue-600">localStorage</code>.
                    </p>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Mode Penyimpanan:</span>
                        <strong className="text-emerald-600 font-bold">Offline-First / Zero-Cloud Mock</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Portabilitas:</span>
                        <strong>Vercel, VPS, Shared Hosting Node.js</strong>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: KELOLA HERO & BANNER WEBSITE (GOOGLE DRIVE) */}
          {activeTab === 'hero' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">Kelola Hero &amp; Banner Website</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                      <FolderUp className="w-3 h-3" />
                      <span>Google Drive Terkoneksi</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Edit foto banner utama yang tampil di Beranda, Halaman Susunan Pengurus, Program KKG, dan Perangkat Pembelajaran.
                  </p>
                </div>
              </div>

              {/* GDrive Guidance Callout */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 text-xs">
                <FolderUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold">Panduan Memasang Foto Google Drive ke Banner Website:</span>
                  <ol className="list-decimal ml-4 mt-0.5 space-y-0.5 text-slate-700 dark:text-emerald-300">
                    <li>Buka foto di Google Drive Anda &gt; Klik kanan &gt; Pilih <strong>Bagikan (Share)</strong>.</li>
                    <li>Ubah Akses Umum menjadi <strong>"Siapa saja yang memiliki link"</strong> (Anyone with the link).</li>
                    <li>Salin link tersebut dan tempelkan pada kolom <em>Link Google Drive</em> di tab halaman pilihan Anda.</li>
                    <li>Sistem otomatis mengonversi ke link gambar langsung resolusi tinggi dan langsung tampil di halaman website!</li>
                  </ol>
                </div>
              </div>

              {/* Sub-Tab Selector for Page Banners */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setHeroBannerTab('beranda')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    heroBannerTab === 'beranda'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>1. Hero Beranda Utama</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroBannerTab('pengurus')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    heroBannerTab === 'pengurus'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>2. Hero Susunan Pengurus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroBannerTab('program')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    heroBannerTab === 'program'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>3. Hero Program KKG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroBannerTab('perangkat')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    heroBannerTab === 'perangkat'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>4. Hero Perangkat Pembelajaran</span>
                </button>
              </div>

              {/* SUBTAB 1: HERO BERANDA UTAMA */}
              {heroBannerTab === 'beranda' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300">
                      Pengaturan Hero Banner Halaman Beranda (Home)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('beranda')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Lihat Halaman Beranda</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Badge Kicker</label>
                    <input
                      type="text"
                      value={hero.badge}
                      onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Judul Utama</label>
                      <input
                        type="text"
                        value={hero.title}
                        onChange={(e) => setHero({ ...hero, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Teks Sorotan Warna</label>
                      <input
                        type="text"
                        value={hero.highlightedText}
                        onChange={(e) => setHero({ ...hero, highlightedText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Deskripsi Lengkap Hero</label>
                    <textarea
                      rows={3}
                      value={hero.description}
                      onChange={(e) => setHero({ ...hero, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Label Tombol Primer</label>
                      <input
                        type="text"
                        value={hero.ctaPrimaryText}
                        onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Label Tombol Sekunder</label>
                      <input
                        type="text"
                        value={hero.ctaSecondaryText}
                        onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold">Link Foto Banner Beranda (Google Drive / URL) *</label>
                      {extractGDriveFileId(hero.heroImage) && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ID GDrive Terdeteksi
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={hero.heroImage}
                      onChange={(e) => {
                        const val = e.target.value;
                        const direct = convertGDriveToDirectImageUrl(val);
                        setHero({ ...hero, heroImage: direct });
                      }}
                      placeholder="Tempel link Google Drive atau URL gambar..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      Bisa tempel link Google Drive apa saja (contoh: <code>drive.google.com/file/d/.../view?usp=sharing</code>). Sistem otomatis mengonversinya.
                    </p>

                    {hero.heroImage && (
                      <div className="mt-3 flex items-center gap-4">
                        <div className="w-40 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 shadow-xs">
                          <img 
                            src={hero.heroImage} 
                            alt="Preview Banner Hero Beranda" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200">Pratinjau Foto Banner Beranda</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{hero.heroImage}</div>
                          <div className="text-[10px] text-emerald-600 font-medium">✓ Foto terhubung dengan halaman depan website</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: HERO SUSUNAN PENGURUS */}
              {heroBannerTab === 'pengurus' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300">
                      Pengaturan Hero Banner Halaman Susunan Pengurus &amp; Guru
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('tentang-kami')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Lihat Halaman Pengurus</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Badge Banner Pengurus</label>
                    <input
                      type="text"
                      value={hero.pengurusBadge || ''}
                      onChange={(e) => setHero({ ...hero, pengurusBadge: e.target.value })}
                      placeholder="Struktur Organisasi Resmi KKG PJOK SD Kecamatan Pagu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Judul Banner Pengurus</label>
                    <input
                      type="text"
                      value={hero.pengurusTitle || ''}
                      onChange={(e) => setHero({ ...hero, pengurusTitle: e.target.value })}
                      placeholder="Susunan Pengurus & Keanggotaan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Deskripsi Banner Pengurus</label>
                    <textarea
                      rows={3}
                      value={hero.pengurusDescription || ''}
                      onChange={(e) => setHero({ ...hero, pengurusDescription: e.target.value })}
                      placeholder="Wadah silaturahmi, kolaborasi, dan pengembangan keprofesian berkelanjutan..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold">Link Foto Banner Pengurus (Google Drive / URL) *</label>
                      {extractGDriveFileId(hero.pengurusHeroImage || '') && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ID GDrive Terdeteksi
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={hero.pengurusHeroImage || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const direct = convertGDriveToDirectImageUrl(val);
                        setHero({ ...hero, pengurusHeroImage: direct });
                      }}
                      placeholder="Tempel link Google Drive foto pengurus / pertemuan KKG..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      Foto ini akan dijadikan latar belakang hero banner pada halaman Susunan Pengurus &amp; Keanggotaan.
                    </p>

                    {(hero.pengurusHeroImage || './assets/images/kkg_teachers_meeting_1793250246883.jpg') && (
                      <div className="mt-3 flex items-center gap-4">
                        <div className="w-40 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 shadow-xs relative">
                          <img 
                            src={hero.pengurusHeroImage || './assets/images/kkg_teachers_meeting_1793250246883.jpg'} 
                            alt="Preview Banner Pengurus" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200">Pratinjau Foto Banner Pengurus</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{hero.pengurusHeroImage}</div>
                          <div className="text-[10px] text-emerald-600 font-medium">✓ Terhubung langsung ke Halaman Pengurus KKG</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 3: HERO PROGRAM KKG */}
              {heroBannerTab === 'program' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300">
                      Pengaturan Hero Banner Halaman Program Kerja KKG PJOK
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('program-kkg')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Lihat Halaman Program</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Badge Banner Program</label>
                    <input
                      type="text"
                      value={hero.programBadge || ''}
                      onChange={(e) => setHero({ ...hero, programBadge: e.target.value })}
                      placeholder="Agenda & Kegiatan KKG"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Judul Banner Program</label>
                    <input
                      type="text"
                      value={hero.programTitle || ''}
                      onChange={(e) => setHero({ ...hero, programTitle: e.target.value })}
                      placeholder="Program Kerja KKG PJOK SD Kecamatan Pagu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Deskripsi Banner Program</label>
                    <textarea
                      rows={3}
                      value={hero.programDescription || ''}
                      onChange={(e) => setHero({ ...hero, programDescription: e.target.value })}
                      placeholder="Rangkaian bimtek kurikulum merdeka, seleksi atletik usia dini..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold">Link Foto Banner Program KKG (Google Drive / URL) *</label>
                      {extractGDriveFileId(hero.programHeroImage || '') && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ID GDrive Terdeteksi
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={hero.programHeroImage || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const direct = convertGDriveToDirectImageUrl(val);
                        setHero({ ...hero, programHeroImage: direct });
                      }}
                      placeholder="Tempel link Google Drive foto kegiatan / perlombaan..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      Foto ini akan dijadikan latar belakang hero banner pada halaman Program KKG PJOK.
                    </p>

                    {(hero.programHeroImage || './assets/images/elementary_sports_day_1793250248307.jpg') && (
                      <div className="mt-3 flex items-center gap-4">
                        <div className="w-40 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 shadow-xs relative">
                          <img 
                            src={hero.programHeroImage || './assets/images/elementary_sports_day_1793250248307.jpg'} 
                            alt="Preview Banner Program" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200">Pratinjau Foto Banner Program</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{hero.programHeroImage}</div>
                          <div className="text-[10px] text-emerald-600 font-medium">✓ Terhubung langsung ke Halaman Program KKG</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 4: HERO PERANGKAT PEMBELAJARAN */}
              {heroBannerTab === 'perangkat' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300">
                      Pengaturan Hero Banner Halaman Perangkat Pembelajaran &amp; Modul
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('perangkat-pembelajaran')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Lihat Halaman Perangkat Ajar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Badge Banner Perangkat</label>
                    <input
                      type="text"
                      value={hero.perangkatBadge || ''}
                      onChange={(e) => setHero({ ...hero, perangkatBadge: e.target.value })}
                      placeholder="Bank Kurikulum & Modul Ajar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Judul Banner Perangkat</label>
                    <input
                      type="text"
                      value={hero.perangkatTitle || ''}
                      onChange={(e) => setHero({ ...hero, perangkatTitle: e.target.value })}
                      placeholder="Perangkat Ajar PJOK SD Kurikulum Merdeka"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Deskripsi Banner Perangkat</label>
                    <textarea
                      rows={3}
                      value={hero.perangkatDescription || ''}
                      onChange={(e) => setHero({ ...hero, perangkatDescription: e.target.value })}
                      placeholder="Bank perangkat ajar gratis dan resmi yang disusun oleh guru-guru PJOK..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold">Link Foto Banner Perangkat Ajar (Google Drive / URL) *</label>
                      {extractGDriveFileId(hero.perangkatHeroImage || '') && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ID GDrive Terdeteksi
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={hero.perangkatHeroImage || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const direct = convertGDriveToDirectImageUrl(val);
                        setHero({ ...hero, perangkatHeroImage: direct });
                      }}
                      placeholder="Tempel link Google Drive foto lapangan olahraga / senam..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      Foto ini akan dijadikan latar belakang hero banner pada halaman Perangkat Pembelajaran &amp; Modul Ajar.
                    </p>

                    {(hero.perangkatHeroImage || './assets/images/gymnastics_field_pagu_1793250247785.jpg') && (
                      <div className="mt-3 flex items-center gap-4">
                        <div className="w-40 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 shadow-xs relative">
                          <img 
                            src={hero.perangkatHeroImage || './assets/images/gymnastics_field_pagu_1793250247785.jpg'} 
                            alt="Preview Banner Perangkat" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200">Pratinjau Foto Banner Perangkat</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{hero.perangkatHeroImage}</div>
                          <div className="text-[10px] text-emerald-600 font-medium">✓ Terhubung langsung ke Halaman Perangkat Ajar</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button for All Banners */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Perubahan langsung tersinkronisasi ke Firebase Firestore &amp; halaman website.</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    showToast('Pengaturan Hero & Banner Website berhasil disimpan & disinkronisasi ke website!', 'success');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan &amp; Tampilkan di Website</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KELOLA TENTANG & PENGURUS */}
          {activeTab === 'tentang' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Kelola Pengurus, Pendamping & Anggota KKG</h2>
                  <p className="text-xs text-slate-500">Edit foto, nama lengkap, NIP, jabatan, dan satuan pendidikan pengurus serta anggota.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewTeacher(true);
                    setEditingTeacher(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pendidik Baru</span>
                </button>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Role Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
                  {(['Semua', 'Pendamping', 'Pengurus', 'Anggota'] as const).map((tab) => {
                    const count = tab === 'Semua' 
                      ? teachers.length
                      : tab === 'Pendamping'
                      ? teachers.filter(t => t.role === 'Pendamping').length
                      : tab === 'Pengurus'
                      ? teachers.filter(t => t.role !== 'Pendamping' && t.role !== 'Anggota').length
                      : teachers.filter(t => t.role === 'Anggota').length;

                    const isActive = teacherRoleTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setTeacherRoleTab(tab)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : isAdminDarkMode
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tab} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Search Box */}
                <div className="w-full md:w-72">
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Cari nama, NIP, atau sekolah..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Teachers List */}
              <div className="space-y-3">
                {teachers
                  .filter((t) => {
                    const matchesSearch = 
                      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                      t.school.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                      (t.nip && t.nip.includes(teacherSearch));

                    let matchesRole = true;
                    if (teacherRoleTab === 'Pendamping') {
                      matchesRole = t.role === 'Pendamping';
                    } else if (teacherRoleTab === 'Pengurus') {
                      matchesRole = t.role !== 'Pendamping' && t.role !== 'Anggota';
                    } else if (teacherRoleTab === 'Anggota') {
                      matchesRole = t.role === 'Anggota';
                    }

                    return matchesSearch && matchesRole;
                  })
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`p-4 rounded-xl border ${isAdminDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-300 dark:border-slate-700 shrink-0 bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              t.role === 'Pendamping'
                                ? 'bg-purple-100 text-purple-950 dark:bg-purple-900/70 dark:text-purple-200 border border-purple-300'
                                : t.role === 'Ketua'
                                ? 'bg-blue-600 text-white'
                                : t.role === 'Wakil Ketua'
                                ? 'bg-indigo-600 text-white'
                                : t.role.startsWith('Sekretaris')
                                ? 'bg-amber-600 text-white'
                                : t.role.startsWith('Bendahara')
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/70 dark:text-emerald-200 border border-emerald-300'
                            }`}>
                              {t.role}
                            </span>
                          </div>

                          {/* 1. NAMA */}
                          <h4 className="text-sm font-black text-black dark:text-white uppercase truncate">
                            {t.name}
                          </h4>

                          {/* 2. NIP LANGSUNG DI BAWAH NAMA (TEKS SAJA TANPA BLOK WARNA) */}
                          <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400">
                            NIP. {t.nip && t.nip !== '-' ? t.nip : 'Non-ASN / Belum Terdata'}
                          </div>

                          {/* 3. SATUAN PENDIDIKAN DI BAWAH NIP */}
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 pt-0.5">
                            <School className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate uppercase">{t.school}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-200 dark:border-slate-700/80">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewTeacher(false);
                            setEditingTeacher(t);
                          }}
                          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                          title="Edit Foto, Nama, NIP, Jabatan, Satuan Pendidikan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Data</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus "${t.name}" dari daftar?`)) {
                              handleDeleteTeacher(t.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer border border-rose-200 dark:border-rose-800"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: KELOLA LAYANAN (CRUD) */}
          {activeTab === 'layanan' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Kelola Layanan KKG PJOK</h2>
                  <p className="text-xs text-slate-500">Tambah, sunting, atau hapus paket fasilitasi guru.</p>
                </div>
                <button
                  onClick={() => {
                    setIsNewService(true);
                    setEditingService({
                      id: 'srv-' + Date.now(),
                      slug: 'layanan-baru-' + Date.now(),
                      title: '',
                      category: 'Kurikulum & Modul',
                      summary: '',
                      description: '',
                      benefits: ['Akses materi kurikulum lengkap', 'Pendampingan langsung'],
                      gallery: ['./assets/images/hero_sport_education_1793250246629.jpg'],
                      faqs: [{ question: 'Bagaimana cara mendaftar?', answer: 'Hubungi koordinator layanan via WhatsApp.' }],
                      contactPerson: 'Pengurus KKG Pagu',
                      iconName: 'BookOpen'
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Layanan Baru</span>
                </button>
              </div>

              {/* Service List Table */}
              <div className="space-y-3">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className={`p-4 rounded-xl border ${isAdminDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {srv.category}
                      </span>
                      <h4 className="text-sm font-bold mt-1">{srv.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{srv.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setIsNewService(false);
                          setEditingService(srv);
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        title="Edit Layanan"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                        title="Hapus Layanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: KELOLA PROGRAM KKG (CRUD) */}
          {activeTab === 'program' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Kelola Program Kerja KKG</h2>
                  <p className="text-xs text-slate-500">Program terjadwal & terhubung dengan Google Drive.</p>
                </div>
                <button
                  onClick={() => {
                    setIsNewProgram(true);
                    setEditingProgram({
                      id: 'prg-' + Date.now(),
                      slug: 'program-kkg-' + Date.now(),
                      title: '',
                      category: 'Bimtek & Workshop',
                      date: '15 November 2026',
                      time: '08.00 - 13.00 WIB',
                      location: 'SDN Pagu 1',
                      driveLink: 'https://drive.google.com',
                      description: '',
                      status: 'Akan Datang',
                      targetParticipants: 'Guru PJOK SD Pagu',
                      materials: [{ title: 'Materi Presentasi.pdf', size: '2 MB', link: 'https://drive.google.com' }],
                      image: './assets/images/kkg_teachers_meeting_1793250246883.jpg'
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Program KKG</span>
                </button>
              </div>

              <div className="space-y-3">
                {programs.map((prog) => (
                  <div
                    key={prog.id}
                    className={`p-4 rounded-xl border ${isAdminDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                          {prog.category}
                        </span>
                        <span className="text-xs text-slate-400">{prog.date}</span>
                      </div>
                      <h4 className="text-sm font-bold mt-1">{prog.title}</h4>
                      <p className="text-xs text-slate-500">{prog.location}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={prog.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                        title="Buka Drive"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          setIsNewProgram(false);
                          setEditingProgram(prog);
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        title="Edit Program"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(prog.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                        title="Hapus Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KELOLA ARTIKEL & BERITA (CRUD) */}
          {activeTab === 'artikel' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Kelola Berita & Informasi</h2>
                  <p className="text-xs text-slate-500">Artikel prestasi, hasil lomba, dan regulasi dinas.</p>
                </div>
                <button
                  onClick={() => {
                    setIsNewArticle(true);
                    setEditingArticle({
                      id: 'art-' + Date.now(),
                      slug: 'berita-' + Date.now(),
                      title: '',
                      category: 'Praktik Baik',
                      summary: '',
                      content: '',
                      author: 'Pengurus KKG PJOK',
                      date: '28 Oktober 2026',
                      readTime: '3 menit baca',
                      thumbnail: './assets/images/elementary_sports_day_1793250248307.jpg',
                      tags: ['O2SN', 'PJOK', 'Pagu']
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Berita Baru</span>
                </button>
              </div>

              <div className="space-y-3">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className={`p-4 rounded-xl border ${isAdminDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {art.category}
                      </span>
                      <h4 className="text-sm font-bold mt-1">{art.title}</h4>
                      <div className="text-[11px] text-slate-400">{art.date} · Penulis: {art.author}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setIsNewArticle(false);
                          setEditingArticle(art);
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        title="Edit Berita"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                        title="Hapus Berita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: KELOLA PERANGKAT PEMBELAJARAN (CRUD) */}
          {activeTab === 'perangkat' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Kelola Perangkat Pembelajaran</h2>
                  <p className="text-xs text-slate-500">Modul ajar, ATP, CP, dan instrumen asesmen Kelas 1 - 6.</p>
                </div>
                <button
                  onClick={() => {
                    setIsNewMaterial(true);
                    setEditingMaterial({
                      id: 'mat-' + Date.now(),
                      grade: 'Kelas 1',
                      category: 'Modul Ajar',
                      title: '',
                      summary: '',
                      author: 'Guru PJOK Pagu',
                      schoolOrigin: 'SDN Pagu 1',
                      date: '28 Oktober 2026',
                      fileSize: '3.0 MB',
                      downloadUrl: 'https://drive.google.com',
                      thumbnail: './assets/images/hero_sport_education_1793250246629.jpg',
                      downloadsCount: 15
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Perangkat Ajar</span>
                </button>
              </div>

              <div className="space-y-3">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    className={`p-4 rounded-xl border ${isAdminDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          {mat.grade}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {mat.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold mt-1">{mat.title}</h4>
                      <p className="text-[11px] text-slate-500">{mat.author} ({mat.schoolOrigin}) · {mat.fileSize}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setIsNewMaterial(false);
                          setEditingMaterial(mat);
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        title="Edit Perangkat"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(mat.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                        title="Hapus Perangkat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: KELOLA AGENDA KEGIATAN */}
          {activeTab === 'agenda' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Kelola Agenda & Jadwal Pertemuan</h2>
                  <p className="text-xs text-slate-500">Jadwal pertemuan rutin gugus dan tempat sekolah pelaksana.</p>
                </div>
                <button
                  onClick={() => {
                    setIsNewAgenda(true);
                    setEditingAgenda({
                      id: 'agn-' + Date.now(),
                      title: '',
                      category: 'Bimtek Akademik',
                      date: '10 Desember 2026',
                      time: '08.00 - 12.00 WIB',
                      venue: 'SDN Pagu 1',
                      hostSchool: 'SDN Pagu 1',
                      speaker: 'Tim Pengurus KKG',
                      dressCode: 'Kaos Olahraga Resmi',
                      status: 'Mendatang',
                      description: '',
                      registrationOpen: true
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Jadwal Agenda</span>
                </button>
              </div>

              <div className="space-y-3">
                {agenda.map((item) => {
                  const isUpcoming = item.status === 'Akan Datang' || item.status === 'Mendatang';
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border ${isAdminDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isUpcoming ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {isUpcoming ? 'Akan Datang' : 'Sudah Terlaksana'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.date} · {item.venue}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const newStatus = isUpcoming ? 'Sudah Terlaksana' : 'Akan Datang';
                            setAgenda(agenda.map(a => a.id === item.id ? { ...a, status: newStatus } : a));
                            showToast(`Status diubah menjadi: ${newStatus}`, 'success');
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                            isUpcoming ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title="Ubah Status Pelaksanaan"
                        >
                          {isUpcoming ? 'Tandai Selesai' : 'Tandai Akan Datang'}
                        </button>
                        <button
                          onClick={() => {
                            setIsNewAgenda(false);
                            setEditingAgenda(item);
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                          title="Edit Agenda"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAgenda(item.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}



          {/* TAB 11: MEDIA MANAGER (UPLOAD IMAGE & GDRIVE) */}
          {activeTab === 'media' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-8 animate-in fade-in`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">Media Manager & Dokumentasi Foto</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      Google Drive Terintegrasi
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Unggah foto baru via link Google Drive, salin link foto, atau edit foto arsip kegiatan KKG PJOK.</p>
                </div>
              </div>

              {/* Upload & Add Form with Source Tabs */}
              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-blue-600" />
                    <span>Tambah Foto Baru</span>
                  </div>

                  {/* Source Toggle */}
                  <div className="inline-flex rounded-xl p-1 bg-white/80 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setMediaSourceType('gdrive')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        mediaSourceType === 'gdrive'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <FolderUp className="w-3.5 h-3.5" />
                      <span>Link Google Drive (Disarankan)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaSourceType('url')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        mediaSourceType === 'url'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>URL / Path Langsung</span>
                    </button>
                  </div>
                </div>

                {/* GDrive Guidance Callout */}
                {mediaSourceType === 'gdrive' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                    <FolderUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed">
                      <p className="font-bold mb-0.5">Petunjuk Link Google Drive:</p>
                      <ol className="list-decimal ml-4 space-y-0.5 text-slate-700 dark:text-emerald-300">
                        <li>Buka Google Drive &gt; Klik kanan foto &gt; Pilih <strong>Bagikan (Share)</strong>.</li>
                        <li>Ubah Akses Umum menjadi: <strong>"Siapa saja yang memiliki link"</strong> (Anyone with the link).</li>
                        <li>Salin link &amp; tempel di kolom link Google Drive di bawah. Sistem otomatis mengonversi ke link foto langsung!</li>
                      </ol>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSimulateImageUpload} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Nama / Judul Foto *</label>
                      <input
                        type="text"
                        required
                        value={newMediaName}
                        onChange={(e) => setNewMediaName(e.target.value)}
                        placeholder="Contoh: Latihan Lempar Lembing"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Kategori Foto</label>
                      <select
                        value={newMediaCategory}
                        onChange={(e) => setNewMediaCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                      >
                        <option value="Hero & Banner">Hero & Banner</option>
                        <option value="Dokumentasi">Dokumentasi</option>
                        <option value="Kompetisi">Kompetisi</option>
                        <option value="Kebugaran">Kebugaran</option>
                        <option value="Guru & Pengurus">Guru & Pengurus</option>
                        <option value="Pelatihan">Pelatihan</option>
                      </select>
                    </div>

                    <div>
                      {mediaSourceType === 'gdrive' ? (
                        <>
                          <label className="block font-semibold mb-1 flex items-center justify-between">
                            <span>Link Google Drive *</span>
                            {extractGDriveFileId(gdriveInputMedia) && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓ ID Terdeteksi</span>
                            )}
                          </label>
                          <input
                            type="text"
                            required
                            value={gdriveInputMedia}
                            onChange={(e) => setGdriveInputMedia(e.target.value)}
                            placeholder="https://drive.google.com/file/d/.../view"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 font-mono text-[11px]"
                          />
                        </>
                      ) : (
                        <>
                          <label className="block font-semibold mb-1">Path / URL Gambar *</label>
                          <input
                            type="text"
                            required
                            value={newMediaUrl}
                            onChange={(e) => setNewMediaUrl(e.target.value)}
                            placeholder="https://... atau /src/assets/..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 font-mono text-[11px]"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Live Thumbnail Preview for GDrive */}
                  {mediaSourceType === 'gdrive' && gdriveInputMedia.trim() && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={convertGDriveToDirectImageUrl(gdriveInputMedia)}
                          alt="Preview GDrive"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Link Google Drive Siap Digunakan</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate font-mono">
                          Direct URL: {convertGDriveToDirectImageUrl(gdriveInputMedia)}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Pastikan foto terlihat pada kotak di kiri. Jika kosong, pastikan izin sharing Drive sudah "Siapa saja yang memiliki link".
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
                    >
                      {mediaSourceType === 'gdrive' ? (
                        <>
                          <FolderUp className="w-3.5 h-3.5" />
                          <span>Simpan Foto dari Google Drive</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Simpan ke Media Manager</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Media Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Daftar Foto & Arsip Media ({mediaList.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Klik "Edit Foto" untuk mengganti link Google Drive foto kapan saja
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mediaList.map((item) => {
                    const isGdrive = isGDriveUrl(item.url) || item.url.includes('googleusercontent.com');
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 group relative flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div className="h-40 bg-slate-900 relative overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />

                          {/* GDrive Tag */}
                          {isGdrive && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                              <FolderUp className="w-2.5 h-2.5" />
                              <span>GDrive</span>
                            </span>
                          )}

                          {/* Action overlay buttons */}
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingMedia(item)}
                              className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-blue-700 shadow-md backdrop-blur-xs transition-transform active:scale-95"
                              title="Edit Foto & Sumber GDrive"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus foto "${item.name}" dari Media Manager?`)) {
                                  deleteMediaItem(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white shadow-md backdrop-blur-xs transition-transform active:scale-95"
                              title="Hapus media"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3.5 text-xs space-y-2">
                          <div className="font-bold text-slate-800 dark:text-slate-100 truncate" title={item.name}>
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-medium">{item.category}</span>
                            <span>{item.date}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button
                              onClick={() => setEditingMedia(item)}
                              className="py-1.5 px-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[10px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center justify-center gap-1 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Foto</span>
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(item.url);
                                showToast('Link gambar disalin ke clipboard!', 'success');
                              }}
                              className="py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>Salin Link</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: SEO WEBSITE */}
          {activeTab === 'seo' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Pengaturan SEO, Meta Tags & Schema</h2>
                  <p className="text-xs text-slate-500">Optimasi mesin pencari Google untuk kata kunci KKG PJOK Pagu.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Meta Title (30 - 60 Karakter)</label>
                  <input
                    type="text"
                    value={settings.metaTitle}
                    onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Panjang saat ini: {settings.metaTitle.length} karakter</div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Meta Description (120 - 160 Karakter)</label>
                  <textarea
                    rows={3}
                    value={settings.metaDescription}
                    onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Panjang saat ini: {settings.metaDescription.length} karakter</div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Keywords Pencarian</label>
                  <input
                    type="text"
                    value={settings.metaKeywords}
                    onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Pratinjau Hasil Pencarian Google (Snippet SERP):</div>
                  <div className="text-blue-700 text-sm font-semibold truncate hover:underline cursor-pointer">
                    {settings.metaTitle}
                  </div>
                  <div className="text-emerald-700 text-[11px] font-mono">
                    https://kkgpjokpagu.id
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2">
                    {settings.metaDescription}
                  </p>
                </div>

                <button
                  onClick={() => showToast('Pengaturan SEO berhasil disimpan!', 'success')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan SEO</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 13: PENGATURAN UMUM */}
          {activeTab === 'pengaturan' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Pengaturan Warna, Logo & Kontak</h2>
                  <p className="text-xs text-slate-500">Konfigurasi identitas web, email, WhatsApp, dan tautan sosial media.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Nama Organisasi Website</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Email Resmi</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Telepon</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">WhatsApp (Format: 628xxx)</label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Alamat Sekretariat</label>
                  <textarea
                    rows={2}
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Warna Primer (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Warna Aksen Merah/Orange (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Pengaturan umum berhasil disimpan!', 'success')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Semua Pengaturan</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* EDIT MODAL: LAYANAN */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleSaveService} className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isNewService ? 'Tambah Layanan Baru' : 'Edit Layanan KKG'}
              </h3>
              <button type="button" onClick={() => setEditingService(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Judul Layanan *</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Kategori Layanan</label>
                <select
                  value={editingService.category}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Kurikulum & Modul">Kurikulum & Modul</option>
                  <option value="Pelatihan Atletik & O2SN">Pelatihan Atletik & O2SN</option>
                  <option value="Konsultasi UKS & Kebugaran">Konsultasi UKS & Kebugaran</option>
                  <option value="Pengembangan Profesi">Pengembangan Profesi</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ringkasan Singkat</label>
                <input
                  type="text"
                  value={editingService.summary}
                  onChange={(e) => setEditingService({ ...editingService, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Lengkap Layanan</label>
                <textarea
                  rows={4}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Koordinator / PIC</label>
                <input
                  type="text"
                  value={editingService.contactPerson}
                  onChange={(e) => setEditingService({ ...editingService, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Simpan Layanan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL: PROGRAM KKG */}
      {editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleSaveProgram} className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isNewProgram ? 'Tambah Program KKG Baru' : 'Edit Program KKG'}
              </h3>
              <button type="button" onClick={() => setEditingProgram(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Judul Program *</label>
                <input
                  type="text"
                  required
                  value={editingProgram.title}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={editingProgram.category}
                    onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Praktik Baik">Praktik Baik</option>
                    <option value="Bimtek & Workshop">Bimtek & Workshop</option>
                    <option value="Kompetisi O2SN">Kompetisi O2SN</option>
                    <option value="Senam & Kebugaran Massal">Senam & Kebugaran Massal</option>
                    <option value="Rapat Rutin">Rapat Rutin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editingProgram.status}
                    onChange={(e) => setEditingProgram({ ...editingProgram, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Berjalan">Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={editingProgram.date}
                    onChange={(e) => setEditingProgram({ ...editingProgram, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Waktu</label>
                  <input
                    type="text"
                    value={editingProgram.time}
                    onChange={(e) => setEditingProgram({ ...editingProgram, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Lokasi Tempat</label>
                <input
                  type="text"
                  value={editingProgram.location}
                  onChange={(e) => setEditingProgram({ ...editingProgram, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tautan Google Drive Materi</label>
                <input
                  type="text"
                  value={editingProgram.driveLink}
                  onChange={(e) => setEditingProgram({ ...editingProgram, driveLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Program</label>
                <textarea
                  rows={3}
                  value={editingProgram.description}
                  onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setEditingProgram(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100">
                Batal
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Simpan Program
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL: ARTIKEL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleSaveArticle} className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isNewArticle ? 'Tambah Berita Baru' : 'Edit Berita / Artikel'}
              </h3>
              <button type="button" onClick={() => setEditingArticle(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Praktik Baik">Praktik Baik</option>
                    <option value="Berita Prestasi">Berita Prestasi</option>
                    <option value="Sosialisasi Kurikulum">Sosialisasi Kurikulum</option>
                    <option value="Kesehatan & Gizi">Kesehatan & Gizi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Penulis</label>
                  <input
                    type="text"
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ringkasan</label>
                <input
                  type="text"
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Konten Lengkap Berita</label>
                <textarea
                  rows={6}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setEditingArticle(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100">
                Batal
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Terbitkan Berita
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL: PERANGKAT AJAR */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleSaveMaterial} className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isNewMaterial ? 'Tambah Perangkat Ajar Baru' : 'Edit Perangkat Ajar'}
              </h3>
              <button type="button" onClick={() => setEditingMaterial(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Judul Perangkat Ajar *</label>
                <input
                  type="text"
                  required
                  value={editingMaterial.title}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tingkat Kelas</label>
                  <select
                    value={editingMaterial.grade}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, grade: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                    <option value="Semua Kelas">Semua Kelas</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jenis Perangkat</label>
                  <select
                    value={editingMaterial.category}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Modul Ajar">Modul Ajar</option>
                    <option value="ATP & CP">ATP & CP</option>
                    <option value="Instrumen Tes Kebugaran">Instrumen Tes Kebugaran</option>
                    <option value="Modul P5 PJOK">Modul P5 PJOK</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Penyusun</label>
                  <input
                    type="text"
                    value={editingMaterial.author}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Asal Sekolah</label>
                  <input
                    type="text"
                    value={editingMaterial.schoolOrigin}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, schoolOrigin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tautan Unduh (Google Drive / File)</label>
                <input
                  type="text"
                  value={editingMaterial.downloadUrl}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, downloadUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Ringkasan Dokumen</label>
                <textarea
                  rows={3}
                  value={editingMaterial.summary}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setEditingMaterial(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100">
                Batal
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Simpan Perangkat Ajar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL: AGENDA */}
      {editingAgenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleSaveAgenda} className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isNewAgenda ? 'Tambah Agenda Baru' : 'Edit Agenda Pertemuan'}
              </h3>
              <button type="button" onClick={() => setEditingAgenda(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nama Agenda *</label>
                <input
                  type="text"
                  required
                  value={editingAgenda.title}
                  onChange={(e) => setEditingAgenda({ ...editingAgenda, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Status Pelaksanaan</label>
                  <select
                    value={editingAgenda.status}
                    onChange={(e) => setEditingAgenda({ ...editingAgenda, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sudah Terlaksana">Sudah Terlaksana</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kategori Agenda</label>
                  <input
                    type="text"
                    value={editingAgenda.category}
                    onChange={(e) => setEditingAgenda({ ...editingAgenda, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={editingAgenda.date}
                    onChange={(e) => setEditingAgenda({ ...editingAgenda, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Waktu</label>
                  <input
                    type="text"
                    value={editingAgenda.time}
                    onChange={(e) => setEditingAgenda({ ...editingAgenda, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Lokasi Tempat</label>
                  <input
                    type="text"
                    value={editingAgenda.venue}
                    onChange={(e) => setEditingAgenda({ ...editingAgenda, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sekolah Penyelenggara</label>
                  <input
                    type="text"
                    value={editingAgenda.hostSchool}
                    onChange={(e) => setEditingAgenda({ ...editingAgenda, hostSchool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Narasumber / Speaker</label>
                <input
                  type="text"
                  value={editingAgenda.speaker}
                  onChange={(e) => setEditingAgenda({ ...editingAgenda, speaker: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setEditingAgenda(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100">
                Batal
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Simpan Agenda
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL: FOTO & MEDIA (GOOGLE DRIVE) */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleUpdateMedia}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Edit Foto & Sumber Google Drive
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Judul / Nama Foto *
                </label>
                <input
                  type="text"
                  required
                  value={editingMedia.name}
                  onChange={(e) => setEditingMedia({ ...editingMedia, name: e.target.value })}
                  placeholder="Contoh: Dokumentasi Senam Kesegaran Jasmani"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Kategori Foto
                </label>
                <select
                  value={editingMedia.category}
                  onChange={(e) => setEditingMedia({ ...editingMedia, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Hero & Banner">Hero & Banner</option>
                  <option value="Dokumentasi">Dokumentasi</option>
                  <option value="Kompetisi">Kompetisi</option>
                  <option value="Kebugaran">Kebugaran</option>
                  <option value="Guru & Pengurus">Guru & Pengurus</option>
                  <option value="Pelatihan">Pelatihan</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Link Foto / Link Google Drive *
                  </label>
                  {extractGDriveFileId(editingMedia.url) && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ID GDrive Terdeteksi
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={editingMedia.url}
                  onChange={(e) => setEditingMedia({ ...editingMedia, url: e.target.value })}
                  placeholder="Tempel link Google Drive atau URL gambar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-mono text-[11px] focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-[10px] text-slate-400">
                  Bisa tempel link Google Drive apa pun (contoh: <code className="text-blue-500">drive.google.com/file/d/.../view</code>). Sistem otomatis mengonversinya ke URL gambar langsung.
                </p>
              </div>

              {/* Live Image Preview */}
              {editingMedia.url && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-between">
                    <span>Pratinjau Foto Langsung:</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isGDriveUrl(editingMedia.url) || editingMedia.url.includes('googleusercontent.com') ? 'Google Drive Source' : 'Web URL'}
                    </span>
                  </div>
                  <div className="h-44 w-full rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <img
                      src={convertGDriveToDirectImageUrl(editingMedia.url)}
                      alt="Preview Foto"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                    Jika foto tidak muncul, pastikan pengaturan berbagi di Google Drive adalah "Siapa saja yang memiliki link".
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Foto</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL: PENGURUS & ANGGOTA (TEACHER PROFILE) */}
      <EditTeacherModal
        isOpen={!!editingTeacher || isNewTeacher}
        onClose={() => {
          setEditingTeacher(null);
          setIsNewTeacher(false);
        }}
        teacher={editingTeacher}
        isNew={isNewTeacher}
        onSave={handleSaveTeacher}
        onDelete={handleDeleteTeacher}
      />

    </div>
  );
};
