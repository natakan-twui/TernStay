// ===============================
// Import CSS และ Components
// ===============================
import "./Register.css";
import Navbar from "../components/Navbar";

// React Router สำหรับเปลี่ยนหน้า
import { useNavigate } from "react-router-dom";

// React Hooks
import { useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
// Icons
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

import {
    FiSearch,
    FiFileText,
    FiBriefcase,
    FiHome,
} from "react-icons/fi";


function Register() {

    // ===============================
    // React Router
    // ===============================
    // ใช้สำหรับเปลี่ยนหน้า เช่น /login
    const navigate = useNavigate();


    // ===============================
    // Loading State
    // ===============================
    // ใช้แสดง Loading ระหว่างกำลังส่งข้อมูล
    // ไปยัง Backend
    const [loading, setLoading] = useState(false);

const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    // ===============================
    // ข้อมูลผู้สมัคร
    // ===============================

    // ชื่อ
    const [firstName, setFirstName] = useState("");

    // นามสกุล
    const [lastName, setLastName] = useState("");

    // อีเมล
    const [email, setEmail] = useState("");

    // รหัสผ่าน
    const [password, setPassword] = useState("");

    // ยืนยันรหัสผ่าน
    const [confirmPassword, setConfirmPassword] = useState("");


    // ===============================
    // ยอมรับเงื่อนไข
    // ===============================

    // true = ยอมรับ
    // false = ยังไม่ยอมรับ
    const [acceptTerms, setAcceptTerms] = useState(false);


    // ===============================
    // Error Message
    // ===============================

    // เก็บข้อความ Error ของแต่ละช่อง
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: "",
    });


    // ===============================
    // Focus Field
    // ===============================

    // ใช้ตรวจว่าผู้ใช้กำลังกรอกช่องไหน
    // เพื่อเปลี่ยน Style ของ input
    const [focusedField, setFocusedField] = useState("");


    // ==================================================
    // Function ตรวจสอบข้อมูลแต่ละช่อง
    // ==================================================

    const validateField = (field, value) => {

        // ตัวแปรสำหรับเก็บข้อความ Error
        let message = "";


        // ตรวจสอบตามชื่อของ Field
        switch (field) {

            // ===============================
            // ตรวจสอบชื่อ
            // ===============================
            case "firstName":

                if (!value.trim()) {
                    message = "ระบุชื่อ";
                }

                break;


            // ===============================
            // ตรวจสอบนามสกุล
            // ===============================
            case "lastName":

                if (!value.trim()) {
                    message = "ระบุนามสกุล";
                }

                break;


            // ===============================
            // ตรวจสอบ Email
            // ===============================
            case "email":

                // ถ้าไม่ได้กรอก Email
                if (!value.trim()) {

                    message = "ระบุอีเมล";

                }

                // ตรวจสอบรูปแบบ Email
                else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ) {

                    message =
                        'ระบุอีเมลให้ถูกต้อง เช่น "TernStay@example.com"';

                }

                break;


            // ===============================
            // ตรวจสอบ Password
            // ===============================
            case "password":

                // ไม่ได้กรอกรหัสผ่าน
                if (!value.trim()) {

                    message = "ระบุรหัสผ่าน";

                }

                // รหัสผ่านน้อยกว่า 8 ตัว
                else if (value.length < 8) {

                    message = "ระบุรหัสผ่านอย่างน้อย 8 หลัก";

                }

                // รหัสผ่านมากกว่า 64 ตัว
                else if (value.length > 64) {

                    message = "ระบุรหัสผ่านไม่เกิน 64 หลัก";

                }

                // ตรวจสอบอักขระที่อนุญาต
                else if (
                    !/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/.test(value)
                ) {

                    message =
                        "รหัสผ่านใช้ได้เฉพาะ A-Z, a-z, 0-9 หรืออักขระพิเศษ";

                }

                break;


            // ===============================
            // ตรวจสอบ Confirm Password
            // ===============================
            case "confirmPassword":

                if (!value.trim()) {
                    message = "ยืนยันรหัสผ่าน";
                }

                break;


            // ===============================
            // Default
            // ===============================
            default:
                message = "";
        }


        // อัปเดต Error ของ Field นั้น
        setErrors((prev) => ({
            ...prev,
            [field]: message,
        }));
    };


    // ==================================================
    // Function สมัครสมาชิก
    // ==================================================

    const handleRegister = async () => {

        // ===============================
        // ตรวจสอบข้อมูลก่อนสมัคร
        // ===============================

        // เก็บ Error ใหม่
        const newErrors = {};


        // ===============================
        // ตรวจสอบชื่อ
        // ===============================

        if (!firstName.trim()) {
            newErrors.firstName = "ระบุชื่อ";
        }


        // ===============================
        // ตรวจสอบนามสกุล
        // ===============================

        if (!lastName.trim()) {
            newErrors.lastName = "ระบุนามสกุล";
        }


        // ===============================
        // ตรวจสอบ Email
        // ===============================

        if (!email.trim()) {

            newErrors.email = "ระบุอีเมล";

        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {

            newErrors.email =
                'ระบุอีเมลให้ถูกต้อง เช่น "TernStay@example.com"';

        }


        // ===============================
        // ตรวจสอบ Password
        // ===============================

        if (!password.trim()) {

            newErrors.password = "ระบุรหัสผ่าน";

        } else if (password.length < 8) {

            newErrors.password =
                "ระบุรหัสผ่านอย่างน้อย 8 หลัก";

        } else if (password.length > 64) {

            newErrors.password =
                "ระบุรหัสผ่านไม่เกิน 64 หลัก";

        } else if (
            !/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/.test(password)
        ) {

            newErrors.password =
                "รหัสผ่านใช้ได้เฉพาะ A-Z, a-z, 0-9 หรืออักขระพิเศษ";

        }


        // ===============================
        // ตรวจสอบ Confirm Password
        // ===============================

        if (!confirmPassword.trim()) {

            newErrors.confirmPassword =
                "ยืนยันรหัสผ่าน";

        }


        // แสดง Error ทั้งหมด
        setErrors(newErrors);


        // ===============================
        // ถ้ามี Error ให้หยุดการทำงาน
        // ===============================

        if (Object.keys(newErrors).length > 0) {
            return;
        }


        // ===============================
        // ตรวจสอบ Password ตรงกันหรือไม่
        // ===============================

        if (password !== confirmPassword) {

            setErrors((prev) => ({
                ...prev,
                confirmPassword: "รหัสผ่านไม่ตรงกัน",
            }));

            return;
        }


        // ===============================
        // ตรวจสอบการยอมรับ Terms
        // ===============================

        if (!acceptTerms) {

            setErrors((prev) => ({
                ...prev,

                terms:
                    "กรุณายอมรับเงื่อนไขข้อตกลงการใช้บริการ และนโยบายความเป็นส่วนตัวของ TernStay",
            }));

            return;
        }


        // ==================================================
        // เริ่มกระบวนการสมัครสมาชิก
        // ==================================================

        // เปิด Loading
        setLoading(true);


        try {

            // ===============================
            // ส่งข้อมูลไป Backend
            // ===============================

            const response = await fetch(
                "http://localhost:5000/api/user/register",
                {
                    method: "POST",

                    // ระบุว่าข้อมูลที่ส่งเป็น JSON
                    headers: {
                        "Content-Type": "application/json",
                    },

                    // ข้อมูลที่จะส่งไป Backend
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password,
                    }),
                }
            );


            // แปลง Response เป็น JSON
            const data = await response.json();


            // ===============================
            // ตรวจสอบ Response จาก Backend
            // ===============================

            if (!response.ok) {

                // ถ้าสมัครไม่สำเร็จ
                // เช่น Email ซ้ำ
                setErrors((prev) => ({
                    ...prev,
                    email: data.message,
                }));

                return;
            }


            // ===============================
            // สมัครสำเร็จ
            // ===============================

            // สมัครสมาชิกสำเร็จ แสดง Popup ก่อนเปลี่ยนหน้า
setShowSuccessPopup(true);


        } catch (error) {
            console.error("Register Error:", error);

            setErrors((prev) => ({
                ...prev,
                email: "ไม่สามารถเชื่อมต่อ Server ได้",
            }));
        } finally {
            setLoading(false);
        }
    };


    // ==================================================
    // แสดง / ซ่อน Password
    // ==================================================

    // Password
    const [showPassword, setShowPassword] = useState(false);

    // Confirm Password
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    // ==================================================
    // Return UI
    // ==================================================

    return (

        <div>

            {/* ==========================================
                Navbar
            ========================================== */}

            <Navbar isLoginPage={true} />


            {/* ==========================================
                Register Container
            ========================================== */}

            <div className="register-container">


                {/* ==========================================
                    ฝั่งซ้าย
                ========================================== */}

                <div className="register-left">

                    <div className="register-benefit">


                        {/* หัวข้อ */}

                        <h2>
                            หาโอกาสฝึกงานที่ใช่ ได้ที่{" "}
                            <span>TernStay</span>
                        </h2>


                        {/* รูปประกอบ */}

                        <img
                            src="/image/index.png"
                            alt="Register Illustration"
                            className="register-image"
                        />


                        {/* ==========================================
                            Benefit 1
                        ========================================== */}

                        <div className="benefit-item">

                            <div className="benefit-icon">
                                <FiSearch />
                            </div>

                            <div>

                                <h3>
                                    ฝากโปรไฟล์ให้บริษัทค้นหา
                                </h3>

                                <p>
                                    เพิ่มโอกาสให้บริษัทเห็นข้อมูลของคุณ
                                    แม้ยังไม่ได้สมัครงาน
                                </p>

                            </div>

                        </div>


                        {/* ==========================================
                            Benefit 2
                        ========================================== */}

                        <div className="benefit-item">

                            <div className="benefit-icon">
                                <FiFileText />
                            </div>

                            <div>

                                <h3>
                                    จัดการการสมัครฝึกงานของคุณ
                                </h3>

                                <p>
                                    ดูประวัติการสมัครงาน
                                    งานที่บันทึกไว้ และสถานะการสมัคร
                                </p>

                            </div>

                        </div>


                        {/* ==========================================
                            Benefit 3
                        ========================================== */}

                        <div className="benefit-item">

                            <div className="benefit-icon">
                                <FiBriefcase />
                            </div>

                            <div>

                                <h3>
                                    เชื่อมต่อกับบริษัทชั้นนำ
                                </h3>

                                <p>
                                    ค้นหาสถานที่ฝึกงานที่ตรงกับความสนใจ
                                    พร้อมข้อมูลบริษัทและรายละเอียดงาน
                                </p>

                            </div>

                        </div>


                        {/* ==========================================
                            Benefit 4
                        ========================================== */}

                        <div className="benefit-item">

                            <div className="benefit-icon">
                                <FiHome />
                            </div>

                            <div>

                                <h3>
                                    ค้นหาหอพักใกล้สถานที่ฝึกงาน
                                </h3>

                                <p>
                                    วางแผนที่พักได้ง่ายขึ้น
                                    ด้วยหอพักใกล้บริษัทที่คุณสนใจ
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    ฝั่งขวา
                ========================================== */}

                <div className="register-right">

                    <div className="register-card">


                        {/* ==========================================
                            หัวข้อสมัครสมาชิก
                        ========================================== */}

                        <h2 className="register-title">

                            สมัครสมาชิกสำหรับ
                            <span>ผู้สมัครงาน</span>

                        </h2>


                        {/* ==========================================
                            Section ข้อมูลผู้ใช้
                        ========================================== */}

                        <div className="register-user">

                            <h3>
                                ข้อมูลผู้ใช้
                            </h3>

                        </div>


                        {/* ==========================================
                            Input ชื่อ
                        ========================================== */}

                        <div className="box-input">

                            <input
                                type="text"
                                placeholder="กรอกชื่อ"
                                value={firstName}

                                // เมื่อ Focus
                                onFocus={() =>
                                    setFocusedField("firstName")
                                }

                                // เมื่อออกจาก Input
                                onBlur={() => {

                                    setFocusedField("");

                                    validateField(
                                        "firstName",
                                        firstName
                                    );

                                }}

                                // เมื่อพิมพ์
                                onChange={(e) => {

                                    setFirstName(
                                        e.target.value
                                    );

                                    // ลบ Error เมื่อกรอกข้อมูลแล้ว
                                    if (
                                        errors.firstName &&
                                        e.target.value.trim()
                                    ) {

                                        setErrors((prev) => ({
                                            ...prev,
                                            firstName: "",
                                        }));

                                    }

                                }}

                                // เปลี่ยน Class ตามสถานะ
                                className={`register-input ${errors.firstName
                                    ? "input-error"
                                    : focusedField === "firstName"
                                        ? "input-focus"
                                        : ""
                                    }`}
                            />

                            {/* Error Message */}

                            {errors.firstName && (
                                <p className="error-text">
                                    {errors.firstName}
                                </p>
                            )}

                        </div>


                        {/* ==========================================
                            Input นามสกุล
                        ========================================== */}

                        <div className="box-input">

                            <input
                                type="text"
                                placeholder="กรอกนามสกุล"
                                value={lastName}

                                onFocus={() =>
                                    setFocusedField("lastName")
                                }

                                onBlur={() => {

                                    setFocusedField("");

                                    validateField(
                                        "lastName",
                                        lastName
                                    );

                                }}

                                onChange={(e) => {

                                    setLastName(
                                        e.target.value
                                    );

                                    // ลบ Error เมื่อกรอกข้อมูล
                                    if (
                                        errors.lastName &&
                                        e.target.value.trim()
                                    ) {

                                        setErrors((prev) => ({
                                            ...prev,
                                            lastName: "",
                                        }));

                                    }

                                }}

                                className={`register-input ${errors.lastName
                                    ? "input-error"
                                    : focusedField === "lastName"
                                        ? "input-focus"
                                        : ""
                                    }`}
                            />


                            {/* Error */}

                            {errors.lastName && (
                                <p className="error-text">
                                    {errors.lastName}
                                </p>
                            )}

                        </div>


                        {/* ==========================================
                            Section ข้อมูลบัญชี
                        ========================================== */}

                        <div className="register-account">

                            <h3>
                                ข้อมูลบัญชีผู้ใช้
                            </h3>

                        </div>


                        {/* ==========================================
                            Input Email
                        ========================================== */}

                        <div className="box-input">

                            <input
                                type="email"
                                placeholder="กรอกอีเมล เช่น TernStay@example.com"
                                value={email}

                                onFocus={() =>
                                    setFocusedField("email")
                                }

                                onBlur={() => {

                                    setFocusedField("");

                                    validateField(
                                        "email",
                                        email
                                    );

                                }}

                                onChange={(e) => {

                                    setEmail(
                                        e.target.value
                                    );

                                    // ลบ Error
                                    if (
                                        errors.email &&
                                        e.target.value.trim()
                                    ) {

                                        setErrors((prev) => ({
                                            ...prev,
                                            email: "",
                                        }));

                                    }

                                }}

                                className={`register-input ${errors.email
                                    ? "input-error"
                                    : focusedField === "email"
                                        ? "input-focus"
                                        : ""
                                    }`}
                            />


                            {errors.email && (
                                <p className="error-text">
                                    {errors.email}
                                </p>
                            )}

                        </div>


                        {/* ==========================================
                            Input Password
                        ========================================== */}

                        <div className="box-input">

                            <div className="password-container">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="กรอกรหัสผ่าน"

                                    value={password}

                                    onFocus={() =>
                                        setFocusedField("password")
                                    }

                                    onBlur={() => {

                                        setFocusedField("");

                                        validateField(
                                            "password",
                                            password
                                        );

                                    }}

                                    onChange={(e) => {

                                        setPassword(
                                            e.target.value
                                        );

                                    }}

                                    className={`register-input password-input ${errors.password
                                        ? "input-error"
                                        : focusedField === "password"
                                            ? "input-focus"
                                            : ""
                                        }`}
                                />


                                {/* ปุ่มแสดง / ซ่อน Password */}

                                <span
                                    className="eye-icon"

                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }

                                </span>

                            </div>


                            {/* Error */}

                            {errors.password && (
                                <p className="error-text">
                                    {errors.password}
                                </p>
                            )}

                        </div>


                        {/* ==========================================
                            Input Confirm Password
                        ========================================== */}

                        <div className="box-input">

                            <div className="password-container">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="ยืนยันรหัสผ่าน"

                                    value={confirmPassword}

                                    onFocus={() =>
                                        setFocusedField(
                                            "confirmPassword"
                                        )
                                    }

                                    onBlur={() => {

                                        setFocusedField("");

                                        // ตรวจสอบว่ากรอกหรือยัง
                                        if (!confirmPassword.trim()) {

                                            setErrors((prev) => ({
                                                ...prev,
                                                confirmPassword:
                                                    "ยืนยันรหัสผ่าน",
                                            }));

                                        }

                                        // ตรวจสอบว่ารหัสผ่านตรงกันไหม
                                        else if (
                                            password !==
                                            confirmPassword
                                        ) {

                                            setErrors((prev) => ({
                                                ...prev,
                                                confirmPassword:
                                                    "ข้อมูลรหัสผ่านไม่ตรงกัน",
                                            }));

                                        }

                                        // ถ้าถูกต้อง
                                        else {

                                            setErrors((prev) => ({
                                                ...prev,
                                                confirmPassword: "",
                                            }));

                                        }

                                    }}

                                    onChange={(e) => {

                                        setConfirmPassword(
                                            e.target.value
                                        );

                                    }}

                                    className={`register-input password-input ${errors.confirmPassword
                                        ? "input-error"
                                        : focusedField ===
                                            "confirmPassword"
                                            ? "input-focus"
                                            : ""
                                        }`}
                                />


                                {/* ปุ่มแสดง / ซ่อน */}

                                <span
                                    className="eye-icon"

                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >

                                    {showConfirmPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }

                                </span>

                            </div>


                            {/* Error */}

                            {errors.confirmPassword && (
                                <p className="error-text">
                                    {errors.confirmPassword}
                                </p>
                            )}

                        </div>


                        {/* ==========================================
                            Checkbox Terms
                        ========================================== */}

                        <label className="checkbox-container">

                            <div
                                className={`checkbox-circle ${acceptTerms
                                    ? "checked"
                                    : ""
                                    }`}

                                onClick={() => {

                                    // เปลี่ยนสถานะ Checkbox
                                    setAcceptTerms(
                                        !acceptTerms
                                    );

                                    // ถ้าติ๊กแล้ว
                                    // ให้ลบ Error
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


                            {/* ข้อความ Terms */}

                            <span>

                                ฉันยอมรับ{" "}

                                <span className="register-link">
                                    ข้อตกลงการใช้บริการ
                                </span>

                                {" "}และ{" "}

                                <span className="register-link">
                                    นโยบายความเป็นส่วนตัว
                                </span>

                                {" "}ของ TernStay

                            </span>

                        </label>


                        {/* Terms Error */}

                        {errors.terms && (
                            <p className="terms-error">
                                {errors.terms}
                            </p>
                        )}


                        {/* ==========================================
                            ปุ่มสมัครสมาชิก
                        ========================================== */}

                        <button
                            className="register-button"
                            onClick={handleRegister}
                            disabled={loading}
                        >

                            {loading
                                ? "กำลังดำเนินการ..."
                                : "สมัครสมาชิก"
                            }

                        </button>


                        {/* ==========================================
                            Link ไปหน้า Login
                        ========================================== */}

                        <p className="register-text">

                            เป็นสมาชิกอยู่แล้ว?

                            <span
                                className="register-link login-link"

                                onClick={() =>
                                    navigate("/login")
                                }
                            >

                                เข้าสู่ระบบ

                            </span>

                        </p>

                    </div>

                </div>

            </div>


            {/* ==========================================
                Loading Overlay
            ========================================== */}

            {loading && (

                <div className="loading-overlay">

                    <div className="loading-popup">

                        {/* Spinner */}

                        <div className="spinner"></div>


                        {/* Loading Text */}

                        <h3 className="loading-text">
                            กำลังดำเนินการ...
                        </h3>

                    </div>

                </div>

            )}
```jsx
{/* ===============================
    LOADING POPUP
================================ */}
{loading && (
    <div className="register-popup-overlay">
        <div
            className="register-status-popup"
            role="status"
            aria-live="polite"
        >
            <div className="register-loading-spinner" />

            <h3>กำลังดำเนินการ...</h3>

            <p>กรุณารอสักครู่ ระบบกำลังสร้างบัญชีของคุณ</p>
        </div>
    </div>
)}

{/* ===============================
    SUCCESS POPUP
================================ */}

{showSuccessPopup && (
    <div className="register-popup-overlay">
        <div className="register-popup success">

            <button
                type="button"
                className="register-popup-close"
                onClick={() => setShowSuccessPopup(false)}
                aria-label="ปิดหน้าต่าง"
            >
                <RxCross2 />
            </button>

            <div className="register-popup-icon">
                <FaRegCircleCheck />
            </div>

            <h3>สมัครสมาชิกเรียบร้อยแล้ว</h3>

            <p>
                สร้างบัญชี TernStay สำเร็จแล้ว
                คุณสามารถเข้าสู่ระบบเพื่อเริ่มใช้งานได้ทันที
            </p>

            <button
                type="button"
                className="register-popup-btn"
                onClick={() => navigate("/login")}
            >
                เข้าสู่ระบบ
            </button>

        </div>
    </div>
)}


        </div>
    );
}


export default Register;