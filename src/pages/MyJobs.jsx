import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import {
    FiHome,
    FiSearch,
    FiBriefcase,
    FiUser,
    FiLogOut,
    FiSearch as FiSearchIcon,
    FiFilter,
    FiArrowRight,
    FiMapPin,
    FiDollarSign,
    FiCheck,
    FiMoreVertical,
    FiClock,
    FiCalendar,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle
} from "react-icons/fi";;
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { CgSandClock } from "react-icons/cg";
import { SlHome } from "react-icons/sl";
import "./MyJobs.css";


function MyJobs() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [applications, setApplications] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);

    const [showFilter, setShowFilter] = useState(false);
    const [workTypeFilter, setWorkTypeFilter] = useState("all");
    const [salaryFilter, setSalaryFilter] = useState("all");

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("confirm");
    const [popupMessage, setPopupMessage] = useState("");
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const isRejected = application.status === "rejected";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            // =========================
            // Profile
            // =========================

            const profileResponse = await fetch(
                "http://localhost:5000/api/user/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const profileData = await profileResponse.json();

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

                console.error(
                    "FETCH PROFILE ERROR:",
                    profileData
                );

                return;
            }

            setProfile(profileData);


            // =========================
            // Applications
            // =========================

            const applicationsResponse = await fetch(
                "http://localhost:5000/api/user/applications/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const applicationsData =
                await applicationsResponse.json();

            console.log(
                "MY APPLICATIONS:",
                applicationsData
            );

            if (!applicationsResponse.ok) {

                console.error(
                    "FETCH APPLICATIONS ERROR:",
                    applicationsData
                );

                return;
            }

            if (Array.isArray(applicationsData)) {
                const activeApplications = applicationsData.filter(
                    (application) => application.status !== "cancelled"
                );

                setApplications(activeApplications);
            } else {
                setApplications([]);
            }

        } catch (error) {

            console.error(
                "MY JOBS ERROR:",
                error
            );

            setApplications([]);

        } finally {

            setLoading(false);

        }

    };

    const [cancellingId, setCancellingId] = useState(null);


    const cancelApplication = (applicationId) => {
        setSelectedApplicationId(applicationId);
        setPopupType("confirm");
        setPopupMessage("คุณต้องการยกเลิกการสมัครฝึกงานนี้ใช่หรือไม่?");
        setShowPopup(true);
    };

    const confirmCancelApplication = async () => {
        if (selectedApplicationId == null || cancellingId !== null) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setPopupType("error");
            setPopupMessage("กรุณาเข้าสู่ระบบใหม่ก่อนดำเนินการ");
            setShowPopup(true);
            navigate("/login");
            return;
        }

        try {
            setCancellingId(selectedApplicationId);

            const response = await fetch(
                `http://localhost:5000/api/user/applications/${selectedApplicationId}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setPopupType("error");
                setPopupMessage(
                    data.message || "ยกเลิกการสมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
                );
                setShowPopup(true);
                return;
            }

            // นำรายการที่ยกเลิกออกจากหน้าจอ
            setApplications((previous) =>
                previous.filter(
                    (application) => application.id !== selectedApplicationId
                )
            );

            setOpenMenu(null);
            setPopupType("success");
            setPopupMessage("ยกเลิกการสมัครฝึกงานเรียบร้อยแล้ว");
            setShowPopup(true);

        } catch (error) {
            console.error("CANCEL APPLICATION ERROR:", error);

            setPopupType("error");
            setPopupMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
            setShowPopup(true);

        } finally {
            setCancellingId(null);
        }
    };


    const statusText = {
        pending: "รอการพิจารณา",
        interview: "สัมภาษณ์",
        accepted: "ตอบรับแล้ว",
        rejected: "ไม่ผ่านการคัดเลือก",
        cancelled: "ยกเลิกการสมัคร"
    };


    // ================= Search + Filter =================

    const filteredApplications = applications.filter((application) => {

        const title =
            application.job?.title || "";

        const company =
            application.job?.company?.companyName || "";

        const workType =
            application.job?.workType || "";

        const salaryType =
            application.job?.salaryType || "";

        const matchSearch =
            title
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            company
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "all" ||
            application.status === statusFilter;

        const matchWorkType =
            workTypeFilter === "all" ||
            workType === workTypeFilter;

        const matchSalary =
            salaryFilter === "all" ||
            (salaryFilter === "paid" && salaryType === "paid") ||
            (salaryFilter === "unpaid" && salaryType !== "paid");

        return (
            matchSearch &&
            matchStatus &&
            matchWorkType &&
            matchSalary
        );

    });
    const statusCounts = {
        pending: applications.filter(
            (application) => application.status === "pending"
        ).length,

        interview: applications.filter(
            (application) => application.status === "interview"
        ).length,

        accepted: applications.filter(
            (application) => application.status === "accepted"
        ).length,

        rejected: applications.filter(
            (application) => application.status === "rejected"
        ).length
    };


    // ================= Logout =================

    const logout = () => {

        localStorage.removeItem("user");

        navigate("/home");

    };

    const getProgress = (status) => {

        switch (status) {

            case "pending":
                return 2;

            case "interview":
                return 3;

            case "accepted":
                return 4;

            case "rejected":
                return 3;

            default:
                return 1;
        }
    };

    return (

        <>

            <Navbar />


            <div className="my-jobs-page">


                {/* =================================================
                    Sidebar
                ================================================= */}

                <aside className="my-jobs-sidebar">


                    {/* Profile */}

                    <div className="profile-box">

                        <div className="profile-image">
                            <img
                                src={
                                    profile?.profileImage
                                        ? profile.profileImage.startsWith("http")
                                            ? profile.profileImage
                                            : `http://localhost:5000${profile.profileImage}`
                                        : "/image/profile-default.png"
                                }
                                alt="Profile"
                            />
                        </div>

                        <div className="profile-info">

                            <h3>
                                {profile?.firstName || "-"}{" "}
                                {profile?.lastName || ""}
                            </h3>

                            <button
                                className="profile-view-btn"
                                onClick={() => navigate("/profile")}
                            >
                                ดูโปรไฟล์ของฉัน
                                <FiArrowRight />
                            </button>

                        </div>

                    </div>


                    {/* Menu */}

                    <nav className="user-menu">


                        <button
                            onClick={() => navigate("/")}
                        >
                            <SlHome />

                            <span>
                                หน้าหลัก
                            </span>

                        </button>


                        <button
                            onClick={() => navigate("/home")}
                        >
                            <FiSearch />

                            <span>
                                ค้นหางาน
                            </span>

                        </button>


                        <button className="active">

                            <BiBriefcaseAlt2 />

                            <span>
                                งานของฉัน
                            </span>

                        </button>


                        <button
                            onClick={() => navigate("/profile")}
                        >

                            <FiUser />

                            <span>
                                โปรไฟล์ของฉัน
                            </span>

                        </button>


                    </nav>


                    {/* Logout */}

                    <div className="sidebar-bottom">

                        <button
                            className="logout-btn"
                            onClick={logout}
                        >

                            <FiLogOut />

                            <span>
                                ออกจากระบบ
                            </span>

                        </button>

                    </div>


                </aside>



                {/* =================================================
                    Main
                ================================================= */}

                <main className="my-jobs-main">


                    {/* =================================================
                        Header
                    ================================================= */}

                    <section className="my-jobs-header">


                        {/* LEFT */}

                        <div className="my-jobs-title">

                            <h1>
                                <BiBriefcaseAlt2 />
                                งานของฉัน
                            </h1>

                            <p>
                                จัดการและติดตามงานที่คุณสมัคร
                            </p>

                        </div>


                        {/* RIGHT
                            Search + Filter
                        */}

                        <div className="job-search-area">

                            <div className="job-search-box">

                                <FiSearchIcon />

                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่องาน หรือชื่อบริษัท"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                            </div>


                            <div className="filter-wrapper">

                                <button
                                    className={`filter-btn ${showFilter ? "active" : ""
                                        }`}
                                    onClick={() =>
                                        setShowFilter(!showFilter)
                                    }
                                >

                                    <FiFilter />

                                    ตัวกรอง

                                </button>


                                {showFilter && (

                                    <div className="filter-dropdown">

                                        <div className="filter-dropdown-header">
                                            <strong>
                                                ตัวกรอง
                                            </strong>
                                        </div>


                                        {/* รูปแบบการทำงาน */}

                                        <div className="filter-group">

                                            <label>
                                                รูปแบบการทำงาน
                                            </label>

                                            <select
                                                value={workTypeFilter}
                                                onChange={(e) =>
                                                    setWorkTypeFilter(e.target.value)
                                                }
                                            >

                                                <option value="all">
                                                    ทั้งหมด
                                                </option>

                                                <option value="On-site">
                                                    On-site
                                                </option>

                                                <option value="Hybrid">
                                                    Hybrid
                                                </option>

                                                <option value="Work from home">
                                                    Work from home
                                                </option>

                                            </select>

                                        </div>


                                        {/* ค่าตอบแทน */}

                                        <div className="filter-group">

                                            <label>
                                                ค่าตอบแทน
                                            </label>

                                            <select
                                                value={salaryFilter}
                                                onChange={(e) =>
                                                    setSalaryFilter(e.target.value)
                                                }
                                            >

                                                <option value="all">
                                                    ทั้งหมด
                                                </option>

                                                <option value="paid">
                                                    มีค่าตอบแทน
                                                </option>

                                                <option value="unpaid">
                                                    ไม่มีค่าตอบแทน
                                                </option>

                                            </select>

                                        </div>


                                        {/* Reset */}

                                        <button
                                            className="filter-reset"
                                            onClick={() => {
                                                setWorkTypeFilter("all");
                                                setSalaryFilter("all");
                                            }}
                                        >
                                            รีเซ็ตตัวกรอง
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>


                    </section>



                    {/* =================================================
                        Status Filter
                    ================================================= */}

                    <div className="status-filter">
                        <button
                            className={statusFilter === "all" ? "active" : ""}
                            onClick={() => setStatusFilter("all")}
                        >
                            ทั้งหมด ({applications.length})
                        </button>

                        <button
                            className={statusFilter === "pending" ? "active" : ""}
                            onClick={() => setStatusFilter("pending")}
                        >
                            รอการพิจารณา ({statusCounts.pending})
                        </button>

                        <button
                            className={statusFilter === "interview" ? "active" : ""}
                            onClick={() => setStatusFilter("interview")}
                        >
                            สัมภาษณ์ ({statusCounts.interview})
                        </button>

                        <button
                            className={statusFilter === "accepted" ? "active" : ""}
                            onClick={() => setStatusFilter("accepted")}
                        >
                            ตอบรับแล้ว ({statusCounts.accepted})
                        </button>

                        <button
                            className={statusFilter === "rejected" ? "active" : ""}
                            onClick={() => setStatusFilter("rejected")}
                        >
                            ไม่ผ่านการคัดเลือก ({statusCounts.rejected})
                        </button>
                    </div>



                    {/* =================================================
                        Applications
                    ================================================= */}

                    <section className="applications-section">


                        {/* Table Header */}

                        <div className="applications-table-header">

                            <span>
                                ตำแหน่งงาน
                            </span>

                            <span>
                                สถานะ
                            </span>

                            <span>
                                วันที่สมัคร
                            </span>

                            <span>
                                อัปเดตล่าสุด
                            </span>

                            <span>
                                การจัดการ
                            </span>

                        </div>



                        {/* Application List */}

                        <div className="applications-list">

                            {filteredApplications.length > 0 ? (

                                filteredApplications.map((application) => {

                                    const progress = getProgress(application.status);
                                    const isRejected = application.status === "rejected";

                                    return (
                                        <div
                                            className="application-card"
                                            key={application.id}
                                        >

                                            {/* ================= Job ================= */}

                                            <div className="application-job">

                                                <div className="job-company-icon">
                                                    {application.job?.company?.logo ? (
                                                        <img
                                                            src={
                                                                application.job.company.logo.startsWith("http")
                                                                    ? application.job.company.logo
                                                                    : `http://localhost:5000${application.job.company.logo}`
                                                            }
                                                            alt={`โลโก้ ${application.job?.company?.companyName || "บริษัท"}`}
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = "none";
                                                                e.currentTarget.nextElementSibling.style.display = "flex";
                                                            }}
                                                        />
                                                    ) : null}

                                                    <div
                                                        className="company-logo-fallback"
                                                        style={{
                                                            display: application.job?.company?.logo ? "none" : "flex"
                                                        }}
                                                    >
                                                        <BiBriefcaseAlt2 />
                                                    </div>
                                                </div>

                                                <div>

                                                    <h3>
                                                        {application.job?.title}
                                                    </h3>

                                                    <p className="company-name">
                                                        {application.job?.company?.companyName}
                                                    </p>

                                                    <div className="job-meta">

                                                        <span>
                                                            <BiBriefcaseAlt2 />
                                                            {application.job?.workType}
                                                        </span>

                                                        <span>
                                                            <FiDollarSign />

                                                            {application.job?.salaryType === "paid"
                                                                ? `${application.job.salary?.toLocaleString()} ${application.job.salaryUnit}`
                                                                : "ไม่มีค่าตอบแทน"
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ================= Status ================= */}

                                            {/* ================= Status ================= */}

                                            <div className="application-status">
                                                <span
                                                    className={`status-badge ${application.status}`}
                                                >
                                                    {application.status === "pending" && (
                                                        <CgSandClock className="status-icon" />
                                                    )}

                                                    {application.status === "interview" && (
                                                        <FiClock className="status-icon" />
                                                    )}

                                                    {application.status === "accepted" && (
                                                        <FiCheckCircle className="status-icon" />
                                                    )}

                                                    {application.status === "rejected" && (
                                                        <FiXCircle className="status-icon" />
                                                    )}

                                                    {statusText[application.status] || "รอการพิจารณา"}
                                                </span>
                                            </div>


                                            {/* ================= Applied Date ================= */}

                                            <div className="application-date">

                                                {new Date(
                                                    application.createdAt
                                                ).toLocaleDateString(
                                                    "th-TH",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}

                                            </div>


                                            {/* ================= Updated ================= */}

                                            <div className="application-date">

                                                {new Date(
                                                    application.updatedAt
                                                ).toLocaleDateString(
                                                    "th-TH",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}

                                            </div>

                                            {/* ================= Action ================= */}


                                            <div className="application-action">
                                                <button
                                                    type="button"
                                                    className="detail-btn"
                                                    onClick={() =>
                                                        navigate(`/internship/${application.job?.id}`)
                                                    }
                                                >
                                                    ดูรายละเอียด
                                                </button>

                                                <div className="action-menu-wrapper">
                                                    <button
                                                        type="button"
                                                        className="more-btn"
                                                        aria-label="ตัวเลือกเพิ่มเติม"
                                                        aria-expanded={openMenu === application.id}
                                                        onClick={() => {
                                                            setOpenMenu((current) =>
                                                                current === application.id
                                                                    ? null
                                                                    : application.id
                                                            );
                                                        }}
                                                    >
                                                        <FiMoreVertical />
                                                    </button>

                                                    {openMenu === application.id && (
                                                        <div className="action-menu">



                                                            <button
                                                                type="button"
                                                                className="cancel-application-btn"
                                                                disabled={
                                                                    ["cancelled", "accepted"].includes(application.status) ||
                                                                    cancellingId === application.id
                                                                }
                                                                onClick={() => cancelApplication(application.id)}
                                                            >
                                                                {cancellingId === application.id
                                                                    ? "กำลังยกเลิก..."
                                                                    : "ยกเลิกสมัครฝึกงาน"}
                                                            </button>



                                                        </div>
                                                    )}
                                                </div>
                                            </div>




                                            {/* ================= Progress ================= */}

                                            <div className="application-progress">

                                                <div className="progress-line">

                                                    <div
                                                        className="progress-line-active"
                                                        style={{
                                                            width: `${((progress - 1) / 4) * 100}%`
                                                        }}
                                                    />

                                                </div>


                                                <div className="progress-steps">

                                                    {/* สมัครงาน */}

                                                    <div
                                                        className={
                                                            progress >= 1
                                                                ? "step active"
                                                                : "step"
                                                        }
                                                    >

                                                        <div className="step-dot">
                                                            {progress >= 1 && <FiCheck />}
                                                        </div>

                                                        <span>
                                                            สมัครงาน
                                                        </span>

                                                        <small>
                                                            {new Date(
                                                                application.createdAt
                                                            ).toLocaleDateString(
                                                                "th-TH",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )}
                                                        </small>

                                                    </div>


                                                    {/* รอการคัดกรอง */}

                                                    <div
                                                        className={
                                                            progress >= 2
                                                                ? "step active"
                                                                : "step"
                                                        }
                                                    >

                                                        <div className="step-dot">
                                                            {progress >= 2 && <FiCheck />}
                                                        </div>

                                                        <span>
                                                            รอการคัดกรอง
                                                        </span>

                                                    </div>


                                                    {/* สัมภาษณ์ */}

                                                    <div
                                                        className={
                                                            progress >= 3
                                                                ? "step active"
                                                                : "step"
                                                        }
                                                    >

                                                        <div className="step-dot">
                                                            {isRejected ? (
                                                                "×"
                                                            ) : (
                                                                progress >= 3 && <FiCheck />
                                                            )}
                                                        </div>

                                                        <span>
                                                            {isRejected
                                                                ? "ไม่ผ่านการคัดเลือก"
                                                                : "สัมภาษณ์"
                                                            }
                                                        </span>

                                                    </div>


                                                    {/* ตอบรับ */}

                                                    <div
                                                        className={
                                                            progress >= 4
                                                                ? "step active"
                                                                : "step"
                                                        }
                                                    >

                                                        <div className="step-dot">
                                                            {progress >= 4 && <FiCheck />}
                                                        </div>

                                                        <span>
                                                            ตอบรับ
                                                        </span>

                                                    </div>


                                                    {/* เริ่มงาน */}

                                                    <div
                                                        className={
                                                            progress >= 5
                                                                ? "step active"
                                                                : "step"
                                                        }
                                                    >

                                                        <div className="step-dot">
                                                            {progress >= 5 && <FiCheck />}
                                                        </div>

                                                        <span>
                                                            เริ่มงาน
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    );

                                })

                            ) : (

                                <div className="no-applications">

                                    <FiBriefcase />

                                    <h3>
                                        ไม่พบงานที่สมัคร
                                    </h3>

                                    <p>
                                        ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง
                                    </p>

                                </div>

                            )}

                        </div>


                    </section>


                </main>


            </div>

            {showPopup && (
                <div
                    className="my-jobs-popup-overlay"
                    onClick={() => {
                        if (popupType !== "loading") {
                            setShowPopup(false);
                        }
                    }}
                >
                    <div
                        className={`my-jobs-popup ${popupType}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="my-jobs-popup-close"
                            onClick={() => {
                                if (cancellingId === null) {
                                    setShowPopup(false);
                                }
                            }}
                            disabled={cancellingId !== null}
                            aria-label="ปิดหน้าต่าง"
                        >
                            <RxCross2 />
                        </button>

                        <div className="my-jobs-popup-icon">
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : popupType === "confirm" ? (
                                <IoIosCloseCircle />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>

                        <h3>
                            {popupType === "confirm"
                                ? "ยืนยันการยกเลิก"
                                : popupType === "success"
                                    ? "ยกเลิกการสมัครสำเร็จ"
                                    : "ไม่สามารถยกเลิกได้"}
                        </h3>

                        <p>{popupMessage}</p>

                        <div className="my-jobs-popup-actions">
                            {popupType === "confirm" ? (
                                <>
                                    <button
                                        type="button"
                                        className="my-jobs-popup-btn secondary"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        ยกเลิก
                                    </button>

                                    <button
                                        type="button"
                                        className="my-jobs-popup-btn danger"
                                        onClick={confirmCancelApplication}
                                        disabled={cancellingId !== null}
                                    >
                                        {cancellingId !== null
                                            ? "กำลังยกเลิก..."
                                            : "ยืนยันการยกเลิก"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="my-jobs-popup-btn"
                                    onClick={() => setShowPopup(false)}
                                >
                                    ตกลง
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>

    );

}


export default MyJobs;