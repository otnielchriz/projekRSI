import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Briefcase, FileText, CheckCircle2, Clock, XCircle, X, Plus, Trash2, Award, Code, Calendar, Building, ChevronDown } from "lucide-react";

// Type Definitions
interface Skill {
  id: number;
  nama: string;
  level: number;
}

interface Project {
  id: number;
  nama: string;
  deskripsi: string;
  link: string;
  skills: string[];
}

interface Certificate {
  id: number;
  nama: string;
  penerbit: string;
  tanggalTerbit: string;
}

export default function JobSeekerDashboard() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "projects" | "certificates">("overview");

  // Applications data (existing)
  const applications = [
    { id: 1, job: "Senior Frontend Developer", company: "TechCorp Indonesia", status: "Pending", date: "2 hari lalu", logo: "🚀" },
    { id: 2, job: "UI/UX Designer", company: "Creative Studio", status: "Diterima", date: "5 hari lalu", logo: "🎨" },
    { id: 3, job: "Data Analyst", company: "Analytics Pro", status: "Ditolak", date: "1 minggu lalu", logo: "📊" },
  ];

  const recommendedJobs = [
    { id: 4, title: "Backend Engineer", company: "Cloud Systems", salary: "18 - 30 jt", type: "Full-Time", logo: "⚡" },
    { id: 5, title: "Product Manager", company: "StartUp Hub", salary: "20 - 35 jt", type: "Full-Time", logo: "🎯" },
  ];

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, nama: "React", level: 5 },
    { id: 2, nama: "TypeScript", level: 4 },
    { id: 3, nama: "Tailwind CSS", level: 5 },
  ]);
  const [newSkill, setNewSkill] = useState({ nama: "", level: 3 });
  const [skillError, setSkillError] = useState("");

  // Projects state
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      nama: "E-Commerce Platform",
      deskripsi: "Platform e-commerce dengan fitur checkout dan payment gateway terintegrasi",
      link: "https://github.com/example/ecommerce",
      skills: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      id: 2,
      nama: "Task Management App",
      deskripsi: "Aplikasi manajemen tugas dengan real-time collaboration",
      link: "https://github.com/example/task-app",
      skills: ["React", "Firebase"],
    },
  ]);
  const [newProject, setNewProject] = useState({ nama: "", deskripsi: "", link: "" });
  const [projectError, setProjectError] = useState("");

  // New Project Skill Input State
  const [newProjectSkills, setNewProjectSkills] = useState<string[]>([]);
  const [newProjectSkillSearch, setNewProjectSkillSearch] = useState("");
  const [showNewProjectSkillDropdown, setShowNewProjectSkillDropdown] = useState(false);

  // Master Skills List
  const masterSkills = [
    "React", "TypeScript", "Tailwind CSS", "Vue.js", "Angular", "Node.js",
    "Python", "JavaScript", "Firebase", "MongoDB", "PostgreSQL", "GraphQL",
    "Redux", "Git", "Docker", "AWS", "Figma", "UI Design", "UX Design",
    "Next.js", "Express.js", "REST API", "MySQL", "CSS/SCSS", "HTML5",
  ].sort();

  // Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 1,
      nama: "React Developer Certification",
      penerbit: "Udemy",
      tanggalTerbit: "2024-03-15",
    },
  ]);
  const [newCertificate, setNewCertificate] = useState({ nama: "", penerbit: "", tanggalTerbit: "" });
  const [certificateError, setCertificateError] = useState("");

  // Existing helper functions
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Diterima":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Ditolak":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Skills handlers
  const getLevelLabel = (level: number) => {
    const labels = ["Pemula", "Dasar", "Menengah", "Mahir", "Ahli"];
    return labels[level - 1] || "Pemula";
  };

  const handleAddSkill = () => {
    setSkillError("");

    if (!newSkill.nama.trim()) {
      setSkillError("Nama skill wajib diisi");
      return;
    }

    if (skills.length >= 10) {
      setSkillError("Maksimal 10 skill dapat ditambahkan (BR-06)");
      return;
    }

    if (newSkill.level < 1 || newSkill.level > 5) {
      setSkillError("Level skill harus antara 1-5");
      return;
    }

    setSkills([...skills, { id: Date.now(), nama: newSkill.nama, level: newSkill.level }]);
    setNewSkill({ nama: "", level: 3 });
  };

  const handleRemoveSkill = (id: number) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  // Projects handlers
  const handleAddProject = () => {
    setProjectError("");

    if (!newProject.nama.trim()) {
      setProjectError("Nama project wajib diisi");
      return;
    }

    if (newProject.nama.length > 100) {
      setProjectError("Nama project maksimal 100 karakter");
      return;
    }

    if (!newProject.deskripsi.trim()) {
      setProjectError("Deskripsi project wajib diisi");
      return;
    }

    setProjects([
      ...projects,
      {
        id: Date.now(),
        nama: newProject.nama,
        deskripsi: newProject.deskripsi,
        link: newProject.link,
        skills: newProjectSkills,
      },
    ]);
    setNewProject({ nama: "", deskripsi: "", link: "" });
    setNewProjectSkills([]);
    setNewProjectSkillSearch("");
  };

  const handleRemoveProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // New Project Skill Handlers
  const handleAddSkillToNewProject = (skill: string) => {
    if (!newProjectSkills.includes(skill)) {
      setNewProjectSkills([...newProjectSkills, skill]);
    }
    setNewProjectSkillSearch("");
    setShowNewProjectSkillDropdown(false);
  };

  const handleRemoveSkillFromNewProject = (skillToRemove: string) => {
    setNewProjectSkills(newProjectSkills.filter((s) => s !== skillToRemove));
  };

  const getNewProjectFilteredSkills = () => {
    return masterSkills.filter(
      (skill) =>
        skill.toLowerCase().includes(newProjectSkillSearch.toLowerCase()) &&
        !newProjectSkills.includes(skill)
    );
  };

  // Certificates handlers
  const handleAddCertificate = () => {
    setCertificateError("");

    if (!newCertificate.nama.trim()) {
      setCertificateError("Nama sertifikat wajib diisi");
      return;
    }

    if (!newCertificate.penerbit.trim()) {
      setCertificateError("Penerbit wajib diisi");
      return;
    }

    if (!newCertificate.tanggalTerbit) {
      setCertificateError("Tanggal terbit wajib diisi");
      return;
    }

    setCertificates([
      ...certificates,
      {
        id: Date.now(),
        nama: newCertificate.nama,
        penerbit: newCertificate.penerbit,
        tanggalTerbit: newCertificate.tanggalTerbit,
      },
    ]);
    setNewCertificate({ nama: "", penerbit: "", tanggalTerbit: "" });
  };

  const handleRemoveCertificate = (id: number) => {
    setCertificates(certificates.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard Pelamar</h1>
            <p className="text-muted-foreground text-lg">Selamat datang kembali, Budi Santoso!</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-border">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 whitespace-nowrap font-medium transition-all rounded-t-lg ${
                activeTab === "overview"
                  ? "text-[var(--coral)] border-b-2 border-[var(--coral)] bg-red-50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Overview Lamaran</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-6 py-3 whitespace-nowrap font-medium transition-all rounded-t-lg ${
                activeTab === "skills"
                  ? "text-[var(--coral)] border-b-2 border-[var(--coral)] bg-red-50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>Kelola Hard Skill</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-6 py-3 whitespace-nowrap font-medium transition-all rounded-t-lg ${
                activeTab === "projects"
                  ? "text-[var(--coral)] border-b-2 border-[var(--coral)] bg-red-50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Kelola Project</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`px-6 py-3 whitespace-nowrap font-medium transition-all rounded-t-lg ${
                activeTab === "certificates"
                  ? "text-[var(--coral)] border-b-2 border-[var(--coral)] bg-red-50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Kelola Sertifikat</span>
              </div>
            </button>
          </div>

          {/* TAB 1: OVERVIEW LAMARAN */}
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Lamaran</p>
                      <p className="text-3xl font-bold">{applications.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Diterima</p>
                      <p className="text-3xl font-bold">
                        {applications.filter((a) => a.status === "Diterima").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Menunggu</p>
                      <p className="text-3xl font-bold">
                        {applications.filter((a) => a.status === "Pending").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-border mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Status Lamaran</h2>
                  <Link to="/lowongan" className="text-[var(--coral)] hover:underline">
                    Cari lowongan lain
                  </Link>
                </div>

                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-[var(--coral)] transition-colors"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center text-3xl flex-shrink-0">
                        {app.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{app.job}</h3>
                        <p className="text-sm text-muted-foreground">{app.company}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{app.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6">Rekomendasi Untuk Anda</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedJobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/lowongan/${job.id}`}
                      className="flex items-start gap-4 p-6 rounded-2xl border border-border hover:border-[var(--coral)] transition-all hover:shadow-lg"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--coral)] to-[var(--peach)] flex items-center justify-center text-3xl flex-shrink-0">
                        {job.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold">{job.title}</h3>
                          <span className="px-2 py-1 bg-[var(--yellow-light)] text-[var(--coral)] rounded-lg text-xs font-medium whitespace-nowrap">
                            {job.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                        <p className="text-[var(--coral)] font-semibold text-sm">
                          Gaji: {job.salary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: KELOLA HARD SKILL */}
          {activeTab === "skills" && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Kelola Hard Skill</h2>
                <p className="text-muted-foreground">Maksimal 10 skill dapat ditambahkan (BR-06)</p>
              </div>

              {skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-lg">Skills Anda ({skills.length}/10)</h3>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--coral)]/10 to-transparent border border-[var(--coral)]/30 hover:border-[var(--coral)]/60 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{skill.nama}</p>
                          <p className="text-xs text-muted-foreground">{getLevelLabel(skill.level)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="ml-2 p-1 hover:bg-red-100 rounded transition-colors text-[var(--coral)]"
                          title="Hapus skill"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={skills.length > 0 ? "border-t pt-8" : ""}>
                <h3 className="font-semibold mb-4 text-lg">Tambah Skill Baru</h3>

                {skillError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{skillError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nama Skill <span className="text-[var(--coral)]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: React, TypeScript, UI Design"
                      value={newSkill.nama}
                      onChange={(e) => setNewSkill({ ...newSkill, nama: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Level Keahlian <span className="text-[var(--coral)]">*</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={newSkill.level}
                        onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #FF6B6B 0%, #FF6B6B ${
                            (newSkill.level / 5) * 100
                          }%, #e5e7eb ${(newSkill.level / 5) * 100}%, #e5e7eb 100%)`,
                        }}
                      />
                      <span className="min-w-20 text-sm font-medium px-3 py-1 bg-[var(--coral)]/10 text-[var(--coral)] rounded-lg">
                        {getLevelLabel(newSkill.level)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>1 - Pemula</span>
                      <span>5 - Ahli</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddSkill}
                    disabled={skills.length >= 10}
                    className="w-full py-2 px-4 bg-[var(--coral)] hover:bg-[var(--coral)]/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Skill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KELOLA PROJECT */}
          {activeTab === "projects" && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Kelola Project</h2>
                <p className="text-muted-foreground">Tampilkan karya terbaik Anda kepada perekrut</p>
              </div>

              {projects.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-lg">Project Anda ({projects.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-6 border border-border rounded-2xl hover:border-[var(--coral)] hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h4 className="font-semibold text-base flex-1 line-clamp-2">{project.nama}</h4>
                          <button
                            onClick={() => handleRemoveProject(project.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-[var(--coral)] flex-shrink-0"
                            title="Hapus project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.deskripsi}</p>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[var(--coral)] hover:underline break-all"
                          >
                            {project.link}
                          </a>
                        )}
                        {/* Skills Tags */}
                        {project.skills && project.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--coral)]/10 text-[var(--coral)] border border-[var(--coral)]/30 rounded-full text-xs font-medium"
                              >
                                <Code className="w-3 h-3" />
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={projects.length > 0 ? "border-t pt-8" : ""}>
                <h3 className="font-semibold mb-4 text-lg">Tambah Project Baru</h3>

                {projectError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{projectError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nama Project <span className="text-[var(--coral)]">*</span>
                      <span className="text-xs text-muted-foreground"> (Max 100 karakter)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: E-Commerce Platform"
                      value={newProject.nama}
                      onChange={(e) =>
                        setNewProject({ ...newProject, nama: e.target.value.slice(0, 100) })
                      }
                      maxLength={100}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{newProject.nama.length}/100</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Deskripsi Project <span className="text-[var(--coral)]">*</span>
                    </label>
                    <textarea
                      placeholder="Jelaskan project Anda, teknologi yang digunakan, dan fitur utamanya..."
                      value={newProject.deskripsi}
                      onChange={(e) =>
                        setNewProject({ ...newProject, deskripsi: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Link Project <span className="text-muted-foreground">(Opsional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={newProject.link}
                      onChange={(e) =>
                        setNewProject({ ...newProject, link: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/50"
                    />
                  </div>

                  {/* Skill Selection for New Project */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hard Skills Project{" "}
                      <span className="text-muted-foreground text-xs">(Opsional)</span>
                    </label>

                    {/* Selected Skills Badges */}
                    {newProjectSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {newProjectSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 pl-2 pr-1 py-1 bg-[var(--coral)]/10 text-[var(--coral)] border border-[var(--coral)]/30 rounded-full text-xs font-medium"
                          >
                            <Code className="w-3 h-3" />
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkillFromNewProject(skill)}
                              className="ml-1 rounded-full hover:bg-[var(--coral)]/20 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Skill Search Dropdown */}
                    <div className="relative">
                      <div className="flex items-center relative">
                        <input
                          type="text"
                          placeholder="Cari dan tambah skill (e.g., React, TypeScript)"
                          value={newProjectSkillSearch}
                          onChange={(e) => setNewProjectSkillSearch(e.target.value)}
                          onFocus={() => setShowNewProjectSkillDropdown(true)}
                          onBlur={() =>
                            setTimeout(() => setShowNewProjectSkillDropdown(false), 200)
                          }
                          className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/50"
                        />
                        <ChevronDown
                          className={`absolute right-3 w-4 h-4 text-muted-foreground transition-transform ${
                            showNewProjectSkillDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* Dropdown Menu */}
                      {showNewProjectSkillDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {getNewProjectFilteredSkills().length > 0 ? (
                            getNewProjectFilteredSkills().map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => handleAddSkillToNewProject(skill)}
                                className="w-full text-left px-4 py-3 hover:bg-[var(--coral)]/5 transition-colors border-b border-border/30 last:border-b-0"
                              >
                                <div className="flex items-center gap-2">
                                  <Code className="w-4 h-4 text-[var(--coral)]" />
                                  <span className="text-sm">{skill}</span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                              Semua skill sudah dipilih atau tidak ada hasil
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleAddProject}
                    className="w-full py-2 px-4 bg-[var(--coral)] hover:bg-[var(--coral)]/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Project
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KELOLA SERTIFIKAT */}
          {activeTab === "certificates" && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Kelola Sertifikat</h2>
                <p className="text-muted-foreground">Tampilkan kredensial dan penghargaan Anda</p>
              </div>

              {certificates.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-lg">Sertifikat Anda ({certificates.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-6 border border-border rounded-2xl hover:border-[var(--coral)] hover:shadow-lg transition-all bg-gradient-to-br from-[var(--coral)]/5 via-white to-white"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <Award className="w-5 h-5 text-[var(--coral)] flex-shrink-0 mt-1" />
                          <button
                            onClick={() => handleRemoveCertificate(cert.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-[var(--coral)] flex-shrink-0"
                            title="Hapus sertifikat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-base mb-2 line-clamp-2">{cert.nama}</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {cert.penerbit}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(cert.tanggalTerbit).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={certificates.length > 0 ? "border-t pt-8" : ""}>
                <h3 className="font-semibold mb-4 text-lg">Tambah Sertifikat Baru</h3>

                {certificateError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{certificateError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nama Sertifikat <span className="text-[var(--coral)]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: React Developer Certification"
                      value={newCertificate.nama}
                      onChange={(e) =>
                        setNewCertificate({ ...newCertificate, nama: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Penerbit <span className="text-[var(--coral)]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Cth: Udemy, Coursera, Google"
                      value={newCertificate.penerbit}
                      onChange={(e) =>
                        setNewCertificate({ ...newCertificate, penerbit: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tanggal Terbit <span className="text-[var(--coral)]">*</span>
                    </label>
                    <input
                      type="date"
                      value={newCertificate.tanggalTerbit}
                      onChange={(e) =>
                        setNewCertificate({ ...newCertificate, tanggalTerbit: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/50"
                    />
                  </div>

                  <button
                    onClick={handleAddCertificate}
                    className="w-full py-2 px-4 bg-[var(--coral)] hover:bg-[var(--coral)]/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Sertifikat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
