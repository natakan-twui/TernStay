import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InternshipDetail from "./pages/InternshipDetail";
import DormDetail from "./pages/DormDetail";
import Dorms from "./pages/Dorm";
import NearbyDorms from "./pages/NearbyDorms";
import Apply from "./pages/Apply";
import ScrollToTop from "./components/ScrollToTop";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Index from "./pages/Index";
import "leaflet/dist/leaflet.css";
// ================= Company =================
import CompanyHome from "./pages/company/CompanyHome";
import CompanyLogin from "./pages/company/CompanyLogin";
import CompanySearch from "./pages/company/CompanySearch";
import CompanyRegister from "./pages/company/CompanyRegister";
import CompanyCreateJob from "./pages/company/CompanyCreateJob";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyEditJob from "./pages/company/CompanyEditJob";
import CompanyJobDetail from "./pages/company/CompanyJobDetail";
import CompanyApplicants from "./pages/company/CompanyApplicants";
import CompanyJobs from "./pages/company/CompanyJobs";
import CompanyApplicantDetail from "./pages/company/CompanyApplicantDetail";
import CompanyActivity from "./pages/company/CompanyActivity";
import CompanyForgotPassword from "./pages/company/ForgotPassword";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanyProfileEdit from "./pages/company/CompanyProfileEdit";
import CompanySettings from "./pages/company/CompanySettings";
// ================= User =================
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import ProfilePreview from "./pages/ProfilePreview";
import ProfilePrivacy from "./pages/ProfilePrivacy";
import ProfileSettings from "./pages/ProfileSettings";
import MyJobs from "./pages/MyJobs";
function App() {
    return (
        <BrowserRouter>

            <ScrollToTop />

            <Routes>

                {/* ================= USER ================= */}

                {/* หน้าแรก */}
                <Route
                    path="/"
                    element={<Index />}
                />

                {/* หน้าหาที่ฝึกงาน */}
                <Route
                    path="/home"
                    element={<Home />}
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Forgot Password */}
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                {/* Verify Email */}
                <Route
                    path="/verify-email"
                    element={<VerifyEmail />}
                />

                {/* Internship Detail */}
                <Route
                    path="/internship/:id"
                    element={<InternshipDetail />}
                />

                {/* Nearby Dorms */}
                <Route
                    path="/internship/:id/dorms"
                    element={<NearbyDorms />}
                />

                {/* Dorms */}
                <Route
                    path="/dorms"
                    element={<Dorms />}
                />

                {/* Dorm Detail */}
                <Route
                    path="/dorm/:id"
                    element={<DormDetail />}
                />

                {/* Apply */}
                <Route
                    path="/apply/:id"
                    element={<Apply />}
                />

                {/* Profile */}
                <Route
                    path="/profile"
                    element={<Profile />}
                />

                {/* Edit Profile */}
                <Route
                    path="/profile/edit"
                    element={<ProfileEdit />}
                />

                {/* Preview Profile */}
                <Route
                    path="/profile/preview"
                    element={<ProfilePreview />}
                />

                {/* Private Profile */}
                <Route
                    path="/profile/privacy"
                    element={<ProfilePrivacy />}
                />

                {/* Profile Setting */}
                <Route 
                    path="/profile/settings" 
                    element={<ProfileSettings />} 
                />

                {/* My Jobs */}
                <Route path="/my-jobs" element={<MyJobs />} />

                {/* ================= COMPANY ================= */}

                {/* Company Home */}
                <Route
                    path="/company"
                    element={<CompanyHome />}
                />

                <Route
                    path="/company/home"
                    element={<CompanyHome />}
                />

                {/* Company Login */}
                <Route
                    path="/company/login"
                    element={<CompanyLogin />}
                />

                {/* Company Register */}
                <Route
                    path="/company/register"
                    element={<CompanyRegister />}
                />

                {/* Forgot Password */}
                <Route
                    path="/company/forgot-password"
                    element={<CompanyForgotPassword />}
                />

                {/* Company Search */}
                <Route
                    path="/company/search"
                    element={<CompanySearch />}
                />

                

                {/* Company Dashboard */}
                <Route
                    path="/company/dashboard"
                    element={<CompanyDashboard />}
                />

                {/* Create Job */}
                <Route
                    path="/company/create-job"
                    element={<CompanyCreateJob />}
                />

                {/* My Jobs */}
                <Route
                    path="/company/jobs"
                    element={<CompanyJobs />}
                />

                {/* Job Detail */}
                <Route
                    path="/company/jobs/:id"
                    element={<CompanyJobDetail />}
                />

                {/* Edit Job */}
                <Route
                    path="/company/jobs/edit/:id"
                    element={<CompanyEditJob />}
                />

                {/* Applicants */}
                <Route
                    path="/company/jobs/:id/applicants"
                    element={<CompanyApplicants />}
                />

                {/* Applicant Detail */}
                <Route
                    path="/company/jobs/:jobId/applicants/:applicationId"
                    element={<CompanyApplicantDetail />}
                />

                {/* Company Activity */}
                <Route
                    path="/company/activity"
                    element={<CompanyActivity />}
                />

                {/* Company Profile */}
                <Route
                    path="/company/profile"
                    element={<CompanyProfile />}
                />

                {/* Company Edit Profile */}
                <Route
                    path="/company/profile/edit"
                    element={<CompanyProfileEdit />}
                />

                {/* Company Setting Profile */}
                <Route
                    path="/company/settings"
                    element={<CompanySettings />}
                />
            </Routes>

        </BrowserRouter>
    );
}

export default App;