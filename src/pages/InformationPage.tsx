import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Tag, 
  Bookmark,
  ChevronRight
} from 'lucide-react';

export const InformationPage: React.FC = () => {
  const { articles, selectedItemId, setSelectedItemId, showToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedArticle = articles.find(a => a.id === selectedItemId);

  const categories = [
    'Semua',
    'Praktik Baik',
    'Sosialisasi Kurikulum',
    'Kesehatan & Gizi'
  ];

  const filteredArticles = articles.filter(art => {
    const matchesCategory = activeCategory === 'Semua' || 
                            art.category === activeCategory ||
                            (activeCategory === 'Praktik Baik' && (art.category === 'Praktik Baik' || art.category === 'Berita Prestasi'));
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Tautan artikel berhasil disalin ke clipboard!', 'success');
  };

  // DETAIL ARTIKEL VIEW
  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumb 
          items={[
            { label: 'Informasi & Berita', page: 'informasi' },
            { label: selectedArticle.title, active: true }
          ]} 
        />

        <div className="space-y-4">
          <button
            onClick={() => setSelectedItemId(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Informasi</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="px-2.5 py-0.5 rounded-md font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {selectedArticle.category}
            </span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedArticle.date}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedArticle.readTime}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {selectedArticle.title}
          </h1>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <User className="w-4 h-4 text-blue-600" />
              <span>Penulis: {selectedArticle.author}</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Berita</span>
            </button>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
          <img
            src={selectedArticle.thumbnail}
            alt={selectedArticle.title}
            className="w-full h-80 sm:h-96 object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content Prose */}
        <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
          {selectedArticle.content}
        </div>

        {/* Tags */}
        <div className="flex items-center flex-wrap gap-2 pt-4">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Topik:</span>
          </span>
          {selectedArticle.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>

      </div>
    );
  }

  // LISTING VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Informasi & Berita', active: true }]} />

      {/* Hero Banner Informasi */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            Papan Informasi Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Berita, Prestasi & Pengumuman KKG
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Pusat publikasi hasil kejuaraan O2SN, sosialisasi modul ajar kurikulum merdeka, dan panduan kesehatan anak sekolah dasar.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-slate-100/80 rounded-2xl border border-slate-200">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita atau pengumuman..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="h-48 relative overflow-hidden bg-slate-900">
                <img
                  src={art.thumbnail}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-600 text-white">
                  {art.category}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>{art.date}</span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>

                <h2
                  onClick={() => setSelectedItemId(art.id)}
                  className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {art.title}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                Oleh: {art.author}
              </span>
              <button
                onClick={() => setSelectedItemId(art.id)}
                className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900"
              >
                <span>Baca Lengkap</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
