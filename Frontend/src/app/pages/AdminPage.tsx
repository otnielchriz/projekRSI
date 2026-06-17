import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { adminApi, CompanyForAdmin, JobForAdmin, UserForAdmin } from "../services/api";
import { toast } from "sonner";

export default function AdminPage() {
  const [pendingCompanies, setPendingCompanies] = useState<CompanyForAdmin[]>([]);
  const [pendingJobs, setPendingJobs] = useState<JobForAdmin[]>([]);
  const [allUsers, setAllUsers] = useState<UserForAdmin[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
    fetchJobs();
    fetchUsers();
  }, []);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const companies = await adminApi.pendingCompanies();
      setPendingCompanies(companies);
    } catch (error) {
      toast.error("Gagal memuat daftar perusahaan");
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const jobs = await adminApi.pendingJobs();
      setPendingJobs(jobs);
    } catch (error) {
      toast.error("Gagal memuat daftar lowongan");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await adminApi.listUsers();
      setAllUsers(users);
    } catch (error) {
      toast.error("Gagal memuat daftar user");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleValidateCompany = async (companyId: number, companyName: string) => {
    setActionLoading(`validate-company-${companyId}`);
    try {
      await adminApi.validateCompany(companyId);
      setPendingCompanies(pendingCompanies.filter((c) => c.id !== companyId));
      toast.success(`Perusahaan "${companyName}" berhasil divalidasi`);
    } catch (error: any) {
      toast.error(error.message || "Gagal memvalidasi perusahaan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectCompany = async (companyId: number, companyName: string) => {
    setActionLoading(`reject-company-${companyId}`);
    try {
      await adminApi.rejectCompany(companyId);
      setPendingCompanies(pendingCompanies.filter((c) => c.id !== companyId));
      toast.success(`Perusahaan "${companyName}" berhasil ditolak`);
    } catch (error: any) {
      toast.error(error.message || "Gagal menolak perusahaan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleValidateJob = async (jobId: number, jobTitle: string) => {
    setActionLoading(`validate-job-${jobId}`);
    try {
      await adminApi.validateJob(jobId);
      setPendingJobs(pendingJobs.filter((j) => j.id !== jobId));
      toast.success(`Lowongan "${jobTitle}" berhasil divalidasi`);
    } catch (error: any) {
      toast.error(error.message || "Gagal memvalidasi lowongan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectJob = async (jobId: number, jobTitle: string) => {
    setActionLoading(`reject-job-${jobId}`);
    try {
      await adminApi.rejectJob(jobId);
      setPendingJobs(pendingJobs.filter((j) => j.id !== jobId));
      toast.success(`Lowongan "${jobTitle}" berhasil ditolak`);
    } catch (error: any) {
      toast.error(error.message || "Gagal menolak lowongan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLockUser = async (userId: number, userName: string) => {
    setActionLoading(`lock-user-${userId}`);
    try {
      await adminApi.lockUser(userId);
      setAllUsers(allUsers.map((u) => (u.id === userId ? { ...u, is_locked: true } : u)));
      toast.success(`Akun "${userName}" berhasil dikunci`);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunci akun");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlockUser = async (userId: number, userName: string) => {
    setActionLoading(`unlock-user-${userId}`);
    try {
      await adminApi.unlockUser(userId);
      setAllUsers(allUsers.map((u) => (u.id === userId ? { ...u, is_locked: false } : u)));
      toast.success(`Akun "${userName}" berhasil dibuka`);
    } catch (error: any) {
      toast.error(error.message || "Gagal membuka akun");
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyUser = async (userId: number, userName: string) => {
    setActionLoading(`verify-user-${userId}`);
    try {
      await adminApi.verifyUser(userId);
      setAllUsers(allUsers.map((u) => (u.id === userId ? { ...u, is_verified: true } : u)));
      toast.success(`Akun "${userName}" berhasil diverifikasi`);
    } catch (error: any) {
      toast.error(error.message || "Gagal memverifikasi akun");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola validasi perusahaan, lowongan, dan akun pengguna</p>
          </div>

          <Tabs defaultValue="companies" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 bg-gray-100">
              <TabsTrigger value="companies" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--coral)] data-[state=active]:to-[var(--peach)] data-[state=active]:text-white">
                Perusahaan ({pendingCompanies.length})
              </TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--coral)] data-[state=active]:to-[var(--peach)] data-[state=active]:text-white">Lowongan ({pendingJobs.length})</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--coral)] data-[state=active]:to-[var(--peach)] data-[state=active]:text-white">User ({allUsers.length})</TabsTrigger>
            </TabsList>

            {/* Companies Tab */}
            <TabsContent value="companies" className="space-y-4">
              {loadingCompanies ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Loading perusahaan...
                  </CardContent>
                </Card>
              ) : pendingCompanies.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Tidak ada perusahaan yang menunggu validasi
                  </CardContent>
                </Card>
              ) : (
                pendingCompanies.map((company) => (
                  <Card key={company.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{company.company_name}</CardTitle>
                          <CardDescription className="mt-1">
                            <div className="text-sm">
                              <p>
                                <strong>Pemilik:</strong> {company.owner_name} ({company.owner_email})
                              </p>
                              <p>
                                <strong>Alamat:</strong> {company.address}
                              </p>
                              <p className="mt-2">
                                <strong>Deskripsi:</strong> {company.description}
                              </p>
                            </div>
                          </CardDescription>
                        </div>
                        <Badge variant={company.is_validated ? "default" : "secondary"}>
                          {company.is_validated ? "Tervalidasi" : "Menunggu"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-3 justify-end pt-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleValidateCompany(company.id, company.company_name)}
                        disabled={actionLoading === `validate-company-${company.id}`}
                      >
                        {actionLoading === `validate-company-${company.id}` ? "Loading..." : "Terima"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectCompany(company.id, company.company_name)}
                        disabled={actionLoading === `reject-company-${company.id}`}
                      >
                        {actionLoading === `reject-company-${company.id}` ? "Loading..." : "Tolak"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-4">
              {loadingJobs ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Loading lowongan...
                  </CardContent>
                </Card>
              ) : pendingJobs.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Tidak ada lowongan yang menunggu validasi
                  </CardContent>
                </Card>
              ) : (
                pendingJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{job.job_title}</CardTitle>
                          <CardDescription className="mt-1 text-sm">
                            <p>
                              <strong>Perusahaan:</strong> {job.company_name}
                            </p>
                            <p>
                              <strong>Lokasi:</strong> {job.location}
                            </p>
                            <p>
                              <strong>Tipe:</strong> {job.job_type}
                            </p>
                            <p className="mt-2 line-clamp-2">
                              <strong>Deskripsi:</strong> {job.job_description}
                            </p>
                          </CardDescription>
                        </div>
                        <div className="ml-4">
                          <Badge variant={job.is_validated ? "default" : "secondary"}>
                            {job.is_validated ? "Tervalidasi" : "Menunggu"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-3 justify-end pt-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleValidateJob(job.id, job.job_title)}
                        disabled={actionLoading === `validate-job-${job.id}`}
                      >
                        {actionLoading === `validate-job-${job.id}` ? "Loading..." : "Terima"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectJob(job.id, job.job_title)}
                        disabled={actionLoading === `reject-job-${job.id}`}
                      >
                        {actionLoading === `reject-job-${job.id}` ? "Loading..." : "Tolak"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              {loadingUsers ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Loading user...
                  </CardContent>
                </Card>
              ) : allUsers.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Tidak ada user
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <Card key={user.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{user.full_name}</CardTitle>
                            <CardDescription className="mt-1 text-sm">
                              <p>
                                <strong>Email:</strong> {user.email}
                              </p>
                              <p>
                                <strong>Role:</strong> {user.role}
                              </p>
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={user.is_verified ? "default" : "secondary"}>
                              {user.is_verified ? "Diverifikasi" : "Belum Verifikasi"}
                            </Badge>
                            <Badge variant={user.is_locked ? "destructive" : "outline"}>
                              {user.is_locked ? "Dikunci" : "Aktif"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex gap-3 justify-end pt-2">
                        {user.role !== "admin" && (
                          <>
                            {!user.is_verified && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleVerifyUser(user.id, user.full_name)}
                                disabled={actionLoading === `verify-user-${user.id}`}
                              >
                                {actionLoading === `verify-user-${user.id}` ? "Loading..." : "Verifikasi"}
                              </Button>
                            )}
                            {user.is_locked ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnlockUser(user.id, user.full_name)}
                                disabled={actionLoading === `unlock-user-${user.id}`}
                              >
                                {actionLoading === `unlock-user-${user.id}` ? "Loading..." : "Buka Kunci"}
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleLockUser(user.id, user.full_name)}
                                disabled={actionLoading === `lock-user-${user.id}`}
                              >
                                {actionLoading === `lock-user-${user.id}` ? "Loading..." : "Kunci Akun"}
                              </Button>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
