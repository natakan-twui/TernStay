import NavbarCompany from "../../components/NavbarCompany";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CompanyJobDetail.css";

import {
    FiArrowLeft,
    FiEdit,
    FiUsers,
    FiMapPin,
    FiDollarSign,
    FiBriefcase,
    FiCalendar,
    FiUser,
    FiMail,
    FiPhone,
    FiFileText
} from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuUserRoundSearch } from "react-icons/lu";
import { HiUsers } from "react-icons/hi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuUserPlus } from "react-icons/lu";

function CompanyJobDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState("open"); //เปลี่ยนสถานะเปิดรับสมัครงาน

    useEffect(() => {

        const fetchJob = async () => {

            try {

                const token = localStorage.getItem("companyToken");

                const res = await fetch(
                    `http://localhost:5000/api/company/jobs/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || "ไม่พบประกาศงาน");
                    navigate("/company/dashboard");
                    return;
                }

                setJob(data);
                setStatus(data.status || "open");

                const activeApplicants = (data.applications || []).filter(
                    (applicant) => applicant.status !== "cancelled"
                );

                setApplicants(activeApplicants);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }
        };

        fetchJob();

    }, [id, navigate]);

    if (loading) {
        return (
            <>
                <NavbarCompany />

                <div className="company-job-detail-page">
                    <p className="loading-text">
                        กำลังโหลดข้อมูล...
                    </p>
                </div>
            </>
        );
    }

    if (!job) {
        return null;
    }
    const handleStatusChange = async (newStatus) => {

        try {

            const token = localStorage.getItem("companyToken");

            const res = await fetch(
                `http://localhost:5000/api/company/jobs/${id}/status`,
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
                alert(data.message || "ไม่สามารถเปลี่ยนสถานะได้");
                return;
            }

            window.location.reload();

        } catch (error) {

            console.log(error);

            alert("ไม่สามารถเชื่อมต่อ Server ได้");

        }
    };
    return (
        <>
            <NavbarCompany />

            <div className="company-job-detail-page">

                {/* ปุ่มกลับ */}
                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate("/company/dashboard")}
                >
                    <FiArrowLeft />
                    กลับแดชบอร์ด
                </button>

                {/* Header */}
                <section className="job-detail-header">

                    <div className="job-detail-header-content">

                        <span
                            className={`job-detail-status ${status === "closed"
                                ? "status-closed"
                                : "status-open"
                                }`}
                        >
                            {status === "open"
                                ? "เปิดรับสมัคร"
                                : "ปิดรับสมัคร"
                            }
                        </span>

                        <h1>
                            {job.title}
                        </h1>

                        <p className="detail-company-name">
                            {job.company?.companyName || "บริษัทของคุณ"}
                        </p>

                    </div>

                </section>

                <div className="job-detail-layout">

                    {/* ================= LEFT ================= */}
                    <main className="job-detail-main">

                        {/* รวมทุกข้อมูลไว้ในการ์ดเดียว */}
                        <section className="job-detail-card">

                            {/* ================= ข้อมูลตำแหน่งงาน ================= */}
                            <div className="detail-section">

                                <h2>
                                    <span className="step-circle">1</span>
                                    ข้อมูลตำแหน่งงาน
                                </h2>

                                <div className="detail-info-grid">

                                    <div className="detail-info-item">
                                        <span>
                                            สายงาน
                                        </span>

                                        <p>
                                            {job.category || "-"}
                                        </p>
                                    </div>

                                    <div className="detail-info-item">
                                        <span>
                                            ประเภทงาน
                                        </span>

                                        <p>
                                            {job.jobType || "-"}
                                        </p>
                                    </div>

                                    <div className="detail-info-item">
                                        <span>
                                            รูปแบบการทำงาน
                                        </span>

                                        <p>
                                            {job.workType || "-"}
                                        </p>
                                    </div>

                                    <div className="detail-info-item">
                                        <span>
                                            จังหวัด
                                        </span>

                                        <p>
                                            <FiMapPin />
                                            {job.location || "-"}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* ================= ค่าตอบแทน ================= */}
                            <div className="detail-section">

                                <h2>
                                    <span className="step-circle">2</span>
                                    เงินเดือน
                                </h2>

                                <p className="detail-large-text">

                                    {job.salaryType === "paid"
                                        ? `${job.salary || "-"} ${job.salaryUnit || "บาท/เดือน"}`
                                        : "ไม่มีค่าตอบแทน"
                                    }

                                </p>

                            </div>

                            {/* ================= รายละเอียดงาน ================= */}
                            <div className="detail-section">

                                <h2>
                                    <span className="step-circle">3</span>
                                    รายละเอียดงาน
                                </h2>

                                <div className="detail-text-section">

                                    <h3>
                                        หน้าที่ความรับผิดชอบ
                                    </h3>

                                    <p className="pre-line">
                                        {job.description || "-"}
                                    </p>

                                </div>

                                <div className="detail-text-section">

                                    <h3>
                                        คุณสมบัติผู้สมัคร
                                    </h3>

                                    {job.qualification ? (

                                        <ul>

                                            {job.qualification
                                                .split("\n")
                                                .filter(item => item.trim() !== "")
                                                .map((item, index) => (
                                                    <li key={index}>
                                                        {item}
                                                    </li>
                                                ))
                                            }

                                        </ul>

                                    ) : (

                                        <p>
                                            ยังไม่ได้ระบุ
                                        </p>

                                    )}

                                </div>

                                <div className="detail-text-section">

                                    <h3>
                                        สวัสดิการ
                                    </h3>

                                    {job.welfare ? (

                                        <ul>

                                            {job.welfare
                                                .split("\n")
                                                .filter(item => item.trim() !== "")
                                                .map((item, index) => (
                                                    <li key={index}>
                                                        {item}
                                                    </li>
                                                ))
                                            }

                                        </ul>

                                    ) : (

                                        <p>
                                            ยังไม่ได้ระบุ
                                        </p>

                                    )}

                                </div>

                            </div>

                            {/* ================= ข้อมูลการติดต่อ ================= */}
                            <div className="detail-section">

                                <h2>
                                    <span className="step-circle">4</span>
                                    ข้อมูลการติดต่อ
                                </h2>

                                <div className="contact-detail-list">

                                    <div>
                                        <FiUser />

                                        <span>
                                            {job.contactName || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <FiMail />

                                        <span>
                                            {job.contactEmail || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <FiPhone />

                                        <span>
                                            {job.contactPhone || "-"}
                                        </span>
                                    </div>

                                </div>

                            </div>

                            {/* ================= ปุ่มแก้ไข ================= */}
                            <div className="job-detail-actions">

                                <button
                                    className="sidebar-edit-btn"
                                    onClick={() =>
                                        navigate(`/company/jobs/edit/${job.id}`)
                                    }
                                >
                                    <FiEdit />
                                    แก้ไขประกาศงาน
                                </button>

                                <button
                                    className="close-job-btn"
                                    onClick={() => handleStatusChange("closed")}
                                >
                                    ปิดรับสมัครงาน
                                </button>

                            </div>

                        </section>

                    </main>

                    {/* ================= RIGHT ================= */}
                    <aside className="job-detail-sidebar">

                        {/* สถานะ */}
                        <div className="status-wrapper">
                            <section className="editjob-status-card">
                                <h2>สถานะการรับสมัคร</h2>

                                <select
                                    className="job-status-box"
                                    value={status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    <option value="open">
                                        เปิดรับสมัคร
                                    </option>

                                    <option value="closed">
                                        ปิดรับสมัคร
                                    </option>
                                </select>
                            </section>
                        </div>

                        {/* สถิติ */}
                        <section className="detail-side-card">

                            <h2>
                                สถิติการรับสมัคร
                            </h2>

                            <div className="publication-info">

                                {/* ผู้สมัครทั้งหมด */}
                                <div>

                                    <span>
                                        <FiUsers />
                                        ผู้สมัครทั้งหมด
                                    </span>

                                    <p>
                                        {job.statistics?.total || 0} คน
                                    </p>

                                </div>


                                {/* ผู้สมัครใหม่ 7 วัน */}
                                <div>

                                    <span>
                                        <LuUserPlus />
                                        ผู้สมัครใหม่ (7 วัน)
                                    </span>

                                    <p>
                                        {job.statistics?.newApplicants || 0} คน
                                    </p>

                                </div>


                                {/* กำลังพิจารณา */}
                                <div>

                                    <span>
                                        <LuUserRoundSearch />
                                        กำลังพิจารณา
                                    </span>

                                    <p>
                                        {job.statistics?.pending || 0} คน
                                    </p>

                                </div>


                                {/* ถูกปฏิเสธ */}
                                <div>

                                    <span>
                                        <IoCloseCircleOutline />
                                        ถูกปฏิเสธ
                                    </span>

                                    <p>
                                        {job.statistics?.rejected || 0} คน
                                    </p>

                                </div>

                            </div>

                        </section>


                    </aside>

                </div>

            </div>
        </>
    );
}

export default CompanyJobDetail;