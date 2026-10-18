import NavbarCompany from "../../components/NavbarCompany";
import "./CompanyCreateJob.css";
import { useState, useRef, useEffect } from "react";
import { FiEye, FiUploadCloud, FiFile, FiCheckCircle, FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign, FiMonitor } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiChevronDown } from "react-icons/fi";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
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
function CompanyCreateJob() {

    const [touched, setTouched] = useState({});

    const formRef = useRef(null);

    const [jobData, setJobData] = useState({
        jobTitle: "",
        category: "",
        jobType: "",
        location: "",
        workType: "",
        salaryType: "",
        salary: "",
        salaryUnit: "บาท/วัน",
        description: "",
        qualification: "",
        skills: "", // เพิ่มตรงนี้
        welfare: ""
    });


    const [company, setCompany] = useState({
        companyName: "",
        logo: "",
        address: "",
        contactName: "",
        contactEmail: "",
        phone: ""
    });



    const getProvinceName = (address) => {
        if (!address) return "จังหวัด";

        const provinces = [
            "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์",
            "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา",
            "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย",
            "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก",
            "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช",
            "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ",
            "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี",
            "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา",
            "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี",
            "เพชรบูรณ์", "แพร่", "ภูเก็ต", "มหาสารคาม",
            "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา",
            "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี",
            "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร",
            "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม",
            "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี",
            "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์",
            "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อุดรธานี",
            "อุทัยธานี", "อุตรดิตถ์", "อุบลราชธานี", "อำนาจเจริญ"
        ];

        if (address.includes("กรุงเทพ")) {
            return "กรุงเทพมหานคร";
        }

        const found = provinces
            .filter(province => address.includes(province))
            .sort((a, b) => b.length - a.length)[0];

        return found || "ไม่ระบุจังหวัด";
    };



    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const token = localStorage.getItem("companyToken");

                if (!token) return;

                const response = await axios.get(
                    "http://localhost:5000/api/company/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = response.data;

                setCompany({
                    companyName: data.companyName || "",
                    logo: data.logo || "",
                    address: data.address || "",
                    contactName: data.contactName || "",
                    contactEmail: data.contactEmail || "",
                    phone: data.phone || ""
                });

                // ใช้ที่อยู่บริษัทเป็นสถานที่ทำงาน
                setJobData(prev => ({
                    ...prev,
                    location: data.address || ""
                }));

                // ถ้ามีพิกัดบริษัท ให้ใช้เป็นตำแหน่งเริ่มต้นของแผนที่
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
                console.error("GET COMPANY PROFILE ERROR:", error);
            }
        };

        fetchCompanyProfile();
    }, []);
    const getCompanyLogoUrl = () => {
        if (!company.logo) {
            return "/image/logo.png";
        }

        return company.logo.startsWith("http")
            ? company.logo
            : `http://localhost:5000${company.logo}`;
    };

    // เก็บ error ข้อมูลที่ยังไม่กรอก
    const [errors, setErrors] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");

    const fieldRefs = {
        jobTitle: useRef(null),
        category: useRef(null),
        jobType: useRef(null),
        location: useRef(null),
        map: useRef(null),
        workType: useRef(null),
        salaryType: useRef(null),
        salary: useRef(null),
        description: useRef(null),
        qualification: useRef(null),
        skills: useRef(null),
        welfare: useRef(null),
    };

    const validateForm = () => {
        const newErrors = {};

        if (!jobData.jobTitle.trim())
            newErrors.jobTitle = "กรุณากรอกชื่อตำแหน่งงาน";
        if (!jobData.category)
            newErrors.category = "กรุณาเลือกหมวดหมู่งาน";
        // if (!jobData.jobType)
        //     newErrors.jobType = "กรุณาเลือกประเภทงาน";
        if (!jobData.location.trim())
            newErrors.location = "กรุณากรอกสถานที่ทำงาน";

        if (latitude === null || longitude === null)
            newErrors.map = "กรุณาเลือกตำแหน่งบนแผนที่";
        if (!jobData.workType)
            newErrors.workType = "กรุณาเลือกรูปแบบการทำงาน";
        if (!jobData.salaryType)
            newErrors.salaryType = "กรุณาเลือกค่าตอบแทน";
        if (jobData.salaryType === "paid") {
            if (!jobData.salary.trim()) {
                newErrors.salary = "กรุณากรอกจำนวนเงิน";
            } else if (Number(jobData.salary) <= 0) {
                newErrors.salary = "จำนวนเงินต้องมากกว่า 0";
            }
        }

        if (!jobData.description.trim())
            newErrors.description = "กรุณากรอกรายละเอียดงาน";
        if (!jobData.qualification.trim())
            newErrors.qualification = "กรุณากรอกคุณสมบัติ";
        if (!jobData.skills.trim())
            newErrors.skills = "กรุณากรอกทักษะที่ต้องการ";
        if (!jobData.welfare.trim())
            newErrors.welfare = "กรุณากรอกสวัสดิการ";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.keys(newErrors)[0];
            const element = fieldRefs[firstError]?.current;

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                if (typeof element.focus === "function") {
                    setTimeout(() => {
                        element.focus({ preventScroll: true });
                    }, 300);
                }
            }

            return false;
        }

        return true;

    };

    const validateField = (field, value) => {
        let message = "";

        switch (field) {
            case "jobTitle":
                if (!value.trim()) {
                    message = "กรุณากรอกชื่อตำแหน่งงาน";
                }
                break;

            case "category":
                if (!value) {
                    message = "กรุณาเลือกหมวดหมู่งาน";
                }
                break;

            case "jobType":
                if (!value) {
                    message = "กรุณาเลือกประเภทงาน";
                }
                break;

            case "location":
                if (!value.trim()) {
                    message = "กรุณากรอกสถานที่ทำงาน";
                }
                break;

            case "description":
                if (!value.trim()) {
                    message = "กรุณากรอกรายละเอียดงาน";
                }
                break;

            case "qualification":
                if (!value.trim()) {
                    message = "กรุณากรอกคุณสมบัติ";
                }
                break;

            case "welfare":
                if (!value.trim()) {
                    message = "กรุณากรอกสวัสดิการ";
                }
                break;
            case "skills":
                if (!value.trim()) {
                    message = "กรุณากรอกทักษะที่ต้องการ";
                }
                break;
            case "salary":
                if (jobData.salaryType === "paid") {
                    if (!value.trim()) {
                        message = "กรุณากรอกจำนวนเงิน";
                    } else if (Number(value) <= 0) {
                        message = "จำนวนเงินต้องมากกว่า 0";
                    }
                }
                break;

            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [field]: message,
        }));
    };

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    return (
        <>
            <NavbarCompany />

            <div className="create-job-page">

                {/* Hero */}
                <section className="create-job-hero">

                    <h1>
                        ลงประกาศหางาน
                    </h1>

                    <p className="hero-text">
                        <span className="hero-title">
                            ประกาศงานง่าย <span>ได้คนตรงใจ</span>
                        </span>
                        <br />
                        <span className="hero-subtitle">
                            เข้าถึงผู้สมัครที่ใช่ได้ง่ายขึ้น
                        </span>
                    </p>

                    <div className="hero-btn">

                        <button
                            className="create-btn"
                            onClick={() =>
                                formRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                })
                            }
                        >
                            + สร้างประกาศงาน
                        </button>

                        <button className="preview-btn">
                            <FiEye />
                            ดูตัวอย่างประกาศ
                        </button>

                    </div>

                </section>

                {/* Body */}
                <div className="create-job-body">

                    {/* ซ้าย */}
                    <div className="job-form">

                        <div className="form-card" ref={formRef}>

                            <h2>สร้างประกาศงานใหม่</h2>

                            {/* ข้อมูลตำแหน่งงาน */}
                            <section className="form-section">

                                <h2>
                                    <span className="step-circle">1</span>
                                    ข้อมูลตำแหน่งงาน
                                </h2>


                                {/* ชื่อตำแหน่งงาน และหมวดหมู่งาน */}
                                <div className="form-row-create job-title-category-row">

                                    {/* ชื่อตำแหน่งงาน */}
                                    <div className="form-group-create">
                                        <label>
                                            ชื่อตำแหน่งงาน <span className="required">*</span>
                                        </label>

                                        <input
                                            ref={fieldRefs.jobTitle}
                                            value={jobData.jobTitle}
                                            className={errors.jobTitle ? "input-error" : ""}
                                            onBlur={() =>
                                                validateField("jobTitle", jobData.jobTitle)
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                setJobData(prev => ({
                                                    ...prev,
                                                    jobTitle: value,
                                                }));

                                                if (value.trim()) {
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        jobTitle: "",
                                                    }));
                                                }
                                            }}
                                            placeholder="กรอกชื่อตำแหน่งงาน"
                                        />

                                        {errors.jobTitle && (
                                            <small className="error-text-create">
                                                {errors.jobTitle}
                                            </small>
                                        )}
                                    </div>

                                    {/* หมวดหมู่งาน */}
                                    <div className="form-group-create">
                                        <label>
                                            หมวดหมู่งาน <span className="required">*</span>
                                        </label>

                                        <div className="select-wrapper">
                                            <select
                                                ref={fieldRefs.category}
                                                value={jobData.category}
                                                className={errors.category ? "input-error" : ""}
                                                onBlur={() =>
                                                    validateField("category", jobData.category)
                                                }
                                                onChange={(e) => {
                                                    setJobData(prev => ({
                                                        ...prev,
                                                        category: e.target.value,
                                                    }));

                                                    setErrors(prev => ({
                                                        ...prev,
                                                        category: "",
                                                    }));
                                                }}
                                            >
                                                <option value="">เลือกหมวดหมู่งาน</option>
                                                <option value="IT">IT / Developer</option>
                                                <option value="Design">Design</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Business">Business</option>
                                            </select>

                                            <FiChevronDown className="select-arrow" />
                                        </div>

                                        {errors.category && (
                                            <small className="error-text-create">
                                                {errors.category}
                                            </small>
                                        )}
                                    </div>

                                </div>

                                {/* รูปแบบงาน */}
                                <div className="form-group-create">
                                    <label>
                                        รูปแบบการทำงาน <span className="required">*</span>
                                    </label>

                                    <div
                                        ref={fieldRefs.workType}
                                        className="worktype-group"
                                        tabIndex={0}
                                        onBlur={() => {
                                            setTouched(prev => ({
                                                ...prev,
                                                workType: true
                                            }));

                                            if (!jobData.workType) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    workType: "กรุณาเลือกรูปแบบการทำงาน"
                                                }))
                                            }
                                        }}
                                    >

                                        <button
                                            type="button"
                                            className={
                                                jobData.workType === "On-site"
                                                    ? "worktype-btn active"
                                                    : "worktype-btn"
                                            }
                                            onClick={() => {
                                                setJobData({
                                                    ...jobData,
                                                    workType:
                                                        jobData.workType === "On-site"
                                                            ? ""
                                                            : "On-site"
                                                });

                                                setErrors(prev => ({
                                                    ...prev,
                                                    workType: ""
                                                }));
                                            }}


                                        >
                                            On-site
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                jobData.workType === "Hybrid"
                                                    ? "worktype-btn active"
                                                    : "worktype-btn"
                                            }
                                            onClick={() => {
                                                setJobData({
                                                    ...jobData,
                                                    workType:
                                                        jobData.workType === "Hybrid"
                                                            ? ""
                                                            : "Hybrid"
                                                });

                                                setErrors(prev => ({
                                                    ...prev,
                                                    workType: ""
                                                }));
                                            }}
                                        >
                                            Hybrid
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                jobData.workType === "Work from Home"
                                                    ? "worktype-btn active"
                                                    : "worktype-btn"
                                            }
                                            onClick={() => {
                                                setJobData({
                                                    ...jobData,
                                                    workType:
                                                        jobData.workType === "Work from Home"
                                                            ? ""
                                                            : "Work from Home"
                                                });

                                                setErrors(prev => ({
                                                    ...prev,
                                                    workType: ""
                                                }));
                                            }}

                                        >
                                            Work from Home
                                        </button>
                                        {errors.workType && (
                                            <small className="error-text-create">
                                                {errors.workType}
                                            </small>
                                        )}

                                    </div>
                                </div>
                                {/* สถานที่ทำงาน */}
                                <div className="form-group-create">
                                    <label>
                                        สถานที่ทำงาน <span className="required">*</span>
                                    </label>

                                    <div className="company-address-display">
                                        <FiMapPin />

                                        <span>
                                            {company.address || "ยังไม่ได้ระบุที่อยู่บริษัท"}
                                        </span>
                                    </div>

                                    <small className="field-hint">
                                        สถานที่ทำงานอ้างอิงจากที่อยู่บริษัทในโปรไฟล์
                                    </small>
                                </div>


                                {/* แผนที่ */}
                                <div className="form-group-create map-form-group">
                                    <label>
                                        ตำแหน่งบนแผนที่ <span className="required">*</span>
                                    </label>

                                    <div className="map-wrapper">
                                        <MapContainer
                                            center={[13.7563, 100.5018]}
                                            zoom={16}
                                            scrollWheelZoom={true}
                                            style={{ height: "350px", width: "100%" }}
                                        >
                                            <TileLayer
                                                attribution='&copy; OpenStreetMap contributors'
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

                                            {/* <LocationMarker /> */}


                                        </MapContainer>
                                    </div>

                                    <small className="field-hint">
                                        ตำแหน่งบนแผนที่อ้างอิงจากที่อยู่บริษัทในโปรไฟล์ และไม่สามารถแก้ไขได้
                                    </small>
                                </div>
                            </section>





                            {/* เงินเดือน */}
                            <section className="form-section">

                                <h2>
                                    <span className="step-circle">2</span>
                                    เงินเดือน
                                </h2>

                                <label>
                                    ค่าตอบแทน <span className="required">*</span>
                                </label>

                                <div className="salary-group">

                                    <div
                                        ref={fieldRefs.salaryType}
                                        tabIndex={-1}
                                        className={`salary-btn-group ${errors.salaryType ? "input-error-group" : ""
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            className={
                                                jobData.salaryType === "paid"
                                                    ? "salary-btn active"
                                                    : "salary-btn"
                                            }
                                            onClick={() => {
                                                const isCancel = jobData.salaryType === "paid";

                                                setJobData({
                                                    ...jobData,
                                                    salaryType: isCancel ? "" : "paid",
                                                    salary: isCancel ? "" : jobData.salary,
                                                });

                                                setErrors((prev) => ({
                                                    ...prev,
                                                    salaryType: isCancel
                                                        ? "กรุณาเลือกค่าตอบแทน"
                                                        : "",
                                                    salary: "",
                                                }));
                                            }}
                                        >
                                            มีค่าตอบแทน
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                jobData.salaryType === "unpaid"
                                                    ? "salary-btn active"
                                                    : "salary-btn"
                                            }
                                            onClick={() => {
                                                const isCancel = jobData.salaryType === "unpaid";

                                                setJobData({
                                                    ...jobData,
                                                    salaryType: isCancel ? "" : "unpaid",
                                                    salary: "",
                                                });

                                                setErrors((prev) => ({
                                                    ...prev,
                                                    salaryType: isCancel
                                                        ? "กรุณาเลือกค่าตอบแทน"
                                                        : "",
                                                    salary: "",
                                                }));
                                            }}
                                        >
                                            ไม่มีค่าตอบแทน
                                        </button>
                                    </div>
                                    {errors.salaryType && (
                                        <small className="error-text-create">
                                            {errors.salaryType}
                                        </small>
                                    )}
                                    {
                                        jobData.salaryType === "paid" && (
                                            <div className="salary-input-row">
                                                <div className="salary-input-wrapper">
                                                    <input
                                                        ref={fieldRefs.salary}
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                        className={errors.salary ? "input-error" : ""}
                                                        placeholder="เช่น 350"
                                                        value={jobData.salary}
                                                        onBlur={() => validateField("salary", jobData.salary)}
                                                        onChange={(e) => {
                                                            setJobData({
                                                                ...jobData,
                                                                salary: e.target.value
                                                            });

                                                            setErrors(prev => ({
                                                                ...prev,
                                                                salary: ""
                                                            }));
                                                        }}
                                                    />

                                                    {errors.salary && (
                                                        <small className="error-text-create">
                                                            {errors.salary}
                                                        </small>
                                                    )}
                                                </div>

                                                <div className="salary-select-wrapper">
                                                    <select
                                                        value={jobData.salaryUnit}
                                                        onChange={(e) =>
                                                            setJobData({
                                                                ...jobData,
                                                                salaryUnit: e.target.value
                                                            })
                                                        }
                                                    >
                                                        <option>บาท/วัน</option>
                                                        <option>บาท/เดือน</option>
                                                        <option>บาท/ชั่วโมง</option>
                                                    </select>

                                                    <FiChevronDown className="salary-select-arrow" />
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>

                            </section >

                            {/* รายละเอียดงาน */}
                            <section className="form-section job-detail-section">

                                <h2>
                                    <span className="step-circle">3</span>
                                    รายละเอียดงาน
                                </h2>

                                {/* รายละเอียดงาน */}
                                <div className="form-group-create">
                                    <label>
                                        รายละเอียดงาน <span className="required">*</span>
                                    </label>
                                    <textarea
                                        ref={fieldRefs.description}
                                        value={jobData.description}
                                        className={errors.description ? "input-error" : ""}
                                        onBlur={() =>
                                            validateField("description", jobData.description)
                                        }
                                        onChange={(e) => {
                                            setJobData({
                                                ...jobData,
                                                description: e.target.value
                                            });

                                            if (errors.description && e.target.value.trim()) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    description: ""
                                                }))

                                            }
                                        }}
                                        placeholder="อธิบายคุณรายละเอียดงาน"
                                    />
                                    {errors.description &&
                                        <small className="error-text-create">
                                            {errors.description}
                                        </small>
                                    }
                                </div>

                                {/* คุณสมบัติ */}
                                <div className="form-group-create qualification-group">
                                    <label>
                                        คุณสมบัติผู้สมัคร <span className="required">*</span>
                                    </label>
                                    <textarea
                                        ref={fieldRefs.qualification}
                                        rows={5}
                                        maxLength={3000}
                                        className={errors.qualification ? "input-error" : ""}
                                        value={jobData.qualification}
                                        onBlur={() =>
                                            validateField("qualification", jobData.qualification)
                                        }
                                        onChange={(e) => {
                                            setJobData({
                                                ...jobData,
                                                qualification: e.target.value
                                            });

                                            setErrors(prev => ({
                                                ...prev,
                                                qualification: ""
                                            }));
                                        }}
                                        placeholder="อธิบายคุณสมบัติ"
                                    />
                                    {errors.qualification && (
                                        <small className="error-text-create">
                                            {errors.qualification}
                                        </small>
                                    )}
                                </div>


                                {/* ทักษะที่ต้องการ */}

                                {/* ทักษะที่ต้องการ */}
                                <div className="form-group-create skills-group">
                                    <label>
                                        ทักษะที่ต้องการ <span className="required">*</span>
                                    </label>

                                    <textarea
                                        ref={fieldRefs.skills}
                                        rows={3}
                                        maxLength={2000}
                                        value={jobData.skills}
                                        className={errors.skills ? "input-error" : ""}
                                        onBlur={() =>
                                            validateField("skills", jobData.skills)
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setJobData(prev => ({
                                                ...prev,
                                                skills: value
                                            }));

                                            if (value.trim()) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    skills: ""
                                                }));
                                            }
                                        }}
                                        placeholder={"เช่น HTML, CSS, JavaScript, React\nGit, GitHub, MySQL"}
                                    />

                                    {errors.skills && (
                                        <small className="error-text-create">
                                            {errors.skills}
                                        </small>
                                    )}


                                </div>



                                {/* สวัสดิการ */}
                                <div className="form-group-create welfare-group">
                                    <label>
                                        สวัสดิการ <span className="required">*</span>
                                    </label>
                                    <textarea
                                        ref={fieldRefs.welfare}
                                        rows={4}
                                        maxLength={3000}
                                        className={errors.welfare ? "input-error" : ""}
                                        value={jobData.welfare}
                                        onBlur={() =>
                                            validateField("welfare", jobData.welfare)
                                        }
                                        onChange={(e) => {
                                            setJobData({
                                                ...jobData,
                                                welfare: e.target.value
                                            });

                                            setErrors(prev => ({
                                                ...prev,
                                                welfare: ""
                                            }));
                                        }}
                                        placeholder="อธิบายสวัสดิการ..."
                                    />
                                    {errors.welfare &&
                                        <small className="error-text-create">
                                            {errors.welfare}
                                        </small>
                                    }
                                </div>

                            </section>

                            <button
                                type="button"
                                className="published-btn-create"
                                onClick={async () => {
                                    if (!validateForm()) return;
                                    console.log("LATITUDE:", latitude);
                                    console.log("LONGITUDE:", longitude);

                                    console.log("JOB DATA:", {
                                        title: jobData.jobTitle,
                                        location: jobData.location,
                                        latitude: latitude,
                                        longitude: longitude
                                    });
                                    try {
                                        const token = localStorage.getItem("companyToken");

                                        const response = await axios.post(
                                            "http://localhost:5000/api/company/jobs",
                                            {
                                                title: jobData.jobTitle,
                                                category: jobData.category,
                                                jobType: jobData.jobType,
                                                location: jobData.location,

                                                latitude: latitude,
                                                longitude: longitude,

                                                workType: jobData.workType,
                                                salaryType: jobData.salaryType,
                                                salary:
                                                    jobData.salaryType === "paid"
                                                        ? Number(jobData.salary)
                                                        : null,
                                                salaryUnit: jobData.salaryUnit,

                                                description: jobData.description,
                                                qualification: jobData.qualification,
                                                skills: jobData.skills,
                                                welfare: jobData.welfare,

                                                // เพิ่มข้อมูลติดต่อบริษัท
                                                contactName: company.contactName,
                                                contactEmail: company.contactEmail,

                                                contactPhone: company.phone,
                                            },
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
                                                },
                                            }
                                        );

                                        setPopupType("success");
                                        setPopupMessage(response.data.message || "เผยแพร่ประกาศงานเรียบร้อยแล้ว");
                                        setShowPopup(true);

                                    } catch (err) {
                                        console.log(err);

                                        setPopupType("error");
                                        setPopupMessage(
                                            err.response?.data?.message || "สร้างประกาศไม่สำเร็จ"
                                        );
                                        setShowPopup(true);
                                    }
                                }}
                            >
                                <FaPaperPlane />
                                เผยแพร่ประกาศงาน
                            </button>

                        </div >

                    </div >

                    {/* ขวา */}
                    <div className="job-preview" >

                        <h2 className="job-preview-title">
                            <FiEye className="preview-title-icon" />
                            ตัวอย่างประกาศงาน
                        </h2>

                        <div className="preview-card">
                            <span className="company-badge">
                                {company.companyName || "บริษัทของคุณ"}
                            </span>
                            <div className="preview-logo">
                                <img
                                    src={getCompanyLogoUrl()}
                                    alt={company.companyName || "Company"}
                                />
                            </div>
                            <h3>
                                {jobData.jobTitle || "ชื่อตำแหน่งฝึกงาน"}
                            </h3>

                            <p>
                                {company.companyName || "ชื่อบริษัท"}
                            </p>

                            <p>
                                <FiMapPin className="preview-icon" />
                                {getProvinceName(jobData.location)}
                            </p>

                            <p className="preview-info">
                                <HiOutlineBuildingOffice2 className="preview-icon" />
                                {jobData.workType || "รูปแบบการทำงาน"}
                            </p>

                            <p className="preview-info">
                                <FiDollarSign className="preview-icon" />
                                {
                                    jobData.salaryType === "paid"
                                        ? `${jobData.salary || "-"} ${jobData.salaryUnit}`
                                        : jobData.salaryType === "unpaid"
                                            ? "ไม่มีค่าตอบแทน"
                                            : "ค่าตอบแทน"
                                }
                            </p>

                            <hr />

                            <h4>รายละเอียดงาน</h4>

                            <p style={{ whiteSpace: "pre-line" }}>
                                {jobData.description || "-"}
                            </p>

                            <h4>คุณสมบัติผู้สมัคร</h4>

                            <ul>
                                {jobData.qualification
                                    ? jobData.qualification
                                        .split("\n")
                                        .filter((item) => item.trim() !== "")
                                        .map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))
                                    : (
                                        <li>ยังไม่ได้ระบุ</li>
                                    )}
                            </ul>


                            <h4>ทักษะที่ต้องการ</h4>

                            <ul>
                                {jobData.skills
                                    ? jobData.skills
                                        .split(/[\n,]+/)
                                        .map((item) => item.trim())
                                        .filter((item) => item !== "")
                                        .map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))
                                    : (
                                        <li>ยังไม่ได้ระบุ</li>
                                    )}
                            </ul>


                            <h4>สวัสดิการ</h4>

                            <ul>
                                {jobData.welfare
                                    ? jobData.welfare
                                        .split("\n")
                                        .filter((item) => item.trim() !== "")
                                        .map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))
                                    : (
                                        <li>ยังไม่ได้ระบุ</li>
                                    )}
                            </ul>

                            <div className="preview-contact">

                                <h4>ติดต่อสอบถาม</h4>

                                <p>
                                    <FiUser className="contact-icon" />
                                    {company.contactName || ""}
                                </p>

                                <p>
                                    <FiMail className="contact-icon" />
                                    {company.contactEmail || ""}
                                </p>

                                <p>
                                    <FiPhone className="contact-icon" />
                                    {company.phone || ""}
                                </p>

                                <button className="btn-preview">
                                    สมัครงานนี้
                                </button>

                            </div>


                        </div>

                        <div className="preview-card">

                            <div className="tips-wrapper">

                                <div className="tips-left">

                                    <h2>เคล็ดลับการประกาศงาน</h2>

                                    <div className="tips-list">

                                        <p>
                                            <FiCheckCircle className="tip-icon" />
                                            ใส่รายละเอียดงานให้ครบถ้วน ช่วยให้ได้ผู้สมัครที่ตรงใจ
                                        </p>

                                        <p>
                                            <FiCheckCircle className="tip-icon" />
                                            ระบุเงินเดือนจะช่วยเพิ่มโอกาสในการได้รับใบสมัคร
                                        </p>

                                        <p>
                                            <FiCheckCircle className="tip-icon" />
                                            อัปเดตประกาศงานอย่างสม่ำเสมอ
                                        </p>

                                    </div>

                                </div>

                                <img
                                    src="/image/create.png"
                                    alt="Job Tips"
                                    className="tips-image"
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div >

            {showPopup && (
                <div className="company-popup-overlay">
                    <div className={`company-popup ${popupType}`}>

                        <button
                            type="button"
                            className="company-popup-close"
                            onClick={() => setShowPopup(false)}
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
                                ? "เผยแพร่ประกาศสำเร็จ"
                                : "ไม่สามารถเผยแพร่ประกาศได้"}
                        </h3>

                        <p>{popupMessage}</p>

                        <button
                            type="button"
                            className="company-popup-btn"
                            onClick={() => setShowPopup(false)}
                        >
                            ตกลง
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}

export default CompanyCreateJob;