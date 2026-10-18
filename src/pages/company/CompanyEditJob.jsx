import NavbarCompany from "../../components/NavbarCompany";
import "./CompanyEditJob.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";


import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
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
    FiSave,
    FiChevronDown
} from "react-icons/fi";

import { TbUserEdit } from "react-icons/tb";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function LocationPicker({ latitude, longitude }) {
    if (latitude === null || longitude === null) {
        return null;
    }

    return (
        <Marker
            position={[latitude, longitude]}
            draggable={false}
        />
    );
}

function MapController({ latitude, longitude }) {
    const map = useMap();

    useEffect(() => {
        if (latitude !== null && longitude !== null) {
            map.setView([latitude, longitude], 16);
        }
    }, [latitude, longitude, map]);

    return null;
}
function CompanyEditJob() {

    const navigate = useNavigate();
    const { id } = useParams();
    const previewRef = useRef(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [companyLogo, setCompanyLogo] = useState("");
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
    const [skills, setSkills] = useState("");
    const [welfare, setWelfare] = useState("");

    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");

    // ข้อมูลเพิ่มเติมสำหรับ preview / sidebar
    const [jobCreatedAt, setJobCreatedAt] = useState(null);
    const [jobUpdatedAt, setJobUpdatedAt] = useState(null);
    const [applicantCount, setApplicantCount] = useState(0);

    const [logoFile, setLogoFile] = useState(null);

    // Error ของแต่ละช่องในหน้า Edit
    const [errors, setErrors] = useState({});

    // อ้างอิงตำแหน่งของช่องกรอก
    const fieldRefs = {
        title: useRef(null),
        category: useRef(null),
        workType: useRef(null),
        location: useRef(null),
        salaryType: useRef(null),
        salary: useRef(null),
        description: useRef(null),
        qualification: useRef(null),
        skills: useRef(null),
        welfare: useRef(null),
    };

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
    const fetchCompanyProfile = async () => {
        try {
            const token = getToken();

            if (!token) return;

            const res = await axios.get(
                "http://localhost:5000/api/company/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data;

            setCompanyName(
                data.companyName || ""
            );

            setCompanyAddress(
                data.address || ""
            );

            setCompanyLogo(
                data.logo
                    ? data.logo.startsWith("http")
                        ? data.logo
                        : `http://localhost:5000${data.logo}`
                    : "/image/logo.png"
            );

            if (
                data.latitude !== null &&
                data.latitude !== undefined &&
                data.longitude !== null &&
                data.longitude !== undefined
            ) {
                setLatitude(Number(data.latitude));
                setLongitude(Number(data.longitude));
            }
        } catch (error) {
            console.error(
                "GET COMPANY PROFILE ERROR:",
                error
            );
        }
    };
    const thaiProvinces = [
        "กรุงเทพมหานคร",
        "กระบี่",
        "กาญจนบุรี",
        "กาฬสินธุ์",
        "กำแพงเพชร",
        "ขอนแก่น",
        "จันทบุรี",
        "ฉะเชิงเทรา",
        "ชลบุรี",
        "ชัยนาท",
        "ชัยภูมิ",
        "ชุมพร",
        "เชียงราย",
        "เชียงใหม่",
        "ตรัง",
        "ตราด",
        "ตาก",
        "นครนายก",
        "นครปฐม",
        "นครพนม",
        "นครราชสีมา",
        "นครศรีธรรมราช",
        "นครสวรรค์",
        "นนทบุรี",
        "นราธิวาส",
        "น่าน",
        "บึงกาฬ",
        "บุรีรัมย์",
        "ปทุมธานี",
        "ประจวบคีรีขันธ์",
        "ปราจีนบุรี",
        "ปัตตานี",
        "พระนครศรีอยุธยา",
        "พะเยา",
        "พังงา",
        "พัทลุง",
        "พิจิตร",
        "พิษณุโลก",
        "เพชรบุรี",
        "เพชรบูรณ์",
        "แพร่",
        "ภูเก็ต",
        "มหาสารคาม",
        "มุกดาหาร",
        "แม่ฮ่องสอน",
        "ยโสธร",
        "ยะลา",
        "ร้อยเอ็ด",
        "ระนอง",
        "ระยอง",
        "ราชบุรี",
        "ลพบุรี",
        "ลำปาง",
        "ลำพูน",
        "เลย",
        "ศรีสะเกษ",
        "สกลนคร",
        "สงขลา",
        "สตูล",
        "สมุทรปราการ",
        "สมุทรสงคราม",
        "สมุทรสาคร",
        "สระแก้ว",
        "สระบุรี",
        "สิงห์บุรี",
        "สุโขทัย",
        "สุพรรณบุรี",
        "สุราษฎร์ธานี",
        "สุรินทร์",
        "หนองคาย",
        "หนองบัวลำภู",
        "อ่างทอง",
        "อุดรธานี",
        "อุทัยธานี",
        "อุตรดิตถ์",
        "อุบลราชธานี",
        "อำนาจเจริญ"
    ];

    const getProvinceName = (address) => {
        if (!address) return "ไม่ระบุจังหวัด";

        const normalizedAddress = address
            .replace(/กรุงเทพฯ|กทม\./g, "กรุงเทพมหานคร");

        const province = thaiProvinces
            .slice()
            .sort((a, b) => b.length - a.length)
            .find((name) => normalizedAddress.includes(name));

        return province || "ไม่ระบุจังหวัด";
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

            setSkills(
                Array.isArray(data.skills)
                    ? data.skills.join(", ")
                    : data.skills || ""
            );

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
        fetchCompanyProfile();
    }, [id]);


    // ตรวจสอบข้อมูลทีละช่อง
    const validateField = (field, value) => {
        let message = "";

        switch (field) {
            case "title":
                if (!String(value ?? "").trim()) {
                    message = "กรุณากรอกชื่อตำแหน่งงาน";
                }
                break;

            case "category":
                if (!value) {
                    message = "กรุณาเลือกหมวดหมู่งาน";
                }
                break;

            case "workType":
                if (!value) {
                    message = "กรุณาเลือกรูปแบบการทำงาน";
                }
                break;

            case "location":
                if (!value.trim()) {
                    message = "กรุณากรอกสถานที่ทำงาน";
                }
                break;

            case "salaryType":
                if (!value) {
                    message = "กรุณาเลือกค่าตอบแทน";
                }
                break;

            case "salary":
                if (salaryType === "paid") {
                    if (value === "" || String(value).trim() === "") {
                        message = "กรุณากรอกจำนวนเงิน";
                    } else if (!Number.isFinite(Number(value)) || Number(value) <= 0) {
                        message = "จำนวนเงินต้องมากกว่า 0";
                    }
                }
                break;

            case "description":
                if (!value.trim()) {
                    message = "กรุณากรอกรายละเอียดงาน";
                }
                break;

            case "qualification":
                if (!value.trim()) {
                    message = "กรุณากรอกคุณสมบัติผู้สมัคร";
                }
                break;

            case "skills":
                if (!value.trim()) {
                    message = "กรุณากรอกทักษะที่ต้องการ";
                }
                break;

            case "welfare":
                if (!value.trim()) {
                    message = "กรุณากรอกสวัสดิการ";
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [field]: message,
        }));

        return !message;
    };

    // ตรวจสอบทุกช่องก่อนบันทึก
    const validateForm = () => {
        const values = {
            title,
            category,
            workType,
            location,
            salaryType,
            salary,
            description,
            qualification,
            skills,
            welfare,
        };

        const newErrors = {};

        Object.entries(values).forEach(([field, value]) => {
            let message = "";

            switch (field) {
                case "title":
                    if (!value.trim()) message = "กรุณากรอกชื่อตำแหน่งงาน";
                    break;

                case "category":
                    if (!value) message = "กรุณาเลือกหมวดหมู่งาน";
                    break;

                case "workType":
                    if (!value) message = "กรุณาเลือกรูปแบบการทำงาน";
                    break;

                case "location":
                    if (!value.trim()) message = "กรุณากรอกสถานที่ทำงาน";
                    break;

                case "salaryType":
                    if (!value) message = "กรุณาเลือกค่าตอบแทน";
                    break;

                case "salary":
                    if (salaryType === "paid") {
                        if (value === "" || String(value).trim() === "") {
                            message = "กรุณากรอกจำนวนเงิน";
                        } else if (
                            !Number.isFinite(Number(value)) ||
                            Number(value) <= 0
                        ) {
                            message = "จำนวนเงินต้องมากกว่า 0";
                        }
                    }
                    break;

                case "description":
                    if (!value.trim()) message = "กรุณากรอกรายละเอียดงาน";
                    break;

                case "qualification":
                    if (!value.trim()) message = "กรุณากรอกคุณสมบัติผู้สมัคร";
                    break;

                case "skills":
                    if (!value.trim()) message = "กรุณากรอกทักษะที่ต้องการ";
                    break;

                case "welfare":
                    if (!value.trim()) message = "กรุณากรอกสวัสดิการ";
                    break;

                default:
                    break;
            }

            if (message) {
                newErrors[field] = message;
            }
        });

        setErrors(newErrors);

        // เลื่อนไปยังช่องแรกที่พบข้อผิดพลาด
        const firstError = Object.keys(newErrors)[0];

        if (firstError) {
            fieldRefs[firstError].current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            fieldRefs[firstError].current?.focus?.();

            return false;
        }

        return true;
    };
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

            // ตรวจสอบข้อมูลก่อนส่งไป Backend
            if (!validateForm()) {
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
            formData.append("skills", skills);
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
    // เลือกรูปแบบการทำงาน หรือคลิกซ้ำเพื่อยกเลิก
    const handleWorkTypeClick = (value) => {
        setWorkType((prev) => (prev === value ? "" : value));

        setErrors((prev) => ({
            ...prev,
            workType: "",
        }));
    };

    // เลือกค่าตอบแทน หรือคลิกซ้ำเพื่อยกเลิก
    const handleSalaryTypeClick = (value) => {
        if (salaryType === value) {
            setSalaryType("");
            setSalary("");
        } else {
            setSalaryType(value);

            if (value === "unpaid") {
                setSalary("");
            }
        }

        setErrors((prev) => ({
            ...prev,
            salaryType: "",
            salary: "",
        }));
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

                        <h2>แก้ไขประกาศงาน</h2>
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
                                        ref={fieldRefs.title}
                                        type="text"
                                        placeholder="เช่น Frontend Developer Intern"
                                        value={title}
                                        className={errors.title ? "edit-input-error" : ""}
                                        onBlur={() => validateField("title", title)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setTitle(value);

                                            if (value.trim()) {
                                                setErrors((prev) => ({ ...prev, title: "" }));
                                            }
                                        }}
                                    />

                                    {errors.title && (
                                        <small className="edit-error-text">{errors.title}</small>
                                    )}

                                </div>


                                <div className="form-group-edit">

                                    <label>
                                        หมวดหมู่งาน <span>*</span>
                                    </label>

                                    <div className="edit-category-select-wrapper">
    <select
        ref={fieldRefs.category}
        value={category}
        className={`edit-category-select ${
            errors.category ? "edit-input-error" : ""
        }`}
        onBlur={() => validateField("category", category)}
        onChange={(e) => {
            const value = e.target.value;
            setCategory(value);

            if (value) {
                setErrors((prev) => ({ ...prev, category: "" }));
            }
        }}
    >
        <option value="">เลือกหมวดหมู่</option>
        <option value="IT">IT / Developer</option>
        <option value="Design">Design</option>
        <option value="Marketing">Marketing</option>
        <option value="Business">Business</option>
    </select>

    <FiChevronDown className="edit-category-arrow" />
</div>

                                    {errors.category && (
                                        <small className="edit-error-text">{errors.category}</small>
                                    )}

                                </div>

                            </div>

                            <div className="form-group-edit">
                                <label>
                                    รูปแบบการทำงาน <span>*</span>
                                </label>

                                <div
                                    className={`work-type-options ${errors.workType ? "edit-options-error" : ""
                                        }`}
                                    ref={fieldRefs.workType}
                                    tabIndex={-1}
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            validateField("workType", workType);
                                        }
                                    }}
                                >
                                    <button
                                        type="button"
                                        className={`work-type-btn ${workType === "On-site" ? "active" : ""}`}
                                        onClick={() => handleWorkTypeClick("On-site")}
                                    >
                                        On-site
                                    </button>

                                    <button
                                        type="button"
                                        className={`work-type-btn ${workType === "Hybrid" ? "active" : ""}`}
                                        onClick={() => handleWorkTypeClick("Hybrid")}
                                    >
                                        Hybrid
                                    </button>

                                    <button
                                        type="button"
                                        className={`work-type-btn ${workType === "Work from Home" ? "active" : ""}`}
                                        onClick={() => handleWorkTypeClick("Work from Home")}
                                    >
                                        Work from Home
                                    </button>
                                </div>

                                {errors.workType && (
                                    <small className="edit-error-text">{errors.workType}</small>
                                )}
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

                                <div className="form-group-edit map-form-group">
                                    <label>ตำแหน่งบนแผนที่</label>

                                    <div className="editjob-map-wrapper">
                                        {latitude !== null && longitude !== null ? (
                                            <MapContainer
                                                center={[latitude, longitude]}
                                                zoom={16}
                                                scrollWheelZoom={true}
                                                style={{
                                                    height: "350px",
                                                    width: "100%",
                                                }}
                                            >
                                                <TileLayer
                                                    attribution="&copy; OpenStreetMap contributors"
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />

                                                <MapController
                                                    latitude={latitude}
                                                    longitude={longitude}
                                                />

                                                <LocationPicker
                                                    latitude={latitude}
                                                    longitude={longitude}
                                                />
                                            </MapContainer>
                                        ) : (
                                            <div className="editjob-map-empty">
                                                ยังไม่มีข้อมูลพิกัดของบริษัท
                                            </div>
                                        )}
                                    </div>

                                    <small className="field-hint">
                                        ตำแหน่งบนแผนที่อ้างอิงจากที่อยู่บริษัทในโปรไฟล์
                                        และไม่สามารถแก้ไขได้
                                    </small>
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


                            <div
                                className={`salary-options ${errors.salaryType ? "edit-options-error" : ""
                                    }`}
                                ref={fieldRefs.salaryType}
                                tabIndex={-1}
                                onBlur={(e) => {
                                    if (!e.currentTarget.contains(e.relatedTarget)) {
                                        validateField("salaryType", salaryType);
                                    }
                                }}
                            >
                                <button
                                    type="button"
                                    className={`salary-btn ${salaryType === "paid" ? "active" : ""}`}
                                    onClick={() => handleSalaryTypeClick("paid")}
                                >
                                    มีค่าตอบแทน
                                </button>

                                <button
                                    type="button"
                                    className={`salary-btn ${salaryType === "unpaid" ? "active" : ""}`}
                                    onClick={() => handleSalaryTypeClick("unpaid")}
                                >
                                    ไม่มีค่าตอบแทน
                                </button>
                            </div>

                            {errors.salaryType && (
                                <small className="edit-error-text">{errors.salaryType}</small>
                            )}




                            {salaryType === "paid" && (
                                <>
                                    <div className="salary-input-row">
                                        <input
                                            ref={fieldRefs.salary}
                                            className={`salary-input-box ${errors.salary ? "edit-input-error" : ""
                                                }`}
                                            type="number"
                                            min="1"
                                            step="1"
                                            placeholder="เช่น 350"
                                            value={salary}
                                            onBlur={() => validateField("salary", salary)}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSalary(value);

                                                if (
                                                    value.trim() !== "" &&
                                                    Number.isFinite(Number(value)) &&
                                                    Number(value) > 0
                                                ) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        salary: "",
                                                    }));
                                                }
                                            }}
                                        />

                                        <div className="salary-unit-wrapper">
    <select
        className="salary-unit-select"
        value={salaryUnit}
        onChange={(e) => setSalaryUnit(e.target.value)}
    >
        <option value="บาท/วัน">บาท/วัน</option>
        <option value="บาท/เดือน">บาท/เดือน</option>
        <option value="บาท/ชั่วโมง">บาท/ชั่วโมง</option>
    </select>

    <FiChevronDown className="salary-unit-arrow" />
