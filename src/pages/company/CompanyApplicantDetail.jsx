import NavbarCompany from "../../components/NavbarCompany";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FiArrowLeft,
    FiMail,
    FiPhone,
    FiEye,
    FiMapPin,
    FiUser,
    FiBriefcase,
    FiCalendar,
    FiEdit,
    FiXCircle,
    FiFileText,
    FiBookOpen,
    FiCode,
    FiFolder,
    FiMessageCircle
} from "react-icons/fi";

import "./CompanyApplicantDetail.css";

function CompanyApplicantDetail() {

    const navigate = useNavigate();
    const { jobId, applicationId } = useParams();

    const [activeTab, setActiveTab] = useState("overview");

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchApplication = async () => {

            try {

                const token = localStorage.getItem("companyToken");

                const res = await fetch(
                    `http://localhost:5000/api/company/jobs/${jobId}/applicants/${applicationId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                console.log("APPLICANT DETAIL RESPONSE:", data);
console.log("ฟิลด์ทั้งหมดของ user:", Object.keys(data.user || {}));
console.log("ข้อมูล user แบบเต็ม:", JSON.stringify(data.user, null, 2));

                if (!res.ok) {
                    alert(
                        data.message ||
                        "ไม่สามารถโหลดข้อมูลผู้สมัครได้"
                    );

                    navigate(`/company/jobs/${jobId}/applicants`);

                    return;
                }

                setApplication(data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchApplication();

    }, [jobId, applicationId, navigate]);



    /* =================================================
       STATUS
    ================================================= */

    const getStatus = (status) => {

        switch (status) {

            case "interview":
                return {
                    label: "สัมภาษณ์",
                    className: "interview"
                };

            case "accepted":
                return {
                    label: "ตอบรับแล้ว",
                    className: "accepted"
                };

            case "rejected":
                return {
                    label: "ไม่ผ่านการคัดเลือก",
                    className: "rejected"
                };

            default:
                return {
                    label: "รอการพิจารณา",
                    className: "pending"
                };
        }

    };


    /* =================================================
       DATE
    ================================================= */

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "th-TH",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    };


    /* =================================================
       SALARY
    ================================================= */

    const getSalary = (job) => {

        if (!job) return "-";

        if (job.salaryType !== "paid") {
            return "ไม่มีค่าตอบแทน";
        }

        if (!job.salary) {
            return "ไม่ระบุ";
        }

        return `${job.salary.toLocaleString()} ${job.salaryUnit || "บาท"}`;

    };
    if (loading) {
        return <p>กำลังโหลดข้อมูล...</p>;
    }

    if (!application) {
        return null;
    }

    const handleChangeStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem("companyToken");

            const res = await fetch(
                `http://localhost:5000/api/company/jobs/${jobId}/applicants/${applicationId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "เปลี่ยนสถานะไม่สำเร็จ");
                return;
            }

            // อัปเดตข้อมูลบนหน้าเว็บทันที
            setApplication({
                ...application,
                status: data.application.status
            });

            alert("เปลี่ยนสถานะสำเร็จ");

        } catch (error) {
            console.log(error);
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }
    };

    const handleRejectApplicant = async () => {

        const confirmReject = window.confirm(
            `ต้องการปฏิเสธ ${fullName} ใช่หรือไม่?`
        );

        if (!confirmReject) {
            return;
        }

        await handleChangeStatus("rejected");
    };

    const user = application.user;
    const job = application.job;

    const status = getStatus(application.status);

    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim();


    return (
        <>
            <NavbarCompany />

            <div className="applicant-detail-page">

                {/* =========================
                    BACK
                ========================= */}

                {/* BACK */}
                <div className="applicant-detail-breadcrumb">
                    <span
                        className="breadcrumb-link"
                        onClick={() =>
                            navigate(`/company/jobs/${jobId}/applicants`)
                        }
                    >
                        ผู้สมัคร
                    </span>

                    <span className="breadcrumb-separator">&gt;</span>

                    <span className="breadcrumb-current">
                        รายละเอียดผู้สมัคร
                    </span>
                </div>


                <div className="applicant-detail-layout">

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <aside className="applicant-detail-left">

                        {/* =========================
                            CARD 1 : PROFILE
                        ========================= */}

                        <section className="detail-profile-card">

                            <div className="detail-profile-avatar">
    {user.profileImage ? (
        <img
            src={
                user.profileImage.startsWith("http")
                    ? user.profileImage
                    : `http://localhost:5000${user.profileImage.startsWith("/")
                        ? ""
                        : "/"}${user.profileImage}`
            }
            alt={`รูปโปรไฟล์ ${fullName}`}
            onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "block";
            }}
        />
    ) : null}

    <FiUser
        className="detail-profile-avatar-fallback"
        style={{
            display: user.profileImage ? "none" : "block"
        }}
    />
