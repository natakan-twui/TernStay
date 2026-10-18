import "./CompanyRegister.css";
import NavbarCompany from "../../components/NavbarCompany";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FiSearch,
    FiFileText,
    FiBriefcase,
    FiHome,
} from "react-icons/fi";
import { FaEye, FaEyeSlash, FaCheck, FaUsers } from "react-icons/fa";
function CompanyRegister() {
    const navigate = useNavigate();

    // ตัวหมุนดำเนินการ
    const [loading, setLoading] = useState(false);

    //ตรวจว่ากรอก ชื่อ นามสกุล อีเมล รหัสผ่าน ยืนยันรหัสผ่าน
    const [companyName, setCompanyName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [accountEmail, setAccountEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // ยืนยันก่อนกดสมัคร
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState({
        accountEmail: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        businessType: "",
        contactName: "",
        phone: "",
        contactEmail: "",
        terms: ""
    });

    const [focusedField, setFocusedField] = useState("");
    const validateField = (field, value) => {
        let message = "";

        switch (field) {
            case "accountEmail":
                if (!value.trim()) {
                    message = "ระบุอีเมลตั้งค่าบัญชี";
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ) {
                    message = "ระบุอีเมลให้ถูกต้อง"
                }
                break;

            case "companyName":
                if (!value.trim()) {
                    message = "ระบุชื่อบริษัท";
                }
                break;

            // case "businessType":
            //     if (!value.trim()) {
            //         message = "ระบุลักษณะธุรกิจ";
            //     }
            //     break;

            case "contactName":
                if (!value.trim()) {
                    message = "ระบุชื่อผู้ติดต่อ";
                }
                break;

            case "phone":
                if (!value.trim()) {
                    message = "ระบุเบอร์โทรศัพท์";
                }
                break;

            case "contactEmail":
                if (!value.trim()) {
                    message = "ระบุอีเมลติดต่อ";
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ) {
                    message = "ระบุอีเมลให้ถูกต้อง";
                }
                break;

            case "password":
                if (!value.trim()) {
                    message = "ระบุรหัสผ่าน";
                } else if (value.length < 8) {
                    message = "ระบุรหัสผ่านอย่างน้อย 8 หลัก";
                } else if (value.length > 64) {
                    message = "ระบุรหัสผ่านไม่เกิน 64 หลัก"
                } else if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/.test(value)) {
                    message = "รหัสผ่านใช้ได้เฉพาะ A-Z, a-z, 0-9 หรืออักขระพิเศษ";
                }
                break;

            case "confirmPassword":
                if (!value.trim()) {
                    message = "ยืนยันรหัสผ่าน";
                }
                break;

            default:
                message = "";
        }

        setErrors((prev) => ({
            ...prev,
            [field]: message,
        }));
    };

    const handleRegister = async () => {
        const newErrors = {};

        // Email บัญชี
        if (!accountEmail.trim()) {
            newErrors.accountEmail = "ระบุอีเมลตั้งค่าบัญชี";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(accountEmail)
        ) {
            newErrors.accountEmail = "ระบุอีเมลให้ถูกต้อง";
        }

        // ชื่อบริษัท
        if (!companyName.trim()) {
            newErrors.companyName = "ระบุชื่อบริษัท";
        }

        // ชื่อผู้ติดต่อ
        if (!contactName.trim()) {
            newErrors.contactName = "ระบุชื่อผู้ติดต่อ";
        }

        // เบอร์โทร
        if (!phone.trim()) {
            newErrors.phone = "ระบุเบอร์โทรศัพท์";
        }

        // Email ติดต่อ
        if (!contactEmail.trim()) {
            newErrors.contactEmail = "ระบุอีเมลติดต่อ";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactEmail)
        ) {
            newErrors.contactEmail = "ระบุอีเมลให้ถูกต้อง";
        }

        // Password
        if (!password.trim()) {
            newErrors.password = "ระบุรหัสผ่าน";
        } else if (password.length < 8) {
            newErrors.password = "ระบุรหัสผ่านอย่างน้อย 8 หลัก";
        } else if (password.length > 64) {
            newErrors.password = "ระบุรหัสผ่านไม่เกิน 64 หลัก";
        } else if (
            !/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/.test(
                password
            )
        ) {
            newErrors.password =
                "รหัสผ่านใช้ได้เฉพาะ A-Z, a-z, 0-9 หรืออักขระพิเศษ";
        }

        // Confirm Password
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "ยืนยันรหัสผ่าน";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
        }

        // แสดง Error
        setErrors(newErrors);

        // ถ้ามี error หยุด
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Terms
        if (!acceptTerms) {
            setErrors((prev) => ({
                ...prev,
                terms:
                    "กรุณายอมรับเงื่อนไขข้อตกลงการใช้บริการ และนโยบายความเป็นส่วนตัวของ TernStay",
            }));
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/company/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: accountEmail.trim(),
                        password: password,

                        companyName: companyName.trim(),
                        businessType: businessType.trim(),

                        contactName: contactName.trim(),
                        phone: phone.trim(),
                        contactEmail: contactEmail.trim(),
                    }),
                }
            );

            const data = await response.json();

            console.log("Register response:", data);

            if (!response.ok) {
                setErrors((prev) => ({
                    ...prev,
                    accountEmail:
                        data.message || "สมัครสมาชิกไม่สำเร็จ",
                }));

                return;
            }

            // สมัครสำเร็จ
            alert("สมัครสมาชิกบริษัทสำเร็จ");

            navigate("/company/login");

        } catch (error) {
            console.error("Register error:", error);

            setErrors((prev) => ({
                ...prev,
                accountEmail: "ไม่สามารถเชื่อมต่อ Server ได้",
            }));

        } finally {
            setLoading(false);
        }
    };
    // เปิดปิดรหัสผ่าน
    const [showPassword, setShowPassword] = useState(false);

    // เปิดปิดยืนยันรหัสผ่าน
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // ทำให้มีเส้นใต้ขึ้นเวลาเลื่อนเมาส์ไปที่ ลืมรหัสผ่าน
    // const [hoverForgot, setHoverForgot] = useState(false);



    return (
        <div>
            <NavbarCompany />

            <div className="register-container">

                {/* ฝั่งซ้าย */}
                <div className="register-left">
                    <div className="register-benefit">

                        <h2>
                            ค้นหานักศึกษาฝึกงานที่ใช่ ได้ที่ <span>TernStay</span>
                        </h2>

                        <img
                            src="/image/Dashboard.jpeg"
                            alt="Register Illustration"
                            className="register-image"
                        />

                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <FiSearch />
                            </div>

                            <div>
                                <h3>ค้นหาคนที่ใช่</h3>
                                <p className="benefit-item">

                                    ค้นหานักศึกษาฝึกงานที่มีศักยภาพ <br />
                                    ตรงกับความต้องการของบริษัท
                                </p>
                            </div>
                        </div>


                        <div className="benefit-item">
                            <div className="benefit-icon">
                                📄
                            </div>

                            <div>
                                <h3>สร้างโอกาสให้บริษัทเป็นที่รู้จัก</h3>
                                <p className="benefit-item">

                                    แนะนำข้อมูลบริษัทและตำแหน่งฝึกงาน <br />
                                    ให้กับนักศึกษาที่กำลังมองหาโอกาส
                                </p>
                            </div>
                        </div>


                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <FaUsers />
                            </div>

                            <div>
                                <h3>จัดการได้ง่าย</h3>
                                <p className="benefit-item">
                                    ระบบใช้งานง่าย ครบจบในที่เดียว <br />
                                    สำหรับบริษัทของคุณ
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ฝั่งขวา */}
                <div className="register-right">
                    <div className="register-card">
                        <h2 className="register-title-company">
                            สมัครสมาชิกสำหรับ<span>บริษัท</span>
                        </h2>


                        <div className="box-input">

                            <div className="register-company">
                                <h3>ข้อมูลบริษัท</h3>
                            </div>

                            <input
                                type="text"
                                placeholder="กรอกอีเมลตั้งค่าบัญชี"
                                value={accountEmail}
                                onFocus={() => setFocusedField("accountEmail")}
                                onBlur={() => {
                                    setFocusedField("");
                                    validateField("accountEmail", accountEmail);
                                }}
                                onChange={(e) => {
                                    setAccountEmail(e.target.value);
                                    if (errors.accountEmail && e.target.value.trim()) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            accountEmail: "",
                                        }));
                                    }
                                }}
                                className={`register-input ${errors.accountEmail
                                    ? "input-error"
                                    : focusedField === "accountEmail"
                                        ? "input-focus"
                                        : ""
                                    }`}
                            />

                            {errors.accountEmail && (
                                <p className="error-text">
                                    {errors.accountEmail}
                                </p>
                            )}
                        </div>



                        {/* รหัสผ่าน */}
                        <div className="box-input">
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="กรอกรหัสผ่าน"
                                    value={password}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => {
                                        setFocusedField("");
                                        validateField("password", password);
                                    }}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    className={`register-input password-input ${errors.password
                                        ? "input-error"
                                        : focusedField === "password"
                                            ? "input-focus"
                                            : ""
                                        }`}
                                />

                                <span
                                    className="eye-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {errors.password && (
                                <p className="error-text">
                                    {errors.password}
                                </p>
                            )}

                        </div>

                        {/* ยืนยันรหัสผ่าน */}
                        <div className="box-input">
                            <div className="password-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="ยืนยันรหัสผ่าน"
                                    value={confirmPassword}
                                    onFocus={() => setFocusedField("confirmPassword")}
                                    onBlur={() => {
                                        setFocusedField("");

                                        if (!confirmPassword.trim()) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                confirmPassword: "ยืนยันรหัสผ่าน",
                                            }));
                                        } else if (password !== confirmPassword) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                confirmPassword: "ข้อมูลรหัสผ่านไม่ตรงกัน",
                                            }));
                                        } else {
                                            setErrors((prev) => ({
                                                ...prev,
                                                confirmPassword: "",
                                            }));
                                        }
                                    }}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                    className={`register-input password-input ${errors.confirmPassword
                                        ? "input-error"
                                        : focusedField === "confirmPassword"
                                            ? "input-focus"
                                            : ""
                                        }`}
                                />

                                <span
                                    className="eye-icon"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {errors.confirmPassword && (
                                <p className="error-text">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div className="register-company">
                            <h3>ข้อมูลติดต่อ</h3>
                        </div>

                        <div className="box-input">
                            <input
                                type="text"
                                className={`register-input ${errors.contactName
                                    ? "input-error"
                                    : focusedField === "contactName"
                                        ? "input-focus"
                                        : ""
                                    }`}
                                placeholder="กรอกชื่อผู้ติดต่อ"
                                value={contactName}
                                onFocus={() => setFocusedField("contactName")}
                                onBlur={() => {
                                    setFocusedField("");
                                    validateField("contactName", contactName);
                                }}
                                onChange={(e) => {
                                    setContactName(e.target.value);

                                    if (errors.contactName && e.target.value.trim()) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            contactName: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.contactName && (
                                <p className="error-text">
                                    {errors.contactName}
                                </p>
                            )}
                        </div>

                        <div className="box-input">
                            <input
                                type="text"
                                className={`register-input ${errors.phone
                                    ? "input-error"
                                    : focusedField === "phone"
                                        ? "input-focus"
                                        : ""
                                    }`}
                                placeholder="กรอกเบอร์โทรศัพท์"
                                value={phone}
                                onFocus={() => setFocusedField("phone")}
                                onBlur={() => {
                                    setFocusedField("");
                                    validateField("phone", phone);
                                }}
                                onChange={(e) => {
                                    setPhone(e.target.value);

                                    if (errors.phone && e.target.value.trim()) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            phone: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.phone && (
                                <p className="error-text">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="box-input">
                            <input
                                type="email"
                                className={`register-input ${errors.contactEmail
                                    ? "input-error"
                                    : focusedField === "contactEmail"
                                        ? "input-focus"
                                        : ""
                                    }`}
                                placeholder="กรอกอีเมลติดต่อ"
                                value={contactEmail}
                                onFocus={() => setFocusedField("contactEmail")}
                                onBlur={() => {
                                    setFocusedField("");
                                    validateField("contactEmail", contactEmail);
                                }}
                                onChange={(e) => {
                                    setContactEmail(e.target.value);

                                    if (errors.contactEmail && e.target.value.trim()) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            contactEmail: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.contactEmail && (
                                <p className="error-text">
                                    {errors.contactEmail}
                                </p>
                            )}
                        </div>


                        {/* ยืนยัน */}
                        <label className="checkbox-container">

                            <div
                                className={`checkbox-circle ${acceptTerms ? "checked" : ""
                                    }`}
                                onClick={() => {
                                    setAcceptTerms(!acceptTerms);

                                    if (!acceptTerms) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            terms: "",
                                        }));
                                    }
                                }}
                            >
                                {acceptTerms && "✓"}
                            </div>

                            <span>
                                ฉันยอมรับ{" "}
                                <span className="register-link">
                                    ข้อตกลงการใช้บริการ
                                </span>{" "}
                                และ{" "}
                                <span className="register-link">
                                    นโยบายความเป็นส่วนตัว
                                </span>{" "}
                                ของ TernStay
                            </span>

                        </label>
                        {errors.terms && (
                            <p className="terms-error">
                                {errors.terms}
                            </p>
                        )}

                        <button
                            className="register-button"
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                        </button>

                        <p className="register-text">
                            เป็นสมาชิกอยู่แล้ว?
                            <span
                                className="register-link login-link"
                                onClick={() => navigate("/login")}
                            >
                                เข้าสู่ระบบ
                            </span>
                        </p>
                    </div>
                </div>

            </div>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-popup">
                        <div className="spinner"></div>

                        <h3 className="loading-text">
                            กำลังดำเนินการ...
                        </h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CompanyRegister;