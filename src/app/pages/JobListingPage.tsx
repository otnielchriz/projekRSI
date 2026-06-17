import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Briefcase } from "lucide-react";

export default function JobListingPage() {
  const jobs = [
    { id: 1, title: "Senior Frontend Developer", company: "TechCorp Indonesia", salary: "15 - 25 jt", type: "Full-Time", location: "Jakarta", logo: "🚀" },
    { id: 2, title: "UI/UX Designer", company: "Creative Studio", salary: "10 - 18 jt", type: "Full-Time", location: "Bandung", logo: "🎨" },
    { id: 3, title: "Data Analyst", company: "Analytics Pro", salary: "12 - 20 jt", type: "Full-Time", location: "Surabaya", logo: "📊" },
    { id: 4, title: "Backend Engineer", company: "Cloud Systems", salary: "18 - 30 jt", type: "Full-Time", location: "Jakarta", logo: "⚡" },
    { id: 5, title: "Product Manager", company: "StartUp Hub", salary: "20 - 35 jt", type: "Full-Time", location: "Jakarta", logo: "🎯" },
    { id: 6, title: "Mobile Developer", company: "App Factory", salary: "14 - 22 jt", type: "Full-Time", location: "Yogyakarta", logo: "📱" },
    { id: 7, title: "DevOps Engineer", company: "Infrastructure Co", salary: "16 - 28 jt", type: "Full-Time", location: "Jakarta", logo: "🔧" },
    { id: 8, title: "Content Writer", company: "Media Group", salary: "8 - 15 jt", type: "Full-Time", location: "Bali", logo: "✍️" },
    { id: 9, title: "Marketing Manager", company: "Brand Agency", salary: "15 - 25 jt", type: "Full-Time", location: "Jakarta", logo: "📈" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Lowongan tersedia</h1>
            <p className="text-muted-foreground text-lg">
              {jobs.length} posisi menunggu untuk Anda
            </p>
          </div>

          <div className="mb-8 flex gap-4 flex-wrap justify-center">
            <select className="px-4 py-3 rounded-2xl bg-white border border-border shadow-sm hover:border-[var(--coral)] transition-colors outline-none">
              <option>Semua Lokasi</option>
              <option>Jakarta</option>
              <option>Bandung</option>
              <option>Surabaya</option>
              <option>Yogyakarta</option>
            </select>
            <select className="px-4 py-3 rounded-2xl bg-white border border-border shadow-sm hover:border-[var(--coral)] transition-colors outline-none">
              <option>Semua Gaji</option>
              <option>5 - 10 jt</option>
              <option>10 - 20 jt</option>
              <option>20 - 30 jt</option>
              <option>30+ jt</option>
            </select>
            <select className="px-4 py-3 rounded-2xl bg-white border border-border shadow-sm hover:border-[var(--coral)] transition-colors outline-none">
              <option>Tipe Pekerjaan</option>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Remote</option>
              <option>Freelance</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/lowongan/${job.id}`}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-border group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {job.logo}
                  </div>
                  <span className="px-3 py-1.5 bg-[var(--yellow-light)] text-[var(--coral)] rounded-full text-xs font-semibold">
                    {job.type}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--coral)] transition-colors">
                  {job.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">{job.company}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-[var(--coral)] font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Gaji: {job.salary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
