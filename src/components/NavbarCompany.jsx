import { useNavigate, useLocation } from "react-router-dom";

import "./NavbarCompany.css";

function NavbarCompany() {
    const navigate = useNavigate();
    const location = useLocation();

    // เช็ค Login
    const companyToken = localStorage.getItem("companyToken");
    const isLogin = !!companyToken;

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("companyToken");
        localStorage.removeItem("company");

        navigate("/company/login");
    };

    // เช็คเมนูที่กำลังเปิดอยู่
    const isProfileActive =
        location.pathname === "/company/profile" ||
        location.pathname === "/company/profile/edit" ||
        location.pathname === "/company/settings";

    const isSearchActive =
        location.pathname === "/company/search";

    const isJobsActive =
        location.pathname.startsWith("/company/dashboard") ||
        location.pathname.startsWith("/company/jobs");

    return (
        <div style={navStyle}>

            {/* Logo */}
            <div
                style={logoStyle}
                onClick={() => navigate("/company")}
            >
                <img
                    style={imgLogo}
                    src="/image/logo.png"
                    alt="TernStay"
                />
                Tern<span style={logo}>Stay</span>
            </div>

            {/* Menu */}
            <div style={rightGroup}>

                {isLogin ? (
                    <>
                        {/* หน้าหลัก */}
                        <div
                            className={`nav-item ${
                                location.pathname === "/company" ||
                                location.pathname === "/company/home"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => navigate("/company")}
                        >
                            หน้าหลัก
                        </div>

                        {/* ลงประกาศงาน */}
                        <div
                            className={`nav-item ${
                                location.pathname === "/company/create-job"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => navigate("/company/create-job")}
                        >
                            ลงประกาศงาน
                        </div>

                        {/* งานของฉัน */}
                        <div
                            className={`nav-item ${
                                isJobsActive ? "active" : ""
                            }`}
                            onClick={() => navigate("/company/dashboard")}
                        >
                            งานของฉัน
                        </div>

                        {/* ค้นหาผู้สมัคร */}
                        {/* <div
                            className={`nav-item ${
                                isSearchActive ? "active" : ""
                            }`}
                            onClick={() => navigate("/company/search")}
                        >
                            ค้นหาผู้สมัคร
                        </div> */}

                        {/* โปรไฟล์บริษัท */}
                        <div
                            className={`nav-item ${
                                isProfileActive ? "active" : ""
                            }`}
                            onClick={() => navigate("/company/profile")}
                        >
                            โปรไฟล์บริษัท
                        </div>

                        {/* ออกจากระบบ */}
                        <button
                            style={btnStyle}
                            onClick={handleLogout}
                        >
                            ออกจากระบบ
                        </button>
                    </>
                ) : (
                    <>
                        {/* หน้าหลัก */}
                        <div
                            className={`nav-item ${
                                location.pathname === "/company" ||
                                location.pathname === "/company/home"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => navigate("/company")}
                        >
                            หน้าหลัก
                        </div>

                        {/* ค้นหาผู้สมัคร */}
                        <div
                            className={`nav-item ${
                                isSearchActive ? "active" : ""
                            }`}
                            onClick={() => navigate("/company/search")}
                        >
                            ค้นหาผู้สมัคร
                        </div>

                        {/* หาที่ฝึกงาน */}
                        <div
                            className={`nav-item ${
                                location.pathname === "/"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => navigate("/")}
                        >
                            สำหรับผู้สมัคร
                        </div>

                        {/* เข้าสู่ระบบ */}
                        <button
                            style={btnStyle}
                            onClick={() => navigate("/company/login")}
                        >
                            เข้าสู่ระบบ
                        </button>
                    </>
                )}

            </div>
        </div>
    );
}

/* Nav Container */
const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 50px",
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
};

/* Logo */
const logoStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#182e5b",
};

const logo = {
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#f76f3a",
};

const imgLogo = {
    width: "15%",
    heignt: "15%",

}

/* Menu */
const rightGroup = {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    fontSize: "16px",
};

/* Button */
const btnStyle = {
    cursor: "pointer",
    fontSize: "14px",
    padding: "8px 18px",
    background: "#f76f3a",
    color: "white",
    border: "none",
    borderRadius: "8px",
};

export default NavbarCompany;