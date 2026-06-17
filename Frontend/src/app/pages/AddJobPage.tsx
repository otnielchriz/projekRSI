import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";
import { jobsApi, Skill, skillsApi } from "../services/api";

export default function AddJobPage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ job_title: "", job_description: "", job_qualification: "", location: "", salary_min: "", salary_max: "", job_type: "Full-Time", status: "published" as "draft" | "published" });
  const [skillId, setSkillId] = useState("");
  const [minimumLevel, setMinimumLevel] = useState(3);

  useEffect(() => { skillsApi.getSkills().then(setSkills).catch(err => setError(err.message)); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!skillId) return setError("Lowongan wajib memiliki minimal 1 skill sesuai SRS/FSD.");
    setLoading(true);
    try {
      await jobsApi.createJob({
        job_title: form.job_title,
        job_description: form.job_description,
        job_qualification: form.job_qualification,
        location: form.location,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        job_type: form.job_type,
        status: form.status,
        required_skills: [{ skill_id: Number(skillId), minimum_level: minimumLevel }],
      });
      navigate("/perusahaan/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat lowongan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <Link to="/perusahaan/dashboard" className="inline-flex items-center gap-2 text-[var(--coral)] font-semibold mb-6"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
          <div className="bg-white rounded-3xl p-8 border">
            <h1 className="text-3xl font-bold mb-2">Tambah Lowongan</h1>
            <p className="text-muted-foreground mb-8">Tambahkan lowongan pekerjaan baru.</p>
            {error && <p className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">{error}</p>}
            <form onSubmit={submit} className="space-y-5">
              <input required placeholder="Judul Pekerjaan" value={form.job_title} onChange={e => setForm({ ...form, job_title: e.target.value })} className="w-full px-4 py-3 rounded-2xl border" />
              <textarea required placeholder="Deskripsi Pekerjaan" rows={4} value={form.job_description} onChange={e => setForm({ ...form, job_description: e.target.value })} className="w-full px-4 py-3 rounded-2xl border" />
              <textarea required placeholder="Kualifikasi" rows={4} value={form.job_qualification} onChange={e => setForm({ ...form, job_qualification: e.target.value })} className="w-full px-4 py-3 rounded-2xl border" />
              <div className="grid md:grid-cols-2 gap-4">
                <input required placeholder="Lokasi" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-4 py-3 rounded-2xl border" />
                <select value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })} className="px-4 py-3 rounded-2xl border bg-white"><option>Full-Time</option><option>Part-Time</option><option>Hybrid</option><option>Remote</option><option>Freelance</option></select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="number" placeholder="Gaji Minimum" value={form.salary_min} onChange={e => setForm({ ...form, salary_min: e.target.value })} className="px-4 py-3 rounded-2xl border" />
                <input type="number" placeholder="Gaji Maksimum" value={form.salary_max} onChange={e => setForm({ ...form, salary_max: e.target.value })} className="px-4 py-3 rounded-2xl border" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <select value={skillId} onChange={e => setSkillId(e.target.value)} className="px-4 py-3 rounded-2xl border bg-white"><option value="">Pilih Required Skill</option>{skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}</select>
                <select value={minimumLevel} onChange={e => setMinimumLevel(Number(e.target.value))} className="px-4 py-3 rounded-2xl border bg-white">{[1,2,3,4,5].map(n => <option key={n} value={n}>Minimum Level {n}</option>)}</select>
              </div>
              <button disabled={loading} className="w-full px-8 py-4 bg-[var(--coral)] text-white rounded-2xl font-semibold disabled:opacity-60">{loading ? "Menyimpan..." : "Simpan Lowongan"}</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
