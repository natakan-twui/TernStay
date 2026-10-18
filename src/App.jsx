// import { HashRouter, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import InternshipDetail from "./pages/InternshipDetail";
// import DormDetail from "./pages/DormDetail";
// import Dorms from "./pages/Dorm";
// import NearbyDorms from "./pages/NearbyDorms";
// import Apply from "./pages/Apply";
// import ScrollToTop from "./components/ScrollToTop";
// import ForgotPassword from "./pages/ForgotPassword";
// import VerifyEmail from "./pages/VerifyEmail";
// import Index from "./pages/Index";
// import "leaflet/dist/leaflet.css";
// // ================= Company =================
// import CompanyHome from "./pages/company/CompanyHome";
// import CompanyLogin from "./pages/company/CompanyLogin";
// import CompanySearch from "./pages/company/CompanySearch";
// import CompanyRegister from "./pages/company/CompanyRegister";
// import CompanyCreateJob from "./pages/company/CompanyCreateJob";
// import CompanyDashboard from "./pages/company/CompanyDashboard";
// import CompanyEditJob from "./pages/company/CompanyEditJob";
// import CompanyJobDetail from "./pages/company/CompanyJobDetail";
// import CompanyApplicants from "./pages/company/CompanyApplicants";
// import CompanyJobs from "./pages/company/CompanyJobs";
// import CompanyApplicantDetail from "./pages/company/CompanyApplicantDetail";
// import CompanyActivity from "./pages/company/CompanyActivity";
// import CompanyForgotPassword from "./pages/company/ForgotPassword";
// import CompanyProfile from "./pages/company/CompanyProfile";
// import CompanyProfileEdit from "./pages/company/CompanyProfileEdit";
// import CompanySettings from "./pages/company/CompanySettings";
// // ================= User =================
// import Profile from "./pages/Profile";
// import ProfileEdit from "./pages/ProfileEdit";
// import ProfilePreview from "./pages/ProfilePreview";
// import ProfilePrivacy from "./pages/ProfilePrivacy";
// import ProfileSettings from "./pages/ProfileSettings";
// import MyJobs from "./pages/MyJobs";

// function App() {
//     return (
//         <HashRouter>

//             <ScrollToTop />

//             <Routes>

//                 {/* ================= USER ================= */}

//                 {/* หน้าแรก */}
//                 <Route
//                     path="/"
//                     element={<Index />}
//                 />

//                 {/* หน้าหาที่ฝึกงาน */}
//                 <Route
//                     path="/home"
//                     element={<Home />}
//                 />

//                 {/* Login */}
//                 <Route
//                     path="/login"
//                     element={<Login />}
//                 />

//                 {/* Register */}
//                 <Route
//                     path="/register"
//                     element={<Register />}
//                 />

//                 {/* Forgot Password */}
//                 <Route
//                     path="/forgot-password"
//                     element={<ForgotPassword />}
//                 />

//                 {/* Verify Email */}
//                 <Route
//                     path="/verify-email"
//                     element={<VerifyEmail />}
//                 />

//                 {/* Internship Detail */}
//                 <Route
//                     path="/internship/:id"
//                     element={<InternshipDetail />}
//                 />

//                 {/* Nearby Dorms */}
//                 <Route
//                     path="/internship/:id/dorms"
//                     element={<NearbyDorms />}
//                 />

//                 {/* Dorms */}
//                 <Route
//                     path="/dorms"
//                     element={<Dorms />}
//                 />

//                 {/* Dorm Detail */}
//                 <Route
//                     path="/dorm/:id"
//                     element={<DormDetail />}
//                 />

//                 {/* Apply */}
//                 <Route
//                     path="/apply/:id"
//                     element={<Apply />}
//                 />

//                 {/* Profile */}
//                 <Route
//                     path="/profile"
//                     element={<Profile />}
//                 />

//                 {/* Edit Profile */}
//                 <Route
//                     path="/profile/edit"
//                     element={<ProfileEdit />}
//                 />

//                 {/* Preview Profile */}
//                 <Route
//                     path="/profile/preview"
//                     element={<ProfilePreview />}
//                 />

//                 {/* Private Profile */}
//                 <Route
//                     path="/profile/privacy"
//                     element={<ProfilePrivacy />}
//                 />

//                 {/* Profile Setting */}
//                 <Route 
//                     path="/profile/settings" 
//                     element={<ProfileSettings />} 
//                 />

//                 {/* My Jobs */}
//                 <Route path="/my-jobs" element={<MyJobs />} />

//                 {/* ================= COMPANY ================= */}

//                 {/* Company Home */}
//                 <Route
//                     path="/company"
//                     element={<CompanyHome />}
//                 />

//                 <Route
//                     path="/company/home"
//                     element={<CompanyHome />}
//                 />

//                 {/* Company Login */}
//                 <Route
//                     path="/company/login"
//                     element={<CompanyLogin />}
//                 />

//                 {/* Company Register */}
//                 <Route
//                     path="/company/register"
//                     element={<CompanyRegister />}
//                 />

//                 {/* Forgot Password */}
//                 <Route
//                     path="/company/forgot-password"
//                     element={<CompanyForgotPassword />}
//                 />

//                 {/* Company Search */}
//                 <Route
//                     path="/company/search"
//                     element={<CompanySearch />}
//                 />

//                 {/* Company Dashboard */}
//                 <Route
//                     path="/company/dashboard"
//                     element={<CompanyDashboard />}
//                 />

