import NavbarCompany from "../../components/NavbarCompany";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CompanyDashboard.css";
import {
    FaBriefcase,
    FaUsers,
    FaUserPlus,
    FaMoneyBillWave,
    FaMapMarkerAlt,
    FaClipboardList,
    FaEye,
    FaBullhorn
} from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { BiSolidBusiness } from "react-icons/bi";
import { MdComputer } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
    FiEye,
    FiEdit,
    FiUsers,
    FiTrash2,
    FiBriefcase,
    FiArrowRight,
    FiFileText
} from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";
import { ImBin } from "react-icons/im";
import { MdModeEdit } from "react-icons/md";
import { IoBusinessSharp } from "react-icons/io5";
import { SiEthereum } from "react-icons/si";

function CompanyDashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");
    const [deleteJobId, setDeleteJobId] = useState(null);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("companyToken");

            console.log("COMPANY TOKEN:", token);

            // ยังไม่ได้ Login บริษัท
            if (!token) {
                alert("กรุณาเข้าสู่ระบบบริษัทก่อน");
                navigate("/company/login");
                return;
            }

            const res = await fetch(
                "http://localhost:5000/api/company/jobs",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            console.log("JOBS RESPONSE:", data);

            // Token หมดอายุ / ไม่ถูกต้อง
            if (!res.ok) {
                console.log("COMPANY JOB ERROR:", data);

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("companyToken");
                    localStorage.removeItem("company");

                    alert(data.message || "กรุณาเข้าสู่ระบบบริษัทใหม่");

                    navigate("/company/login");

                    return;
                }

                alert(data.message || "ไม่สามารถโหลดประกาศงานได้");

                setJobs([]);

                return;
            }

            // API ส่ง Array มา
            if (Array.isArray(data)) {
                setJobs(data);
            } else {
                console.error("ข้อมูล jobs ไม่ใช่ Array:", data);
                setJobs([]);
            }

        } catch (err) {

            console.error("FETCH JOB ERROR:", err);

            setJobs([]);

        } finally {

            setLoading(false);

        }
    };

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem("companyToken");

            if (!token) {
                console.error("ไม่พบ companyToken");
                return;
            }

            const res = await fetch(
                "http://localhost:5000/api/company/jobs/activity",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            console.log("ACTIVITY STATUS:", res.status);
            console.log("ACTIVITY RESPONSE:", data);

            if (!res.ok) {
                console.error("โหลดกิจกรรมไม่สำเร็จ:", data);
                setActivities([]);
                return;
            }

            // รองรับทั้ง Array โดยตรง และข้อมูลที่อยู่ใน data
            const activityList = Array.isArray(data)
                ? data
                : Array.isArray(data.activities)
                    ? data.activities
                    : null;

            if (activityList) {
                setActivities(activityList);
            } else {
                console.error("รูปแบบข้อมูลกิจกรรมไม่ถูกต้อง:", data);
                setActivities([]);
            }

        } catch (error) {
            console.error("FETCH ACTIVITY ERROR:", error);
            setActivities([]);
        }
    };



    useEffect(() => {

        fetchJobs();
        fetchActivities();

    }, []);

    const totalApplicants = jobs.reduce(
        (sum, job) => sum + (job._count?.applications || 0),
        0
    );

    const newApplicants = jobs.reduce(
        (sum, job) => sum + (job.newApplicants || 0),
        0
    );

    // ลบงาน
    const deleteJob = async (id) => {
        try {
            const token = localStorage.getItem("companyToken");

            const res = await fetch(
                `http://localhost:5000/api/company/jobs/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (res.ok) {
                setJobs(prev =>
                    prev.filter(job => job.id !== id)
                );

                setPopupType("success");
                setPopupMessage("ลบประกาศงานสำเร็จ");
                setShowPopup(true);
            } else {
                setPopupType("error");
                setPopupMessage(
                    data.message || "ไม่สามารถลบประกาศงานได้"
                );
                setShowPopup(true);
            }
        } catch (error) {
            console.error("DELETE JOB ERROR:", error);

            setPopupType("error");
            setPopupMessage("ไม่สามารถเชื่อมต่อ Server ได้");
            setShowPopup(true);
        }
    };
    const formatActivityTime = (date) => {

        const diff =
            Date.now() - new Date(date).getTime();

        const minutes =
            Math.floor(diff / (1000 * 60));

        const hours =
            Math.floor(diff / (1000 * 60 * 60));

        const days =
            Math.floor(diff / (1000 * 60 * 60 * 24));


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
    return (
        <>
            <NavbarCompany />

            <div className="company-dashboard-page">

                {/* Hero */}
                <section className="dashboard-hero">


                    <div className="hero-content">

                        <h1>แดชบอร์ด<span>บริษัท</span></h1>

                        <p>
                            จัดการประกาศฝึกงานและติดตามผู้สมัครได้ในที่เดียว
                        </p>

                        <button
                            className="create-job-btn"
                            onClick={() => navigate("/company/create-job")}
                        >
                            + เพิ่มประกาศงาน
                        </button>

                    </div>

                    <div className="hero-image">
                        <img src="/image/Dashboard.jpeg" alt="Dashboard" />
                    </div>

                </section>

                {/* Dashboard Summary Cards */}
                <section className="dashboard-summary">

                    <div className="summary-card">
                        <div className="summary-icon">
                            <FaBriefcase />
                        </div>

                        <div>
                            <h3>งานที่เปิดรับ</h3>
                            <p className="summary-number">
                                {jobs.length}
                            </p>
                        </div>
                    </div>


                    <div className="summary-card applicant-summary">

                        <div className="summary-icon">
                            <FaUserGroup />
                        </div>

                        <div>
                            <h3>ผู้สมัครทั้งหมด</h3>
                            <p className="summary-number">
                                {totalApplicants}
                            </p>
                        </div>

                    </div>


                    <div className="summary-card">
                        <div className="summary-icon">
                            <FaUserPlus />
                        </div>

                        <div>
                            <h3>ผู้สมัครใหม่</h3>
                            <p className="summary-number">
                                {newApplicants}
                            </p>
                        </div>
                    </div>

                </section>

                {/* My Jobs Section */}
                <section className="my-jobs-section">

                    <div className="section-header">

                        <div>
                            <h2>งานที่ประกาศของฉัน</h2>
                        </div>


                        <button
                            className="view-all-btn"
                            onClick={() => navigate("/company/jobs")}
                        >
                            ดูทั้งหมด
                            <FiArrowRight />
                        </button>

                    </div>



                    <div className="jobs-grid">

                        {
                            loading ? (

                                <p>กำลังโหลด...</p>

                            ) : (

                                jobs.slice(0, 3).map((job) => (

                                    <div
                                        className="job-card"
                                        key={job.id}
                                        onClick={() => navigate(`/company/jobs/${job.id}`)}
                                    >


                                        <div
                                            className={`job-status ${job.status === "open"
                                                ? "job-status-open"
                                                : "job-status-closed"
                                                }`}
                                        >
                                            {job.status === "open"
                                                ? "เปิดรับ"
                                                : "ปิดรับสมัคร"}
                                        </div>


                                        <div className="company-name">

                                            <div className="company-icon">
                                                <IoBusinessSharp />
                                            </div>


                                            <h3>
                                                {job.company?.companyName}
                                            </h3>


                                        </div>


                                        <h2>
                                            {job.title}
                                        </h2>



                                        <div className="job-info">


                                            <p>
                                                <MdComputer />

                                                สายงาน: {job.category}

                                            </p>


                                            <p>
                                                <FaClipboardList />

                                                ประเภทงาน: {job.jobType}

                                            </p>


                                            <p>
                                                <RiMoneyDollarCircleLine />

                                                {
                                                    job.salaryType === "paid"

                                                        ?
                                                        `${job.salary} ${job.salaryUnit}`

                                                        :
                                                        "ไม่มีค่าตอบแทน"

                                                }

                                            </p>



                                            <p>
                                                <FaMapMarkerAlt />

                                                จังหวัด: {job.location}

                                            </p>


                                            <p>

                                                <FaUserGroup />

                                                จำนวนผู้สมัคร: {job._count?.applications || 0} คน

                                            </p>



                                            <div className="job-actions">


                                                <button
                                                    className="detail-btn-db"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/company/jobs/${job.id}`);
                                                    }}
                                                >
                                                    <FaEye />
                                                    ดูรายละเอียด
                                                </button>


                                                <div className="job-actions-bottom">


                                                    <button
                                                        className="edit-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/company/jobs/edit/${job.id}`);
                                                        }}
                                                    >
                                                        <MdModeEdit />
                                                        แก้ไข
                                                    </button>



                                                    <button
                                                        className="applicant-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/company/jobs/${job.id}/applicants`);
                                                        }}
                                                    >
                                                        <FaUserGroup />
                                                        ดูผู้สมัคร
                                                    </button>



                                                    <button
                                                        className="delete-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            setDeleteJobId(job.id);
                                                            setPopupType("confirm");
                                                            setPopupMessage("ต้องการลบประกาศงานนี้หรือไม่?");
                                                            setShowPopup(true);
                                                        }}
                                                    >
                                                        <ImBin />
                                                        ลบ
                                                    </button>


                                                </div>


                                            </div>


                                        </div>


                                    </div>


                                ))

                            )

                        }

                    </div>

                </section>

                {/* กิจกรรมล่าสุด */}
                <section className="activity-section">

                    <div className="section-header">

                        <div>
                            <h2>กิจกรรมล่าสุด</h2>
                        </div>

                        <button
                            className="view-all-btn"
                            onClick={() => navigate("/company/activity")}
                        >
                            ดูทั้งหมด
                            <FiArrowRight />
                        </button>

                    </div>

                    <div className="timeline">

                        {activities.length > 0 ? (

                            activities.slice(0, 3).map((activity) => (

                                <div
                                    className={`timeline-item ${activity.type}-item`}
                                    key={activity.id}
                                >

                                    <div className={`timeline-icon ${activity.type}`}>

                                        {activity.type === "application" && (
                                            <FaUserPlus />
                                        )}

                                        {activity.type === "published" && (
                                            <FaBullhorn />
                                        )}

                                        {activity.type === "edited" && (
                                            <MdModeEdit />
                                        )}

                                    </div>

                                    <div className="timeline-content">

                                        <h3>
                                            {activity.title}
                                        </h3>

                                        <p>
                                            {activity.description}
                                        </p>

                                        <span>
                                            {formatActivityTime(activity.createdAt)}
                                        </span>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <div className="no-activity">
                                ยังไม่มีกิจกรรมล่าสุด
                            </div>

                        )}

                    </div>


                </section>

            </div>
            {showPopup && (
                <div className="company-popup-overlay">
                    <div className={`company-popup ${popupType}`}>

                        <button
                            type="button"
                            className="company-popup-close"
                            onClick={() => {
                                setShowPopup(false);
                                setDeleteJobId(null);
                            }}
                        >
                            <RxCross2 />
                        </button>

                        <div className="company-popup-icon">
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>

                        <h3>
                            {popupType === "success"
                                ? "ดำเนินการสำเร็จ"
                                : popupType === "error"
                                    ? "ไม่สามารถดำเนินการได้"
                                    : "ยืนยันการลบประกาศ"}
                        </h3>

                        <p>{popupMessage}</p>

                        {popupType === "confirm" ? (
                            <div className="company-popup-actions">

                                <button
                                    type="button"
                                    className="company-popup-cancel-btn"
                                    onClick={() => {
                                        setShowPopup(false);
                                        setDeleteJobId(null);
                                    }}
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    type="button"
                                    className="company-popup-confirm-btn"
                                    onClick={async () => {
                                        const id = deleteJobId;

                                        setShowPopup(false);
                                        setDeleteJobId(null);

                                        await deleteJob(id);
                                    }}
                                >
                                    ตกลง
                                </button>

                            </div>
                        ) : (
                            <button
                                type="button"
                                className="company-popup-btn"
                                onClick={() => setShowPopup(false)}
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

export default CompanyDashboard;