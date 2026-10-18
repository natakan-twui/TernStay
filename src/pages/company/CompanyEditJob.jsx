import NavbarCompany from "../../components/NavbarCompany";
import "./CompanyEditJob.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";
import {
    FiUpload,
    FiEye,
    FiMapPin,
    FiDollarSign,
    FiMail,
    FiPhone,
    FiUser,
    FiBriefcase,
    FiUsers,
    FiSave
} from "react-icons/fi";

import { TbUserEdit } from "react-icons/tb";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

function CompanyEditJob() {

    const navigate = useNavigate();
    const { id } = useParams();
    const previewRef = useRef(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");
    // ========================================
    // Form State
    // ========================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

    const [workType, setWorkType] = useState("On-site");

    const [salaryType, setSalaryType] = useState("paid");
    const [salary, setSalary] = useState("");
    const [salaryUnit, setSalaryUnit] = useState("บาท/วัน");

    const [description, setDescription] = useState("");
    const [qualification, setQualification] = useState("");
    const [welfare, setWelfare] = useState("");

    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");

    // ข้อมูลเพิ่มเติมสำหรับ preview / sidebar
    const [jobCreatedAt, setJobCreatedAt] = useState(null);
    const [jobUpdatedAt, setJobUpdatedAt] = useState(null);
    const [applicantCount, setApplicantCount] = useState(0);

    const [logoFile, setLogoFile] = useState(null);

    const openPopup = (type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setShowPopup(true);
};
    // ========================================
    // ดึง Token
    // ========================================

    const getToken = () => {
        return localStorage.getItem("companyToken");
    };

    // ========================================
    // ดึงข้อมูล Job
    // ========================================

    
const fetchJob = async () => {
    try {
        const token = getToken();

        if (!token) {
            openPopup("error", "กรุณาเข้าสู่ระบบบริษัทก่อน");
            return;
        }

        if (!id) {
            openPopup("error", "ไม่พบรหัสประกาศงาน");
            return;
        }

        console.log("FETCH EDIT JOB:", id);

        const res = await fetch(
            `http://localhost:5000/api/company/jobs/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        console.log("EDIT JOB RESPONSE:", data);

        // Token หมดอายุหรือไม่มีสิทธิ์
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("companyToken");
            localStorage.removeItem("company");

            openPopup(
                "error",
                data.message || "กรุณาเข้าสู่ระบบบริษัทใหม่"
            );
            return;
        }

        // ไม่พบประกาศงาน
        if (res.status === 404) {
            openPopup(
                "error",
                data.message || "ไม่พบประกาศงานนี้"
            );
            return;
        }

        // โหลดข้อมูลไม่สำเร็จ
        if (!res.ok) {
            console.error("FETCH JOB ERROR:", data);

            openPopup(
                "error",
                data.message || "ไม่สามารถโหลดข้อมูลประกาศงานได้"
            );
            return;
        }

        // ใส่ข้อมูลประกาศงานเดิมลงฟอร์ม
        setTitle(data.title || "");
        setCategory(data.category || "");

        setCompanyName(
            data.company?.companyName ||
            data.companyName ||
            ""
        );

        setLocation(data.location || "");

        setWorkType(data.workType || "On-site");

        setSalaryType(data.salaryType || "paid");

        setSalary(data.salary ?? "");

        setSalaryUnit(data.salaryUnit || "บาท/วัน");

        setDescription(data.description || "");

        setQualification(data.qualification || "");

        setWelfare(data.welfare || "");

        setContactName(data.contactName || "");

        setContactEmail(data.contactEmail || "");

        setContactPhone(data.contactPhone || "");

        setJobCreatedAt(data.createdAt || null);

        setJobUpdatedAt(data.updatedAt || null);

        setApplicantCount(
            data.statistics?.total ??
            data._count?.applications ??
            0
        );

        // โหลดข้อมูลสำเร็จ ไม่ต้องแสดง Popup สำเร็จ
    } catch (error) {
        console.error("FETCH EDIT JOB ERROR:", error);

        openPopup(
            "error",
            "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า Backend ทำงานอยู่"
        );
    } finally {
        // สำคัญ: ต้องปิดสถานะ Loading
        setLoading(false);
    }
};


    // ========================================
    // โหลดข้อมูลตอนเปิดหน้า
    // ========================================

    useEffect(() => {

        fetchJob();


    }, [id]);

    // ========================================
    // บันทึกการแก้ไข
    // ========================================

    const handleSave = async () => {

        try {

            const token = getToken();

            if (!token) {

                alert("กรุณาเข้าสู่ระบบบริษัทก่อน");

                navigate("/company/login");

                return;
            }

            // ========================================
            // ตรวจสอบข้อมูลจำเป็น
            // ========================================

            if (!title.trim()) {

                alert("กรุณากรอกชื่อตำแหน่งงาน");

                return;
            }

            if (!category) {

                alert("กรุณาเลือกหมวดหมู่งาน");

                return;
            }

            if (!location.trim()) {

                alert("กรุณากรอกสถานที่ทำงาน");

                return;
            }

            if (!salaryType) {

                alert("กรุณาเลือกค่าตอบแทน");

                return;
            }

            if (
                salaryType === "paid" &&
                (
                    salary === "" ||
                    Number(salary) < 0
                )
            ) {

                alert("กรุณาระบุค่าตอบแทน");

                return;
            }

            if (!description.trim()) {

                alert("กรุณากรอกรายละเอียดงาน");

                return;
            }

            if (!qualification.trim()) {

                alert("กรุณากรอกคุณสมบัติผู้สมัคร");

                return;
            }

            if (!contactName.trim()) {

                alert("กรุณากรอกชื่อผู้ติดต่อ");

                return;
            }

            if (!contactEmail.trim()) {

                alert("กรุณากรอกอีเมล");

                return;
            }

            if (!contactPhone.trim()) {

                alert("กรุณากรอกเบอร์โทรศัพท์");

                return;
            }

            setSaving(true);

            console.log("UPDATE JOB:", id);

            const formData = new FormData();

            formData.append("title", title);
            formData.append("category", category);
            formData.append("companyName", companyName);
            formData.append("location", location);
            formData.append("workType", workType);
            formData.append("salaryType", salaryType);

            formData.append(
                "salary",
                salaryType === "paid"
                    ? String(Number(salary))
                    : ""
            );

            formData.append("salaryUnit", salaryUnit);

            formData.append("description", description);
            formData.append("qualification", qualification);
            formData.append("welfare", welfare);

            formData.append("contactName", contactName);
            formData.append("contactEmail", contactEmail);
            formData.append("contactPhone", contactPhone);

            if (logoFile) {
                formData.append("logo", logoFile);
            }

            console.log("LOGO FILE BEFORE SEND:", logoFile);

            for (const [key, value] of formData.entries()) {
                console.log("FORM DATA:", key, value);
            }

            const res = await fetch(
                `http://localhost:5000/api/company/jobs/${id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );

            const data = await res.json();

console.log("UPDATE JOB RESPONSE:", data);

if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("company");

    openPopup(
        "error",
        data.message || "กรุณาเข้าสู่ระบบบริษัทใหม่"
    );
    return;
}

if (!res.ok) {
    openPopup(
        "error",
        data.message || "ไม่สามารถบันทึกการแก้ไขได้"
    );
    return;
}

// บันทึกสำเร็จแล้ว จึงค่อยแสดง Popup
openPopup(
    "success",
    data.message || "บันทึกการแก้ไขประกาศงานเรียบร้อยแล้ว"
);

        } catch (error) {

            console.error(
                "SAVE EDIT JOB ERROR:",
                error
            );

            alert(
                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
            );

        } finally {

            setSaving(false);

        }

    };

    // ========================================
    // Format วันที่
    // ========================================

    const formatThaiDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "th-TH",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    };

    // ========================================
    // Loading
    // ========================================

    if (loading) {

        return (
            <>
                <NavbarCompany />

                <div className="company-editejob-page">

                    <div
                        style={{
                            padding: "50px",
                            textAlign: "center"
                        }}
                    >
                        กำลังโหลดข้อมูลประกาศงาน...
                    </div>

                </div>
            </>
        );

    }

    return (
        <>
            <NavbarCompany />

            <div className="company-editejob-page">

                {/* Hero */}

                <section className="editjob-hero">

                    <div className="hero-content">

                        <h1>
                            แก้ไขประกาศงาน
                        </h1>

                        <p>
                            อัปเดตข้อมูลให้เป็นปัจจุบัน <br />
                            เพื่อดึงดูดผู้สมัครที่เหมาะสม
                        </p>

                    </div>

                    <div className="hero-image">

                        <img
                            src="/image/companyedit.jpeg"
                            alt="EditJob"
                        />

                    </div>

                </section>


                {/* Layout หลัก */}

                <div className="editjob-layout">


                    {/* ================= ฝั่งซ้าย ================= */}

                    <section className="editjob-form">


                        {/* ข้อมูลตำแหน่งงาน */}

                        <section className="editjob-form-card">

                            <h2>
                                <span className="step-circle">
                                    1
                                </span>

                                ข้อมูลตำแหน่งงาน
                            </h2>


                            <div className="form-row-edit">

                                <div className="form-group-edit">

                                    <label>
                                        ชื่อตำแหน่งงาน <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="เช่น Frontend Developer Intern"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />

                                </div>


                                <div className="form-group-edit">

                                    <label>
                                        หมวดหมู่งาน <span>*</span>
                                    </label>

                                    <select
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                    >

                                        <option value="">เลือกหมวดหมู่</option>
                                        <option value="IT">IT / Developer</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Business">Business</option>

                                    </select>

                                </div>

                            </div>


                            <div className="form-group-edit">


                                <label>
                                    สถานที่ทำงาน <span>*</span>
                                </label>

                                <div className="company-address-display">
                                    <FiMapPin />

                                    <span>
                                        {companyAddress ||
                                            location ||
                                            "ยังไม่ได้ระบุที่อยู่บริษัท"}
                                    </span>
                                </div>



                                <label>
                                    รูปแบบการทำงาน <span>*</span>
                                </label>

                                <div className="work-type-options">

                                    <button
                                        type="button"
                                        className={`work-type-btn ${workType === "On-site"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setWorkType("On-site")
                                        }
                                    >
                                        On-site
                                    </button>

                                    <button
                                        type="button"
                                        className={`work-type-btn ${workType === "Hybrid"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setWorkType("Hybrid")
                                        }
                                    >
                                        Hybrid
                                    </button>

                                    <button
                                        type="button"
                                        className={`work-type-btn ${workType === "Work From Home"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setWorkType(
                                                "Work From Home"
                                            )
                                        }
                                    >
                                        Work From Home
                                    </button>

                                </div>



                                {/* <div className="form-group-edit">

                                    <label>
                                        โลโก้บริษัท
                                    </label>

                                    <label className="logo-upload-box-company">

                                        <div className="logo-upload-icon-company">
                                            <FiUpload />
                                        </div>

                                        <div className="logo-upload-text-company">

                                            <strong>
                                                {logoFile
                                                    ? logoFile.name
                                                    : "อัปโหลดโลโก้"
                                                }
                                            </strong>

                                            <span>
                                                ขนาดแนะนำ 200 × 200px
                                            </span>

                                            <span>
                                                PNG, JPG ไม่เกิน 2MB
                                            </span>

                                        </div>

                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg"
                                            hidden
                                            onChange={(e) => {

                                                const file = e.target.files?.[0];

                                                if (!file) return;

                                                if (file.size > 2 * 1024 * 1024) {
                                                    alert("ไฟล์ต้องไม่เกิน 2MB");
                                                    return;
                                                }

                                                setLogoFile(file);
                                            }}
                                        />

                                    </label>

                                </div> */}

                            </div>
                        </section>


                        {/* ข้อมูลบริษัท */}

                        <section className="editjob-form-card">

                            {/* <h2>
                                <span className="step-circle">
                                    2
                                </span>

                                ข้อมูลบริษัท
                            </h2> */}




                        </section>


                        {/* เงินเดือน */}

                        <section className="editjob-form-card">

                            <h2>
                                <span className="step-circle">
                                    2
                                </span>

                                เงินเดือน
                            </h2>


                            <label>
                                ค่าตอบแทน <span>*</span>
                            </label>


                            <div className="salary-options">

                                <button
                                    type="button"
                                    className={`salary-btn ${salaryType === "paid"
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setSalaryType("paid")
                                    }
                                >
                                    มีค่าตอบแทน
                                </button>


                                <button
                                    type="button"
                                    className={`salary-btn ${salaryType === "unpaid"
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() => {

                                        setSalaryType(
                                            "unpaid"
                                        );

                                        setSalary("");

                                    }}
                                >
                                    ไม่มีค่าตอบแทน
                                </button>

                            </div>


                            {salaryType === "paid" && (

                                <div className="salary-input-row">

                                    <input
                                        className="salary-input-box"
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="เช่น 5000"
                                        value={salary}
                                        onChange={(e) =>
                                            setSalary(e.target.value)
                                        }
                                    />

                                    <select
                                        className="salary-unit-select"
                                        value={salaryUnit}
                                        onChange={(e) =>
                                            setSalaryUnit(e.target.value)
                                        }
                                    >
                                        <option value="บาท/วัน">
                                            บาท/วัน
                                        </option>

                                        <option value="บาท/เดือน">
                                            บาท/เดือน
                                        </option>

                                        <option value="บาท/ชั่วโมง">
                                            บาท/ชั่วโมง
                                        </option>
                                    </select>

                                </div>

                            )}

                        </section>


                        {/* รายละเอียดงาน */}

                        <section className="editjob-form-card">

                            <h2>
                                <span className="step-circle">
                                    3
                                </span>

                                รายละเอียดงาน
                            </h2>


                            <div className="form-group-edit">

                                <label>
                                    หน้าที่ความรับผิดชอบ <span>*</span>
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder="ระบุรายละเอียดงาน หน้าที่ความรับผิดชอบ..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-group-edit">

                                <label>
                                    คุณสมบัติผู้สมัคร <span>*</span>
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder="ระบุคุณสมบัติ เช่น ทักษะที่ต้องการ ระดับการศึกษา..."
                                    value={qualification}
                                    onChange={(e) =>
                                        setQualification(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-group-edit">

                                <label>
                                    สวัสดิการ
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder="ระบุสวัสดิการ เช่น เบี้ยเลี้ยง อาหารกลางวัน ค่าเดินทาง..."
                                    value={welfare}
                                    onChange={(e) =>
                                        setWelfare(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </section>


                        {/* ข้อมูลการติดต่อ */}

                        {/* <section className="editjob-form-card">

                            <h2>
                                <span className="step-circle">
                                    5
                                </span>

                                ข้อมูลการติดต่อ
                            </h2>


                            <div className="form-row-edit">

                                <div className="form-group-edit">

                                    <label>
                                        ชื่อผู้ติดต่อ <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="เช่น คุณสมชาย"
                                        value={contactName}
                                        onChange={(e) =>
                                            setContactName(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group-edit">

                                    <label>
                                        อีเมล <span>*</span>
                                    </label>

                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={contactEmail}
                                        onChange={(e) =>
                                            setContactEmail(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group-edit">

                                    <label>
                                        เบอร์โทรศัพท์ <span>*</span>
                                    </label>

                                    <input
                                        type="tel"
                                        placeholder="08xxxxxxxx"
                                        value={contactPhone}
                                        onChange={(e) =>
                                            setContactPhone(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </section> */}


                        {/* ปุ่มจัดการ */}

                        <div className="editjob-actions">

                            <button
                                type="button"
                                className="cancel-edit-btn"
                                onClick={() =>
                                    navigate(
                                        "/company/dashboard"
                                    )
                                }
                                disabled={saving}
                            >
                                ยกเลิก
                            </button>


                            {/* <button
                                type="button"
                                className="view-work-btn"
                                onClick={() => {
                                    previewRef.current?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start"
                                    });
                                }}
                            >
                                <FiEye />
                                ดูตัวอย่างประกาศงาน
                            </button> */}


                            <button
                                type="button"
                                className="save-edit-btn"
                                onClick={handleSave}
                                disabled={saving}
                            >

                                <FiSave />

                                {saving
                                    ? "กำลังบันทึก..."
                                    : "บันทึกการแก้ไข"
                                }

                            </button>

                        </div>

                    </section>


                    {/* ================= ฝั่งขวา ================= */}

                    <aside className="editjob-right">







                        {/* ตัวอย่างประกาศงาน */}

                        <section
                            className="editjob-preview-card"
                            ref={previewRef}
                        >

                            <h2 className="job-preview-title">

                                <FiEye className="preview-title-icon" />

                                ตัวอย่างประกาศงาน

                            </h2>


                            <div className="preview-card">

                                <span className="company-badge">
                                    บริษัทของคุณ
                                </span>


                                <div className="preview-logo">

                                    <img
                                        src="/image/logo.png"
                                        alt="บริษัท"
                                    />

                                </div>


                                <h3>
                                    {title ||
                                        "ชื่อตำแหน่งฝึกงาน"}
                                </h3>


                                <p>
                                    {companyName ||
                                        "ชื่อบริษัท"}
                                </p>


                                <p>

                                    <FiMapPin className="preview-icon" />

                                    {location ||
                                        "สถานที่ทำงาน"}

                                </p>


                                <p className="preview-info">

                                    <HiOutlineBuildingOffice2
                                        className="preview-icon"
                                    />

                                    {workType ||
                                        "รูปแบบการทำงาน"}

                                </p>


                                <p className="preview-info">

                                    <FiDollarSign
                                        className="preview-icon"
                                    />

                                    {salaryType === "unpaid"
                                        ? "ไม่มีค่าตอบแทน"
                                        : salary
                                            ? `${salary} ${salaryUnit || "บาท"}`
                                            : "ค่าตอบแทน"}

                                </p>


                                <hr />


                                <h4>
                                    รายละเอียดงาน
                                </h4>

                                <p>
                                    {description ||
                                        "รายละเอียดหน้าที่ความรับผิดชอบจะแสดงตรงนี้"}
                                </p>


                                <h4>
                                    คุณสมบัติผู้สมัคร
                                </h4>

                                <ul>

                                    <li>
                                        {qualification ||
                                            "ยังไม่ได้ระบุ"}
                                    </li>

                                </ul>


                                <h4>
                                    สวัสดิการ
                                </h4>

                                <ul>

                                    <li>
                                        {welfare ||
                                            "ยังไม่ได้ระบุ"}
                                    </li>

                                </ul>


                                <div className="preview-contact">

                                    <h4>
                                        ติดต่อสอบถาม
                                    </h4>


                                    <p>

                                        <FiUser
                                            className="contact-icon"
                                        />

                                        {contactName ||
                                            "ชื่อผู้ติดต่อ"}

                                    </p>


                                    <p>

                                        <FiMail
                                            className="contact-icon"
                                        />

                                        {contactEmail ||
                                            "example@email.com"}

                                    </p>


                                    <p>

                                        <FiPhone
                                            className="contact-icon"
                                        />

                                        {contactPhone ||
                                            "08xxxxxxxx"}

                                    </p>


                                    <button
                                        className="btn-preview"
                                    >
                                        สมัครงานนี้
                                    </button>

                                </div>

                            </div>

                        </section>


                        {/* ข้อมูลการเผยแพร่ */}

                        <section className="editjob-side-card">

                            <h2>
                                ข้อมูลการเผยแพร่
                            </h2>


                            <div className="publish-info">

                                <div>

                                    <span className="date-label">

                                        <FiBriefcase />

                                        ประกาศเมื่อ

                                    </span>

                                    <p>
                                        {formatThaiDate(
                                            jobCreatedAt
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <span className="date-label">

                                        <TbUserEdit />

                                        แก้ไขล่าสุด

                                    </span>

                                    <p>
                                        {formatThaiDate(
                                            jobUpdatedAt
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <span className="date-label">

                                        <FiUsers />

                                        ผู้สมัครทั้งหมด

                                    </span>

                                    <p>
                                        {applicantCount} คน
                                    </p>

                                </div>

                            </div>

                        </section>

                    </aside>

                </div>

            </div>
            {showPopup && (
                <div
                    className="cej-popup-overlay"
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        className={`cej-popup ${popupType}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="cej-popup-close"
                            onClick={() => setShowPopup(false)}
                            aria-label="ปิดหน้าต่าง"
                        >
                            <RxCross2 />
                        </button>

                        <div className="cej-popup-icon">
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>

                        <h3>
                            {popupType === "success"
                                ? "บันทึกการแก้ไขสำเร็จ"
                                : "ไม่สามารถบันทึกการแก้ไขได้"}
                        </h3>

                        <p>{popupMessage}</p>

                        <button
                            type="button"
                            className="cej-popup-btn"
                            onClick={() => {
                                setShowPopup(false);

                                if (popupType === "success") {
                                    navigate("/company/dashboard");
                                }
                            }}
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CompanyEditJob;