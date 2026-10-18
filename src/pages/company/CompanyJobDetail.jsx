import NavbarCompany from "../../components/NavbarCompany";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CompanyJobDetail.css";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { IoAlertCircleOutline } from "react-icons/io5";
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
    FiFileText,
    FiChevronDown
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
    const [showStatusPopup, setShowStatusPopup] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [statusPopupType, setStatusPopupType] = useState("confirm");
    const [statusPopupMessage, setStatusPopupMessage] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
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

                // const activeApplicants = (data.applications || []).filter(
                //     (applicant) => applicant.status !== "cancelled"
                // );

                // setApplicants(activeApplicants);

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
    // เปิด Popup เพื่อยืนยันการเปลี่ยนสถานะ
    const openStatusConfirm = (newStatus) => {
        if (newStatus === status) return;

        setPendingStatus(newStatus);
        setStatusPopupType("confirm");

        setStatusPopupMessage(
            newStatus === "closed"
                ? "คุณต้องการปิดรับสมัครงานตำแหน่งนี้ใช่หรือไม่?"
                : "คุณต้องการเปิดรับสมัครงานตำแหน่งนี้ใช่หรือไม่?"
        );

        setShowStatusPopup(true);
    };

    // ยืนยันการเปลี่ยนสถานะ
    const handleStatusChange = async () => {
        if (!pendingStatus || updatingStatus) return;

        try {
            setUpdatingStatus(true);

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
                        status: pendingStatus
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setStatusPopupType("error");
                setStatusPopupMessage(
                    data.message || "ไม่สามารถเปลี่ยนสถานะประกาศงานได้"
                );
                return;
            }

            setStatus(pendingStatus);
            setJob((prev) => ({
                ...prev,
                status: pendingStatus
            }));

            setStatusPopupType("success");
            setStatusPopupMessage(
                pendingStatus === "closed"
                    ? "ปิดรับสมัครงานเรียบร้อยแล้ว"
                    : "เปิดรับสมัครงานเรียบร้อยแล้ว"
            );

            setPendingStatus(null);

        } catch (error) {
            console.error(error);

            setStatusPopupType("error");
            setStatusPopupMessage("ไม่สามารถเชื่อมต่อ Server ได้");

        } finally {
            setUpdatingStatus(false);
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

                {/* Header */}
                <section className="job-detail-header">
                    <div className="job-detail-header-content">
                        <span
                            className={`job-detail-status ${status === "closed" ? "status-closed" : "status-open"
                                }`}
                        >
                            {status === "open" ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                        </span>

                        <h1>{job.title}</h1>

                        <div className="job-header-info">
                            {/* แถวที่ 1 */}
                            <div className="job-header-info-item">
                                <FiBriefcase />
                                <div>
                                    <span>รูปแบบการทำงาน</span>
                                    <p>{job.workType || "-"}</p>
                                </div>
                            </div>

                            <div className="job-header-info-item">
                                <FiDollarSign />
                                <div>
                                    <span>ค่าตอบแทน</span>
                                    <p>
                                        {job.salaryType === "paid"
                                            ? `${Number(job.salary).toLocaleString("th-TH")} ${job.salaryUnit || "บาท/เดือน"
                                            }`
                                            : "ไม่มีค่าตอบแทน"}
                                    </p>
                                </div>
                            </div>

                            <div className="job-header-info-item">
                                <FiMapPin />
                                <div>
                                    <span>จังหวัด</span>
                                    <p>
                                        {job.location
                                            ? (
                                                job.location.match(
                                                    /กรุงเทพมหานคร|จังหวัด\s*[ก-๙]+|(?:อำเภอ|เขต)[ก-๙]+\s+จังหวัด\s*[ก-๙]+/
                                                )?.[0]
                                                    ?.replace("จังหวัด", "")
                                                    ?.trim()
                                                ||
                                                [
                                                    "กรุงเทพมหานคร",
                                                    "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร",
                                                    "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี",
                                                    "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่",
                                                    "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม",
                                                    "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์",
                                                    "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์",
                                                    "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี",
                                                    "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง",
                                                    "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์",
                                                    "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน",
                                                    "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง",
                                                    "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย",
                                                    "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
                                                    "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี",
                                                    "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี",
                                                    "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง",
                                                    "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี",
                                                    "อุบลราชธานี"
                                                ]
                                                    .sort((a, b) => b.length - a.length)
                                                    .find((province) => job.location.includes(province))
                                                || "-"
                                            )
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="job-header-divider" />

                        {/* แถวที่ 2 */}
                        <div className="job-header-meta">
                            <div className="job-header-meta-item">
                                <FiCalendar />
                                <div>
                                    <span>ประกาศเมื่อ</span>
                                    <p>
                                        {job.createdAt
                                            ? new Date(job.createdAt).toLocaleDateString(
                                                "th-TH",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="job-header-meta-item">
                                <FiCalendar />
                                <div>
                                    <span>แก้ไขล่าสุด</span>
                                    <p>
                                        {job.updatedAt
                                            ? new Date(job.updatedAt).toLocaleDateString(
                                                "th-TH",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="job-header-meta-item">
                                <FiUsers />
                                <div>
                                    <span>ผู้สมัครทั้งหมด</span>
                                    <p>{job.statistics?.total || 0} คน</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="job-detail-header-image">
                        <img
                            src="/image/detail1.png"
                            alt="ภาพประกอบประกาศงาน"
                        />
                    </div>
                </section>


                <div className="job-detail-layout">

                    {/* ================= LEFT ================= */}
                    <main className="job-detail-main">

                        {/* รวมทุกข้อมูลไว้ในการ์ดเดียว */}
                        <section className="job-detail-card">

                            {/* ================= ข้อมูลตำแหน่งงาน ================= */}
                            {/* <div className="detail-section">

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

                            </div> */}

                            {/* ================= ค่าตอบแทน ================= */}
                            {/* <div className="detail-section">

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

                            </div> */}

                            {/* ================= รายละเอียดงาน ================= */}
                            <div className="detail-section">

                                <h2 className="detail-section-title">
                                    <FiFileText className="detail-section-icon" />
                                    รายละเอียดงาน
                                </h2>

                                <div className="detail-text-section">

                                    <h3>
                                        รายละเอียดงาน
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
                                {/* ทักษะที่ต้องการ */}
                                <div className="detail-text-section">
                                    <h3>ทักษะที่ต้องการ</h3>

                                    {[
                                        job.skill1,
                                        job.skill2,
                                        job.skill3,
                                        job.skill4,
                                        job.skill5,
                                    ].filter((skill) => skill && skill.trim() !== "").length > 0 ? (
                                        <ul>
                                            {[
                                                job.skill1,
                                                job.skill2,
                                                job.skill3,
                                                job.skill4,
                                                job.skill5,
                                            ]
                                                .filter((skill) => skill && skill.trim() !== "")
                                                .map((skill, index) => (
                                                    <li key={index}>{skill}</li>
                                                ))}
                                        </ul>
                                    ) : (
                                        <p>ยังไม่ได้ระบุ</p>
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

                                <h2 className="detail-section-title">
                                    <FiPhone className="detail-section-icon" />
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
                                    type="button"
                                    className="sidebar-edit-btn"
                                    onClick={() => navigate(`/company/jobs/edit/${job.id}`)}
                                >
                                    <FiEdit />
                                    แก้ไขประกาศงาน
                                </button>

                                <button
                                    type="button"
                                    className="close-job-btn"
                                    onClick={() => {
                                        openStatusConfirm(
                                            status === "closed" ? "open" : "closed"
                                        );
                                    }}
                                    disabled={updatingStatus}
                                >
                                    {status === "closed"
                                        ? "เปิดรับสมัครงาน"
                                        : "ปิดรับสมัครงาน"}
                                </button>

                            </div>

                        </section>

                    </main>

                    {/* ================= RIGHT ================= */}
                    <aside className="job-detail-sidebar">

                        {/* สถานะ */}
                        {/* สถานะ */}
<div className="status-wrapper">
    <section className="editjob-status-card">
        <h2>สถานะการรับสมัคร</h2>

        <div className="job-status-select-wrapper">
            <select
                className="job-status-box"
                value={status}
                onChange={(e) => openStatusConfirm(e.target.value)}
            >
                <option value="open">
                    เปิดรับสมัคร
                </option>

                <option value="closed">
                    ปิดรับสมัคร
                </option>
            </select>

            <FiChevronDown className="job-status-select-icon" />
        </div>
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
            {/* Popup ยืนยันเปลี่ยนสถานะประกาศงาน */}
            {showStatusPopup && (
                <div
                    className="job-status-popup-overlay"
                    onClick={() => {
                        if (!updatingStatus) {
                            setShowStatusPopup(false);
                            setPendingStatus(null);
                        }
                    }}
                >
                    <div
                        className={`job-status-popup ${statusPopupType}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="job-status-popup-close"
                            disabled={updatingStatus}
                            onClick={() => {
                                setShowStatusPopup(false);
                                setPendingStatus(null);
                            }}
                        >
                            <RxCross2 />
                        </button>

                        <div className="job-status-popup-icon">
                            {statusPopupType === "confirm" ? (
                                <IoAlertCircleOutline />
                            ) : statusPopupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>

                        <h3>
                            {statusPopupType === "confirm"
                                ? "ยืนยันการเปลี่ยนสถานะ"
                                : statusPopupType === "success"
                                    ? "เปลี่ยนสถานะสำเร็จ"
                                    : "ไม่สามารถเปลี่ยนสถานะได้"}
                        </h3>

                        <p>{statusPopupMessage}</p>

                        {statusPopupType === "confirm" ? (
                            <div className="job-status-popup-actions">
                                <button
                                    type="button"
                                    className="job-status-popup-cancel"
                                    disabled={updatingStatus}
                                    onClick={() => {
                                        setShowStatusPopup(false);
                                        setPendingStatus(null);
                                    }}
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    type="button"
                                    className={`job-status-popup-confirm ${pendingStatus === "closed" ? "is-closing" : "is-opening"
                                        }`}
                                    disabled={updatingStatus}
                                    onClick={handleStatusChange}
                                >
                                    {updatingStatus
                                        ? "กำลังดำเนินการ..."
                                        : pendingStatus === "closed"
                                            ? "ยืนยันปิดรับสมัคร"
                                            : "ยืนยันเปิดรับสมัคร"}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className={`job-status-popup-ok ${statusPopupType === "success" ? "is-success" : "is-error"
                                    }`}
                                onClick={() => setShowStatusPopup(false)}
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

export default CompanyJobDetail;