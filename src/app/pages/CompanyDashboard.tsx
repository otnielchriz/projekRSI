import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Briefcase, Users, TrendingUp, Plus, Eye, Edit, XCircle } from "lucide-react";

export default function CompanyDashboard() {
  const stats = {
    totalLowongan: 12,
    totalPelamar: 156,
    lowonganAktif: 8,
    trending: 3
  };

  const recentJobs = [
    { id: 1, title: "Senior Frontend Developer", applicants: 45, status: "Aktif", isTrending: true },
    { id: 2, title: "UI/UX Designer", applicants: 32, status: "Aktif", isTrending: false },
    { id: 3, title: "Data Analyst", applicants: 28, status: "Ditutup", isTrending: false },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard Perusahaan</h1>
              <p className="text-muted-foreground text-lg">Selamat datang, TechCorp Indonesia!</p>
            </div>
            <Link
              to="/perusahaan/tambah-lowongan"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--coral)] text-white rounded-2xl font-semibold hover:bg-[var(--coral-light)] transition-all hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Tambah Lowongan
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Lowongan</p>
                  <p className="text-3xl font-bold">{stats.totalLowongan}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pelamar</p>
                  <p className="text-3xl font-bold">{stats.totalPelamar}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lowongan Aktif</p>
                  <p className="text-3xl font-bold">{stats.lowonganAktif}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--peach)] to-[var(--pink)] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trending</p>
                  <p className="text-3xl font-bold">{stats.trending}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-border mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Lowongan Terbaru</h2>
              <Link
                to="/perusahaan/kelola-lowongan"
                className="text-[var(--coral)] hover:underline font-medium"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-[var(--coral)] transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      {job.isTrending && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-[var(--yellow-light)] text-[var(--coral)] rounded-full text-xs font-semibold">
                          🔥 Trending
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === "Aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.applicants} pelamar
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/perusahaan/lowongan/${job.id}/pelamar`}
                      className="p-2 hover:bg-[var(--input-background)] rounded-xl transition-colors"
                      title="Lihat pelamar"
                    >
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <button
                      className="p-2 hover:bg-[var(--input-background)] rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button
                      className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                      title="Tutup lowongan"
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-4">Statistik Pelamar</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hari ini</span>
                  <span className="font-semibold">12 pelamar</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Minggu ini</span>
                  <span className="font-semibold">48 pelamar</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bulan ini</span>
                  <span className="font-semibold">156 pelamar</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/perusahaan/tambah-lowongan"
                  className="block w-full px-4 py-3 bg-[var(--coral)] text-white rounded-2xl font-medium hover:bg-[var(--coral-light)] transition-colors text-center"
                >
                  Tambah Lowongan Baru
                </Link>
                <Link
                  to="/perusahaan/kelola-lowongan"
                  className="block w-full px-4 py-3 border-2 border-border rounded-2xl font-medium hover:border-[var(--coral)] transition-colors text-center"
                >
                  Kelola Lowongan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
