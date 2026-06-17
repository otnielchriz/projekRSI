import { useState } from "react";
import { useParams, Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Briefcase, Calendar, Building2, CheckCircle2 } from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams();
  const [agreed, setAgreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleApply = () => {
    if (agreed) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-border mb-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center text-4xl flex-shrink-0">
                🚀
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Senior Frontend Developer</h1>
                    <p className="text-xl text-muted-foreground">TechCorp Indonesia</p>
                  </div>
                  <span className="px-4 py-2 bg-[var(--yellow-light)] text-[var(--coral)] rounded-2xl text-sm font-semibold whitespace-nowrap">
                    Full-Time
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-[var(--coral)]" />
                    <span>Jakarta</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Briefcase className="w-5 h-5 text-[var(--coral)]" />
                    <span>15 - 25 jt/bulan</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-5 h-5 text-[var(--coral)]" />
                    <span>Posted 2 hari lalu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-border mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-[var(--coral)]" />
              <h2 className="text-2xl font-bold">Deskripsi Pekerjaan</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                Kami mencari Frontend Developer berpengalaman untuk bergabung dengan tim engineering kami.
                Anda akan bertanggung jawab mengembangkan aplikasi web modern yang user-friendly dan performant.
              </p>
              <p>
                Posisi ini menawarkan kesempatan untuk bekerja dengan teknologi terkini dan tim yang passionate
                dalam membangun produk digital yang berdampak bagi jutaan pengguna.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Kualifikasi</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--coral)] mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Minimal 3 tahun pengalaman sebagai Frontend Developer</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--coral)] mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Menguasai React.js, TypeScript, dan Tailwind CSS</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--coral)] mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Familiar dengan state management (Redux, Zustand)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--coral)] mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Pemahaman yang baik tentang responsive design dan web performance</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--coral)] mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Mampu bekerja dalam tim dan komunikasi yang baik</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6">Lamar Posisi Ini</h2>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-border text-[var(--coral)] focus:ring-[var(--coral)] mt-0.5"
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Saya setuju dengan syarat dan ketentuan yang berlaku serta memberikan izin kepada perusahaan
                  untuk mengakses data pribadi saya dalam proses rekrutmen.
                </span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApply}
                disabled={!agreed}
                className="flex-1 px-8 py-4 bg-[var(--coral)] text-white rounded-2xl font-semibold hover:bg-[var(--coral-light)] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--coral)] disabled:hover:shadow-none"
              >
                Lamar Sekarang
              </button>
              <Link
                to="/lowongan"
                className="px-8 py-4 bg-white border-2 border-border text-foreground rounded-2xl font-semibold hover:border-[var(--coral)] transition-all"
              >
                Kembali
              </Link>
            </div>

            {showSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                <span>Lamaran berhasil dikirim! Kami akan menghubungi Anda segera.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
