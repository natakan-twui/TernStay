
import NavbarCompany from "../../components/NavbarCompany";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiDownload,
    FiArrowLeft,
    FiUsers,
    FiEdit,
    FiSend,
    FiCalendar,
    FiClock,
    FiChevronDown
} from "react-icons/fi";

import "./CompanyActivity.css";

function CompanyActivity() {

    const navigate = useNavigate();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedType, setSelectedType] =
        useState("ทั้งหมด");


    // ========================================
    // ดึงกิจกรรมจาก Backend
    // ========================================
    const fetchActivities = async () => {

        try {

            const token =
                localStorage.getItem("companyToken");


            // ยังไม่ได้ login
            if (!token) {

                alert("กรุณาเข้าสู่ระบบบริษัทก่อน");

                navigate("/company/login");

                return;
            }


            console.log(
                "FETCH COMPANY ACTIVITIES..."
            );


            const res = await fetch(
                "http://localhost:5000/api/company/jobs/activity",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data = await res.json();


            console.log(
                "ACTIVITY RESPONSE:",
                data
            );


            // ========================================
            // Token หมดอายุ
            // ========================================
            if (
                res.status === 401 ||
                res.status === 403
            ) {

                localStorage.removeItem(
                    "companyToken"
                );

                localStorage.removeItem(
                    "company"
                );

                alert(
                    data.message ||
                    "กรุณาเข้าสู่ระบบบริษัทใหม่"
                );

                navigate("/company/login");

                return;
            }


            // ========================================
            // API Error
            // ========================================
            if (!res.ok) {

                console.error(
                    "ACTIVITY API ERROR:",
                    data
                );

                setActivities([]);

                return;
            }


            // ========================================
            // สำเร็จ
            // ========================================
            if (Array.isArray(data)) {

                setActivities(data);

            } else {

                console.error(
                    "ACTIVITY DATA IS NOT ARRAY:",
                    data
                );

                setActivities([]);

            }


        } catch (error) {

            console.error(
                "FETCH ACTIVITY ERROR:",
                error
            );

            setActivities([]);

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // โหลดตอนเปิดหน้า
    // ========================================
    useEffect(() => {

        fetchActivities();

    }, []);


    // ========================================
    // แปลงประเภทกิจกรรม
    // ========================================
    const getActivityType = (activity) => {

        if (activity.type === "application") {
            return "ผู้สมัคร";
        }

        return "ระบบ";

    };


    // ========================================
    // กรองกิจกรรม
    // ========================================
    const filteredActivities =
        selectedType === "ทั้งหมด"

            ? activities

            : activities.filter(
                activity =>
                    getActivityType(activity) ===
                    selectedType
            );


    // ========================================
    // จำนวนประเภทกิจกรรม
    // ========================================
    const applicantCount =
        activities.filter(
            activity =>
                activity.type === "application"
        ).length;


    const systemCount =
        activities.filter(
            activity =>
                activity.type === "published" ||
                activity.type === "edited"
        ).length;


    // ========================================
    // เวลา
    // ========================================
    const formatActivityTime = (date) => {

        const diff =
            Date.now() -
            new Date(date).getTime();


        const minutes =
            Math.floor(
                diff / (1000 * 60)
            );


        const hours =
            Math.floor(
                diff / (1000 * 60 * 60)
            );


        const days =
            Math.floor(
                diff / (1000 * 60 * 60 * 24)
            );


        if (minutes < 1) {
            return "เมื่อสักครู่นี้";
        }


        if (minutes < 60) {
            return `${minutes} นาทีที่แล้ว`;
        }


        if (hours < 24) {
            return `${hours} ชั่วโมงที่แล้ว`;
        }


        if (days < 7) {
            return `${days} วันที่แล้ว`;
        }


        return new Date(date).toLocaleDateString(
            "th-TH"
        );

    };


    // ========================================
    // วันที่
    // ========================================
    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "th-TH",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ========================================
    // เวลา
    // ========================================
    const formatTime = (date) => {

        return new Date(date).toLocaleTimeString(
            "th-TH",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ) + " น.";

    };


    // ========================================
    // Icon
    // ========================================
    const getActivityIcon = (type) => {

        if (type === "application") {
            return <FiUsers />;
        }

        if (type === "edited") {
            return <FiEdit />;
        }

        return <FiSend />;

    };


    // ========================================
    // สรุปช่วงเวลา
    // ========================================
    const todayCount =
        activities.filter(activity => {

            const activityDate =
                new Date(activity.createdAt);

            const today =
                new Date();

            return (
                activityDate.toDateString() ===
                today.toDateString()
            );

        }).length;


    const weekCount =
        activities.filter(activity => {

            const diff =
                Date.now() -
                new Date(activity.createdAt).getTime();

            return (
                diff <=
                7 * 24 * 60 * 60 * 1000
            );

        }).length;


    const monthCount =
        activities.filter(activity => {

            const activityDate =
                new Date(activity.createdAt);

            const today =
                new Date();

            return (
                activityDate.getMonth() ===
                today.getMonth() &&
                activityDate.getFullYear() ===
                today.getFullYear()
            );

        }).length;


    return (
        <>
            <NavbarCompany />

            <div className="activity-page">

                {/* ================= HEADER ================= */}

                <section className="activity-header-card">

                    <div>

                        <button
                            className="activity-back-btn"
                            onClick={() =>
                                navigate("/company/dashboard")
                            }
                        >
                            <FiArrowLeft />
                            กลับแดชบอร์ด
                        </button>


                        <h1>
                            กิจกรรมทั้งหมด
                        </h1>


                        <p>
                            ตรวจสอบความเคลื่อนไหวและกิจกรรมต่างๆ ในระบบ
                        </p>

                    </div>

                </section>


                <section className="activity-main-card">

                    {/* ================= TOP FILTER ================= */}

                    <div className="activity-filter-bar">

                        <div className="activity-filter-section">

                            
<div className="activity-filter-section">
    <div className="select-wrapper">
        <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
        >
            <option value="ทั้งหมด">
                ประเภทกิจกรรมทั้งหมด
            </option>
            <option value="ผู้สมัคร">ผู้สมัคร</option>
            <option value="ระบบ">ระบบ</option>
        </select>

        <FiChevronDown className="select-arrow" />
    </div>
</div>


                        </div>




                    </div>


                    {/* ================= CONTENT ================= */}

                    <div className="activity-content">


                        {/* ================= LEFT ================= */}

                        <aside className="activity-left">


                            {/* ===== ประเภทกิจกรรม ===== */}

                            <section className="activity-type-card">

                                <div className="activity-section-heading">

                                    <h2>
                                        ประเภทกิจกรรม
                                    </h2>

                                </div>


                                <div className="activity-type-list">

                                    <button
                                        className={`activity-type-item ${selectedType === "ทั้งหมด"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedType(
                                                "ทั้งหมด"
                                            )
                                        }
                                    >

                                        <span>
                                            ทั้งหมด
                                        </span>

                                        <p>
                                            {activities.length}
                                        </p>

                                    </button>


                                    <button
                                        className={`activity-type-item ${selectedType === "ผู้สมัคร"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedType(
                                                "ผู้สมัคร"
                                            )
                                        }
                                    >

                                        <span>
                                            ผู้สมัคร
                                        </span>

                                        <p>
                                            {applicantCount}
                                        </p>

                                    </button>


                                    <button
                                        className={`activity-type-item ${selectedType === "ระบบ"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedType(
                                                "ระบบ"
                                            )
                                        }
                                    >

                                        <span>
                                            ระบบ
                                        </span>

                                        <p>
                                            {systemCount}
                                        </p>

                                    </button>

                                </div>

                            </section>


                            {/* ===== สรุปกิจกรรม ===== */}

                            <section className="activity-total-card">

                                <div className="activity-section-heading">

                                    <h2>
                                        สรุปกิจกรรม
                                    </h2>

                                </div>


                                <div className="activity-total-number">

                                    <span>
                                        รวมทั้งหมด
                                    </span>

                                    <strong>
                                        {activities.length}
                                    </strong>

                                    <span>
                                        รายการ
                                    </span>

                                </div>


                                <div className="activity-period-list">

                                    <div>
                                        <span>
                                            วันนี้
                                        </span>

                                        <strong>
                                            {todayCount} รายการ
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            สัปดาห์นี้
                                        </span>

                                        <strong>
                                            {weekCount} รายการ
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            เดือนนี้
                                        </span>

                                        <strong>
                                            {monthCount} รายการ
                                        </strong>
                                    </div>

                                </div>

                            </section>

                        </aside>


                        {/* ================= RIGHT ================= */}

                        <main className="activity-right">

                            <section className="activity-list">


                                {/* ===== HEADER ===== */}

                                <div className="activity-list-header">

                                    <span>
                                        กิจกรรม
                                    </span>

                                    <span>
                                        รายละเอียด
                                    </span>

                                    <span>
                                        วันที่และเวลา
                                    </span>

                                </div>


                                {/* ===== LOADING ===== */}

                                {loading ? (

                                    <div className="no-activity">
                                        กำลังโหลดกิจกรรม...
                                    </div>

                                ) : filteredActivities.length === 0 ? (

                                    <div className="no-activity">
                                        ยังไม่มีกิจกรรม
                                    </div>

                                ) : (

                                    filteredActivities.map(
                                        (activity) => (

                                            <div
                                                className="activity-row"
                                                key={activity.id}
                                            >


                                                {/* กิจกรรม */}

                                                <div className="activity-name">

                                                    <div className="activity-icon">

                                                        {getActivityIcon(
                                                            activity.type
                                                        )}

                                                    </div>


                                                    <div>

                                                        <h3>
                                                            {activity.title}
                                                        </h3>


                                                        <span>
                                                            {activity.description}
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* งาน */}

                                                <div className="activity-description">
                                                    <strong>
                                                        {activity.description || "-"}
                                                    </strong>
                                                </div>


                                                {/* วันที่ */}

                                                <div className="activity-date-cell">

                                                    <div className="activity-date-item">

                                                        <FiCalendar />

                                                        <strong>
                                                            {formatDate(
                                                                activity.createdAt
                                                            )}
                                                        </strong>

                                                    </div>


                                                    <div className="activity-time-item">

                                                        <FiClock />

                                                        <span>
                                                            {formatTime(
                                                                activity.createdAt
                                                            )}
                                                        </span>

                                                    </div>


                                                    <small>
                                                        {formatActivityTime(
                                                            activity.createdAt
                                                        )}
                                                    </small>

                                                </div>

                                            </div>

                                        )
                                    )

                                )}

                            </section>

                        </main>

                    </div>

                </section>

            </div>
        </>
    );

}

export default CompanyActivity;
