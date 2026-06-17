import { Link } from "react-router";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="font-bold text-2xl text-[var(--coral)]">KerjoLe!</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-[var(--coral)] transition-colors">
              Home
            </Link>
            <Link to="/lowongan" className="text-foreground hover:text-[var(--coral)] transition-colors">
              Lowongan
            </Link>
            <Link to="/perusahaan/dashboard" className="text-foreground hover:text-[var(--coral)] transition-colors">
              Perusahaan
            </Link>
            <Link to="#" className="text-foreground hover:text-[var(--coral)] transition-colors">
              Tentang
            </Link>
          </div>

          <Link
            to="/login"
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[var(--coral)] text-white hover:bg-[var(--coral-light)] transition-all hover:shadow-lg"
          >
            <User className="w-4 h-4" />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
