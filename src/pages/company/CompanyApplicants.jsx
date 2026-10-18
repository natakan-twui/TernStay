import NavbarCompany from "../../components/NavbarCompany";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    FiEye,
    FiDownload,
    FiSearch,
    FiUser,
    FiFileText,
    FiBriefcase,
    FiDollarSign,
    FiCalendar,
    FiMapPin,
    FiCheck,
    FiMail,
    FiPhone,
    FiArrowUp, FiArrowDown
} from "react-icons/fi";
import { CgArrowsV } from "react-icons/cg";
import { IoMdPin } from "react-icons/io";
import { PiBagBold } from "react-icons/pi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { CiFileOn } from "react-icons/ci";
import "./CompanyApplicants.css";
import { GiBackwardTime } from "react-icons/gi";

function CompanyApplicants() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openManageId, setOpenManageId] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const [companyLogo, setCompanyLogo] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    const sortedApplicants = [...applicants].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sortOrder === "newest"
            ? dateB - dateA
            : dateA - dateB;
    });

    const [resumeSizes, setResumeSizes] = useState({});

    const fetchResumeSize = async (resume, applicantId) => {
        try {
            const response = await fetch(
                `http://localhost:5000${resume}`
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            let bytes = Number(response.headers.get("Content-Length"));

            // ถ้าไม่มี Content-Length ให้อ่านขนาดจากไฟล
            if (!bytes || Number.isNaN(bytes)) {
                const blob = await response.blob();
                bytes = blob.size;
            }

            const formattedSize =
                bytes < 1024 * 1024
                    ? `${(bytes / 1024).toFixed(1)} KB`
                    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

            setResumeSizes((prev) => ({
                ...prev,
                [applicantId]: formattedSize,
            }));
        } catch (error) {
            console.error(
                `ไม่สามารถอ่านขนาดไฟล์ของผู้สมัคร ${applicantId}:`,
                error
            );

            setResumeSizes((prev) => ({
                ...prev,
                [applicantId]: "ไม่สามารถอ่านขนาดไฟล์ได้",
            }));
        }
    };


    const downloadApplicantProjectFile = async (applicationId, file) => {
        try {
            const token = localStorage.getItem("companyToken");

            if (!token) {
                alert("กรุณาเข้าสู่ระบบบริษัทก่อน");
                navigate("/company/login");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/company/jobs/${id}/applicants/${applicationId}/project-files/${file.id}/download`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(
                    result.message || "ดาวน์โหลดไฟล์ไม่สำเร็จ"
                );
            }

            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = objectUrl;
            link.download = file.originalName || "project-file";

            document.body.appendChild(link);
            link.click();
            link.remove();

            // หน่วงเวลาสั้น ๆ ก่อนคืนหน่วยความจำของ URL
            window.setTimeout(() => {
                window.URL.revokeObjectURL(objectUrl);
            }, 1000);

        } catch (error) {
            console.error("DOWNLOAD PROJECT FILE ERROR:", error);
            alert(error.message || "ไม่สามารถดาวน์โหลดไฟล์ได้");
        }
    };


    const openApplicantResume = async (resume, applicantId) => {
        try {
            if (!resume) {
                alert("ไม่พบไฟล์เรซูเม่");
                return;
            }

            const token = localStorage.getItem("companyToken");

            if (!token) {
                alert("กรุณาเข้าสู่ระบบบริษัทก่อน");
                navigate("/company/login");
                return;
            }

            const response = await fetch(
                `http://localhost:5000${resume}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`ไม่สามารถเปิดไฟล์ได้ (HTTP ${response.status})`);
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);

            window.open(fileUrl, "_blank");

            // คืนหน่วยความจำภายหลัง
            window.setTimeout(() => {
                window.URL.revokeObjectURL(fileUrl);
            }, 60000);

        } catch (error) {
            console.error(
                `OPEN RESUME ERROR (${applicantId}):`,
                error
            );

            alert(error.message || "ไม่สามารถเปิดไฟล์เรซูเม่ได้");
        }
    };


    // ดึงเฉพาะชื่อจังหวัด

    const getProvince = (location) => {
        if (!location) return "-";

        const provinces = [
            "กรุงเทพมหานคร",
            "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร",
            "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี",
            "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่",
            "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม",
            "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์",
            "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์",
            "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี",
            "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร",
            "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต",
            "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร",
            "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี",
            "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ",
            "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
            "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี",
            "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี",
            "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง",
            "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี",
            "อุบลราชธานี", "อ่างทอง", "อาส"
        ];

        const normalizedLocation = location.trim();

        // ตรวจสอบว่ามีชื่อจังหวัดอยู่ในที่อยู่หรือไม่
        const province = provinces.find((name) =>
            normalizedLocation.includes(name)
        );

        if (province) return province;

        // ถ้าเป็นชื่อจังหวัดอย่างเดียว ให้คืนค่าเดิม
        // ถ้าหาไม่พบ จะไม่แสดงรหัสไปรษณีย์เป็นชื่อจังหวัด
        return /^\d{5}$/.test(normalizedLocation) ? "-" : normalizedLocation;
    };


    // ดึงชื่อไฟล์จาก path เรซูเม่
    const getResumeFileName = (resume) => {
        if (!resume) return null;

        const path = resume.split("?")[0];
        return decodeURIComponent(path.split("/").pop());
    };

    // ดาวน์โหลดไฟล์ประสบการณ์ / โปรเจกต์
    const downloadApplicantFile = async (fileUrl, fileName) => {
        try {
            if (!fileUrl) {
                alert("ไม่พบไฟล์ที่ต้องการดาวน์โหลด");
                return;
            }

            const token = localStorage.getItem("companyToken");

            if (!token) {
                alert("กรุณาเข้าสู่ระบบบริษัทก่อน");
                navigate("/company/login");
                return;
            }

            // รองรับทั้ง URL เต็มและ path ที่ขึ้นต้นด้วย /
            const url = fileUrl.startsWith("http")
                ? fileUrl
                : `http://localhost:5000${fileUrl}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("ไม่สามารถดาวน์โหลดไฟล์ได้");
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = fileName || "applicant-file";
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("DOWNLOAD APPLICANT FILE ERROR:", error);
            alert("ดาวน์โหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    };

    const getCompanyLogoUrl = () => {
        if (!companyLogo) return null;

        return companyLogo.startsWith("http")
            ? companyLogo
            : `http://localhost:5000${companyLogo}`;
    };
    // ดึงทักษะของผู้สมัคร
    const getUserSkills = (user) => {
        if (!user) return [];

        if (Array.isArray(user.skills)) {
            return user.skills
                .map((skill) =>
                    typeof skill === "string" ? skill : skill.name
                )
                .filter(Boolean);
        }

        return [
            user.skill1,
            user.skill2,
            user.skill3,
            user.skill4,
            user.skill5,
        ].filter(Boolean);
    };


    const getApplicantSkillStatus = (applicant) => {
        const userSkills = getUserSkills(applicant.user)
            .map((skill) => skill.trim().toLowerCase());

        const requiredSkills =
            typeof job?.skills === "string"
                ? job.skills
                    .split(/\r?\n/)
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                : Array.isArray(job?.skills)
                    ? job.skills
                        .map((skill) =>
                            typeof skill === "string" ? skill : skill.name
                        )
                        .filter(Boolean)
                    : [];

        return requiredSkills
            .map((requiredSkill) => ({
                name: requiredSkill,
                matched: userSkills.includes(
                    requiredSkill.trim().toLowerCase()
                ),
            }))
            .slice(0, 3);
    };

    const fetchCompanyLogo = async () => {
        try {
            const token = localStorage.getItem("companyToken");

            if (!token) return;

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
                console.error("โหลดโปรไฟล์บริษัทไม่สำเร็จ:", data.message);
                return;
            }

            setCompanyLogo(data.logo || "");
        } catch (error) {
            console.error("GET COMPANY LOGO ERROR:", error);
        }
    };
    useEffect(() => {

        const fetchApplicants = async () => {

            try {

                const token = localStorage.getItem("companyToken");

                const res = await fetch(
                    `http://localhost:5000/api/company/jobs/${id}/applicants`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                console.log("ข้อมูลประกาศงาน:", data.job);
                console.log("ข้อมูลบริษัท:", data.job?.company);
                console.log("Path โลโก้:", data.job?.company?.logo);
                console.log("URL โลโก้:", data.job?.company?.logo
                    ? `http://localhost:5000${data.job.company.logo}`
                    : "ไม่มี URL โลโก้");

                if (!res.ok) {

                    alert(data.message || "ไม่สามารถโหลดข้อมูลผู้สมัครได้");

                    navigate("/company/jobs");

                    return;
                }

                setJob(data.job);

                const activeApplicants = (data.applications || []).filter(
                    (applicant) => applicant.status !== "cancelled"
                );

                setApplicants(activeApplicants);

                activeApplicants.forEach((applicant) => {
                    if (applicant.resume) {
                        fetchResumeSize(applicant.resume, applicant.id);
                    }
                });

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchApplicants();
        fetchCompanyLogo();

    }, [id, navigate]);

    if (loading) {
        return <p>กำลังโหลดข้อมูล...</p>;
    }

    if (!job) {
        return null;
    }

    const pendingCount = applicants.filter(
        (applicant) => applicant.status === "pending"
    ).length;

    const interviewCount = applicants.filter(
        (applicant) => applicant.status === "interview"
    ).length;

    const acceptedCount = applicants.filter(
        (applicant) => applicant.status === "accepted"
    ).length;

    const rejectedCount = applicants.filter(
        (applicant) => applicant.status === "rejected"
    ).length;

    const filteredApplicants = applicants.filter((applicant) => {

        const user = applicant.user;

        const search = searchTerm.toLowerCase().trim();

        const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`
                .toLowerCase();

        const email =
            (user.email || "").toLowerCase();

        const university =
            (user.university || "").toLowerCase();

        const major =
            (user.major || "").toLowerCase();

        const matchesSearch =
            !search ||
            fullName.includes(search) ||
            email.includes(search) ||
            university.includes(search) ||
            major.includes(search);

        const matchesStatus =
            selectedStatus === "all" ||
            applicant.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const updateApplicantStatus = async (applicationId, status) => {
        try {
            const token = localStorage.getItem("companyToken");

            if (!token) {
                alert("กรุณาเข้าสู่ระบบบริษัทก่อน");
                navigate("/company/login");
                return;
            }

            setUpdatingStatus(applicationId);

            const res = await fetch(
                `http://localhost:5000/api/company/jobs/${job.id}/applicants/${applicationId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "ไม่สามารถเปลี่ยนสถานะได้");
                return;
            }

            // อัปเดตสถานะเฉพาะผู้สมัครที่เลือก
            setApplicants(prev =>
                prev.map(applicant =>
                    applicant.id === applicationId
                        ? {
                            ...applicant,
                            status: data.application.status
                        }
                        : applicant
                )
            );

            // ปิดเมนู
            setOpenManageId(null);

        } catch (error) {

            console.log("UPDATE STATUS ERROR:", error);

            alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");

        } finally {

            setUpdatingStatus(null);

        }
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
    };

    const clearFilters = () => {

        setSearchTerm("");
        setSelectedStatus("all");

    };
    return (
        <>
            <NavbarCompany />
            <div className="applicants-page">

                {/* ================= LEFT ================= */}
                <aside className="applicant-left">

                    <div className="applicant-breadcrumb">
                        <button onClick={() => navigate("/company/jobs")}>
                            งานของฉัน
                        </button>

                        <span>&gt;</span>

                        <span className="current">ผู้สมัคร</span>
                    </div>

                    {/* กล่องข้อมูลประกาศงาน */}
                    <section className="applicant-job-card">


                        <div className="applicant-job-image">
                            {getCompanyLogoUrl() ? (
                                <img
                                    src={getCompanyLogoUrl()}
                                    alt="โลโก้บริษัท"
                                    onError={(e) => {
                                        console.error(
                                            "โหลดโลโก้ไม่สำเร็จ:",
                                            e.currentTarget.src
                                        );
                                    }}
                                />
                            ) : (
                                <div className="applicant-company-logo-placeholder">
                                    <FiBriefcase />
                                </div>
                            )}

                            <span
                                className={`applicant-job-status ${job.status === "open" ? "open" : "closed"
                                    }`}
                            >
                                {job.status === "open"
                                    ? "เปิดรับสมัคร"
                                    : "ปิดรับสมัคร"}
                            </span>
                        </div>


                        <h3>
                            {job.title}
                        </h3>

                        <div className="applicant-job-info">
                            <div className="applicant-job-info-row">
                                <PiBagBold className="job-info-icon" />

                                <div className="job-info-content">
                                    <span>รูปแบบการทำงาน</span>
                                    <p>{job.workType || "-"}</p>
                                </div>
                            </div>

                            <div className="applicant-job-info-row">
                                <RiMoneyDollarCircleFill className="job-info-icon" />

                                <div className="job-info-content">
                                    <span>เงินเดือน</span>
                                    <p>
                                        {job.salaryType === "paid"
                                            ? `${job.salary || "-"} ${job.salaryUnit || ""}`.trim()
                                            : "ไม่มีค่าตอบแทน"}
                                    </p>
                                </div>
                            </div>

                            <div className="applicant-job-info-row">
                                <IoMdPin className="job-info-icon" />

                                <div className="job-info-content">
                                    <span>จังหวัด</span>
                                    <p>
                                        {job.province && !/^\d{5}$/.test(job.province.trim())
                                            ? job.province
                                            : getProvince(job.location)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="view-job-detail-btn"
                            onClick={() =>
                                navigate(`/company/jobs/${job.id}`)
                            }
                        >
                            ดูรายละเอียดงาน <span>›</span>
                        </button>

                    </section>


                    {/* กล่องตัวกรอง */}
                    <section className="applicant-filter-card">

                        <h2>ตัวกรอง</h2>

                        <div className="filter-section">

                            <h3>สถานะผู้สมัคร</h3>

                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedStatus === "all"}
                                    onChange={() => handleStatusFilter("all")}
                                />
                                <span>ทั้งหมด</span>
                            </label>

                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedStatus === "pending"}
                                    onChange={() => handleStatusFilter("pending")}
                                />
                                <span>
                                    รอการพิจารณา ({pendingCount})
                                </span>
                            </label>

                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedStatus === "interview"}
                                    onChange={() => handleStatusFilter("interview")}
                                />
                                <span>
                                    สัมภาษณ์ ({interviewCount})
                                </span>
                            </label>

                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedStatus === "accepted"}
                                    onChange={() => handleStatusFilter("accepted")}
                                />
                                <span>
                                    ตอบรับแล้ว ({acceptedCount})
                                </span>
                            </label>

                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedStatus === "rejected"}
                                    onChange={() => handleStatusFilter("rejected")}
                                />
                                <span>
                                    ไม่ผ่านการคัดเลือก ({rejectedCount})
                                </span>
                            </label>

                        </div>


                        <button
                            className="clear-filter-btn"
                            onClick={clearFilters}
                        >
                            <GiBackwardTime />
                            ล้างตัวกรอง
                        </button>



                    </section>

                </aside>
                {/* ================= RIGHT ================= */}
                <main className="applicant-right">

                    {/* ================= กล่อง 1 ================= */}
                    {/* ================= กล่อง 1 ================= */}
                    <section className="applicant-header-card">

                        <div className="applicant-header-top">

                            {/* ฝั่งซ้าย */}
                            <div className="applicant-header-text">

                                <h1>
                                    ผู้สมัครงาน
                                </h1>

                                <p>
                                    จัดการและติดตามผู้สมัครทั้งหมดของตำแหน่งนี้
                                </p>

                            </div>

                            {/* ฝั่งขวา */}
                            <div className="applicant-header-actions">

                                {/* ช่องค้นหา */}
                                <div className="applicant-search">

                                    <FiSearch />

                                    <input
                                        type="text"
                                        placeholder="ค้นหาชื่อผู้สมัคร..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />

                                </div>

                                {/* ปุ่มส่งออก */}
                                {/* <button className="export-applicant-btn">

                                    <FiDownload />

                                    ส่งออกข้อมูล

                                </button> */}

                            </div>

                        </div>

                    </section>


                    {/* ================= กล่อง 2 ================= */}
                    <section className="applicant-summary-card">

                        <button
                            className={`applicant-summary-item ${selectedStatus === "all"
                                ? "active"
                                : ""
                                }`}
                            onClick={() => handleStatusFilter("all")}
                        >

                            <span>ทั้งหมด</span>

                            <div className="summary-count">
                                <strong>{applicants.length}</strong>
                                <small>คน</small>
                            </div>

                        </button>


                        <button
                            className={`applicant-summary-item ${selectedStatus === "pending"
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleStatusFilter("pending")
                            }
                        >
                            <span>รอการพิจารณา</span>

                            <div className="summary-count">
                                <strong>{pendingCount}</strong>
                                <small>คน</small>
                            </div>

                        </button>


                        <button
                            className={`applicant-summary-item ${selectedStatus === "interview"
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleStatusFilter("interview")
                            }
                        >
                            <span>สัมภาษณ์</span>

                            <div className="summary-count">
                                <strong>{interviewCount}</strong>
                                <small>คน</small>
                            </div>
                        </button>


                        <button
                            className={`applicant-summary-item ${selectedStatus === "accepted"
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleStatusFilter("accepted")
                            }
                        >
                            <span>ตอบรับแล้ว</span>

                            <div className="summary-count">
                                <strong>{acceptedCount}</strong>
                                <small>คน</small>
                            </div>
                        </button>


                        <button
                            className={`applicant-summary-item ${selectedStatus === "rejected"
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleStatusFilter("rejected")
                            }
                        >
                            <span>ไม่ผ่านการคัดเลือก</span>

                            <div className="summary-count">
                                <strong>{rejectedCount}</strong>
                                <small>คน</small>
                            </div>
                        </button>

                    </section>


                    {/* ================= กล่อง 3 ================= */}
                    <section className="applicant-list-card">

                        {/* หัวตาราง */}
                        <div className="applicant-list-header">

                            <span>ผู้สมัคร</span>

                            <div className="application-date-heading">
                                <span>วันที่สมัคร</span>

                                <button
                                    type="button"
                                    className="sort-date-button"
                                    onClick={() =>
                                        setSortOrder((prev) =>
                                            prev === "newest" ? "oldest" : "newest"
                                        )
                                    }
                                    title="สลับลำดับวันที่สมัคร"
                                    aria-label="สลับลำดับวันที่สมัคร"
                                >
                                    <CgArrowsV />
                                </button>
                            </div>

                            <span>สถานะ</span>

                            <span>คุณสมบัติเบื้องต้น</span>

                            <span>เรซูเม่ / ไฟล์</span>

                            <span>จัดการ</span>

                        </div>
                        {filteredApplicants.length > 0 ? (

                            filteredApplicants.map((applicant) => (

                                <div
                                    className="applicant-list-row"
                                    key={applicant.id}
                                >

                                    {/* ผู้สมัคร */}
                                    <div className="applicant-person">

                                        <div className="applicant-avatar">
                                            {applicant.user.profileImage ? (
                                                <img
                                                    src={`http://localhost:5000${applicant.user.profileImage}`}
                                                    alt="รูปโปรไฟล์ผู้สมัคร"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                        e.currentTarget.nextElementSibling.style.display = "flex";
                                                    }}
                                                />
                                            ) : null}

                                            <div
                                                className="applicant-avatar-fallback"
                                                style={{
                                                    display: applicant.user.profileImage ? "none" : "flex"
                                                }}
                                            >
                                                <FiUser />
                                            </div>
                                        </div>


                                        <div className="applicant-person-info">
                                            <h3>
                                                {applicant.user.firstName}{" "}
                                                {applicant.user.lastName}
                                            </h3>

                                            <p className="applicant-email">
                                                <FiMail />
                                                <span>{applicant.user.email || "-"}</span>
                                            </p>

                                            <p className="applicant-phone">
                                                <FiPhone />
                                                <span>{applicant.user.phone || "-"}</span>
                                            </p>
                                        </div>


                                    </div>


                                    {/* วันที่สมัคร */}
                                    <div className="applicant-date">
                                        <span>
                                            {new Date(
                                                applicant.createdAt
                                            ).toLocaleDateString("th-TH")}
                                        </span>
                                    </div>


                                    {/* สถานะ */}
                                    <div>
                                        <span
                                            className={`applicant-status ${applicant.status}`}
                                        >
                                            {applicant.status === "pending" &&
                                                "รอการพิจารณา"}

                                            {applicant.status === "interview" &&
                                                "สัมภาษณ์"}

                                            {applicant.status === "accepted" &&
                                                "ตอบรับแล้ว"}

                                            {applicant.status === "rejected" &&
                                                "ไม่ผ่านการคัดเลือก"}
                                        </span>
                                    </div>


                                    {/* คุณสมบัติ */}

                                    <div className="applicant-qualification">
                                        {getApplicantSkillStatus(applicant).length > 0 ? (
                                            getApplicantSkillStatus(applicant).map((skill) => (
                                                <span
                                                    className={`matched-skill ${skill.matched ? "is-matched" : "not-matched"
                                                        }`}
                                                    key={skill.name}
                                                    title={skill.name}
                                                >
                                                    {skill.matched ? (
                                                        <FiCheck className="matched-skill-icon" />
                                                    ) : (
                                                        <span className="unmatched-skill-icon">✕</span>
                                                    )}

                                                    <span className="matched-skill-text">
                                                        {skill.name}
                                                    </span>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="no-matched-skill">ไม่มีการระบุคุณสมบัติ</span>
                                        )}
                                    </div>




                                    {/* Resume / ไฟล์ที่แนบตอนสมัครงาน */}
                                    <div className="applicant-resume">
                                        {applicant.resume ? (
                                            <button
                                                type="button"
                                                className="resume-file"
                                                title={getResumeFileName(applicant.resume)}
                                                onClick={() =>
                                                    openApplicantResume(
                                                        applicant.resume,
                                                        applicant.id
                                                    )
                                                }
                                            >
                                                <div className="resume-file-icon">
                                                    <CiFileOn />
                                                </div>

                                                <div className="resume-file-info">
                                                    <span className="resume-file-name">
                                                        {getResumeFileName(applicant.resume)}
                                                    </span>

                                                    <span className="resume-file-size">
                                                        ({resumeSizes[applicant.id] || "กำลังโหลดขนาดไฟล์..."})
                                                    </span>
                                                </div>
                                            </button>
                                        ) : (
                                            <span className="no-resume">
                                                ไม่ได้แนบเรซูเม่
                                            </span>
                                        )}
                                    </div>



                                    {/* จัดการ */}
                                    <div className="applicant-manage">

                                        <button
                                            className="view-applicant-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/company/jobs/${job.id}/applicants/${applicant.id}`
                                                )
                                            }
                                            title="ดูรายละเอียดผู้สมัคร"
                                        >
                                            <FiEye />
                                        </button>

                                        <div className="manage-wrapper">

                                            <button
                                                className="manage-applicant-btn"
                                                onClick={() =>
                                                    setOpenManageId(
                                                        openManageId === applicant.id
                                                            ? null
                                                            : applicant.id
                                                    )
                                                }
                                            >
                                                จัดการ
                                            </button>

                                            {openManageId === applicant.id && (

                                                <div className="manage-dropdown">

                                                    <button
                                                        onClick={() =>
                                                            updateApplicantStatus(
                                                                applicant.id,
                                                                "pending"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingStatus === applicant.id
                                                        }
                                                    >
                                                        รอการพิจารณา
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            updateApplicantStatus(
                                                                applicant.id,
                                                                "interview"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingStatus === applicant.id
                                                        }
                                                    >
                                                        สัมภาษณ์
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            updateApplicantStatus(
                                                                applicant.id,
                                                                "accepted"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingStatus === applicant.id
                                                        }
                                                    >
                                                        ตอบรับแล้ว
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            updateApplicantStatus(
                                                                applicant.id,
                                                                "rejected"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingStatus === applicant.id
                                                        }
                                                    >
                                                        ไม่ผ่านการคัดเลือก
                                                    </button>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <div className="no-applicant-result">

                                <h3>
                                    ไม่พบผู้สมัคร
                                </h3>

                            </div>

                        )}

                    </section>

                </main>
            </div>
        </>

    );
}

export default CompanyApplicants;