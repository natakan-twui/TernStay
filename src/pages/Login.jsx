import "./Login.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    FaEye,
    FaEyeSlash,
    FaUser,
    FaLock,
    FaShieldAlt,
    FaSyncAlt,
    FaCheckCircle,
} from "react-icons/fa";
import {
    FiUser,
    FiLock,
    FiShield,
    FiKey,
    FiRefreshCw,
} from "react-icons/fi";
function Login() {
    const navigate = useNavigate();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
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

    // เปิดปิดรหัสผ่าน
    const [showPassword, setShowPassword] = useState(false);

    // ตรวจว่ากรอกเป็น email มั้ย
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // ทำให้มีเส้นใต้ขึ้นเวลาเลื่อนเมาส์ไปที่ ลืมรหัสผ่าน
    // const [hoverForgot, setHoverForgot] = useState(false);

    const handleLogin = async () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "ระบุอีเมล";
        }
        else if (!emailRegex.test(email)) {
            newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
        }

        if (!password.trim()) {
            newErrors.password = "ระบุรหัสผ่าน";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            const response = await fetch(
                "http://localhost:5000/api/user/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                if (data.message === "รหัสผ่านไม่ถูกต้อง") {

                    setErrors({
                        password: data.message
                    });

                } else {

                    setErrors({
                        email: data.message
                    });

                }

                return;
            }

            // เก็บ Token
            localStorage.setItem(
                "token",
                data.token
            );

            // เก็บ User
            // เก็บ User
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // แสดง Popup เมื่อล็อกอินสำเร็จ
            setShowSuccessPopup(true);

            setTimeout(() => {
                navigate("/home");
            }, 1500);
        } catch (error) {
            console.log(error);

            setErrors({
                email: "ไม่สามารถเชื่อมต่อ Server ได้"
            });
        }
    };

    return (
        <div>
            <Navbar isLoginPage={true} />

            <div className="login-container">

                {/* ฝั่งซ้าย */}
                <div className="login-left">

                    <div className="security-content">

                        <h1 className="company-title">
                            ระบบสำหรับจัดการบัญชี <span><br />ผู้ใช้งาน</span>
                        </h1>

                        <p className="content-title">
                            เพื่อความปลอดภัยของบัญชีผู้ใช้งาน TernStay <br />
                            โปรดตั้งรหัสผ่านที่คาดเดาได้ยาก <br />
                            และหลีกเลี่ยงการเปิดเผยข้อมูลการเข้าสู่ระบบแก่ผู้อื่น
                        </p>

                        <div className="security-image">
                            <img
                                src="\image\3.png"
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
                            ไม่ควรใช้รหัสผ่านเดียวกันกับเว็บไซต์หรือแอปพลิเคชันอื่น ๆ
                            เพื่อช่วยลดความเสี่ยงหากบัญชีใดบัญชีหนึ่งถูกเข้าถึงโดยไม่ได้รับอนุญาต
                        </p>


                    </div>

                </div>

                {/* ฝั่งขวา */}
                <div className="login-right">
                    <div className="login-card">
                        <h2 className="login-title">
                            เข้าสู่ระบบสำหรับผู้สมัครงาน
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
                            <p className="error-text-user">{errors.email}</p>
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
                                onClick={() => navigate("/forgot-password")}
                            >
                                ลืมรหัสผ่าน ?
                            </span>
                        </div>

                        <button
                            className="login-button"
                            onClick={handleLogin}
                        >
                            เข้าสู่ระบบ
                        </button>

                        <p className="login-text">
                            ยังไม่ได้เป็นสมาชิก TernStay?
                            <span
                                className="register-link"
                                onClick={() => navigate("/register")}
                            >
                                สมัครสมาชิก
                            </span>
                        </p>
                    </div>
                </div>

            </div>

            {showSuccessPopup && (
                <div className="login-success-overlay">
                    <div className="login-success-popup">
                        <div className="login-success-icon">
                            <FaCheckCircle />
                        </div>

                        <h3>เข้าสู่ระบบสำเร็จ</h3>

                        <p>ยินดีต้อนรับกลับสู่ TernStay</p>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Login;