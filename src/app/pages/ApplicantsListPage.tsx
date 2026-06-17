import { useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Eye, User, Calendar, Filter } from "lucide-react";

export default function ApplicantsListPage() {
  const { id } = useParams();
  const [filter, setFilter] = useState("Semua");

  const applicants = [
    {
      id: 1,
      nama: "Budi Santoso",
      foto: "👨",
      posisi: "Senior Frontend Developer",
      status: "Pending",
      tanggal: "2 hari lalu"
    },
    {
      id: 2,
      nama: "Siti Rahayu",
      foto: "👩",
      posisi: "Senior Frontend Developer",
      status: "Diterima",
      tanggal: "3 hari lalu"
    },
    {
      id: 3,
      nama: "Ahmad Yani",
      foto: "👨",
      posisi: "Senior Frontend Developer",
      status: "Pending",
      tanggal: "4 hari lalu"
    },
    {
      id: 4,
      nama: "Dewi Lestari",
      foto: "👩",
      posisi: "Senior Frontend Developer",
      status: "Ditolak",
      tanggal: "5 hari lalu"
    },
    {
      id: 5,
      nama: "Joko Widodo",
      foto: "👨",
      posisi: "Senior Frontend Developer",
      status: "Pending",
      tanggal: "1 minggu lalu"
    },
  ];

  const filteredApplicants =
    filter === "Semua"
      ? applicants
      : applicants.filter((app) => app.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Diterima":
        return "bg-green-100 text-green-700";
      case "Ditolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              to="/perusahaan/kelola-lowongan"
              className="text-[var(--coral)] hover:underline mb-2 inline-block"
            >
              ← Kembali ke Kelola Lowongan
            </Link>
            <h1 className="text-4xl font-bold mb-2">Daftar Pelamar</h1>
            <p className="text-muted-foreground text-lg">
              Senior Frontend Developer - {applicants.length} pelamar
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Semua Pelamar</h2>

              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <div className="flex gap-2">
                  {["Semua", "Pending", "Diterima", "Ditolak"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        filter === status
                          ? "bg-[var(--coral)] text-white"
                          : "bg-[var(--input-background)] text-muted-foreground hover:bg-[var(--yellow-light)]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-[var(--coral)] transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center text-3xl flex-shrink-0">
                    {applicant.foto}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{applicant.nama}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          applicant.status
                        )}`}
                      >
                        {applicant.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Melamar sebagai {applicant.posisi}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {applicant.tanggal}
                      </div>
                    </div>

                    <Link
                      to={`/perusahaan/pelamar/${applicant.id}`}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[var(--coral)] text-white rounded-2xl font-medium hover:bg-[var(--coral-light)] transition-all hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}

              {filteredApplicants.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Tidak ada pelamar dengan filter "{filter}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
