import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Apply.css";
import { useState, useEffect } from "react";
import {
    FiUser,
    FiMapPin,
    FiPhone,
    FiMail,
    FiBookOpen,
    FiBriefcase,
    FiCalendar,
    FiHome,
    FiChevronRight,
    FiChevronLeft,
    FiFileText,
    FiUploadCloud,
    FiSend
} from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { SlHome } from "react-icons/sl";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoSchoolOutline } from "react-icons/io5";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
const getLogoUrl = (logo) => {
    if (!logo) {
        return "/image/default-company.png";
    }

    if (logo.startsWith("http")) {
        return logo;
    }

    return `http://localhost:5000${logo}`;
};

function Apply() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resumeOption, setResumeOption] = useState("");
    const [showSuccess, setShowSuccess] = useState(false); // popup แสดงสมัครเสร็จสิ้น
    const [resumeFile, setResumeFile] = useState(null); //เช็คว่าไฟล์ได้ส่งมั้ย
    const [submitting, setSubmitting] = useState(false);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [profileComplete, setProfileComplete] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");
    const [showProfilePopup, setShowProfilePopup] = useState(false);


    const checkProfileComplete = (data) => {

        const requiredFields = [
            data.firstName,
            data.lastName,
            data.birthDate,
            data.gender,
            data.province,
            data.phone,
            data.educationLevel,
            data.university,
            data.faculty,
            data.year
        ];

        return requiredFields.every(
            field => String(field || "").trim() !== ""
        );
    };
    useEffect(() => {

        const fetchJob = async () => {

            try {

                const res = await fetch(
                    `http://localhost:5000/api/job/${id}`
                );

                const data = await res.json();

                if (!res.ok) {

                    alert(
                        data.message ||
                        "ไม่พบประกาศงาน"
                    );

                    navigate("/");
                    return;
                }

                setJob(data);

            } catch (error) {

                console.log(
                    "FETCH JOB ERROR:",
                    error
                );

                alert(
                    "ไม่สามารถโหลดข้อมูลประกาศงานได้"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchJob();

    }, [id, navigate]);
    useEffect(() => {

        const fetchProfile = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setProfileLoading(false);
                alert("กรุณาเข้าสู่ระบบก่อนสมัครงาน");
                navigate("/login");
                return;
            }

            try {

                const res = await fetch(
                    "http://localhost:5000/api/user/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();

                if (!res.ok) {

                    alert(
                        data.message ||
                        "ไม่สามารถโหลดข้อมูลประวัติได้"
                    );

                    return;
                }

                setProfile(data);

                setProfileComplete(
                    checkProfileComplete(data)
                );

            } catch (error) {

                console.log("FETCH PROFILE ERROR:", error);

                alert("ไม่สามารถโหลดข้อมูลประวัติได้");

            } finally {

                setProfileLoading(false);

            }

        };

        fetchProfile();

    }, [navigate]);

    useEffect(() => {
        if (!profileLoading && profile && !profileComplete) {
            setShowProfilePopup(true);
        }
    }, [profileLoading, profile, profileComplete]);

    const [errors, setErrors] = useState({});


    const handleSubmit = async () => {
        if (submitting) return;

        const newErrors = {};

        if (!profileComplete) {
            setShowProfilePopup(true);
            return;
        }

        if (!resumeOption) {
            newErrors.resume = "กรุณาเลือก Resume";
        }

        if (resumeOption === "attach" && !resumeFile) {
            newErrors.resume = "กรุณาแนบ Resume";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setPopupType("error");
            setPopupMessage("กรุณาเข้าสู่ระบบก่อนสมัครงาน");
            setShowPopup(true);
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("jobId", job.id);

            if (resumeOption === "attach" && resumeFile) {
                formData.append("resume", resumeFile);
            }

            const res = await fetch(
                "http://localhost:5000/api/user/applications",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setPopupType("error");
                setPopupMessage(
                    data.message || "สมัครงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
                );
                setShowPopup(true);
                return;
            }

            setPopupType("success");
            setPopupMessage(
                "บริษัทได้รับข้อมูลการสมัครของคุณเรียบร้อยแล้ว และจะติดต่อกลับภายใน 7 วัน"
            );
            setShowPopup(true);

        } catch (error) {
            console.error("APPLY ERROR:", error);

            setPopupType("error");
            setPopupMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
            setShowPopup(true);

        } finally {
            setSubmitting(false);
        }
    };



    if (loading || profileLoading) {
        return (
            <>
                <Navbar />

                <div className="apply-loading">
                    กำลังเตรียมข้อมูลการสมัคร...
                </div>
            </>
        );
    }

    if (!job) {
        return (
            <>
                <Navbar />

                <div className="apply-loading">
                    ไม่พบข้อมูลประกาศงาน
                </div>
            </>
        );
    }


    return (
        <div>
            <Navbar />
            <div className="apply-container">
                {/* ปุ่มย้อนกลับ */}
                <div className="apply-back-container">
                    <button
                        type="button"
                        className="apply-back-button"
                        onClick={() => navigate(`/internship/${job.id}`)}
                    >
                        <FiChevronLeft />
                        กลับไปยังรายละเอียดงาน
                    </button>
                </div>
                {/* ข้อมูลงาน */}

                <div className="job-header">

                    {/* โลโก้บริษัทฝั่งซ้าย */}
                    <img
                        src={getLogoUrl(job.company?.logo)}
                        alt={job.company?.companyName || "บริษัท"}
                        className="job-logo"
                    />

                    {/* ข้อมูลงานตรงกลาง */}
                    <div className="job-info">
                        <h1 className="job-position">
                            {job.title}
                        </h1>

                        <p className="company-name">
                            {job.company?.companyName}
                        </p>

                        <span
                            onClick={() => navigate(`/internship/${job.id}`)}
                            className="detail-link"
                        >
                            ดูรายละเอียดงาน
                            <FiChevronRight />
                        </span>
                    </div>

                    {/* รูปประกอบฝั่งขวาสุด */}
                    <div className="job-image-container">
                        <img
                            src="/image/Apply.png"
                            alt="รูปภาพประกอบประกาศงาน"
                            className="job-banner-image"
                        />
                    </div>

                </div>

                {/* ข้อมูลส่วนตัว */}
                {/* ชื่อ - นามสกุล */}
                <div className="info-box">

                    <div className="section-header">

                        <div className="section-icon">
                            <FiUser />
                        </div>

                        <h2 className="section-title">
                            ข้อมูลผู้สมัคร
                        </h2>

                    </div>

                    <div className="profile-form">

                        {/* ชื่อ - นามสกุล */}
                        <div className="form-row-apply">

                            <div className="form-field">
                                <label>
                                    <FaRegUser />
                                    ชื่อ
                                </label>

                                <input
                                    type="text"
                                    value={profile.firstName || ""}
                                    readOnly
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    <FaRegUser />
                                    นามสกุล
                                </label>

                                <input
                                    type="text"
                                    value={profile.lastName || ""}
                                    readOnly
                                />
                            </div>

                        </div>


                        {/* ที่อยู่ */}
                        <div className="form-field">

                            <label>
                                <SlHome />
                                ที่อยู่ปัจจุบัน
                            </label>

                            <input
                                type="text"
                                value={profile.address || ""}
                                readOnly
                            />

                        </div>


                        {/* เบอร์ - อีเมล */}
                        <div className="form-row-apply">

                            <div className="form-field">
                                <label>
                                    <FiPhone />
                                    หมายเลขโทรศัพท์
                                </label>

                                <input
                                    type="text"
                                    value={profile.phone || ""}
                                    readOnly
                                />
                            </div>

                            <div className="form-field">
                                <label>
                                    <FiMail />
                                    อีเมล
                                </label>

                                <input
                                    type="email"
                                    value={profile.email || ""}
                                    readOnly
                                />
                            </div>

                        </div>
                        {/* มหาวิทยาลัย - สาขา */}
                        <div className="form-row-apply">

                            {/* มหาวิทยาลัย */}
                            <div className="form-field">
                                <label className="form-label-apply">
                                    <IoSchoolOutline />
                                    มหาวิทยาลัย
                                </label>

                                <input
                                    type="text"
                                    value={profile.university || ""}
                                    readOnly
                                />
                            </div>

                            {/* สาขา */}
                            <div className="form-field">
                                <label className="form-label-apply">
                                    <HiOutlineOfficeBuilding />
                                    สาขา
                                </label>

                                <input
                                    type="text"
                                    value={profile.major || profile.faculty || ""}
                                    readOnly
                                />
                            </div>

                        </div>



                        {/* ชั้นปี */}
                        <div className="form-field">

                            <label>
                                <FiCalendar />
                                ชั้นปี
                            </label>

                            <select
                                value={profile.year || ""}
                                disabled
                            >
                                <option value="">
                                    เลือกชั้นปี
                                </option>

                                <option value="ปี 1">
                                    ปี 1
                                </option>

                                <option value="ปี 2">
                                    ปี 2
                                </option>

                                <option value="ปี 3">
                                    ปี 3
                                </option>

                                <option value="ปี 4">
                                    ปี 4
                                </option>
                            </select>

                        </div>

                    </div>

                    <div className="profile-edit-action">
                        <button
                            type="button"
                            className="edit-profile-btn"
                            onClick={() => navigate("/profile/edit")}
                        >
                            แก้ไขประวัติ
                        </button>
                    </div>

                </div>
                {/* Resume */}
                <div className="resume-section">

                    <div className="resume-header">

                        <div className="resume-icon">
                            <FiFileText />
                        </div>

                        <h2 className="resume-title">
                            Resume
                        </h2>

                    </div>

                    <label className="resume-radio">
                        <input
                            type="radio"
                            name="resume"
                            value="attach"
                            checked={resumeOption === "attach"}
                            onClick={() =>
                                setResumeOption(
                                    resumeOption === "attach" ? "" : "attach"
                                )
                            }
                        />
                        แนบ Resume
                    </label>

                    <label
                        className={`upload-box ${resumeOption !== "attach" ? "disabled" : ""
                            }`}
                    >
                        <FiUploadCloud className="upload-icon" />

                        <div className="upload-content">

                            <p className="upload-title">
                                {resumeFile ? resumeFile.name : "อัปโหลดไฟล์"}
                            </p>

                            <p className="upload-note">
                                รองรับไฟล์ประเภท .doc, .docx, .pdf, .rtf
                                <br />
                                (ขนาดไม่เกิน 5 MB)
                            </p>

                        </div>


                        <input
                            type="file"
                            hidden
                            accept=".doc,.docx,.pdf,.rtf"
                            disabled={resumeOption !== "attach"}

                            onChange={(e) => {

                                const file = e.target.files[0];

                                if (!file) return;


                                if (file.size > 5 * 1024 * 1024) {

                                    alert("ไฟล์ต้องมีขนาดไม่เกิน 5 MB");

                                    e.target.value = "";

                                    return;
                                }


                                setResumeFile(file);


                                setErrors({
                                    ...errors,
                                    resume: false,
                                });

                            }}
                        />

                    </label>
                    {/* <p className="upload-note">
                        ระบบรองรับไฟล์ประเภท .doc, .docx, .pdf, .txt และ .rtf
                        (ขนาดไม่เกิน 5 MB)
                    </p> */}
                    {errors.resume && (
                        <p className="error-text-apply">
                            กรุณาแนบ Resume
                        </p>
                    )}

                    <label className="resume-radio">
                        <input
                            type="radio"
                            name="resume"
                            checked={resumeOption === "none"}
                            onClick={() => {
                                setResumeOption(
                                    resumeOption === "none" ? "" : "none"
                                );

                                setErrors({
                                    ...errors,
                                    resume: false,
                                });
                            }}
                        />
                        ไม่แนบ Resume
                    </label>

                </div>

                <div className="submit-container">
                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                    >
                        <FiSend />
                        สมัครงาน
                    </button>
                </div>



                {showPopup && (
                    <div
                        className="company-popup-overlay"
                        onClick={() => setShowPopup(false)}
                    >
                        <div
                            className={`company-popup ${popupType}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="company-popup-close"
                                onClick={() => setShowPopup(false)}
                                aria-label="ปิดหน้าต่าง"
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
                                    ? "สมัครฝึกงานสำเร็จ"
                                    : "ไม่สามารถสมัครฝึกงานได้"}
                            </h3>

                            <p>{popupMessage}</p>

                            <button
                                type="button"
                                className="company-popup-btn"
                                onClick={() => {
                                    setShowPopup(false);

                                    if (popupType === "success") {
                                        navigate("/my-jobs");
                                    }
                                }}
                            >
                                {popupType === "success" ? "ดูงานของฉัน" : "ตกลง"}
                            </button>



                        </div>
                    </div>
                )}
                {showProfilePopup && !profileComplete && (
                    <div
                        className="company-popup-overlay"
                        onClick={() => setShowProfilePopup(false)}
                    >
                        <div
                            className="company-popup error"
                            onClick={(e) => e.stopPropagation()}
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="profile-required-title"
                        >
                            <button
                                type="button"
                                className="company-popup-close"
                                onClick={() => setShowProfilePopup(false)}
                                aria-label="ปิดหน้าต่าง"
                            >
                                <RxCross2 />
                            </button>

                            <div className="company-popup-icon">
                                <IoIosCloseCircle />
                            </div>

                            <h3 id="profile-required-title">
                                กรุณากรอกข้อมูลประวัติก่อนสมัครงาน
                            </h3>

                            <p>
                                ข้อมูลประวัติของคุณยังไม่ครบถ้วน
                                กรุณากรอกข้อมูลสำคัญให้ครบก่อนสมัครงาน
                            </p>

                            <button
                                type="button"
                                className="company-popup-btn"
                                onClick={() => {
                                    setShowProfilePopup(false);
                                    navigate("/profile/edit");
                                }}
                            >
                                ไปกรอกประวัติ
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
}

export default Apply;