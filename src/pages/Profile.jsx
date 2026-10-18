import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleCheck } from "react-icons/fa6";
import {
    FaUser,
    FaEdit,
    FaEye,
    FaLock,
    FaCog,
    FaBriefcase,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaArrowRight,
    FaHistory
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import {
    FiMail,
    FiCalendar,
    FiUser,
    FiActivity,
    FiCamera
} from "react-icons/fi";

import Navbar from "../components/Navbar";

import "./Profile.css";


function Profile() {

    // ==============================
    // React Router
    // ==============================

    // ใช้สำหรับเปลี่ยนหน้า
    const navigate = useNavigate();

    // ใช้ตรวจสอบ URL ปัจจุบัน
    // เพื่อกำหนดเมนู Sidebar ว่าปุ่มไหนกำลัง Active
    const location = useLocation();


    // ==============================
    // Profile State
    // ==============================

    // เก็บข้อมูล Profile ของผู้ใช้
    const [profile, setProfile] = useState(null);

    // สถานะการโหลดข้อมูล
    const [loading, setLoading] = useState(true);


    // ==============================
    // ข้อมูลสรุปการสมัครงาน
    // ==============================

    const [summary, setSummary] = useState({
        applied: 0,     // จำนวนงานที่สมัคร
        selected: 0,    // จำนวนงานที่ได้รับการคัดเลือก
        pending: 0,     // จำนวนงานที่กำลังรอพิจารณา
        rejected: 0     // จำนวนงานที่ไม่ผ่านการคัดเลือก
    });


    // ==============================
    // เปลี่ยนรูป Profile
    // ==============================

    const handleProfileImageChange = async (e) => {

        // ดึงไฟล์แรกจาก input
        const file = e.target.files?.[0];

        // ถ้าไม่มีไฟล์ ให้หยุดทำงาน
        if (!file) {
            return;
        }


        // ==============================
        // ตรวจสอบประเภทไฟล์
        // ==============================

        if (
            ![
                "image/png",
                "image/jpeg",
                "image/jpg"
            ].includes(file.type)
        ) {
            alert("กรุณาเลือกไฟล์ PNG หรือ JPG");
            return;
        }


        // ==============================
        // ตรวจสอบขนาดไฟล์
        // จำกัดไม่เกิน 2MB
        // ==============================

        if (file.size > 2 * 1024 * 1024) {
            alert("รูปภาพต้องมีขนาดไม่เกิน 2MB");
            return;
        }


        try {

            // ดึง Token จาก Local Storage
            const token = localStorage.getItem("token");

            // ถ้าไม่มี Token ให้กลับไปหน้า Login
            if (!token) {
                navigate("/login");
                return;
            }


            // ==============================
            // Preview รูปทันที
            // ==============================

            const previewUrl = URL.createObjectURL(file);

            setProfile(prev => ({
                ...prev,
                profileImage: previewUrl
            }));


            // ==============================
            // เตรียมข้อมูลสำหรับส่งไป Backend
            // ==============================

            const formData = new FormData();

            formData.append(
                "profileImage",
                file
            );


            // ==============================
            // ส่งรูปไปยัง Backend
            // ==============================

            const response = await fetch(
                "http://localhost:5000/api/user/profile/image",
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


            // แปลง Response เป็น JSON
            const data = await response.json();

            console.log(
                "PROFILE IMAGE RESPONSE:",
                data
            );


            // ==============================
            // ตรวจสอบ Error
            // ==============================

            if (!response.ok) {

                // ถ้า Token หมดอายุหรือไม่ถูกต้อง
                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    // ลบข้อมูล Login
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    // กลับไปหน้า Login
                    navigate("/login");

                    return;
                }


                // แสดงข้อความ Error จาก Backend
                alert(
                    data.message ||
                    "ไม่สามารถเปลี่ยนรูปโปรไฟล์ได้"
                );

                return;
            }


            // ==============================
            // ใช้ URL รูปจาก Backend
            // ==============================

            const updatedUser = data.user;

            setProfile(prev => ({
                ...prev,
                profileImage:
                    updatedUser.profileImage
            }));


            // ==============================
            // อัปเดตข้อมูลใน Local Storage
            // ==============================

            const oldUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...oldUser,
                    profileImage:
                        updatedUser.profileImage
                })
            );


            // แจ้งผู้ใช้ว่าเปลี่ยนรูปสำเร็จ
            alert("เปลี่ยนรูปโปรไฟล์สำเร็จ");


            // ล้าง Preview URL
            URL.revokeObjectURL(previewUrl);

        } catch (error) {

            // แสดง Error ใน Console
            console.error(
                "PROFILE IMAGE ERROR:",
                error
            );

            // แจ้งเตือนกรณีเชื่อมต่อ Backend ไม่ได้
            alert(
                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
            );
        }
    };


    // ==============================
    // กิจกรรมล่าสุด
    // ==============================

    const [activities, setActivities] = useState([]);


    // ==============================
    // โหลดข้อมูลเมื่อเปิดหน้า Profile
    // ==============================

    useEffect(() => {

        const fetchData = async () => {

            try {

                // ดึง Token
                const token = localStorage.getItem("token");


                // ถ้าไม่มี Token
                // ให้กลับไปหน้า Login
                if (!token) {
                    navigate("/login");
                    return;
                }


                // ==========================================
                // ดึงข้อมูล Profile
                // ==========================================

                const profileResponse = await fetch(
                    "http://localhost:5000/api/user/profile",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                // แปลงข้อมูลเป็น JSON

                const profileData = await profileResponse.json();

                console.log("PROFILE DATA:", profileData);

                if (!profileResponse.ok) {
                    if (
                        profileResponse.status === 401 ||
                        profileResponse.status === 403
                    ) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                        return;
                    }

                    console.error("FETCH PROFILE ERROR:", profileData);
                    return;
                }

                setProfile(profileData);



                // ==========================================
                // ดึงข้อมูลรายการงานที่สมัคร
                // ==========================================

                const applicationsResponse = await fetch(
                    "http://localhost:5000/api/user/applications/my",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                // แปลง Response เป็น JSON
                const applicationsData =
                    await applicationsResponse.json();


                console.log(
                    "PROFILE APPLICATIONS:",
                    applicationsData
                );


                // ตรวจสอบ Response
                if (!applicationsResponse.ok) {

                    console.error(
                        "FETCH APPLICATIONS ERROR:",
                        applicationsData
                    );

                    return;
                }


                // ==========================================
                // คำนวณข้อมูลสรุปการสมัครงาน
                // ==========================================

                if (Array.isArray(applicationsData)) {

                    // จำนวนงานทั้งหมดที่สมัคร
                    const applied =
                        applicationsData.length;


                    // จำนวนงานที่ได้รับการคัดเลือก
                    const selected =
                        applicationsData.filter(
                            application =>
                                application.status === "accepted"
                        ).length;


                    // จำนวนงานที่กำลังรอพิจารณา
                    const pending =
                        applicationsData.filter(
                            application =>
                                application.status === "pending"
                        ).length;


                    // จำนวนงานที่ไม่ผ่าน
                    const rejected =
                        applicationsData.filter(
                            application =>
                                application.status === "rejected"
                        ).length;


                    // นำข้อมูลไปเก็บใน State
                    setSummary({
                        applied,
                        selected,
                        pending,
                        rejected
                    });

                } else {

                    // ถ้าข้อมูลไม่ใช่ Array
                    // ให้กำหนดค่าทั้งหมดเป็น 0
                    setSummary({
                        applied: 0,
                        selected: 0,
                        pending: 0,
                        rejected: 0
                    });
                }

            } catch (error) {

                // แสดง Error กรณีเกิดปัญหา
                console.error(
                    "PROFILE PAGE ERROR:",
                    error
                );

            } finally {

                // โหลดข้อมูลเสร็จแล้ว
                setLoading(false);
            }
        };


        // เรียกฟังก์ชันโหลดข้อมูล
        fetchData();

    }, [navigate]);


    // ==============================
    // แปลงวันที่เป็นภาษาไทย
    // ==============================

    const formatDate = (date) => {

        // ถ้าไม่มีวันที่
        if (!date) {
            return "-";
        }


        // แปลงวันที่เป็นรูปแบบภาษาไทย
        return new Date(date).toLocaleDateString(
            "th-TH",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };


    // ==============================
    // แปลงเวลา Activity
    // ==============================

    const formatActivityTime = (date) => {

        // ถ้าไม่มีวันที่
        if (!date) {
            return "-";
        }


        // คำนวณระยะเวลาจากเวลาปัจจุบัน
        const diff =
            Date.now() -
            new Date(date).getTime();


        // แปลงเป็นนาที
        const minutes =
            Math.floor(
                diff / (1000 * 60)
            );


        // แปลงเป็นชั่วโมง
        const hours =
            Math.floor(
                diff / (1000 * 60 * 60)
            );


        // แปลงเป็นวัน
        const days =
            Math.floor(
                diff / (1000 * 60 * 60 * 24)
            );


        // น้อยกว่า 1 นาที
        if (minutes < 1) {
            return "เมื่อสักครู่นี้";
        }


        // น้อยกว่า 1 ชั่วโมง
        if (minutes < 60) {
            return `${minutes} นาทีที่แล้ว`;
        }


        // น้อยกว่า 24 ชั่วโมง
        if (hours < 24) {
            return `${hours} ชั่วโมงที่แล้ว`;
        }


        // น้อยกว่า 7 วัน
        if (days < 7) {
            return `${days} วันที่แล้ว`;
        }


        // ถ้าเกิน 7 วัน
        // แสดงเป็นวันที่
        return formatDate(date);
    };


    // ==============================
    // Loading Screen
    // ==============================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="my-profile-page">

                    <p className="profile-loading">
                        กำลังโหลดข้อมูล...
                    </p>

                </div>
            </>
        );
    }


    // ==============================
    // Main Profile Page
    // ==============================

    return (
        <>
            <Navbar />

            <div className="my-profile-page">

                <div className="my-profile-layout">


                    {/* ==========================================
                        Sidebar
                    ========================================== */}

                    <aside className="profile-sidebar-card">

                        <div className="sidebar-menu">

                            <button
                                className={`sidebar-menu-item ${location.pathname === "/profile" ? "active" : ""
                                    }`}
                                onClick={() => navigate("/profile")}
                            >
                                <FaUser />
                                โปรไฟล์
                            </button>

                            <button
                                className={`sidebar-menu-item ${location.pathname === "/profile/edit" ? "active" : ""
                                    }`}
                                onClick={() => navigate("/profile/edit")}
                            >
                                <FaEdit />
                                แก้ไขประวัติ
                            </button>

                            <button
                                className={`sidebar-menu-item ${location.pathname === "/profile/preview" ? "active" : ""
                                    }`}
                                onClick={() => navigate("/profile/preview")}
                            >
                                <FaEye />
                                ดูตัวอย่างประวัติ
                            </button>

                            <button
                                className={`sidebar-menu-item ${location.pathname === "/profile/privacy" ? "active" : ""
                                    }`}
                                onClick={() => navigate("/profile/privacy")}
                            >
                                <FaLock />
                                ตั้งค่าความเป็นส่วนตัว
                            </button>

                            <button
                                className={`sidebar-menu-item ${location.pathname === "/profile/settings" ? "active" : ""
                                    }`}
                                onClick={() => navigate("/profile/settings")}
                            >
                                <FaCog />
                                ตั้งค่าบัญชีผู้ใช้
                            </button>

                        </div>

                    </aside>


                    {/* ==========================================
                        Main Content
                    ========================================== */}

                    <main className="my-profile-main">


                        {/* ==========================================
                            Header
                        ========================================== */}

                        <section className="my-profile-header">

                            <div>

                                <h1>
                                    ประวัติของฉัน
                                </h1>

                                <p>
                                    ข้อมูลและภาพรวมการใช้งานของคุณ
                                </p>

                            </div>

                        </section>


                        {/* ==========================================
                            User Information
                        ========================================== */}

                        <section className="profile-account-card">

                            {/* รูป Profile และสถานะสมาชิก */}
                            <div className="profile-user-left">

                                {/* พื้นที่สำหรับอัปโหลดรูป */}
                                <label className="profile-avatar-upload">

                                    <div className="profile-avatar">

                                        <img
                                            className="profile-avatar-image"
                                            src={
                                                profile?.profileImage
                                                    ? profile.profileImage.startsWith("http")
                                                        ? profile.profileImage
                                                        : `http://localhost:5000${profile.profileImage}`
                                                    : "/image/default-profile.png"
                                            }
                                            alt="Profile"
                                        />

                                        <div className="profile-camera-icon">
                                            <FiCamera />
                                        </div>

                                    </div>


                                    {/* Input สำหรับเลือกรูป */}
                                    <input
                                        type="file"

                                        accept="image/png,image/jpeg,image/jpg"

                                        hidden

                                        onChange={
                                            handleProfileImageChange
                                        }
                                    />

                                </label>


                                {/* Badge สมาชิก */}
                                <span className="member-badge">
                                    สมาชิก TernStay
                                </span>

                            </div>


                            {/* เส้นแบ่ง */}
                            <div className="profile-user-divider">
                            </div>


                            {/* ข้อมูลผู้ใช้ */}
                            <div className="profile-user-info">

                                {/* ชื่อผู้ใช้ */}
                                <div className="profile-name-block">

                                    <h2>
                                        {profile?.firstName || "-"}{" "}
                                        {profile?.lastName || ""}
                                    </h2>

                                </div>


                                {/* ==========================================
                                    ข้อมูลเพิ่มเติม
                                ========================================== */}

                                <div className="profile-info-grid">


                                    {/* Email */}

                                    {/* Email */}
                                    <div className="profile-info-item">
                                        <FiMail className="profile-info-icon" />

                                        <div className="profile-info-item-content">
                                            <strong className="profile-info-item-value">
                                                {profile?.email || "-"}
                                            </strong>
                                        </div>
                                    </div>

                                    {/* ประเภทสมาชิก */}
                                    <div className="profile-info-item">
                                        <FiUser className="profile-info-icon" />

                                        <div className="profile-info-item-content">
                                            <strong className="profile-info-item-value">
                                                {profile?.role === "user"
                                                    ? "ผู้ใช้งาน"
                                                    : profile?.role === "company"
                                                        ? "บริษัท"
                                                        : profile?.role || "-"}
                                            </strong>
                                        </div>
                                    </div>

                                    {/* รหัสสมาชิก */}
                                    <div className="profile-info-item">
                                        <FiActivity className="profile-info-icon" />

                                        <div className="profile-info-item-content">
                                            <strong className="profile-info-item-value">
                                                {profile?.id != null
                                                    ? `TS${String(profile.id).padStart(6, "0")}`
                                                    : "-"}
                                            </strong>
                                        </div>
                                    </div>

                                    {/* วันที่สมัครสมาชิก */}
                                    <div className="profile-info-item">
                                        <FiCalendar className="profile-info-icon" />

                                        <div className="profile-info-item-content">
                                            <strong className="profile-info-item-value">
                                                {formatDate(profile?.createdAt)}
                                            </strong>
                                        </div>
                                    </div>


                                </div>

                            </div>

                        </section>


                        {/* ==========================================
                            Summary
                        ========================================== */}

                        <section className="profile-summary-section">

                            <div className="profile-section-heading">

                                <h2>
                                    ภาพรวมบัญชีของฉัน
                                </h2>

                            </div>


                            <div className="profile-summary-grid">


                                {/* ==========================================
                                    งานที่สมัคร
                                ========================================== */}

                                <div className="profile-summary-card">

                                    <div className="summary-card-icon">
                                        <HiOutlineShoppingBag />
                                    </div>

                                    <div className="summary-card-content">

                                        <strong>
                                            {summary.applied}
                                        </strong>

                                        <h3>
                                            งานที่สมัคร
                                        </h3>

                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate("/my-jobs")
                                        }
                                    >
                                        ดูรายละเอียด
                                        <FaArrowRight />
                                    </button>

                                </div>


                                {/* ==========================================
                                    งานที่ได้รับการคัดเลือก
                                ========================================== */}

                                <div className="profile-summary-card">

                                    <div className="summary-card-icon selected">
                                        <FaRegCircleCheck />
                                    </div>

                                    <div className="summary-card-content">

                                        <strong>
                                            {summary.selected}
                                        </strong>

                                        <h3>
                                            งานที่ได้รับการคัดเลือก
                                        </h3>

                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/my-jobs?status=accepted"
                                            )
                                        }
                                    >
                                        ดูรายละเอียด
                                        <FaArrowRight />
                                    </button>

                                </div>


                                {/* ==========================================
                                    งานที่รอพิจารณา
                                ========================================== */}

                                <div className="profile-summary-card">

                                    <div className="summary-card-icon pending">
                                        <IoMdTime />
                                    </div>

                                    <div className="summary-card-content">

                                        <strong>
                                            {summary.pending}
                                        </strong>

                                        <h3>
                                            รอการพิจารณา
                                        </h3>

                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/my-jobs?status=pending"
                                            )
                                        }
                                    >
                                        ดูรายละเอียด
                                        <FaArrowRight />
                                    </button>

                                </div>


                                {/* ==========================================
                                    งานที่ไม่ผ่าน
                                ========================================== */}

                                <div className="profile-summary-card">

                                    <div className="summary-card-icon rejected">
                                        <IoCloseCircleOutline />
                                    </div>

                                    <div className="summary-card-content">

                                        <strong>
                                            {summary.rejected}
                                        </strong>

                                        <h3>
                                            ไม่ได้รับการคัดเลือก
                                        </h3>

                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/my-jobs?status=rejected"
                                            )
                                        }
                                    >
                                        ดูรายละเอียด
                                        <FaArrowRight />
                                    </button>

                                </div>

                            </div>

                        </section>


                        {/* ==========================================
                            Activities

                            ส่วนนี้ถูก Comment ไว้
                            จึงยังไม่แสดงบนหน้าเว็บ
                        ========================================== */}

                        {/*
                        <section className="profile-activity-card">

                            <div className="profile-section-heading activity-heading">

                                <div>

                                    <h2>
                                        กิจกรรมล่าสุด
                                    </h2>

                                    <p>
                                        รายการกิจกรรมล่าสุดของคุณ
                                    </p>

                                </div>


                                <button
                                    className="activity-view-all"

                                    onClick={() =>
                                        navigate(
                                            "/my-activities"
                                        )
                                    }
                                >
                                    ดูประวัติกิจกรรมทั้งหมด

                                    <FaArrowRight />

                                </button>

                            </div>


                            <div className="activity-list">

                                {activities.length > 0 ? (

                                    activities
                                        .slice(0, 5)
                                        .map((activity) => (

                                            <div
                                                className="profile-activity-item"
                                                key={activity.id}
                                            >

                                                <div
                                                    className={
                                                        `activity-type-icon ${activity.type}`
                                                    }
                                                >

                                                    {activity.type === "accepted" && (
                                                        <FaCheckCircle />
                                                    )}

                                                    {activity.type === "rejected" && (
                                                        <FaTimesCircle />
                                                    )}

                                                    {activity.type === "pending" && (
                                                        <FaClock />
                                                    )}

                                                </div>


                                                <div className="activity-detail">

                                                    <p>
                                                        {activity.description}
                                                    </p>

                                                    <span>
                                                        {formatActivityTime(
                                                            activity.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        ))

                                ) : (

                                    <div className="activity-empty">

                                        <FaHistory />

                                        <p>
                                            ยังไม่มีกิจกรรมล่าสุด
                                        </p>

                                    </div>

                                )}

                            </div>

                        </section>
                        */}

                    </main>

                </div>

            </div>
        </>
    );
}

export default Profile;