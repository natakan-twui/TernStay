import "./CompanyLogin.css";
import NavbarCompany from "../../components/NavbarCompany";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { RxCross2 } from "react-icons/rx";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import {
    FaEye,
    FaEyeSlash,
    FaUser,
    FaLock,
    FaShieldAlt,
    FaSyncAlt,
} from "react-icons/fa";

import {
    FiUser,
    FiLock,
    FiShield,
    FiKey,
    FiRefreshCw,
} from "react-icons/fi";
function CompanyLogin() {
    const navigate = useNavigate();

    //ตรวจว่ากรอกอีเมล รหัสผ่าน
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    // const [focusedField, setFocusedField] = useState("");
    const validateField = (field, value) => {
        setErrors((prev) => ({
            ...prev,
            [field]: value.trim()
                ? ""
                : field === "email"
                    ? "ระบุอีเมล"
                    : "ระบุรหัสผ่าน",
        }));
    };
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("error");
    const [popupMessage, setPopupMessage] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);
    // เปิดปิดรหัสผ่าน
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (loggingIn) return;

        if (!email.trim() || !password.trim()) {
            setErrors({
                email: !email.trim() ? "กรุณาระบุอีเมล" : "",
                password: !password.trim() ? "กรุณาระบุรหัสผ่าน" : ""
            });
            return;
        }

        setErrors({
            email: "",
            password: ""
        });

        try {
            setLoggingIn(true);

            const response = await fetch(
                "http://localhost:5000/api/company/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setPopupType("error");
                setPopupMessage(
                    data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
                );
                setShowPopup(true);
                return;
            }

            localStorage.setItem("companyToken", data.token);
            localStorage.setItem("company", JSON.stringify(data.company));

            setPopupType("success");
            setPopupMessage("เข้าสู่ระบบสำหรับบริษัทสำเร็จ");
            setShowPopup(true);

        } catch (error) {
            console.error("COMPANY LOGIN ERROR:", error);

            setPopupType("error");
            setPopupMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
            setShowPopup(true);

        } finally {
            setLoggingIn(false);
        }
    };

    // ทำให้มีเส้นใต้ขึ้นเวลาเลื่อนเมาส์ไปที่ ลืมรหัสผ่าน
    // const [hoverForgot, setHoverForgot] = useState(false);

    return (
        <div>
            <NavbarCompany isLoginPage={true} />

            <div className="login-container">

                {/* ฝั่งซ้าย */}
                <div className="login-left">

                    <div className="security-content">

                        <h1 className="company-title">
                            ระบบจัดการองค์กร <span><br />สำหรับบริษัท</span>
                        </h1>

                        <p className="content-title">
                            ปัจจุบันมีอาชญากรรมทางไซเบอร์มุ่งโจมตีองค์กรทั่วโลก <br />
                            เพื่อความปลอดภัยของบัญชีการใช้งาน TernStay <br />
                            แนะนำให้ผู้ใช้งานเปลี่ยนรหัสผ่านใหม่
                        </p>

                        <div className="security-image">
                            <img
                                src="\image\image-Photoroom (1).png"
                                alt="Security"
                                className="security-img"
                            />
                        </div>

                        <div className="password-guide">
                            <h3>คำแนะนำในการตั้งรหัสผ่าน</h3>

                            <ul>
                                <li>
                                    มีความยาวอย่างน้อย 8 ตัวอักษร
                                </li>

                                <li>
                                    ใช้ตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และสัญลักษณ์ร่วมกัน
                                </li>

                                <li>
                                    หลีกเลี่ยงการใช้ชื่อ วันเกิด หรือข้อมูลส่วนตัว
                                </li>

                                <li>
                                    ควรเปลี่ยนรหัสผ่านเป็นประจำเพื่อความปลอดภัย
                                </li>
                            </ul>
                        </div>

                        <p className="security-footer">
                            นอกจากนี้คุณไม่ควรใช้รหัสผ่านชุดเดียวกันกับแพลตฟอร์มอื่น ๆ <br />
                            คุณควรเปลี่ยนรหัสผ่านให้ไม่ซ้ำกันเพื่อความปลอดภัยของบัญชีเหล่านั้นด้วย
                        </p>


                    </div>

                </div>

                {/* ฝั่งขวา */}
                <div className="login-right">
                    <div className="login-card">
                        <h2 className="login-title">
                            เข้าสู่ระบบสำหรับบริษัท
                        </h2>

                        <div className="input-container">

                            <FiUser className="input-icon" />

                            <input
                                type="email"
                                placeholder="อีเมล"
                                value={email}
                                onBlur={() => {
                                    validateField("email", email);
                                }}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email && e.target.value.trim()) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            email: "",
                                        }));
                                    }
                                }}
                                className={`login-input ${errors.email ? "error-input" : ""}`}
                            />

                        </div>
                        {errors.email && (
                            <p className="error-text">{errors.email}</p>
                        )}

                        <div className="password-container">

                            <FiLock className="input-icon" />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="รหัสผ่าน"
                                value={password}
                                onBlur={() => {
                                    validateField("password", password);
                                }}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password && e.target.value.trim()) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            password: "",
                                        }));
                                    }
                                }}
                                className={`login-input password-input ${errors.password ? "error-input" : ""
                                    }`}
                            />

                            <span className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>

                        </div>

                        {errors.password && (
                            <p className="error-text">{errors.password}</p>
                        )}

                        <div className="forgot-container">
                            <span
                                className="forgot-password"
                                // onMouseEnter={() => setHoverForgot(true)}
                                // onMouseLeave={() => setHoverForgot(false)}
                                onClick={() => navigate("/company/forgot-password")}
                            >
                                ลืมรหัสผ่าน ?
                            </span>
                        </div>

                        <button
                            type="button"
                            className="login-button"
                            onClick={handleLogin}
                            disabled={loggingIn}
                        >
                            {loggingIn ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                        </button>

                        <p className="login-text">
                            ยังไม่ได้เป็นสมาชิก TernStay?
                            <span
                                className="register-link"
                                onClick={() => navigate("/company/register")}
                            >
                                สมัครสมาชิก
                            </span>
                        </p>
                    </div>
                </div>

            </div>

            {showPopup && (
                <div
                    className="company-popup-overlay"
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        className={`company-popup ${popupType}`}
                        onClick={(e) => e.stopPropagation()}
                        role="alertdialog"
                        aria-modal="true"
                    >
                        <button
                            type="button"
                            className="company-popup-close"
                            onClick={() => setShowPopup(false)}
                            aria-label="ปิดหน้าต่าง"
                        >
                            <RxCross2 />
                        </button>

                        <div className="company-popup-icon">
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>

                        <h3>
                            {popupType === "success"
                                ? "เข้าสู่ระบบสำเร็จ"
                                : "เข้าสู่ระบบไม่สำเร็จ"}
                        </h3>

                        <p>{popupMessage}</p>

                        <button
                            type="button"
                            className="company-popup-btn"
                            onClick={() => {
                                setShowPopup(false);

                                if (popupType === "success") {
                                    navigate("/company/home");
                                }
                            }}
                        >
                            {popupType === "success" ? "เข้าสู่หน้าหลัก" : "ตกลง"}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CompanyLogin;