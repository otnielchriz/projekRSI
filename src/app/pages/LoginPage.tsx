import { useState } from "react";
import { Link } from "react-router";
import { Mail, Lock, User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <span className="font-bold text-3xl text-[var(--coral)]">KerjoLe!</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Selamat Datang Kembali</h1>
          <p className="text-muted-foreground">Masuk untuk melanjutkan pencarian kerja Anda</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--input-background)] border border-border focus:border-[var(--coral)] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--input-background)] border border-border focus:border-[var(--coral)] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border text-[var(--coral)] focus:ring-[var(--coral)]" />
                <span className="text-muted-foreground">Ingat saya</span>
              </label>
              <a href="#" className="text-[var(--coral)] hover:underline">Lupa password?</a>
            </div>

            <Link
              to="/pelamar/dashboard"
              className="w-full block text-center px-8 py-4 bg-[var(--coral)] text-white rounded-2xl font-semibold hover:bg-[var(--coral-light)] transition-all hover:shadow-lg"
            >
              Login
            </Link>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-center space-y-3">
              <p className="text-muted-foreground text-sm">Belum punya akun?</p>
              <div className="flex gap-3">
                <Link
                  to="/register/pelamar"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-border rounded-2xl hover:border-[var(--coral)] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Daftar sebagai Pelamar</span>
                </Link>
                <Link
                  to="/register/perusahaan"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-border rounded-2xl hover:border-[var(--coral)] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Daftar sebagai Perusahaan</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
