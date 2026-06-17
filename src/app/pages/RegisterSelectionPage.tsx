import { Link } from "react-router";
import { User, Building2 } from "lucide-react";

export default function RegisterSelectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <span className="font-bold text-3xl text-[var(--coral)]">KerjoLe!</span>
          </Link>
          <h1 className="text-4xl font-bold mb-3">Mulai Perjalanan Anda</h1>
          <p className="text-muted-foreground text-lg">Pilih jenis akun yang ingin Anda buat</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/register/pelamar"
            className="group bg-white rounded-3xl shadow-xl p-10 border-2 border-border hover:border-[var(--coral)] transition-all hover:shadow-2xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--coral)] transition-colors">
              Saya Mencari Pekerjaan
            </h2>
            <p className="text-muted-foreground mb-6">
              Daftar sebagai pencari kerja untuk melamar ribuan lowongan dari perusahaan terpercaya
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--coral)]"></div>
                Upload CV dan portfolio
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--coral)]"></div>
                Lamar pekerjaan dengan mudah
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--coral)]"></div>
                Tracking status lamaran real-time
              </li>
            </ul>
            <div className="px-6 py-3 bg-[var(--coral)] text-white rounded-2xl text-center font-semibold group-hover:bg-[var(--coral-light)] transition-colors">
              Daftar Sebagai Pelamar
            </div>
          </Link>

          <Link
            to="/register/perusahaan"
            className="group bg-white rounded-3xl shadow-xl p-10 border-2 border-border hover:border-[var(--peach)] transition-all hover:shadow-2xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--peach)] to-[var(--pink)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--peach)] transition-colors">
              Saya Mencari Talenta
            </h2>
            <p className="text-muted-foreground mb-6">
              Daftar sebagai perusahaan untuk menemukan kandidat terbaik dan mengelola proses rekrutmen
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--peach)]"></div>
                Post lowongan unlimited
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--peach)]"></div>
                Kelola pelamar dalam satu dashboard
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--peach)]"></div>
                Analytics dan insights rekrutmen
              </li>
            </ul>
            <div className="px-6 py-3 bg-[var(--peach)] text-white rounded-2xl text-center font-semibold group-hover:bg-[var(--pink)] transition-colors">
              Daftar Sebagai Perusahaan
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[var(--coral)] hover:underline font-medium">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
