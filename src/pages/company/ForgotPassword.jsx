import "./ForgotPassword.css";
import NavbarCompany from "../../components/NavbarCompany";
import { useState } from "react";
import { FiLock, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";

function ForgotPassword() {
    
    const [phone, setPhone] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const [focusedField, setFocusedField] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ==========================
    // ตรวจสอบเบอร์โทรศัพท์
    // ==========================

    const checkPhone = () => {
        if (!phone.trim()) {
            setPhoneError("ระบุเบอร์โทรศัพท์");
            return false;
        }

        if (!/^0[0-9]{9}$/.test(phone)) {
            setPhoneError(
                "ข้อมูลเบอร์โทรศัพท์ไม่ถูกต้อง กรุณาระบุเบอร์โทรศัพท์ใหม่อีกครั้ง"
            );
            return false;
        }

        setPhoneError("");
        return true;
    };

    // ==========================
    // ตรวจสอบรหัสผ่าน
    // ==========================

    const checkPassword = () => {
        if (!newPassword.trim()) {
            setPasswordError("ระบุรหัสผ่านใหม่");
            return false;
        }

        if (newPassword.length < 6) {
            setPasswordError(
                "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
            );
            return false;
        }

        setPasswordError("");
        return true;
    };

    // ==========================
    // ตรวจสอบยืนยันรหัสผ่าน
    // ==========================

    const checkConfirmPassword = () => {
        if (!confirmPassword.trim()) {
            setConfirmError("ระบุการยืนยันรหัสผ่าน");
            return false;
        }

        if (confirmPassword !== newPassword) {
            setConfirmError(
                "รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง"
            );
            return false;
        }

        setConfirmError("");
        return true;
    };

    // ==========================
    // Submit
    // ==========================

    const handleSavePassword = async () => {
    const phoneValid = checkPhone();
    const passwordValid = checkPassword();
    const confirmValid = checkConfirmPassword();

    if (!phoneValid || !passwordValid || !confirmValid) {
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/company/forgot-password",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone,
                    newPassword,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setPhoneError(data.message);
            return;
        }

        alert("เปลี่ยนรหัสผ่านสำเร็จ");
        window.location.href = "/company/login";

    } catch (error) {
        console.error(error);

        setPhoneError(
            "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
        );
    }
};

    // ==========================
    // กลับหน้า Login
    // ==========================

    const handleBackLogin = () => {
        window.location.href = "/company/login";
    };

    return (
        <div className="ternstay-forgot-page">

            <NavbarCompany isLoginPage={true} />

            <div className="ternstay-forgot-wrapper">

                {/* =================================
                    LEFT
                ================================= */}

                <section className="ternstay-forgot-left">

                    <div className="ternstay-forgot-information">

                        <h1 className="ternstay-forgot-heading">
                            ลืม<span>รหัสผ่าน</span>
                        </h1>

                        <p className="ternstay-forgot-description">
                            ไม่ต้องกังวล! เพียงกรอกเบอร์โทรศัพท์ <br />
                            ที่คุณใช้สมัครสมาชิกกับ TernStay <br />
                            แล้วตั้งรหัสผ่านใหม่ได้ทันที
                        </p>


                        {/* รูปภาพ */}

                        <div className="ternstay-forgot-visual">

                            <div className="ternstay-forgot-image">
                                🔐
                            </div>

                        </div>


                        {/* ขั้นตอน */}

                        <div className="ternstay-forgot-guide">

                            <h3>
                                ขั้นตอนการตั้งรหัสผ่านใหม่
                            </h3>

                            <div className="ternstay-forgot-step">

                                <span className="ternstay-forgot-step-number">
                                    01
                                </span>

                                <span>
                                    กรอกเบอร์โทรศัพท์ที่ใช้สมัครสมาชิก
                                </span>

                            </div>


                            <div className="ternstay-forgot-step">

                                <span className="ternstay-forgot-step-number">
                                    02
                                </span>

                                <span>
                                    กำหนดรหัสผ่านใหม่
                                </span>

                            </div>


                            <div className="ternstay-forgot-step">

                                <span className="ternstay-forgot-step-number">
                                    03
                                </span>

                                <span>
                                    ยืนยันรหัสผ่านใหม่
                                </span>

                            </div>

                        </div>


                        <p className="ternstay-forgot-footer">
                            หากเบอร์โทรศัพท์ถูกต้อง
                            คุณสามารถตั้งรหัสผ่านใหม่ได้ทันที
                        </p>

                    </div>

                </section>


                {/* =================================
                    RIGHT
                ================================= */}

                <section className="ternstay-forgot-right">

                    <div className="ternstay-forgot-card">

                        <h2 className="ternstay-forgot-title">
                            ลืมรหัสผ่าน
                        </h2>

                        <p className="ternstay-forgot-subtitle">
                            กรอกเบอร์โทรศัพท์ที่คุณใช้สมัครสมาชิก
                        </p>


                        {/* =================================
                            PHONE
                        ================================= */}

                        <div className="ternstay-forgot-field">

                            <label>
                                เบอร์โทรศัพท์
                            </label>

                            <div
                                className={`ternstay-forgot-input-wrapper ${phoneError
                                        ? "ternstay-forgot-input-error"
                                        : focusedField === "phone"
                                            ? "ternstay-forgot-input-focus"
                                            : ""
                                    }`}
                            >

                                <span className="ternstay-forgot-input-icon">
                                    <FiPhone />
                                </span>

                                <input
                                    type="tel"
                                    placeholder="เบอร์โทรศัพท์"
                                    value={phone}
                                    maxLength={10}

                                    onFocus={() =>
                                        setFocusedField("phone")
                                    }

                                    onBlur={() => {
                                        setFocusedField("");
                                        checkPhone();
                                    }}

                                    onChange={(e) => {

                                        const value =
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        setPhone(value);

                                        if (phoneError) {
                                            setPhoneError("");
                                        }
                                    }}
                                />

                            </div>

                            {phoneError && (
                                <p className="ternstay-forgot-error">
                                    {phoneError}
                                </p>
                            )}

                        </div>


                        {/* =================================
                            NEW PASSWORD
                        ================================= */}

                        <div className="ternstay-forgot-field">

                            <label>
                                รหัสผ่านใหม่
                            </label>

                            <div
                                className={`ternstay-forgot-input-wrapper ${passwordError
                                        ? "ternstay-forgot-input-error"
                                        : focusedField === "password"
                                            ? "ternstay-forgot-input-focus"
                                            : ""
                                    }`}
                            >

                                <span className="ternstay-forgot-input-icon">
                                    <FiLock />
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="รหัสผ่านใหม่"
                                    value={newPassword}

                                    onFocus={() =>
                                        setFocusedField("password")
                                    }

                                    onBlur={() => {
                                        setFocusedField("");
                                        checkPassword();
                                    }}

                                    onChange={(e) => {
                                        setNewPassword(
                                            e.target.value
                                        );

                                        if (passwordError) {
                                            setPasswordError("");
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    className="ternstay-forgot-eye"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>

                            </div>

                            {passwordError && (
                                <p className="ternstay-forgot-error">
                                    {passwordError}
                                </p>
                            )}

                        </div>


                        {/* =================================
                            CONFIRM PASSWORD
                        ================================= */}

                        <div className="ternstay-forgot-field">

                            <label>
                                ยืนยันรหัสผ่าน
                            </label>

                            <div
                                className={`ternstay-forgot-input-wrapper ${confirmError
                                        ? "ternstay-forgot-input-error"
                                        : focusedField === "confirm"
                                            ? "ternstay-forgot-input-focus"
                                            : ""
                                    }`}
                            >

                                <span className="ternstay-forgot-input-icon">
                                    <FiLock />
                                </span>

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="ยืนยันรหัสผ่าน"
                                    value={confirmPassword}

                                    onFocus={() =>
                                        setFocusedField("confirm")
                                    }

                                    onBlur={() => {
                                        setFocusedField("");
                                        checkConfirmPassword();
                                    }}

                                    onChange={(e) => {
                                        setConfirmPassword(
                                            e.target.value
                                        );

                                        if (confirmError) {
                                            setConfirmError("");
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    className="ternstay-forgot-eye"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword
                                        ? "🙈"
                                        : "👁"}
                                </button>

                            </div>

                            {confirmError && (
                                <p className="ternstay-forgot-error">
                                    {confirmError}
                                </p>
                            )}

                        </div>


                        {/* =================================
                            SAVE
                        ================================= */}

                        <button
                            type="button"
                            className="ternstay-forgot-save"
                            onClick={handleSavePassword}
                        >
                            บันทึกรหัสผ่าน
                        </button>


                        {/* =================================
                            OR
                        ================================= */}

                        <div className="ternstay-forgot-divider">

                            <span></span>

                            <p>หรือ</p>

                            <span></span>

                        </div>


                        {/* =================================
                            BACK LOGIN
                        ================================= */}

                        <button
                            type="button"
                            className="ternstay-forgot-back"
                            onClick={handleBackLogin}
                        >
                            กลับไปเข้าสู่ระบบ
                        </button>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default ForgotPassword;