</div>

                            <h1>
                                {fullName}
                            </h1>

                            <span
                                className={`detail-status-badge ${status.className}`}
                            >
                                <span className="detail-status-dot"></span>
                                {status.label}
                            </span>


                            <div className="detail-contact-list">

                                <div>
                                    <FiMail />
                                    <span>
                                        {user.email}
                                    </span>
                                </div>

                                <div>
                                    <FiPhone />
                                    <span>
                                        {user.phone}
                                    </span>
                                </div>

                                <div>
                                    <FiMapPin />
                                    <span>
                                        {user.province}
                                    </span>
                                </div>

                            </div>


                            <div className="detail-education-mini">

                                <div>
                                    <FiBookOpen />

                                    <div>
                                        <small>
                                            มหาวิทยาลัย
                                        </small>

                                        <strong>
                                            {user.university}
                                        </strong>
                                    </div>
                                </div>


                                <div>
                                    <FiBookOpen />

                                    <div>
                                        <small>
                                            คณะ
                                        </small>

                                        <strong>
                                            {user.faculty}
                                        </strong>
                                    </div>
                                </div>

                            </div>

                        </section>


                        {/* =========================
                            CARD 2 : JOB
                        ========================= */}

                        <section className="detail-job-card">

                            <div className="detail-card-title">

                                <h2>
                                    สมัครตำแหน่ง
                                </h2>

                            </div>


                            <h3>
                                {job.title}
                            </h3>


                            <div className="detail-job-meta">

                                <span>
                                    {job.jobType}
                                </span>

                                <span>
                                    |
                                </span>

                                <span>
                                    {getSalary(job)}
                                </span>

                            </div>


                            <div className="detail-job-location">

                                <FiMapPin />

                                {job.location}

                            </div>


                            <div className="detail-applied-date">

                                <FiCalendar />

                                <span>
                                    สมัครเมื่อ {formatDate(application.createdAt)}
                                </span>

                            </div>

                        </section>


                        {/* =========================
                            CARD 3 : MANAGEMENT
                        ========================= */}

                        <section className="detail-management-card">

                            <div className="detail-card-title">

                                <FiEdit />

                                <h2>
                                    การจัดการผู้สมัคร
                                </h2>

                            </div>


                            <div className="status-select-wrapper">

                                <label htmlFor="application-status">
                                    สถานะผู้สมัคร
                                </label>

                                <select
                                    id="application-status"
                                    className="status-select"
                                    value={application.status}
                                    onChange={(e) => handleChangeStatus(e.target.value)}
                                >
                                    <option value="pending">
                                        รอการพิจารณา
                                    </option>

                                    <option value="interview">
                                        สัมภาษณ์
                                    </option>

                                    <option value="accepted">
                                        ตอบรับแล้ว
                                    </option>

                                    <option value="rejected">
                                        ไม่ผ่านการคัดเลือก
                                    </option>
                                </select>

                            </div>


                            {/* <button
                                className="reject-applicant-btn"
                                onClick={handleRejectApplicant}
                            >
                                <FiXCircle />
                                ปฏิเสธผู้สมัคร
                            </button> */}

                        </section>

                    </aside>


                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <main className="applicant-detail-right">

                        {/* =========================
                            TABS
                        ========================= */}

                        <section className="detail-tabs-card">

                            <button
                                className={
                                    activeTab === "overview"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setActiveTab("overview")
                                }
                            >
                                <FiUser />
                                ข้อมูลโดยรวม
                            </button>


                            <button
                                className={
                                    activeTab === "resume"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setActiveTab("resume")
                                }
                            >
                                <FiFileText />
                                เรซูเม่ / ไฟล์
                            </button>


                            <button
                                className={
                                    activeTab === "contact"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setActiveTab("contact")
                                }
                            >
                                <FiMessageCircle />
                                ประวัติการติดต่อ
                            </button>

                        </section>


                        {/* =================================================
                            OVERVIEW
                        ================================================= */}

                        {activeTab === "overview" && (

                            <div className="detail-overview">

                                {/* =========================
                                    ABOUT
                                ========================= */}

                                <section className="detail-content-card">

                                    <div className="detail-content-title">

                                        <div className="detail-content-icon">
                                            <FiUser />
                                        </div>

                                        <div>
                                            <h2>
                                                เกี่ยวกับผู้สมัคร
                                            </h2>

                                        </div>

                                    </div>


                                    <div className="about-applicant">

                                        สวัสดีค่ะ ชื่อ{" "}

                                        <strong>
                                            {fullName}
                                        </strong>{" "}

                                        สนใจสมัครตำแหน่ง{" "}

                                        <strong>
                                            {job.title}
                                        </strong>{" "}

                                        และมีความสนใจในการเรียนรู้
                                        และพัฒนาทักษะเพื่อเติบโตในสายงานนี้ค่ะ

                                    </div>

                                </section>


                                {/* =========================
                                    SKILLS
                                ========================= */}

                                <section className="detail-content-card">

                                    <div className="detail-content-title">

                                        <div className="detail-content-icon">
                                            <FiCode />
                                        </div>

                                        <div>
                                            <h2>
                                                ทักษะ
                                            </h2>
                                        </div>

                                    </div>


                                    <div className="skill-list-applicants">

                                        {[
                                            user.skill1,
                                            user.skill2,
                                            user.skill3,
                                            user.skill4,
                                            user.skill5
                                        ]
                                            .filter(Boolean)
                                            .map((skill, index) => (

                                                <span
                                                    key={index}
                                                    className="skill-tag"
                                                >
                                                    {skill}
                                                </span>

                                            ))
                                        }

                                    </div>

                                </section>


                                {/* =========================
                                    EDUCATION
                                ========================= */}

                                <section className="detail-content-card">

                                    <div className="detail-content-title">

                                        <div className="detail-content-icon">
                                            <FiBookOpen />
                                        </div>

                                        <div>
                                            <h2>
                                                ประวัติการศึกษา
                                            </h2>

                                        </div>

                                    </div>


                                    <div className="education-detail">

                                        <div className="education-item">
                                            <span>
                                                ระดับการศึกษา
                                            </span>

                                            <strong>
                                                {user.educationLevel}
                                            </strong>
                                        </div>


                                        <div className="education-item">
                                            <span>
                                                มหาวิทยาลัย
                                            </span>

                                            <strong>
                                                {user.university}
                                            </strong>
                                        </div>


                                        <div className="education-item">
                                            <span>
                                                คณะ
                                            </span>

                                            <strong>
                                                {user.faculty}
                                            </strong>
                                        </div>


                                        <div className="education-item">
                                            <span>
                                                สาขา
                                            </span>

                                            <strong>
                                                {user.major}
                                            </strong>
                                        </div>


                                        <div className="education-item">
                                            <span>
                                                ชั้นปี
                                            </span>

                                            <strong>
                                                {user.year}
                                            </strong>
                                        </div>

                                    </div>

                                </section>


                                {/* =========================
    EXPERIENCE / PROJECT
========================= */}

                                <section className="detail-content-card">

                                    <div className="detail-content-title">

                                        <div className="detail-content-icon">
                                            <FiFolder />
                                        </div>

                                        <div>
                                            <h2>
                                                ประสบการณ์ / โปรเจกต์
                                            </h2>

                                            <p>
                                                ประสบการณ์และผลงานของผู้สมัคร
                                            </p>
                                        </div>

                                    </div>


                                    {user.projects && user.projects.length > 0 ? (

                                        <div className="applicant-project-list">

                                            {user.projects.map((project) => (

                                                <div
                                                    className="applicant-project-card"
                                                    key={project.id}
                                                >

                                                    {/* =========================
                        PROJECT
                    ========================= */}

                                                    <div className="applicant-project-header">

                                                        <div className="applicant-project-icon">
                                                            <FiFolder />
                                                        </div>

                                                        <div className="applicant-project-info">

                                                            <h3>
                                                                {project.name}
                                                            </h3>

                                                            {project.description && (
                                                                <p>
                                                                    {project.description}
                                                                </p>
                                                            )}

                                                        </div>

                                                    </div>


                                                    {/* =========================
                        FILES
                    ========================= */}

                                                    {project.files &&
                                                        project.files.length > 0 && (

                                                            <div className="applicant-project-files">

                                                                <h4>
                                                                    ไฟล์ผลงาน
                                                                </h4>

                                                                <div className="project-file-list">

                                                                    {project.files.map((file) => {

                                                                        const fileUrl =
                                                                            `http://localhost:5000${file.filePath}`;

                                                                        const isImage =
                                                                            /\.(png|jpg|jpeg)$/i.test(
                                                                                file.filePath
                                                                            );

                                                                        return (

                                                                            <div
                                                                                className="project-file-item"
                                                                                key={file.id}
                                                                            >

                                                                                {isImage ? (

                                                                                    <a
                                                                                        href={fileUrl}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="project-file-preview"
                                                                                    >
                                                                                        <img
                                                                                            src={fileUrl}
                                                                                            alt={file.originalName}
                                                                                        />
                                                                                    </a>

                                                                                ) : (

                                                                                    <div className="project-file-icon">
                                                                                        <FiFileText />
                                                                                    </div>

                                                                                )}


                                                                                <div className="project-file-info">

                                                                                    <strong>
                                                                                        {file.originalName}
                                                                                    </strong>

                                                                                    <a
                                                                                        href={fileUrl}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                    >
                                                                                        ดูไฟล์
                                                                                    </a>

                                                                                </div>

                                                                            </div>

                                                                        );

                                                                    })}

                                                                </div>

                                                            </div>

                                                        )}

                                                </div>

                                            ))}

                                        </div>

                                    ) : (

                                        <div className="no-content-box">

                                            <FiFolder />

                                            <span>
                                                ยังไม่มีข้อมูลประสบการณ์หรือโปรเจกต์
                                            </span>

                                        </div>

                                    )}

                                </section>

                            </div>

                        )}


                        {/* =================================================
                            RESUME
                        ================================================= */}

                        {activeTab === "resume" && (

                            <section className="detail-content-card">

                                <div className="detail-content-title">

                                    <div className="detail-content-icon">
                                        <FiFileText />
                                    </div>

                                    <div>
                                        <h2>
                                            เรซูเม่ / ไฟล์
                                        </h2>

                                        <p>
                                            เอกสารที่ผู้สมัครแนบมา
                                        </p>
                                    </div>

                                </div>


                                {application.resume ? (

                                    <div className="resume-file-box">

                                        <div className="resume-file-icon">
                                            <FiFileText />
                                        </div>

                                        <div className="resume-file-info">

                                            <strong>
                                                Resume ของ {fullName}
                                            </strong>

                                            <span>
                                                เอกสารสมัครงาน
                                            </span>

                                        </div>


                                        <div className="resume-file-actions">

                                            <a
                                                href={`http://localhost:5000${application.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="resume-view-btn"
                                            >
                                                <FiEye />
                                                ดู Resume
                                            </a>

                                            <a
                                                href={`http://localhost:5000${application.resume}`}
                                                download
                                                className="resume-download-btn"
                                            >
                                                ดาวน์โหลด
                                            </a>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="no-content-box">

                                        <FiFileText />

                                        <span>
                                            ผู้สมัครยังไม่ได้แนบไฟล์เรซูเม่
                                        </span>

                                    </div>

                                )}

                            </section>

                        )}


                        {/* =================================================
                            CONTACT HISTORY
                        ================================================= */}

                        {activeTab === "contact" && (

                            <section className="detail-content-card">

                                <div className="detail-content-title">

                                    <div className="detail-content-icon">
                                        <FiMessageCircle />
                                    </div>

                                    <div>
                                        <h2>
                                            ประวัติการติดต่อ
                                        </h2>

                                        <p>
                                            ประวัติการติดต่อกับผู้สมัคร
                                        </p>
                                    </div>

                                </div>


                                <div className="no-content-box">

                                    <FiMessageCircle />

                                    <span>
                                        ยังไม่มีประวัติการติดต่อ
                                    </span>

                                </div>

                            </section>

                        )}

                    </main>

                </div>
                <div className="applicant-detail-bottom-actions">

                    <button
                        className="detail-back-list-btn"
                        onClick={() =>
                            navigate(`/company/jobs/${jobId}/applicants`)
                        }
                    >
                        <FiArrowLeft />
                        กลับไปหน้ารายชื่อผู้สมัคร
                    </button>

                    <button
                        className="detail-reject-btn"
                        onClick={() => handleChangeStatus("rejected")}
                    >
                        <FiXCircle />
                        ปฏิเสธผู้สมัคร
                    </button>

                </div>
            </div>
        </>
    );
}

export default CompanyApplicantDetail;
