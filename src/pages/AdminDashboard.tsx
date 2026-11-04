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
  School
} from 'lucide-react';
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
    mediaList, addMediaItem, deleteMediaItem,
    isAdminDarkMode, setIsAdminDarkMode,
    isAdminLoggedIn, loginAdmin, logoutAdmin,
    resetAllData, exportDataJSON, importDataJSON,
    showToast
  } = useApp();

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
    if (!newMediaName || !newMediaUrl) {
      showToast('Harap masukkan judul gambar dan URL gambar', 'error');
      return;
    }
    addMediaItem({
      name: newMediaName,
      url: newMediaUrl,
      category: newMediaCategory
    });
    setNewMediaName('');
    setNewMediaUrl('');
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
    if (isNewProgram) {
      setPrograms(prev => [editingProgram, ...prev]);
      showToast('Program kerja baru berhasil ditambahkan!', 'success');
    } else {
      setPrograms(prev => prev.map(p => p.id === editingProgram.id ? editingProgram : p));
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
    if (isNewArticle) {
      setArticles(prev => [editingArticle, ...prev]);
      showToast('Artikel baru berhasil diterbitkan!', 'success');
    } else {
      setArticles(prev => prev.map(a => a.id === editingArticle.id ? editingArticle : a));
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
    if (isNewMaterial) {
      setMaterials(prev => [editingMaterial, ...prev]);
      showToast('Perangkat ajar baru berhasil diunggah!', 'success');
    } else {
      setMaterials(prev => prev.map(m => m.id === editingMaterial.id ? editingMaterial : m));
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
    { id: 'media', label: 'Media Manager (Upload)', icon: <Layers className="w-4 h-4" /> },
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

          {/* TAB 2: KELOLA HERO */}
          {activeTab === 'hero' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Kelola Hero Banner Beranda</h2>
                  <p className="text-xs text-slate-500">Sesuaikan badge, judul besar, dan deskripsi utama.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
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
                    rows={4}
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

                <div>
                  <label className="block font-semibold mb-1">Path / URL Gambar Hero</label>
                  <input
                    type="text"
                    value={hero.heroImage}
                    onChange={(e) => setHero({ ...hero, heroImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <button
                  onClick={() => showToast('Pengaturan Hero berhasil disimpan!', 'success')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Hero</span>
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



          {/* TAB 11: MEDIA MANAGER (UPLOAD IMAGE) */}
          {activeTab === 'media' && (
            <div className={`p-6 sm:p-8 rounded-2xl border ${isAdminDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-8 animate-in fade-in`}>
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                <div>
                  <h2 className="text-lg font-bold">Media Manager & Dokumentasi Foto</h2>
                  <p className="text-xs text-slate-500">Unggah foto baru atau kelola arsip gambar kegiatan KKG PJOK.</p>
                </div>
              </div>

              {/* Upload Form Simulator */}
              <form onSubmit={handleSimulateImageUpload} className="p-5 rounded-2xl bg-blue-50/60 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 space-y-4 text-xs">
                <div className="font-bold text-sm text-blue-900 dark:text-blue-300">
                  Tambah / Upload Foto Baru
                </div>

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
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Path / URL Gambar *</label>
                    <input
                      type="text"
                      required
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      placeholder="/src/assets/images/... atau URL"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Simpan ke Media Manager</span>
                  </button>
                </div>
              </form>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 group relative flex flex-col justify-between"
                  >
                    <div className="h-32 bg-slate-900 relative">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => deleteMediaItem(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3 text-xs space-y-1">
                      <div className="font-bold truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{item.category}</span>
                        <span>{item.date}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(item.url);
                          showToast('Path gambar disalin ke clipboard!', 'success');
                        }}
                        className="w-full mt-1 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                      >
                        Salin Path Gambar
                      </button>
                    </div>
                  </div>
                ))}
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
