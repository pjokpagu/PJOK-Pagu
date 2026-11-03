import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Harap isi nama, email, dan pesan Anda', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Pesan Anda berhasil dikirimkan ke Sekretariat KKG PJOK Pagu!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Kontak & Sekretariat', active: true }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
          Layanan Komunikasi Guru
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Hubungi Pengurus KKG PJOK SD Pagu
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Kami siap membantu konsultasi kurikulum merdeka, modul ajar PJOK, pendaftaran atlet O2SN, dan kolaborasi program kebugaran sekolah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Kolom Kiri: Contact Details & Info Card */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900">
              Sekretariat KKG PJOK Kecamatan Pagu
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Alamat Kantor Sekretariat</div>
                  <div className="text-slate-600 leading-relaxed mt-0.5">{settings.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Email Resmi KKG</div>
                  <div className="text-slate-600 mt-0.5">{settings.email}</div>
                  <div className="text-[11px] text-slate-400">Respon dalam 1x24 jam kerja</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Telepon & WhatsApp</div>
                  <div className="text-slate-600 mt-0.5">{settings.phone}</div>
                  <div className="text-[11px] text-slate-400">Pengurus Harian KKG</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Jam Layanan Konsultasi</div>
                  <div className="text-slate-600 mt-0.5">{settings.workingHours}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Halo%20Sekretariat%20KKG%20PJOK%20SD%20Kecamatan%20Pagu`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Langsung via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Simulation Box for Pagu, Kediri */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Peta Lokasi Wilayah Pagu</span>
              <span className="text-slate-500 font-mono">Kediri, Jawa Timur</span>
            </div>
            
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44 flex flex-col justify-center items-center text-center p-4">
              <MapPin className="w-8 h-8 text-rose-600 mb-2 animate-bounce" />
              <div className="text-xs font-bold text-slate-800">
                SDN Pagu 1 (Pusat Kegiatan Guru)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Jl. Raya Pagu, Pagu, Kec. Pagu, Kabupaten Kediri
              </div>
              <a
                href="https://maps.google.com/?q=SDN+Pagu+1+Kediri"
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-[11px] font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Formulir Pesan */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                Kirim Pesan atau Permohonan Modul
              </h2>
              <p className="text-xs text-slate-500">
                Silakan tuliskan keperluan Anda, tim pengurus KKG akan segera menindaklanjuti.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Pesan Anda Telah Terkirim!</h3>
                <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
                  Terima kasih <strong>{name}</strong>. Tim pengurus KKG PJOK SD Kecamatan Pagu telah menerima pesan Anda dan akan merespon melalui email <strong>{email}</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@sekolah.sch.id"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Asal Sekolah / Instansi
                    </label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Contoh: SDN Sitimerto"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Subjek Permohonan / Topik
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Misal: Permohonan Modul Ajar Voli"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Isi Pesan atau Pertanyaan Lengkap *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pesan, saran, atau pertanyaan Anda kepada dewan pengurus KKG PJOK Pagu..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition-all shadow-md shadow-blue-600/20 inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirimkan Pesan ke KKG PJOK Pagu</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
