import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus, Eye, Edit, XCircle, Calendar, Users } from "lucide-react";

export default function ManageJobsPage() {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      status: "Aktif",
      isTrending: true,
      applicants: 45,
      date: "2 hari lalu"
    },
    {
      id: 2,
      title: "UI/UX Designer",
      status: "Aktif",
      isTrending: false,
      applicants: 32,
      date: "5 hari lalu"
    },
    {
      id: 3,
      title: "Data Analyst",
      status: "Ditutup",
      isTrending: false,
      applicants: 28,
      date: "1 minggu lalu"
    },
    {
      id: 4,
      title: "Backend Engineer",
      status: "Aktif",
      isTrending: true,
      applicants: 38,
      date: "3 hari lalu"
    },
    {
      id: 5,
      title: "Product Manager",
      status: "Aktif",
      isTrending: true,
      applicants: 52,
      date: "1 hari lalu"
    },
    {
      id: 6,
      title: "Mobile Developer",
      status: "Aktif",
      isTrending: false,
      applicants: 24,
      date: "4 hari lalu"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Kelola Lowongan</h1>
              <p className="text-muted-foreground text-lg">
                Manage semua lowongan pekerjaan Anda di sini
              </p>
            </div>
            <Link
              to="/perusahaan/tambah-lowongan"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--coral)] text-white rounded-2xl font-semibold hover:bg-[var(--coral-light)] transition-all hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Tambah Lowongan
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--input-background)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Judul Lowongan</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Pelamar</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-[var(--input-background)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{job.title}</h3>
                          {job.isTrending && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-[var(--yellow-light)] text-[var(--coral)] rounded-full text-xs font-semibold">
                              🔥
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === "Aktif"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{job.applicants} pelamar</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{job.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/perusahaan/lowongan/${job.id}/pelamar`}
                            className="p-2 hover:bg-blue-50 rounded-xl transition-colors group"
                            title="Lihat pelamar"
                          >
                            <Eye className="w-5 h-5 text-muted-foreground group-hover:text-blue-600" />
                          </Link>
                          <button
                            className="p-2 hover:bg-[var(--yellow-light)] rounded-xl transition-colors group"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5 text-muted-foreground group-hover:text-[var(--coral)]" />
                          </button>
                          <button
                            className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
                            title="Tutup lowongan"
                          >
                            <XCircle className="w-5 h-5 text-muted-foreground group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {jobs.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Belum ada lowongan</p>
                <Link
                  to="/perusahaan/tambah-lowongan"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--coral)] text-white rounded-2xl font-semibold hover:bg-[var(--coral-light)] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Lowongan Pertama
                </Link>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Menampilkan {jobs.length} lowongan
            </p>
            <Link
              to="/perusahaan/dashboard"
              className="px-6 py-3 border-2 border-border rounded-2xl font-medium hover:border-[var(--coral)] transition-colors"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
