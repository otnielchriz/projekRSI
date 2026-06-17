export const API_URL = import.meta.env.VITE_API_URL || "https://kerjo-le-platform-kmtdzqcpl-evanhauzal-6126s-projects.vercel.app";

export type Role = "user" | "company" | "admin";

export type UserMe = {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  is_verified: boolean;
  is_locked: boolean;
  company?: {
    id: number;
    company_name: string;
    address: string;
    description: string;
    is_validated: boolean;
  };
};

export type LoginPayload = { email: string; password: string };
export type RegisterUserPayload = { full_name: string; email: string; password: string };
export type RegisterCompanyPayload = { company_name: string; email: string; password: string; address: string; description: string };
export type LoginResponse = { access_token: string; token_type: string; role: Role };

export type Skill = { id: number; skill_name: string; is_active: boolean };
export type UserSkill = { id: number; skill_id: number; skill_name: string; level: number };
export type Job = {
  id: number;
  company_id: number;
  company_name: string;
  job_title: string;
  job_description: string;
  job_qualification: string;
  location: string;
  salary_min?: number | null;
  salary_max?: number | null;
  job_type: string;
  status: string;
  expired_date?: string | null;
  is_validated: boolean;
  created_at?: string | null;
  required_skills: Array<{ id: number; skill_id: number; skill_name: string; minimum_level: number }>;
  total_applicants: number;
};
export type Application = {
  id: number;
  user_id: number;
  job_id: number;
  status: string;
  matching_score: number;
  applied_at?: string | null;
  applicant_name: string;
  applicant_email: string;
  job_title: string;
  company_name: string;
  skills?: Array<{ skill_name: string; level: number }>;
};

export type ProfileOverview = {
  user: { id: number; full_name: string; email: string; role: Role };
  skills: UserSkill[];
  projects: any[];
  certificates: any[];
  soft_skills: any[];
  cv: any | null;
  applications: Application[];
};

export type JobPayload = {
  job_title: string;
  job_description: string;
  job_qualification: string;
  location: string;
  salary_min?: number | null;
  salary_max?: number | null;
  job_type: string;
  status: "draft" | "published" | "closed";
  required_skills: Array<{ skill_id: number; minimum_level: number }>;
};

export function getToken() {
  return sessionStorage.getItem("kerjole_token");
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function clearAuth() {
  sessionStorage.removeItem("kerjole_token");
  sessionStorage.removeItem("kerjole_role");
}

export function getDashboardPath(role?: string) {
  const normalizedRole = String(
    role || sessionStorage.getItem("kerjole_role") || ""
  ).toLowerCase();
  if (normalizedRole === "company") return "/perusahaan/dashboard";
  if (normalizedRole === "admin") return "/admin";
  return "/pelamar/dashboard";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> | undefined) };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Terjadi kesalahan saat menghubungi backend";

    if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((err: any) => err?.msg || JSON.stringify(err))
        .join(", ");
    } else if (typeof data?.message === "string") {
      message = data.message;
    }

    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  registerUser: (payload: RegisterUserPayload) => request<{ message: string; user_id: number }>("/auth/register/user", { method: "POST", body: JSON.stringify(payload) }),
  registerCompany: (payload: RegisterCompanyPayload) => request<{ message: string; company_id: number }>("/auth/register/company", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: LoginPayload) => request<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<UserMe>("/auth/me"),
};

export const profileApi = {
  overview: () => request<ProfileOverview>("/profile/overview"),
  addSkill: (payload: { skill_id: number; level: number }) => request<{ message: string; skill: UserSkill }>("/profile/skills", { method: "POST", body: JSON.stringify(payload) }),
  deleteSkill: (id: number) => request<{ message: string }>(`/profile/skills/${id}`, { method: "DELETE" }),
  addProject: (payload: { project_name: string; description: string; link?: string; skill_ids: number[] }) => request<any>("/profile/projects", { method: "POST", body: JSON.stringify(payload) }),
  deleteProject: (id: number) => request<{ message: string }>(`/profile/projects/${id}`, { method: "DELETE" }),
  addCertificate: (payload: { certificate_name: string; issuer: string; issue_date: string; skill_id?: number | null }) => request<any>("/profile/certificates", { method: "POST", body: JSON.stringify(payload) }),
  deleteCertificate: (id: number) => request<{ message: string }>(`/profile/certificates/${id}`, { method: "DELETE" }),
  uploadCv: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ message: string; file_path: string }>("/profile/cv", { method: "POST", body: formData });
  },
};

