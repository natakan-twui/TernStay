import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    FaUser,
    FaEdit,
    FaEye,
    FaLock,
    FaCog
} from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { 
    IoIosCloseCircle,
    IoIosSettings

 } from "react-icons/io";
import {
    FiEye,
    FiEyeOff,
    FiSave,
    FiLogOut,
    FiTrash2,
    FiUser,
    FiLock
} from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";
import Navbar from "../components/Navbar";
import "./ProfileSettings.css";

function ProfileSettings() {

    const navigate = useNavigate();
    const location = useLocation();

    // ==================================================
    // User & Loading
    // ==================================================

    // เก็บข้อมูลผู้ใช้ที่ดึงมาจาก API
    const [user, setUser] = useState(null);

    // สถานะกำลังโหลดข้อมูล Profile
    const [loading, setLoading] = useState(true);

    // ==================================================
    // Popup
    // ==================================================

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupAction, setPopupAction] = useState(null);

    const openPopup = (type, title, message, action = null) => {
        setPopupType(type);
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupAction(() => action);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupAction(null);
    };

    const handlePopupConfirm = () => {
        const action = popupAction;

        closePopup();

        if (action) {
            action();
        }
    };
    // ==================================================
    // Account Information
    // ข้อมูลบัญชีผู้ใช้
    // ==================================================

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");

    // สถานะกำลังบันทึกข้อมูลบัญชี
    const [savingAccount, setSavingAccount] = useState(false);


    // ==================================================
    // Password
    // การเปลี่ยนรหัสผ่าน
    // ==================================================

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // เปิด / ปิดการแสดงรหัสผ่าน
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // สถานะกำลังเปลี่ยนรหัสผ่าน
    const [changingPassword, setChangingPassword] = useState(false);

    // เก็บ Error ของแต่ละช่องรหัสผ่าน
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    // ==================================================
    // Load Profile
    // ดึงข้อมูล Profile จาก API
    // ==================================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                // ดึง Token จาก localStorage
                const token = localStorage.getItem("token");

                // ถ้าไม่มี Token ให้กลับไปหน้า Login
                if (!token) {
                    navigate("/login");
                    return;
                }

                // เรียก API เพื่อดึงข้อมูล Profile
                const response = await fetch(
                    "http://localhost:5000/api/user/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                // ถ้า API ส่ง Error กลับมา
                if (!response.ok) {

                    console.log(data);

                    // Token หมดอายุหรือไม่ถูกต้อง
                    if (
                        response.status === 401 ||
                        response.status === 403
                    ) {

                        localStorage.removeItem("token");
                        localStorage.removeItem("user");

                        navigate("/login");
                    }

                    return;
                }

                // เก็บข้อมูล User
                setUser(data);

                // นำข้อมูลจาก API มาใส่ใน State
                setFirstName(data.firstName || "");
                setLastName(data.lastName || "");
                setEmail(data.email || "");
                setPhone(data.phone || "");

                // แปลงวันเกิดให้อยู่ในรูปแบบ YYYY-MM-DD
                setBirthDate(
                    data.birthDate
                        ? new Date(data.birthDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                );

                setGender(data.gender || "");
                setAddress(data.address || "");

            } catch (error) {

                console.error(
                    "PROFILE SETTINGS ERROR:",
                    error
                );

            } finally {

                // ปิด Loading เมื่อทำงานเสร็จ
                setLoading(false);
            }
        };

        fetchProfile();

    }, [navigate]);


    // ==================================================
    // Save Account
    // บันทึกข้อมูลบัญชี
    // ==================================================

    const handleSaveAccount = async () => {

        try {

            // ดึง Token จาก localStorage
            const token = localStorage.getItem("token");

            // ถ้าไม่มี Token ให้กลับไปหน้า Login
            if (!token) {
                navigate("/login");
                return;
            }

            // เปิดสถานะกำลังบันทึก
            setSavingAccount(true);

            // ส่งข้อมูลไปยัง API
            const response = await fetch(
                "http://localhost:5000/api/user/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        phone,
                        address,
                        gender,
                        birthDate
                    })
                }
            );

            const data = await response.json();

            // ถ้าบันทึกไม่สำเร็จ
            if (!response.ok) {
                openPopup(
                    "error",
                    "ไม่สามารถบันทึกข้อมูลได้",
                    data.message || "กรุณาลองใหม่อีกครั้ง"
                );

                return;
            }

            // รองรับทั้งกรณี API ส่ง user โดยตรง
            // หรือส่ง { user: ... }
            const updatedUser = data.user || data;

            // อัปเดตข้อมูล User
            setUser(updatedUser);

            // อัปเดตข้อมูลใน State
            setFirstName(
                updatedUser.firstName || ""
            );

            setLastName(
                updatedUser.lastName || ""
            );

            setEmail(
                updatedUser.email || ""
            );

            setPhone(
                updatedUser.phone || ""
            );

            setBirthDate(
                updatedUser.birthDate
                    ? new Date(updatedUser.birthDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
            );

            setGender(
                updatedUser.gender || ""
            );

            setAddress(
                updatedUser.address || ""
            );

            // อัปเดตข้อมูล User ใน localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            // แจ้งเตือนเมื่อบันทึกสำเร็จ
            openPopup(
                "success",
                "บันทึกข้อมูลสำเร็จ",
                "บันทึกข้อมูลบัญชีของคุณเรียบร้อยแล้ว"
            );

        } catch (error) {

            console.error(
                "SAVE ACCOUNT ERROR:",
                error
            );

            openPopup(
                "error",
                "เกิดข้อผิดพลาด",
                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
            );

        } finally {

            // ปิดสถานะกำลังบันทึก
            setSavingAccount(false);
        }
    };


    // ==================================================
    // Change Password
    // เปลี่ยนรหัสผ่าน
    // ==================================================

    const handleChangePassword = async () => {

        // เก็บ Error ของแต่ละช่อง
        const errors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        };


        // --------------------------------------------------
        // ตรวจสอบรหัสผ่านปัจจุบัน
        // --------------------------------------------------

        if (!currentPassword) {

            errors.currentPassword =
                "กรุณากรอกรหัสผ่านปัจจุบัน";
        }


        // --------------------------------------------------
        // ตรวจสอบรหัสผ่านใหม่
        // --------------------------------------------------

        if (!newPassword) {

            errors.newPassword =
                "กรุณากรอกรหัสผ่านใหม่";

        } else if (newPassword.length < 8) {

            errors.newPassword =
                "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร";
        }


        // --------------------------------------------------
        // ตรวจสอบการยืนยันรหัสผ่าน
        // --------------------------------------------------

        if (!confirmPassword) {

            errors.confirmPassword =
                "กรุณายืนยันรหัสผ่านใหม่";

        } else if (newPassword !== confirmPassword) {

            errors.confirmPassword =
                "รหัสผ่านใหม่ไม่ตรงกัน";
        }


        // แสดง Error
        setPasswordErrors(errors);

        // ถ้ามี Error ไม่ส่ง API
        if (
            errors.currentPassword ||
            errors.newPassword ||
            errors.confirmPassword
        ) {
            return;
        }


        // --------------------------------------------------
        // เรียก API เปลี่ยนรหัสผ่าน
        // --------------------------------------------------

        try {

            // ดึง Token จาก localStorage
            const token = localStorage.getItem("token");

            // ถ้าไม่มี Token ให้กลับไปหน้า Login
            if (!token) {
                navigate("/login");
                return;
            }

            // เปิดสถานะกำลังเปลี่ยนรหัสผ่าน
            setChangingPassword(true);

            // เรียก API เปลี่ยนรหัสผ่าน
            const response = await fetch(
                "http://localhost:5000/api/user/change-password",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            console.log(
                "CHANGE PASSWORD RESPONSE:",
                data
            );


            // --------------------------------------------------
            // จัดการ Error จาก API
            // --------------------------------------------------

            if (!response.ok) {
                // เงื่อนไขตรวจสอบรหัสผ่านปัจจุบันผิด
                // และรหัสผ่านใหม่เหมือนรหัสผ่านเดิม
                // ให้เก็บโค้ดเดิมของคุณไว้

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                    return;
                }

                openPopup(
                    "error",
                    "เปลี่ยนรหัสผ่านไม่สำเร็จ",
                    data.message || "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง"
                );

                return;
            }


            // --------------------------------------------------
            // เปลี่ยนรหัสผ่านสำเร็จ
            // --------------------------------------------------

            // ล้างข้อมูล Password
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // ปิดการแสดง Password
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);

            // ล้าง Error
            setPasswordErrors({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // แจ้งเตือนสำเร็จ
            openPopup(
                "success",
                "เปลี่ยนรหัสผ่านสำเร็จ",
                "รหัสผ่านของคุณได้รับการเปลี่ยนเรียบร้อยแล้ว"
            );

        } catch (error) {
            console.error("CHANGE PASSWORD ERROR:", error);

            openPopup(
                "error",
                "เกิดข้อผิดพลาด",
                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
            );
        } finally {
            setChangingPassword(false);
        }
    };


    // ==================================================
    // Logout All Devices
    // ออกจากระบบทุกอุปกรณ์
    // ==================================================

    const handleLogoutAll = () => {
        openPopup(
            "confirm",
            "ออกจากระบบทั้งหมด?",
            "คุณต้องการออกจากระบบบนอุปกรณ์นี้หรือไม่?",
            () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login", { replace: true });
            }
        );
    };


    // ==================================================
    // Delete Account
    // ลบบัญชีผู้ใช้
    // ==================================================

    const handleDeleteAccount = () => {
        openPopup(
            "confirm",
            "ยืนยันการลบบัญชี?",
            "การลบบัญชีจะลบข้อมูลทั้งหมดอย่างถาวรและไม่สามารถกู้คืนได้",
            () => {
                openPopup(
                    "error",
                    "ยังไม่สามารถลบบัญชีได้",
                    "ระบบยังไม่มี API สำหรับลบบัญชี กรุณาเชื่อมต่อ API ก่อนใช้งาน"
                );
            }
        );
    };


    // ==================================================
    // Loading
    // แสดงระหว่างรอข้อมูล Profile
    // ==================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="profile-settings-page">
                    <p>กำลังโหลดข้อมูล...</p>
                </div>
            </>
        );
    }


    // ==================================================
    // Main Page
    // หน้าตั้งค่าบัญชีผู้ใช้
    // ==================================================

    return (
        <>
            <Navbar />

            <div className="profile-settings-page">

                <div className="profile-settings-layout">


                    {/* ==================================================
                        Sidebar
                        เมนูด้านซ้าย
                    ================================================== */}

                    <aside className="sidebar-card">

                        {/* โปรไฟล์ */}
                        <button
                            className={
                                location.pathname === "/profile"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            <FaUser />
                            โปรไฟล์
                        </button>


                        {/* แก้ไขประวัติ */}
                        <button
                            className={
                                location.pathname === "/profile/edit"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                navigate("/profile/edit")
                            }
                        >
                            <FaEdit />
                            แก้ไขประวัติ
                        </button>


                        {/* ดูตัวอย่างประวัติ */}
                        <button
                            className={
                                location.pathname === "/profile/preview"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                navigate("/profile/preview")
                            }
                        >
                            <FaEye />
                            ดูตัวอย่างประวัติ
                        </button>


                        {/* ตั้งค่าความเป็นส่วนตัว */}
                        <button
                            className={
                                location.pathname === "/profile/privacy"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                navigate("/profile/privacy")
                            }
                        >
                            <FaLock />
                            ตั้งค่าความเป็นส่วนตัว
                        </button>


                        {/* ตั้งค่าบัญชีผู้ใช้ */}
                        <button
                            className={
                                location.pathname === "/profile/settings"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                navigate("/profile/settings")
                            }
                        >
                            <FaCog />
                            ตั้งค่าบัญชีผู้ใช้
                        </button>

                    </aside>


                    {/* ==================================================
                        Main
                        เนื้อหาหลักของหน้า
                    ================================================== */}

                    <main className="profile-settings-main">


                        {/* ==================================================
                            Header
                            หัวข้อหน้าตั้งค่าบัญชี
                        ================================================== */}

                        <section className="settings-header-card">

                            <div>

                                <h1>
                                    ตั้งค่าบัญชีผู้ใช้
                                </h1>

                                <p>
                                    จัดการข้อมูลและความปลอดภัยของคุณ
                                </p>

                            </div>

                        </section>


                        {/* ==================================================
                            Main Grid
                            
                            ซ้าย     = ข้อมูลบัญชี
                            ขวาบน   = เปลี่ยนรหัสผ่าน
                            ขวาล่าง = การจัดการบัญชี
                        ================================================== */}

                        <div className="settings-content-grid">


                            {/* ==================================================
                                Account Information
                                ข้อมูลบัญชี
                            ================================================== */}

                            <section className="settings-card account-card">

                                {/* หัวข้อข้อมูลบัญชี */}
                                <div className="settings-card-header">
    <div className="settings-card-title">
        <FiUser />
        <h2>ข้อมูลบัญชี</h2>
    </div>
</div>


                                {/* Form ข้อมูลบัญชี */}
                                <div className="account-form-grid">


                                    {/* ชื่อ */}
                                    <div className="settings-form-group">

                                        <label>
                                            ชื่อ
                                        </label>

                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    {/* นามสกุล */}
                                    <div className="settings-form-group">

                                        <label>
                                            นามสกุล
                                        </label>

                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    {/* Email */}
                                    <div className="settings-form-group">

                                        <label>
                                            อีเมล
                                        </label>

                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    {/* เบอร์โทรศัพท์ */}
                                    <div className="settings-form-group">

                                        <label>
                                            เบอร์โทรศัพท์
                                        </label>

                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    {/* วันเกิด */}
                                    <div className="settings-form-group">

                                        <label>
                                            วันเกิด
                                        </label>

                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) =>
                                                setBirthDate(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    {/* เพศ */}
                                    <div className="settings-form-group">

                                        <label>
                                            เพศ
                                        </label>

                                        <div className="gender-options">

                                            {/* ปุ่มชาย */}
                                            <button
                                                type="button"
                                                className={
                                                    gender === "ชาย"
                                                        ? "gender-btn active"
                                                        : "gender-btn"
                                                }
                                                onClick={() =>
                                                    setGender("ชาย")
                                                }
                                            >
                                                ชาย
                                            </button>


                                            {/* ปุ่มหญิง */}
                                            <button
                                                type="button"
                                                className={
                                                    gender === "หญิง"
                                                        ? "gender-btn active"
                                                        : "gender-btn"
                                                }
                                                onClick={() =>
                                                    setGender("หญิง")
                                                }
                                            >
                                                หญิง
                                            </button>

                                        </div>

                                    </div>

                                </div>


                                {/* ที่อยู่ */}
                                <div className="settings-form-group full-width">

                                    <label>
                                        ที่อยู่ปัจจุบัน
                                    </label>

                                    <textarea
                                        rows="5"
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* ปุ่มบันทึกข้อมูล */}
                                <div className="account-actions">

                                    <button
                                        className="save-account-btn"
                                        onClick={handleSaveAccount}
                                        disabled={savingAccount}
                                    >
                                        <FiSave />

                                        {savingAccount
                                            ? "กำลังบันทึก..."
                                            : "บันทึกข้อมูล"
                                        }

                                    </button>

                                </div>

                            </section>


                            {/* ==================================================
                                Right Column
                                ส่วนด้านขวา
                            ================================================== */}

                            <div className="settings-right-column">


                                {/* ==================================================
                                    Change Password
                                    เปลี่ยนรหัสผ่าน
                                ================================================== */}

                                <section className="settings-card password-card">

                                    {/* หัวข้อ */}
                                    <div className="settings-card-header">
    <div className="settings-card-title">
        <MdLockOutline />
        <h2>เปลี่ยนรหัสผ่าน</h2>
    </div>
</div>


                                    <div className="password-form">


                                        {/* รหัสผ่านปัจจุบัน */}
                                        <div className="settings-form-group">

                                            <label>
                                                รหัสผ่านปัจจุบัน
                                            </label>

                                            <div className="password-input-wrapper">

                                                <input
                                                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                                                    type={
                                                        showCurrentPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={currentPassword}
                                                    onChange={(e) => {

                                                        setCurrentPassword(
                                                            e.target.value
                                                        );

                                                        // ล้าง Error เมื่อผู้ใช้เริ่มพิมพ์ใหม่
                                                        setPasswordErrors(prev => ({
                                                            ...prev,
                                                            currentPassword: ""
                                                        }));

                                                    }}
                                                />

                                                {/* ปุ่มแสดง / ซ่อนรหัสผ่าน */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCurrentPassword(
                                                            !showCurrentPassword
                                                        )
                                                    }
                                                >
                                                    {showCurrentPassword
                                                        ? <FiEyeOff />
                                                        : <FiEye />
                                                    }
                                                </button>

                                            </div>


                                            {/* Error รหัสผ่านปัจจุบัน */}
                                            {passwordErrors.currentPassword && (
                                                <p className="password-error">
                                                    {passwordErrors.currentPassword}
                                                </p>
                                            )}

                                        </div>


                                        {/* รหัสผ่านใหม่ */}
                                        <div className="settings-form-group">

                                            <label>
                                                รหัสผ่านใหม่
                                            </label>

                                            <div className="password-input-wrapper">

                                                <input
                                                    placeholder="กรอกรหัสผ่านใหม่"
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={newPassword}
                                                    onChange={(e) => {

                                                        setNewPassword(
                                                            e.target.value
                                                        );

                                                        // ล้าง Error เมื่อผู้ใช้แก้ไขข้อมูล
                                                        setPasswordErrors(prev => ({
                                                            ...prev,
                                                            newPassword: ""
                                                        }));

                                                    }}
                                                />

                                                {/* ปุ่มแสดง / ซ่อนรหัสผ่าน */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            !showNewPassword
                                                        )
                                                    }
                                                >
                                                    {showNewPassword
                                                        ? <FiEyeOff />
                                                        : <FiEye />
                                                    }
                                                </button>

                                            </div>


                                            {/* Error รหัสผ่านใหม่ */}
                                            {passwordErrors.newPassword && (
                                                <p className="password-error">
                                                    {passwordErrors.newPassword}
                                                </p>
                                            )}

                                        </div>


                                        {/* ยืนยันรหัสผ่านใหม่ */}
                                        <div className="settings-form-group">

                                            <label>
                                                ยืนยันรหัสผ่านใหม่
                                            </label>

                                            <div className="password-input-wrapper">

                                                <input
                                                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={confirmPassword}
                                                    onChange={(e) => {

                                                        setConfirmPassword(
                                                            e.target.value
                                                        );

                                                        // ล้าง Error เมื่อผู้ใช้แก้ไขข้อมูล
                                                        setPasswordErrors(prev => ({
                                                            ...prev,
                                                            confirmPassword: ""
                                                        }));

                                                    }}
                                                />

                                                {/* ปุ่มแสดง / ซ่อนรหัสผ่าน */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                >
                                                    {showConfirmPassword
                                                        ? <FiEyeOff />
                                                        : <FiEye />
                                                    }
                                                </button>

                                            </div>


                                            {/* Error ยืนยันรหัสผ่าน */}
                                            {passwordErrors.confirmPassword && (
                                                <p className="password-error">
                                                    {passwordErrors.confirmPassword}
                                                </p>
                                            )}

                                        </div>


                                        {/* ปุ่มเปลี่ยนรหัสผ่าน */}
                                        <div className="password-actions">

                                            <button
                                                className="change-password-btn"
                                                onClick={
                                                    handleChangePassword
                                                }
                                                disabled={
                                                    changingPassword
                                                }
                                            >

                                                <FaLock />

                                                {changingPassword
                                                    ? "กำลังเปลี่ยน..."
                                                    : "เปลี่ยนรหัสผ่าน"
                                                }

                                            </button>

                                        </div>

                                    </div>

                                </section>


                                {/* ==================================================
                                    Account Management
                                    การจัดการบัญชี
                                ================================================== */}

                                <section className="settings-card danger-card">

                                    {/* หัวข้อ */}
                                    <div className="settings-card-header">
    <div className="settings-card-title">
        <IoIosSettings />
        <h2>การจัดการบัญชี</h2>
    </div>
</div>


                                    {/* ==================================================
                                        Logout All Devices
                                        ออกจากระบบทุกอุปกรณ์
                                    ================================================== */}

                                    <div className="account-danger-option">

                                        <div>

                                            <h3>
                                                ออกจากระบบทุกอุปกรณ์
                                            </h3>

                                            <p>
                                                ออกจากระบบในอุปกรณ์อื่นๆ ทั้งหมดเพื่อความปลอดภัย
                                            </p>

                                        </div>


                                        <button
                                            className="logout-all-btn"
                                            onClick={
                                                handleLogoutAll
                                            }
                                        >

                                            ออกจากระบบทั้งหมด

                                        </button>

                                    </div>


                                    {/* เส้นแบ่ง */}
                                    <div className="danger-divider" />


                                    {/* ==================================================
                                        Delete Account
                                        ลบบัญชีผู้ใช้
                                    ================================================== */}

                                    <div className="account-danger-option">

                                        <div>

                                            <h3>
                                                ลบบัญชีผู้ใช้
                                            </h3>

                                            <p>
                                                เมื่อคุณลบบัญชี ข้อมูลทั้งหมดจะถูกลบอย่างถาวร
                                                ไม่สามารถกู้คืนได้
                                            </p>

                                        </div>


                                        <button
                                            className="delete-account-btn"
                                            onClick={
                                                handleDeleteAccount
                                            }
                                        >


                                            ลบบัญชีผู้ใช้

                                        </button>

                                    </div>

                                </section>

                            </div>

                        </div>

                    </main>

                </div>

            </div>
            {/* Popup แจ้งเตือนและยืนยันการทำรายการ */}
            {showPopup && (
                <div
                    className="settings-popup-overlay"
                    onClick={closePopup}
                >
                    <div
                        className={`settings-popup ${popupType}`}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="settings-popup-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ปุ่มปิด */}
                        <button
                            type="button"
                            className="settings-popup-close"
                            onClick={closePopup}
                            aria-label="ปิด"
                        >
                            <RxCross2 />
                        </button>

                        {/* ไอคอน ใช้ชุดเดียวกับ CompanyCreateJob */}
                        <div className="settings-popup-icon">
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>

                        {/* ข้อความ */}
                        <h3 id="settings-popup-title">
                            {popupTitle}
                        </h3>

                        <p>{popupMessage}</p>

                        {/* ปุ่ม */}
                        {popupType === "confirm" ? (
                            <div className="settings-popup-actions">
                                <button
                                    type="button"
                                    className="settings-popup-cancel"
                                    onClick={closePopup}
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    type="button"
                                    className="settings-popup-confirm"
                                    onClick={handlePopupConfirm}
                                >
                                    ยืนยัน
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="settings-popup-btn"
                                onClick={closePopup}
                            >
                                ตกลง
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default ProfileSettings;