import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Briefcase, MapPin, DollarSign, FileText, Save, Send } from "lucide-react";

export default function AddJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    kualifikasi: "",
    lokasi: "",
    gaji: "",
    tipeKerja: "Full-Time"
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/perusahaan/kelola-lowongan");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Tambah Lowongan Baru</h1>
            <p className="text-muted-foreground text-lg">
              Buat lowongan pekerjaan untuk menarik kandidat terbaik
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
            <form onSubmit={handlePublish} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Judul Pekerjaan
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.judul}
                    onChange={(e) =>
                      setFormData({ ...formData, judul: e.target.value })
                    }
                    placeholder="Contoh: Senior Frontend Developer"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--input-background)] border border-border focus:border-[var(--coral)] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi Pekerjaan
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    placeholder="Jelaskan detail pekerjaan, tanggung jawab, dan benefit..."
                    rows={6}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--input-background)] border border-border focus:border-[var(--coral)] outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kualifikasi
                </label>
                <textarea
                  value={formData.kualifikasi}
                  onChange={(e) =>
                    setFormData({ ...formData, kualifikasi: e.target.value })
                  }
                  placeholder="Tuliskan kualifikasi yang dibutuhkan (satu per baris)"
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--input-background)] border border-border focus:border-[var(--coral)] outline-none transition-colors resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: Pisahkan setiap kualifikasi dengan baris baru
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Lokasi</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.lokasi}
                      onChange={(e) =>
                        setFormData({ ...formData, lokasi: e.target.value })
                      }
                      placeholder="Contoh: Jakarta"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--input-background)] border border-border focus:border-[var(--coral)] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gaji (per bulan)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.gaji}
                      onChange={(e) =>
                        setFormData({ ...formData, gaji: e.target.value })
                      }
                      placeholder="Contoh: 15 - 25 jt"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--input-background)] border border-border focus:border-[var(--coral)] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipe Pekerjaan
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Full-Time", "Part-Time", "Remote", "Freelance"].map((type) => (
                    <label
                      key={type}
                      className={`flex items-center justify-center px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.tipeKerja === type
                          ? "border-[var(--coral)] bg-[var(--yellow-light)] text-[var(--coral)] font-semibold"
                          : "border-border bg-white hover:border-[var(--coral)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipeKerja"
                        value={type}
                        checked={formData.tipeKerja === type}
                        onChange={(e) =>
                          setFormData({ ...formData, tipeKerja: e.target.value })
                        }
                        className="sr-only"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border flex gap-4">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-border rounded-2xl font-medium hover:border-[var(--coral)] transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Simpan Draft
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--coral)] text-white rounded-2xl font-semibold hover:bg-[var(--coral-light)] transition-all hover:shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  Publish Lowongan
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/perusahaan/kelola-lowongan"
              className="text-muted-foreground hover:text-[var(--coral)] transition-colors"
            >
              ← Kembali ke Kelola Lowongan
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