export const skillsApi = { getSkills: () => request<Skill[]>("/skills") };

export const jobsApi = {
  getJobs: () => request<Job[]>("/jobs"),

  recommendedJobs: () => request<Job[]>("/jobs/recommended"),

  searchJobs: (params: {
    keyword?: string;
    location?: string;
    job_type?: string;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();

    if (params.keyword) searchParams.set("keyword", params.keyword);
    if (params.location) searchParams.set("location", params.location);
    if (params.job_type) searchParams.set("job_type", params.job_type);
    if (params.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();

    return request<Job[]>(query ? `/jobs?${query}` : "/jobs");
  },

  getJobById: (id: string | number) => request<Job>(`/jobs/${id}`),

  getMyCompanyJobs: () =>
    request<{ company: NonNullable<UserMe["company"]>; jobs: Job[] }>(
      "/jobs/company/my"
    ),

  createJob: (payload: JobPayload) =>
    request<{ message: string; job_id: number; job: Job }>("/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  closeJob: (id: number) =>
    request<{ message: string; job: Job }>(`/jobs/${id}/close`, {
      method: "PATCH",
    }),
};

export const applicationsApi = {
  applyJob: (jobId: string | number) => request<{ message: string; matching_score: number; application: Application }>(`/applications/apply/${jobId}`, { method: "POST" }),
  myApplications: () => request<Application[]>("/applications/my"),
  getCandidates: (jobId: string | number) => request<Application[]>(`/applications/job/${jobId}/candidates`),
  getApplicationDetail: (applicationId: number) => request<any>(`/applications/${applicationId}/detail`),
  updateStatus: (applicationId: number, status: string) => request<{ message: string; application: Application }>(`/applications/${applicationId}/status?status=${status}`, { method: "PATCH" }),
};

export type CompanyForAdmin = {
  id: number;
  company_name: string;
  address: string;
  description: string;
  is_validated: boolean;
  owner_name: string;
  owner_email: string;
  created_at: string | null;
};

export type JobForAdmin = {
  id: number;
  job_title: string;
  job_description: string;
  company_name: string;
  company_id: number;
  location: string;
  job_type: string;
  status: string;
  is_validated: boolean;
  created_at: string | null;
};

export type UserForAdmin = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_locked: boolean;
  created_at: string | null;
};

export const adminApi = {
  // Companies
  pendingCompanies: () => request<CompanyForAdmin[]>("/admin/companies/pending"),
  validateCompany: (companyId: number) => request<{ message: string; company: CompanyForAdmin }>(`/admin/companies/${companyId}/validate`, { method: "PATCH" }),
  rejectCompany: (companyId: number) => request<{ message: string }>(`/admin/companies/${companyId}/reject`, { method: "PATCH" }),

  // Jobs
  pendingJobs: () => request<JobForAdmin[]>("/admin/jobs/pending"),
  validateJob: (jobId: number) => request<{ message: string; job: JobForAdmin }>(`/admin/jobs/${jobId}/validate`, { method: "PATCH" }),
  rejectJob: (jobId: number) => request<{ message: string }>(`/admin/jobs/${jobId}/reject`, { method: "PATCH" }),

  // Users
  listUsers: () => request<UserForAdmin[]>("/admin/users"),
  getUser: (userId: number) => request<UserForAdmin>(`/admin/users/${userId}`),
  lockUser: (userId: number) => request<{ message: string; user: UserForAdmin }>(`/admin/users/${userId}/lock`, { method: "PATCH" }),
  unlockUser: (userId: number) => request<{ message: string; user: UserForAdmin }>(`/admin/users/${userId}/unlock`, { method: "PATCH" }),
  verifyUser: (userId: number) => request<{ message: string; user: UserForAdmin }>(`/admin/users/${userId}/verify`, { method: "PATCH" }),
};
