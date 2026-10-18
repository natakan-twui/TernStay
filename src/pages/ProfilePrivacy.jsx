import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    FaUser,
    FaEdit,
    FaEye,
    FaLock,
    FaCog
} from "react-icons/fa";
import { IoAlertCircleOutline } from "react-icons/io5";
import {
    FiEye,
    FiMail,
    FiPhone,
    FiSearch,
    FiSave,
    FiShield,
    FiX,
    FiCheckCircle
} from "react-icons/fi";

import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";
import Navbar from "../components/Navbar";
import "./ProfilePrivacy.css";

function ProfilePrivacy() {

    // =========================
    // NAVIGATION
    // =========================
    const navigate = useNavigate();
    const location = useLocation();


    // =========================
    // PRIVACY SETTINGS
    // =========================
    const [settings, setSettings] = useState({
        searchable: true,
        publicProfile: false,
        hideEmail: false,
        hidePhone: false
    });


    // =========================
    // SAVING STATE
    // =========================
    const [saving, setSaving] = useState(false);


    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");

    const openPopup = (type, message) => {
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);
    };


    // =========================
    // TOGGLE PRIVACY SETTING
    // =========================
    const toggleSetting = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };


    // =========================
    // FETCH PRIVACY SETTINGS
    // =========================
    useEffect(() => {

        const fetchPrivacy = async () => {

            try {

                const token = localStorage.getItem("token");

                // ไม่มี Token → กลับไปหน้า Login
                if (!token) {
                    navigate("/login");
                    return;
                }


                // เรียกข้อมูล Privacy จาก Backend
                const res = await fetch(
                    "http://localhost:5000/api/user/privacy",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                const data = await res.json();

                console.log("PRIVACY STATUS:", res.status);
                console.log("PRIVACY RESPONSE:", data);
                console.log("PRIVACY TOKEN:", token);


                // ถ้า Request ไม่สำเร็จ

                if (!res.ok) {
                    openPopup(
                        "error",
                        data.message || "ไม่สามารถบันทึกการตั้งค่าได้"
                    );
                    return;
                }

                // บันทึกสำเร็จ
                setSettings({
    searchable: data.searchable,
    publicProfile: data.publicProfile,
    hideEmail: data.hideEmail,
    hidePhone: data.hidePhone
});



                // นำข้อมูลจาก Backend มาใส่ใน State
                setSettings({
                    searchable: data.searchable,
                    publicProfile: data.publicProfile,
                    hideEmail: data.hideEmail,
                    hidePhone: data.hidePhone
                });


            } catch (error) {
                console.error("SAVE PRIVACY ERROR:", error);

                openPopup(
                    "error",
                    "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
                );
            } finally {
                setSaving(false);
            }

        };

        fetchPrivacy();

    }, [navigate]);


    // =========================
    // SAVE PRIVACY SETTINGS
    // =========================
    const handleSave = async () => {

        try {

            const token = localStorage.getItem("token");

            // ไม่มี Token → กลับไปหน้า Login
            if (!token) {
                navigate("/login");
                return;
            }


            setSaving(true);


            // ส่งข้อมูล Privacy ไปยัง Backend
            const res = await fetch(
                "http://localhost:5000/api/user/privacy",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(settings)
                }
            );


            const data = await res.json();


            // ถ้าบันทึกไม่สำเร็จ
            if (!res.ok) {

                openPopup(
    "error",
    data.message ||
    "ไม่สามารถบันทึกการตั้งค่าได้"
);

                return;
            }


            // บันทึกสำเร็จ
            openPopup(
    "success",
    "บันทึกการตั้งค่าความเป็นส่วนตัวเรียบร้อยแล้ว"
);


        } catch (error) {

            console.error(
                "SAVE PRIVACY ERROR:",
                error
            );

            openPopup(
    "error",
    "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
);


        } finally {

            setSaving(false);

        }
    };


    // =========================
    // PAGE
    // =========================
    return (
        <>

            {/* =========================
                NAVBAR
            ========================= */}
            <Navbar />


            {/* =========================
                PRIVACY PAGE
            ========================= */}
            <div className="privacy-page">

                <div className="privacy-layout">


                    {/* =========================
                        SIDEBAR
                    ========================= */}
                    <aside className="sidebar-card">

                        {/* Profile */}
                        <button
                            className={
                                location.pathname === "/profile"
                                    ? "active"
                                    : ""
                            }
                            onClick={() => navigate("/profile")}
                        >
                            <FaUser />
                            โปรไฟล์
                        </button>


                        {/* Edit Profile */}
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


                        {/* Preview Profile */}
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


                        {/* Privacy */}
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


                        {/* Account Settings */}
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


                    {/* =========================
                        MAIN
                    ========================= */}
                    <main className="privacy-main">


                        {/* =========================
                            BOX 1 : HEADER
                        ========================= */}
                        <section className="privacy-header-card">

                            <div className="privacy-header-content">

                                <h1>
                                    ตั้งค่าความเป็นส่วนตัว
                                </h1>

                                <p>
                                    จัดการข้อมูลและความเป็นส่วนตัวของคุณ
                                </p>


                                {/* Privacy Notice */}
                                <div className="privacy-notice">

                                    <IoAlertCircleOutline />

                                    <span>
                                        ข้อมูลของคุณจะถูกเก็บเป็นความลับ
                                        และจะไม่เปิดเผยให้บุคคลที่สาม
                                        โดยไม่ได้รับอนุญาต
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* =========================
                            BOX 2 : PRIVACY SETTINGS
                        ========================= */}
                        <section className="privacy-settings-card">


                            {/* =========================
                                CARD HEADER
                            ========================= */}
                            <div className="privacy-card-header">

                                <div>

                                    <h2>
                                        การมองเห็นโปรไฟล์
                                    </h2>

                                </div>

                            </div>


                            {/* =========================
                                SEARCHABLE
                            ========================= */}
                            <div className="privacy-option">

                                <div className="privacy-option-icon">
                                    <FiSearch />
                                </div>


                                <div className="privacy-option-content">

                                    <h3>
                                        เปิดให้บริษัทค้นหาตัวได้
                                    </h3>

                                    <p>
                                        อนุญาตให้บริษัทค้นหาโปรไฟล์ของคุณในระบบ
                                    </p>

                                </div>


                                {/* Toggle */}
                                <button
                                    type="button"
                                    className={
                                        `privacy-toggle ${settings.searchable
                                            ? "on"
                                            : ""
                                        }`
                                    }
                                    onClick={() =>
                                        toggleSetting("searchable")
                                    }
                                    aria-label="เปิดให้บริษัทค้นหาตัวได้"
                                >
                                    <span />
                                </button>

                            </div>


                            {/* =========================
                                PUBLIC PROFILE
                            ========================= */}
                            <div className="privacy-option">

                                <div className="privacy-option-icon">
                                    <FiEye />
                                </div>


                                <div className="privacy-option-content">

                                    <h3>
                                        แสดงโปรไฟล์เป็นสาธารณะ
                                    </h3>

                                    <p>
                                        ผู้ใช้ทั่วไปสามารถกดดูโปรไฟล์ของคุณได้
                                    </p>

                                </div>


                                {/* Toggle */}
                                <button
                                    type="button"
                                    className={
                                        `privacy-toggle ${settings.publicProfile
                                            ? "on"
                                            : ""
                                        }`
                                    }
                                    onClick={() =>
                                        toggleSetting("publicProfile")
                                    }
                                    aria-label="แสดงโปรไฟล์เป็นสาธารณะ"
                                >
                                    <span />
                                </button>

                            </div>


                            {/* =========================
                                HIDE EMAIL
                            ========================= */}
                            <div className="privacy-option">

                                <div className="privacy-option-icon">
                                    <FiMail />
                                </div>


                                <div className="privacy-option-content">

                                    <h3>
                                        ซ่อนอีเมลจากบริษัท
                                    </h3>

                                    <p>
                                        บริษัทจะไม่เห็นอีเมลของคุณ
                                    </p>

                                </div>


                                {/* Toggle */}
                                <button
                                    type="button"
                                    className={
                                        `privacy-toggle ${settings.hideEmail
                                            ? "on"
                                            : ""
                                        }`
                                    }
                                    onClick={() =>
                                        toggleSetting("hideEmail")
                                    }
                                    aria-label="ซ่อนอีเมลจากบริษัท"
                                >
                                    <span />
                                </button>

                            </div>


                            {/* =========================
                                HIDE PHONE
                            ========================= */}
                            <div className="privacy-option">

                                <div className="privacy-option-icon">
                                    <FiPhone />
                                </div>


                                <div className="privacy-option-content">

                                    <h3>
                                        ซ่อนเบอร์โทรศัพท์จากบริษัท
                                    </h3>

                                    <p>
                                        บริษัทจะไม่เห็นเบอร์โทรศัพท์ของคุณ
                                    </p>

                                </div>


                                {/* Toggle */}
                                <button
                                    type="button"
                                    className={
                                        `privacy-toggle ${settings.hidePhone
                                            ? "on"
                                            : ""
                                        }`
                                    }
                                    onClick={() =>
                                        toggleSetting("hidePhone")
                                    }
                                    aria-label="ซ่อนเบอร์โทรศัพท์จากบริษัท"
                                >
                                    <span />
                                </button>

                            </div>


                            {/* =========================
                                SAVE BUTTON
                            ========================= */}
                            <div className="privacy-actions">

                                <button
                                    type="button"
                                    className="privacy-save-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                >

                                    <FiSave />

                                    {saving
                                        ? "กำลังบันทึก..."
                                        : "บันทึกการตั้งค่า"
                                    }

                                </button>

                            </div>

                        </section>

                    </main>

                </div>

            </div>
            {/* PRIVACY POPUP */}
            {showPopup && (
                <div className="privacy-alert-overlay">
                    <div
                        className={`privacy-alert-popup ${popupType}`}
                        role="alertdialog"
                        aria-modal="true"
                    >

                        <button
                            type="button"
                            className="privacy-alert-close"
                            onClick={() => setShowPopup(false)}
                            aria-label="ปิด"
                        >
                            <RxCross2 />
                        </button>

                        <div className="privacy-alert-icon">
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>



                        <h3>
                            {popupType === "success"
                                ? "บันทึกการตั้งค่าสำเร็จ"
                                : "ไม่สามารถบันทึกการตั้งค่าได้"}
                        </h3>

                        <p>{popupMessage}</p>


                        <button
                            type="button"
                            className="privacy-alert-btn"
                            onClick={() => setShowPopup(false)}
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProfilePrivacy;