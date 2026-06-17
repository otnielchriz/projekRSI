import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import JobListingPage from "./pages/JobListingPage";
import JobDetailPage from "./pages/JobDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterSelectionPage from "./pages/RegisterSelectionPage";
import JobSeekerRegisterPage from "./pages/JobSeekerRegisterPage";
import CompanyRegisterPage from "./pages/CompanyRegisterPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import ManageJobsPage from "./pages/ManageJobsPage";
import AddJobPage from "./pages/AddJobPage";
import ApplicantsListPage from "./pages/ApplicantsListPage";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/lowongan",
    Component: JobListingPage,
  },
  {
    path: "/lowongan/:id",
    Component: JobDetailPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterSelectionPage,
  },
  {
    path: "/register/pelamar",
    Component: JobSeekerRegisterPage,
  },
  {
    path: "/register/perusahaan",
    Component: CompanyRegisterPage,
  },
  {
    path: "/pelamar/dashboard",
    Component: JobSeekerDashboard,
  },
  {
    path: "/perusahaan/dashboard",
    Component: CompanyDashboard,
  },
  {
    path: "/perusahaan/kelola-lowongan",
    Component: ManageJobsPage,
  },
  {
    path: "/perusahaan/tambah-lowongan",
    Component: AddJobPage,
  },
  {
    path: "/perusahaan/lowongan/:id/pelamar",
    Component: ApplicantsListPage,
  },
  {
    path: "/perusahaan/pelamar/:id",
    Component: ApplicantDetailPage,
  },
]);
