import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
function Navbar({ isLoginPage = false }) {
    const navigate = useNavigate();
    const location = useLocation();

    // 🔥 state สำหรับ hover เมนู
    const [hoverMenu, setHoverMenu] = useState(null);

    const [user, setUser] = useState(null);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        navigate("/home");
    };
    useEffect(() => {

        const updateUser = () => {
            setUser(
                JSON.parse(localStorage.getItem("user"))
            );
        };

        window.addEventListener(
            "storage",
            updateUser
        );

        return () => {
            window.removeEventListener(
                "storage",
                updateUser
            );
        };

    }, []);
    return (
        <div style={navStyle}>

            {/* LEFT: Logo */}
            <div
                style={logoStyle}
                onClick={() => navigate("/")}
            >
                <img
                    style={imgLogo}
                    src="/image/logo.png"
                />
                Tern<span style={logo}>Stay</span>
            </div>

            {/* RIGHT: Menu */}
            <div
                style={{
                    ...rightGroup,
                    marginLeft: isLoginPage ? "auto" : "0",
                }}
            >

                {/* 🔹 เมนู: หาที่ฝึกงาน */}
                {user ? (

                    <>
                        {/* หน้าหลัก */}
                        <div
                            className={`nav-item ${location.pathname === "/" ? "active" : ""
                                }`}
                            onClick={() => navigate("/")}
                        >
                            หน้าหลัก
                        </div>

                        {/* หางาน */}
                        <div
                            className={`nav-item ${location.pathname === "/home" ? "active" : ""
                                }`}
                            onClick={() => navigate("/home")}
                        >
                            หาที่ฝึกงาน
                        </div>


                        {/* ประวัติของฉัน */}
                        <div
                            className={`nav-item ${location.pathname === "/profile" ? "active" : ""
                                }`}
                            onClick={() => navigate("/profile")}
                        >
                            ประวัติของฉัน
                        </div>


                        {/* งานของฉัน */}
                        <div
                            className={`nav-item ${location.pathname === "/my-jobs" ? "active" : ""
                                }`}
                            onClick={() => navigate("/my-jobs")}
                        >
                            งานของฉัน
                        </div>


                        {/* Logout */}
                        <div
                            style={btnStyle}
                            className="itemStyle"
                            onClick={logout}
                        >
                            ออกจากระบบ
                        </div>

                    </>


                ) : (

                    <>
                        {/* หน้าหลัก */}
                        <div
                            className={`nav-item ${location.pathname === "/" ? "active" : ""
                                }`}
                            onClick={() => navigate("/")}
                        >
                            หน้าหลัก
                        </div>


                        {/* หาที่ฝึกงาน */}
                        <div
                            className={`nav-item ${location.pathname === "/home" ? "active" : ""
                                }`}
                            onClick={() => navigate("/home")}
                        >
                            หาที่ฝึกงาน
                        </div>


                        {/* สำหรับบริษัท */}
                        <div
                            className={`nav-item ${
                                location.pathname === "/company" ? "active" : ""
                            }`}
                            onClick={() => navigate("/company")}
                        >
                            สำหรับบริษัท
                        </div>


                        {/* Login */}
                        {!isLoginPage && (
                            <button
                                style={btnStyle}
                                onClick={() => navigate("/login")}
                            >
                                เข้าสู่ระบบ
                            </button>
                        )}

                    </>

                )}
            </div>
        </div>
    );
}

// Nav Container
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

// Logo
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

// Menu
const rightGroup = {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    fontSize: "16px",
};

// Menu หาที่ฝึก สำหรับบริษัท
const itemStyle = {
    cursor: "pointer",
    color: "#182e5b",
    paddingBottom: "3px",
};

// ปุ่ม เข้าสู่ระบบ
const btnStyle = {
    cursor: "pointer",
    fontSize: "14px",
    padding: "8px 18px",
    background: "#f76f3a",
    color: "white",
    border: "none",
    borderRadius: "8px",
};

export default Navbar;