//                 {/* Create Job */}
//                 <Route
//                     path="/company/create-job"
//                     element={<CompanyCreateJob />}
//                 />

//                 {/* My Jobs */}
//                 <Route
//                     path="/company/jobs"
//                     element={<CompanyJobs />}
//                 />

//                 {/* Job Detail */}
//                 <Route
//                     path="/company/jobs/:id"
//                     element={<CompanyJobDetail />}
//                 />

//                 {/* Edit Job */}
//                 <Route
//                     path="/company/jobs/edit/:id"
//                     element={<CompanyEditJob />}
//                 />

//                 {/* Applicants */}
//                 <Route
//                     path="/company/jobs/:id/applicants"
//                     element={<CompanyApplicants />}
//                 />

//                 {/* Applicant Detail */}
//                 <Route
//                     path="/company/jobs/:jobId/applicants/:applicationId"
//                     element={<CompanyApplicantDetail />}
//                 />

//                 {/* Company Activity */}
//                 <Route
//                     path="/company/activity"
//                     element={<CompanyActivity />}
//                 />

//                 {/* Company Profile */}
//                 <Route
//                     path="/company/profile"
//                     element={<CompanyProfile />}
//                 />

//                 {/* Company Edit Profile */}
//                 <Route
//                     path="/company/profile/edit"
//                     element={<CompanyProfileEdit />}
//                 />

//                 {/* Company Setting Profile */}
//                 <Route
//                     path="/company/settings"
//                     element={<CompanySettings />}
//                 />
//             </Routes>

//         </HashRouter>
//     );
// }

// export default App;

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop'; // เช็กพาร์ทการ import ตามโครงสร้างเดิมของพี่

// Import หน้าต่างๆ ของพี่ (อันนี้ใส่ไว้ตามเดิมที่พี่มี)
import Index from './pages/Index';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import InternshipDetail from './pages/InternshipDetail';
import NearbyDorms from './pages/NearbyDorms';
import Dorms from './pages/Dorms';
import DormDetail from './pages/DormDetail';
import Apply from './pages/Apply';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import ProfilePreview from './pages/ProfilePreview';
import ProfilePrivacy from './pages/ProfilePrivacy';
import ProfileSettings from './pages/ProfileSettings';
import MyJobs from './pages/MyJobs';

import CompanyHome from './pages/CompanyHome';
import CompanyLogin from './pages/CompanyLogin';
import CompanyRegister from './pages/CompanyRegister';
import CompanyForgotPassword from './pages/CompanyForgotPassword';
import CompanySearch from './pages/CompanySearch';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyCreateJob from './pages/CompanyCreateJob';
import CompanyJobs from './pages/CompanyJobs';
import CompanyJobDetail from './pages/CompanyJobDetail';
import CompanyEditJob from './pages/CompanyEditJob';
import CompanyApplicants from './pages/CompanyApplicants';
import CompanyApplicantDetail from './pages/CompanyApplicantDetail';
import CompanyActivity from './pages/CompanyActivity';
import CompanyProfile from './pages/CompanyProfile';
import CompanyProfileEdit from './pages/CompanyProfileEdit';
import CompanySettings from './pages/CompanySettings';

function App() {
    return (
        <HashRouter>
            <ScrollToTop />
            <Routes>
                {/* ================= USER ================= */}
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/internship/:id" element={<InternshipDetail />} />
                <Route path="/internship/:id/dorms" element={<NearbyDorms />} />
                <Route path="/dorms" element={<Dorms />} />
                <Route path="/dorm/:id" element={<DormDetail />} />
                <Route path="/apply/:id" element={<Apply />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/profile/preview" element={<ProfilePreview />} />
                <Route path="/profile/privacy" element={<ProfilePrivacy />} />
                <Route path="/profile/settings" element={<ProfileSettings />} />
                <Route path="/my-jobs" element={<MyJobs />} />

                {/* ================= COMPANY ================= */}
                <Route path="/company" element={<CompanyHome />} />
                <Route path="/company/home" element={<CompanyHome />} />
                <Route path="/company/login" element={<CompanyLogin />} />
                <Route path="/company/register" element={<CompanyRegister />} />
                <Route path="/company/forgot-password" element={<CompanyForgotPassword />} />
                <Route path="/company/search" element={<CompanySearch />} />
                <Route path="/company/dashboard" element={<CompanyDashboard />} />
                <Route path="/company/create-job" element={<CompanyCreateJob />} />
                <Route path="/company/jobs" element={<CompanyJobs />} />
                <Route path="/company/jobs/:id" element={<CompanyJobDetail />} />
                <Route path="/company/jobs/edit/:id" element={<CompanyEditJob />} />
                <Route path="/company/jobs/:id/applicants" element={<CompanyApplicants />} />
                <Route path="/company/jobs/:jobId/applicants/:applicationId" element={<CompanyApplicantDetail />} />
                <Route path="/company/activity" element={<CompanyActivity />} />
                <Route path="/company/profile" element={<CompanyProfile />} />
                <Route path="/company/profile/edit" element={<CompanyProfileEdit />} />
                <Route path="/company/settings" element={<CompanySettings />} />

                {/* Catch-all: ดักพาร์ทที่ไม่รู้จัก ให้อยู่ล่างสุดบรรทัดเดียวเท่านั้น */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
}

export default App;