</div>
                                    </div>

                                    {/* ข้อความแจ้งเตือนอยู่ใต้ช่องเงินเดือน */}
                                    {errors.salary && (
                                        <small className="edit-error-text">
                                            {errors.salary}
                                        </small>
                                    )}
                                </>
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
                                    รายละเอียดงาน <span>*</span>
                                </label>

                                <textarea
                                    ref={fieldRefs.description}
                                    rows="5"
                                    placeholder="ระบุรายละเอียดงาน หน้าที่ความรับผิดชอบ..."
                                    value={description}
                                    className={errors.description ? "edit-input-error" : ""}
                                    onBlur={() => validateField("description", description)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setDescription(value);

                                        if (value.trim()) {
                                            setErrors((prev) => ({ ...prev, description: "" }));
                                        }
                                    }}
                                />

                                {errors.description && (
                                    <small className="edit-error-text">{errors.description}</small>
                                )}

                            </div>


                            <div className="form-group-edit">

                                <label>
                                    คุณสมบัติผู้สมัคร <span>*</span>
                                </label>

                                <textarea
                                    ref={fieldRefs.qualification}
                                    rows="5"
                                    placeholder="ระบุคุณสมบัติ เช่น ระดับการศึกษา..."
                                    value={qualification}
                                    className={errors.qualification ? "edit-input-error" : ""}
                                    onBlur={() => validateField("qualification", qualification)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setQualification(value);

                                        if (value.trim()) {
                                            setErrors((prev) => ({ ...prev, qualification: "" }));
                                        }
                                    }}
                                />

                                {errors.qualification && (
                                    <small className="edit-error-text">{errors.qualification}</small>
                                )}

                            </div>
                            <div className="form-group-edit skills-group">
                                <label>
                                    ทักษะที่ต้องการ <span>*</span>
                                </label>

                                <textarea
                                    ref={fieldRefs.skills}
                                    rows="3"
                                    placeholder="เช่น HTML, CSS, JavaScript, React, MySQL"
                                    value={skills}
                                    className={errors.skills ? "edit-input-error" : ""}
                                    onBlur={() => validateField("skills", skills)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSkills(value);

                                        if (value.trim()) {
                                            setErrors((prev) => ({ ...prev, skills: "" }));
                                        }
                                    }}
                                />

                                {errors.skills && (
                                    <small className="edit-error-text">{errors.skills}</small>
                                )}
                            </div>

                            <div className="form-group-edit">
                                <label>
                                    สวัสดิการ <span>*</span>
                                </label>
                                <textarea
                                    ref={fieldRefs.welfare}
                                    rows="5"
                                    placeholder="ระบุสวัสดิการ เช่น เบี้ยเลี้ยง อาหารกลางวัน ค่าเดินทาง..."
                                    value={welfare}
                                    className={errors.welfare ? "edit-input-error" : ""}
                                    onBlur={() => validateField("welfare", welfare)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setWelfare(value);

                                        if (value.trim()) {
                                            setErrors((prev) => ({ ...prev, welfare: "" }));
                                        }
                                    }}
                                />

                                {errors.welfare && (
                                    <small className="edit-error-text">{errors.welfare}</small>
                                )}
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
                                    {companyName || "บริษัทของคุณ"}
                                </span>


                                <div className="preview-logo">
                                    <img
                                        src={companyLogo || "/image/logo.png"}
                                        alt={companyName || "โลโก้บริษัท"}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/image/logo.png";
                                        }}
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
                                    {getProvinceName(companyAddress || location)}
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

                                <h4>ทักษะที่ต้องการ</h4>

                                <ul>
                                    {skills.trim() ? (
                                        skills.split(",").map((skill, index) => (
                                            skill.trim() && (
                                                <li key={index}>
                                                    {skill.trim()}
                                                </li>
                                            )
                                        ))
                                    ) : (
                                        <li>ยังไม่ได้ระบุ</li>
                                    )}
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