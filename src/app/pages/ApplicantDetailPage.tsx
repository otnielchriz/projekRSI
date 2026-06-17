import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  CreditCard,
  CheckCircle2,
  XCircle,
  Download
} from "lucide-react";

export default function ApplicantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);

  const applicant = {
    id: 1,
    nama: "Budi Santoso",
    foto: "👨",
    email: "budi.santoso@email.com",
    noHp: "081234567890",
    alamat: "Jl. Sudirman No. 123, Jakarta Selatan",
    pendidikan: "S1 Teknik Informatika",
    status: "Pending",
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Node.js", "Git"],
    pengalaman: [
      {
        posisi: "Frontend Developer",
        perusahaan: "Tech Startup",
        periode: "2021 - Sekarang"
      },
      {
        posisi: "Junior Developer",
        perusahaan: "Digital Agency",
        periode: "2019 - 2021"
      }
    ]
  };

  const handleAction = (type: "accept" | "reject") => {
    setActionType(type);
    setShowModal(true);
  };

  const confirmAction = () => {
    setShowModal(false);
    navigate("/perusahaan/lowongan/1/pelamar");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              to="/perusahaan/lowongan/1/pelamar"
              className="text-[var(--coral)] hover:underline mb-2 inline-block"
            >
              ← Kembali ke Daftar Pelamar
            </Link>
            <h1 className="text-4xl font-bold mb-2">Detail Pelamar</h1>
            <p className="text-muted-foreground text-lg">
              Informasi lengkap kandidat
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-border mb-6">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center text-5xl flex-shrink-0">
                {applicant.foto}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{applicant.nama}</h2>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[var(--coral)]" />
                    {applicant.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[var(--coral)]" />
                    {applicant.noHp}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[var(--coral)]" />
                    {applicant.alamat}
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[var(--coral)]" />
                    {applicant.pendidikan}
                  </div>
                </div>
              </div>

              <span
                className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
                  applicant.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : applicant.status === "Diterima"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {applicant.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--coral)]" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-[var(--yellow-light)] text-[var(--coral)] rounded-xl text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--coral)]" />
                  Pengalaman
                </h3>
                <div className="space-y-3">
                  {applicant.pengalaman.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-[var(--coral)] pl-4">
                      <h4 className="font-semibold">{exp.posisi}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exp.perusahaan}
                      </p>
                      <p className="text-xs text-muted-foreground">{exp.periode}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-xl font-semibold mb-4">Dokumen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center gap-3 p-4 rounded-2xl border-2 border-border hover:border-[var(--coral)] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[var(--yellow-light)] flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[var(--coral)]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold">KTP</h4>
                    <p className="text-sm text-muted-foreground">ktp_budi.pdf</p>
                  </div>
                  <Download className="w-5 h-5 text-muted-foreground" />
                </button>

                <button className="flex items-center gap-3 p-4 rounded-2xl border-2 border-border hover:border-[var(--coral)] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[var(--yellow-light)] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[var(--coral)]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold">CV</h4>
                    <p className="text-sm text-muted-foreground">cv_budi.pdf</p>
                  </div>
                  <Download className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {applicant.status === "Pending" && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-6">Action</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAction("accept")}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-all hover:shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Terima Pelamar
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-all hover:shadow-lg"
                >
                  <XCircle className="w-5 h-5" />
                  Tolak Pelamar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              {actionType === "accept" ? "Terima Pelamar?" : "Tolak Pelamar?"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {actionType === "accept"
                ? "Anda yakin ingin menerima pelamar ini? Notifikasi akan dikirim ke email pelamar."
                : "Anda yakin ingin menolak pelamar ini? Keputusan ini tidak dapat dibatalkan."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border-2 border-border rounded-2xl font-medium hover:border-[var(--coral)] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-6 py-3 rounded-2xl font-semibold text-white transition-all hover:shadow-lg ${
                  actionType === "accept"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
