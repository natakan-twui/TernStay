import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiUser,
    FiEdit,
    FiLock,
    FiSettings,
    FiLogOut,
    FiSave,
    FiEye,
    FiEyeOff
} from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import {
    MdLockOutline,
    MdLock
} from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";
import NavbarCompany from "../../components/NavbarCompany";
import "./CompanySettings.css";

function CompanySettings() {
    const navigate = useNavigate();

    const [company, setCompany] = useState({
        contactName: "",
        contactPosition: "",
        contactEmail: "",
        phone: ""
    });

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");

    useEffect(() => {
        fetchCompanyProfile();
    }, []);

    // =========================
    // โหลดข้อมูลบัญชี
    // =========================
    const fetchCompanyProfile = async () => {
        try {
            const token = localStorage.getItem("companyToken");

            if (!token) {
                navigate("/company/login");
                return;
            }

            const res = await fetch(
                "http://localhost:5000/api/company/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "ไม่สามารถโหลดข้อมูลบัญชีได้");
                return;
            }

            setCompany({
                contactName: data.contactName || "",
                contactPosition: data.contactPosition || "",
                contactEmail: data.contactEmail || "",
                phone: data.phone || ""
            });

        } catch (error) {
            console.error("GET COMPANY SETTINGS ERROR:", error);
            alert("ไม่สามารถเชื่อมต่อ Server ได้");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // เปลี่ยนค่า input ข้อมูลบัญชี
    // =========================
    const handleCompanyChange = (e) => {
        const { name, value } = e.target;

        setCompany((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // เปลี่ยนค่า input password
    // =========================
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPassword((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // บันทึกข้อมูลบัญชี
    // =========================
    const handleSaveAccount = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const token = localStorage.getItem("companyToken");

            if (!token) {
                navigate("/company/login");
                return;
            }

            const res = await fetch(
                "http://localhost:5000/api/company/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        contactName: company.contactName,
                        contactPosition: company.contactPosition,
                        contactEmail: company.contactEmail,
                        phone: company.phone
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setPopupType("error");
                setPopupMessage(
                    data.message || "ไม่สามารถบันทึกข้อมูลได้"
                );
                setShowPopup(true);
                return;
            }

            setPopupType("success");
            setPopupMessage("บันทึกข้อมูลบัญชีเรียบร้อยแล้ว");
            setShowPopup(true);

        } catch (error) {
            console.error("UPDATE COMPANY SETTINGS ERROR:", error);

            setPopupType("error");
            setPopupMessage("ไม่สามารถเชื่อมต่อ Server ได้");
            setShowPopup(true);

        } finally {
            setSaving(false);
        }
    };

    // =========================
    // เปลี่ยนรหัสผ่าน
    // =========================
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!password.currentPassword) {
            setPopupType("error");
            setPopupMessage("กรุณากรอกรหัสผ่านปัจจุบัน");
            setShowPopup(true);
            return;
        }

        if (!password.newPassword) {
            setPopupType("error");
            setPopupMessage("กรุณากรอกรหัสผ่านใหม่");
            setShowPopup(true);
            return;
        }

        if (password.newPassword.length < 8) {
            setPopupType("error");
            setPopupMessage("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
            setShowPopup(true);
            return;
        }

        if (password.newPassword !== password.confirmPassword) {
            setPopupType("error");
            setPopupMessage(
                "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน"
            );
            setShowPopup(true);
            return;
        }

        try {
            setChangingPassword(true);

            const token = localStorage.getItem("companyToken");

            if (!token) {
                navigate("/company/login");
                return;
            }

            const res = await fetch(
                "http://localhost:5000/api/company/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        currentPassword: password.currentPassword,
                        newPassword: password.newPassword
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setPopupType("error");
                setPopupMessage(
                    data.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้"
                );
                setShowPopup(true);
                return;
            }

            setPopupType("success");
            setPopupMessage("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
            setShowPopup(true);

            setPassword({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {
            console.error("CHANGE PASSWORD ERROR:", error);

            setPopupType("error");
            setPopupMessage("ไม่สามารถเชื่อมต่อ Server ได้");
            setShowPopup(true);

        } finally {
            setChangingPassword(false);
        }
    };

    // =========================
    // Logout
    // =========================
    const handleLogout = () => {
        localStorage.removeItem("companyToken");
        localStorage.removeItem("company");

        navigate("/company/login");
    };

    if (loading) {
        return (
            <>
                <NavbarCompany />

                <div className="company-settings-loading">
                    กำลังโหลดข้อมูล...
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarCompany />

            <div className="company-settings-page">

                {/* =========================
                    Sidebar
                ========================= */}
                <aside className="company-settings-sidebar">

                    <div className="company-settings-menu">

                        <button
                            className="company-settings-menu-item"
                            onClick={() => navigate("/company/profile")}
                        >
                            <FiUser />
                            <span>โปรไฟล์บริษัท</span>
                        </button>

                        <button
                            className="company-settings-menu-item"
                            onClick={() => navigate("/company/profile/edit")}
                        >
                            <FiEdit />
                            <span>แก้ไขข้อมูลบริษัท</span>
                        </button>

                        <button
                            className="company-settings-menu-item active"
                            onClick={() => navigate("/company/settings")}
                        >
                            <FiSettings />
                            <span>ตั้งค่าบัญชีผู้ใช้</span>
                        </button>

                    </div>

                    <button
                        className="company-settings-logout-menu"
                        onClick={handleLogout}
                    >
                        <FiLogOut />
                        <span>ออกจากระบบ</span>
                    </button>

                </aside>

                {/* =========================
                    Main Content
                ========================= */}
                <main className="company-settings-content">

                    {/* กล่อง 1 */}
                    <section className="company-settings-title-card">

                        <h1>ตั้งค่าบัญชีผู้ใช้</h1>

                        <p>
                            จัดการข้อมูลบัญชี ความปลอดภัย และการใช้งานของคุณ
                        </p>

                    </section>

                    {/* กล่อง 2 + 3 */}
                    <div className="company-settings-grid">

                        {/* =========================
                            ข้อมูลบัญชี
                        ========================= */}
                        <section className="company-settings-card">

                            <div className="company-settings-card-header">
                                <div className="company-settings-icon">
                                    <FaRegUser />
                                </div>

                                <div>
                                    <h2>ข้อมูลบัญชี</h2>
                                </div>
                            </div>

                            <form onSubmit={handleSaveAccount}>

                                <div className="company-settings-form-group">
                                    <label>
                                        ชื่อผู้ติดต่อ <span className="required">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="contactName"
                                        value={company.contactName}
                                        onChange={handleCompanyChange}
                                        placeholder="กรอกชื่อผู้ติดต่อ"
                                    />
                                </div>

                                <div className="company-settings-form-group">
                                    <label>
                                        ตำแหน่ง <span className="required">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="contactPosition"
                                        value={company.contactPosition}
                                        onChange={handleCompanyChange}
                                        placeholder="กรอกตำแหน่ง"
                                    />
                                </div>

                                <div className="company-settings-form-group">
                                    <label>
                                        อีเมล <span className="required">*</span>
                                    </label>

                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={company.contactEmail}
                                        onChange={handleCompanyChange}
                                        placeholder="กรอกอีเมล"
                                    />
                                </div>

                                <div className="company-settings-form-group">
                                    <label>
                                        เบอร์โทรศัพท์ <span className="required">*</span>
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={company.phone}
                                        onChange={handleCompanyChange}
                                        placeholder="กรอกเบอร์โทรศัพท์"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="company-settings-save-btn"
                                    disabled={saving}
                                >
                                    <FiSave />

                                    {saving
                                        ? "กำลังบันทึก..."
                                        : "บันทึกข้อมูล"
                                    }
                                </button>

                            </form>

                        </section>

                        {/* =========================
                            เปลี่ยนรหัสผ่าน
                        ========================= */}
                        <section className="company-settings-card">

                            <div className="company-settings-card-header">
                                <div className="company-settings-icon">
                                    <MdLockOutline />
                                </div>

                                <div>
                                    <h2>เปลี่ยนรหัสผ่าน</h2>
                                </div>
                            </div>

                            <form onSubmit={handleChangePassword}>

                                <div className="company-settings-form-group">

                                    <label>
                                        รหัสผ่านปัจจุบัน <span className="required">*</span>
                                    </label>

                                    <div className="company-settings-password-input">

                                        <input
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="currentPassword"
                                            value={password.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="กรอกรหัสผ่านปัจจุบัน"
                                        />

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

                                </div>

                                <div className="company-settings-form-group">

                                    <label>
                                        รหัสผ่านใหม่ <span className="required">*</span>
                                    </label>

                                    <div className="company-settings-password-input">

                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="newPassword"
                                            value={password.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="กรอกรหัสผ่านใหม่"
                                        />

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

                                </div>

                                <div className="company-settings-form-group">

                                    <label>
                                        ยืนยันรหัสผ่าน <span className="required">*</span>
                                    </label>

                                    <div className="company-settings-password-input">

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={password.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                                        />

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

                                </div>

                                <button
                                    type="submit"
                                    className="company-settings-password-btn"
                                    disabled={changingPassword}
                                >
                                    <MdLock />

                                    {changingPassword
                                        ? "กำลังเปลี่ยนรหัสผ่าน..."
                                        : "เปลี่ยนรหัสผ่าน"
                                    }
                                </button>

                            </form>

                        </section>

                    </div>

                </main>

            </div>

            {showPopup && (
                <div className="company-popup-overlay">
                    <div className={`company-popup ${popupType}`}>

                        <button
                            type="button"
                            className="company-popup-close"
                            onClick={() => setShowPopup(false)}
                        >
                            <RxCross2 />
                        </button>

                        <div
                            className={`company-popup-icon ${popupType === "success"
                                    ? "success"
                                    : "error"
                                }`}
                        >
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>

                        <h3>
                            {popupType === "success"
                                ? "ดำเนินการสำเร็จ"
                                : "ดำเนินการไม่สำเร็จ"}
                        </h3>

                        <p>{popupMessage}</p>

                        <button
                            type="button"
                            className="company-popup-btn"
                            onClick={() => setShowPopup(false)}
                        >
                            ลองอีกครั้ง
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}

export default CompanySettings;

