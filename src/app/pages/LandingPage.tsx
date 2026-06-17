import { useState } from "react";
import { Link } from "react-router";
import { Search, TrendingUp, Briefcase, Users, Building2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingTags = [
    "Data Engineer",
    "Software Engineer",
    "UI/UX Designer",
    "Management",
    "Product Manager",
    "Marketing"
  ];

  const featuredJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Indonesia",
      salary: "15 - 25 jt",
      type: "Full-Time",
      logo: "🚀"
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Creative Studio",
      salary: "10 - 18 jt",
      type: "Full-Time",
      logo: "🎨"
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "Analytics Pro",
      salary: "12 - 20 jt",
      type: "Full-Time",
      logo: "📊"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Temukan pekerjaan impian anda di{" "}
            <span className="text-[var(--coral)]">KerjoLe!</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Platform terpercaya untuk menghubungkan talenta terbaik dengan perusahaan impian
          </p>

          <div className="relative max-w-3xl mx-auto">
            <div className="relative flex items-center bg-white rounded-3xl shadow-2xl p-2 border-2 border-border hover:border-[var(--coral)] transition-all">
              <Search className="absolute left-6 w-6 h-6 text-muted-foreground" />
              <input
                type="text"
                placeholder="Jenis pekerjaan / perusahaan yang anda cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-14 py-4 bg-transparent outline-none text-lg"
              />
              <Link
                to="/lowongan"
                className="px-8 py-4 bg-[var(--coral)] text-white rounded-2xl font-semibold hover:bg-[var(--coral-light)] transition-all hover:shadow-lg"
              >
                Cari
              </Link>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <TrendingUp className="w-5 h-5 text-[var(--coral)]" />
            <span className="text-sm text-muted-foreground">Trending:</span>
            {trendingTags.map((tag) => (
              <Link
                key={tag}
                to="/lowongan"
                className="px-4 py-2 bg-white rounded-full text-sm hover:bg-[var(--coral)] hover:text-white transition-all shadow-sm border border-border"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ribuan Lowongan</h3>
              <p className="text-muted-foreground">
                Akses ribuan lowongan pekerjaan dari perusahaan terpercaya di seluruh Indonesia
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--peach)] to-[var(--pink)] flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proses Mudah</h3>
              <p className="text-muted-foreground">
                Lamar pekerjaan dengan mudah hanya dalam beberapa klik. Upload CV sekali untuk semua lamaran
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--pink)] to-[var(--coral)] flex items-center justify-center mb-4">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Perusahaan Terpercaya</h3>
              <p className="text-muted-foreground">
                Semua perusahaan telah terverifikasi untuk memastikan keamanan dan kenyamanan Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Lowongan Pilihan</h2>
            <p className="text-muted-foreground text-lg">
              Posisi terbaru dari perusahaan terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/lowongan/${job.id}`}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-border"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center text-2xl">
                    {job.logo}
                  </div>
                  <span className="px-3 py-1 bg-[var(--yellow-light)] text-[var(--coral)] rounded-full text-sm font-medium">
                    {job.type}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{job.company}</p>
                <p className="text-[var(--coral)] font-semibold">
                  Gaji: {job.salary}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/lowongan"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--coral)] text-white rounded-2xl font-semibold hover:bg-[var(--coral-light)] transition-all hover:shadow-lg"
            >
              Lihat Semua Lowongan
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
