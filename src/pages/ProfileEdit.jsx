import "./ProfileEdit.css";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FaUser,
    FaEdit,
    FaEye,
    FaLock,
    FaCog,
    FaBookOpen
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { useState, useEffect } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";

function ProfileEdit() {

    const navigate = useNavigate();
    const location = useLocation();
    const [saving, setSaving] = useState(false);
    const [activeMenu, setActiveMenu] = useState("personal");

    const [projects, setProjects] = useState([]);

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectFiles, setProjectFiles] = useState([]);

    // เช็คว่ากดปุ่มบันทึกยัง
    const [isChanged, setIsChanged] = useState(false);

    // =========================
    // POPUP
    // =========================
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupAction, setPopupAction] = useState(null);

    const openPopup = (type, title, message, action = null) => {
        setPopupType(type);
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupAction(() => action);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupAction(null);
    };

    const handlePopupConfirm = () => {
        const action = popupAction;
        closePopup();

        if (action) {
            action();
        }
    };



    const handleProjectFilesChange = (e) => {
        const files = Array.from(e.target.files || []);

        if (files.length > 5) {
            openPopup(
                "error",
                "แนบไฟล์เกินจำนวนที่กำหนด",
                "คุณสามารถแนบไฟล์ผลงานได้สูงสุด 5 ไฟล์"
            );
            e.target.value = "";
            return;
        }

        const allowedExtensions = [
            ".pdf", ".png", ".jpg", ".jpeg", ".zip"
        ];

        for (const file of files) {
            const ext = "." + file.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(ext)) {
                openPopup(
                    "error",
                    "ไม่รองรับไฟล์นี้",
                    `ไฟล์ ${file.name} ไม่รองรับ กรุณาเลือก PDF, PNG, JPG หรือ ZIP`
                );
                e.target.value = "";
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                openPopup(
                    "error",
                    "ไฟล์มีขนาดใหญ่เกินไป",
                    `ไฟล์ ${file.name} มีขนาดเกิน 10MB`
                );
                e.target.value = "";
                return;
            }
        }

        setProjectFiles(files);
        setIsChanged(true);
    };





    const fetchProjects = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/user/projects",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                console.error(data);
                return;

            }

            setProjects(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "FETCH PROJECTS ERROR:",
                error
            );

        }

    };

    // ปุ่มข้อมูล
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",

        nickname: "",
        gender: "",
        birthDate: "",

        phone: "",
        address: "",
        province: "",
        email: "",

        educationLevel: "",
        university: "",
        faculty: "",
        major: "",
        year: "",

        skill1: "",
        skill2: "",
        skill3: "",
        skill4: "",
        skill5: ""
    });

    // ปุ่มเลือกเพศ
    // const [gender, setGender] = useState("");


    // ปุ่มวันเกิด
    // const [birthDate, setBirthDate] = useState({
    //     day: "",
    //     month: "",
    //     year: ""
    // });

    const provinces = [
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
        "พะเยา",
        "พังงา",
        "พัทลุง",
        "พิจิตร",
        "พิษณุโลก",
        "ภูเก็ต",
        "มหาสารคาม",
        "มุกดาหาร",
        "ยะลา",
        "ยโสธร",
        "ร้อยเอ็ด",
        "ระนอง",
        "ระยอง",
        "ราชบุรี",
        "ลพบุรี",
        "ลำปาง",
        "ลำพูน",
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
        "สุพรรณบุรี",
        "สุราษฎร์ธานี",
        "สุรินทร์",
        "สุโขทัย",
        "หนองคาย",
        "หนองบัวลำภู",
        "อ่างทอง",
        "อำนาจเจริญ",
        "อุดรธานี",
        "อุตรดิตถ์",
        "อุทัยธานี",
        "อุบลราชธานี",
        "เชียงราย",
        "เพชรบุรี",
        "เพชรบูรณ์",
        "เลย",
        "แพร่",
        "แม่ฮ่องสอน"
    ];

    // const [education, setEducation] = useState({
    //     level: "",
    //     university: "",
    //     faculty: "",
    //     major: "",
    //     year: "",
    //     gpa: ""
    // });

    const calculateProfilePercent = (data) => {

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

        const filledFields = requiredFields.filter(
            field => String(field || "").trim() !== ""
        ).length;

        return Math.round(
            (filledFields / requiredFields.length) * 100
        );
    };

    const isProfileComplete = (data) => {

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

    const [profilePercent, setProfilePercent] = useState(0);
    const [profileComplete, setProfileComplete] = useState(false);

    useEffect(() => {

        fetchProfile();
        fetchProjects();

    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(
                "http://localhost:5000/api/user/profile",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            console.log("PROFILE FROM BACKEND:", data);

            if (!res.ok) {
                openPopup(
                    "error",
                    "โหลดข้อมูลไม่สำเร็จ",
                    data.message || "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้"
                );
                return;
            }

            const user = data.user || data;

            setFormData({
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                nickname: user.nickname ?? "",
                gender: user.gender ?? "",
                birthDate: user.birthDate
                    ? String(user.birthDate).split("T")[0]
                    : "",
                phone: user.phone ?? "",
                address: user.address ?? "",
                province: user.province ?? "",
                email: user.email ?? "",
                educationLevel: user.educationLevel ?? "",
                university: user.university ?? "",
                faculty: user.faculty ?? "",
                major: user.major ?? "",
                year: user.year ?? "",
                skill1: user.skill1 ?? "",
                skill2: user.skill2 ?? "",
                skill3: user.skill3 ?? "",
                skill4: user.skill4 ?? "",
                skill5: user.skill5 ?? ""
            });

            setProfilePercent(calculateProfilePercent(user));
            setProfileComplete(isProfileComplete(user));

        } catch (err) {
            console.error("FETCH PROFILE ERROR:", err);
        }
    };

    // บันทึก
    const handleSave = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setSaving(true);

            const res = await fetch(
                "http://localhost:5000/api/user/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        birthDate: formData.birthDate
                            ? new Date(formData.birthDate)
                            : null
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                openPopup(
                    "error",
                    "บันทึกข้อมูลไม่สำเร็จ",
                    data.message || "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง"
                );
                return;
            }

            // อัปเดตข้อมูลที่ได้รับกลับมาจาก Backend
            if (data.user) {
                setFormData({
                    firstName: data.user.firstName || "",
                    lastName: data.user.lastName || "",
                    nickname: data.user.nickname || "",
                    gender: data.user.gender || "",
                    birthDate: data.user.birthDate
                        ? data.user.birthDate.split("T")[0]
                        : "",
                    phone: data.user.phone || "",
                    address: data.user.address || "",
                    province: data.user.province || "",
                    email: data.user.email || "",
                    educationLevel: data.user.educationLevel || "",
                    university: data.user.university || "",
                    faculty: data.user.faculty || "",
                    major: data.user.major || "",
                    year: data.user.year || "",
                    skill1: data.user.skill1 || "",
                    skill2: data.user.skill2 || "",
                    skill3: data.user.skill3 || "",
                    skill4: data.user.skill4 || "",
                    skill5: data.user.skill5 || ""
                });
            }

            // คำนวณความสมบูรณ์ใหม่
            const savedData = data.user || formData;

            setProfilePercent(
                calculateProfilePercent(savedData)
            );

            setProfileComplete(
                isProfileComplete(savedData)
            );

            // บันทึกสำเร็จแล้ว ไม่มีข้อมูลค้าง
            setIsChanged(false);

            openPopup(
                "success",
                "บันทึกข้อมูลสำเร็จ",
                data.message || "บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว"
            );

        } catch (err) {
            console.error("SAVE PROFILE ERROR:", err);
            openPopup(
                "error",
                "เกิดข้อผิดพลาด",
                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
            );
        } finally {
            setSaving(false);
        }
    };


    const handleChangeMenu = (menu) => {
        if (menu === activeMenu) {
            return;
        }

        if (isChanged) {
            openPopup(
                "confirm",
                "มีข้อมูลที่ยังไม่ได้บันทึก",
                "คุณต้องการออกจากหมวดนี้โดยไม่บันทึกข้อมูลหรือไม่?",
                () => {
                    setActiveMenu(menu);
                    setIsChanged(false);
                    setProjectName("");
                    setProjectDescription("");
                    setProjectFiles([]);

                    const fileInput = document.getElementById(
                        "project-file-input"
                    );

                    if (fileInput) {
                        fileInput.value = "";
                    }
                }
            );

            return;
        }

        setActiveMenu(menu);
    };


    // ลบผลงาน

    const handleDeleteProject = async (projectId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        openPopup(
            "confirm",
            "ยืนยันการลบผลงาน?",
            "คุณต้องการลบผลงานนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้",
            async () => {
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/user/projects/${projectId}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        openPopup(
                            "error",
                            "ลบผลงานไม่สำเร็จ",
                            data.message || "ไม่สามารถลบผลงานได้"
                        );
                        return;
                    }

                    setProjects((prev) =>
                        prev.filter((project) => project.id !== projectId)
                    );

                    openPopup(
                        "success",
                        "ลบผลงานสำเร็จ",
                        "ลบผลงานออกจากประวัติของคุณเรียบร้อยแล้ว"
                    );
                } catch (error) {
                    console.error("DELETE PROJECT ERROR:", error);

                    openPopup(
                        "error",
                        "เกิดข้อผิดพลาด",
                        "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
                    );
                }
            }
        );
    };


    const handleAddProject = async () => {
        if (!projectName.trim()) {
            openPopup(
                "error",
                "กรุณากรอกชื่อผลงาน",
                "โปรดระบุชื่อผลงานก่อนเพิ่มข้อมูล"
            );
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", projectName.trim());
            formData.append("description", projectDescription);

            projectFiles.forEach((file) => {
                formData.append("files", file);
            });

            const response = await fetch(
                "http://localhost:5000/api/user/projects",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                openPopup(
                    "error",
                    "เพิ่มผลงานไม่สำเร็จ",
                    data.message || "ไม่สามารถเพิ่มผลงานได้"
                );
                return;
            }

            if (data.project) {
                setProjects((prev) => [
                    data.project,
                    ...prev
                ]);
            }

            setProjectName("");
            setProjectDescription("");
            setProjectFiles([]);

            const fileInput = document.getElementById(
                "project-file-input"
            );

            if (fileInput) {
                fileInput.value = "";
            }

            setIsChanged(false);

            openPopup(
                "success",
                "เพิ่มผลงานสำเร็จ",
                "เพิ่มผลงานลงในประวัติของคุณเรียบร้อยแล้ว"
            );

        } catch (error) {
            console.error("ADD PROJECT ERROR:", error);

            openPopup(
                "error",
                "เกิดข้อผิดพลาด",
                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
            );
        }
    };

    return (

        <div>

            <Navbar />

            <div className="profile-edit-layout">

                {/* กล่อง 1 ซ้าย */}
                <aside className="profile-edit-sidebar">

                    <button
                        className={
                            location.pathname === "/profile"
                                ? "active"
                                : ""
                        }
                        onClick={() => navigate("/profile")}
                    >
                        <FaUser />
                        โปรไฟล์
                    </button>


                    <button
                        className={
                            location.pathname === "/profile/edit"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate("/profile/edit")
                        }
                    >
                        <FaEdit />
                        แก้ไขประวัติ
                    </button>


                    <button
                        className={
                            location.pathname === "/profile/preview"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate("/profile/preview")
                        }
                    >
                        <FaEye />
                        ดูตัวอย่างประวัติ
                    </button>


                    <button
                        className={
                            location.pathname === "/profile/privacy"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate("/profile/privacy")
                        }
                    >
                        <FaLock />
                        ตั้งค่าความเป็นส่วนตัว
                    </button>


                    <button
                        className={
                            location.pathname === "/profile/settings"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate("/profile/settings")
                        }
                    >
                        <FaCog />
                        ตั้งค่าบัญชีผู้ใช้
                    </button>

                </aside>

                {/* กล่อง 2 กลาง */}
                <div className="middle-area">
                    {/* Progress */}

                    <div className="progress-content">

                        {/* ส่วนบน */}
                        <div className="progress-top">

                            <div
                                className="percent-circle"
                                style={{
                                    background: `conic-gradient(
                                        #F76F3A ${profilePercent}%,
                                        rgba(255,255,255,.25) ${profilePercent}%
                                    )`
                                }}
                            >
                                <div className="percent-inner">
                                    {profilePercent}%
                                </div>
                            </div>

                            <div>

                                <h2>
                                    ความสมบูรณ์ของประวัติ
                                </h2>

                                <p>
                                    {profileComplete ? (
                                        <>
                                            <span className="highlight-text">ข้อมูล</span>
                                            พร้อมสำหรับสมัครงาน
                                        </>
                                    ) : (
                                        <>
                                            <span className="highlight-text">ข้อมูล</span>
                                            ยังไม่ครบสำหรับการสมัครงาน
                                        </>
                                    )}
                                </p>

                            </div>

                        </div>

                        {/* ส่วนล่าง */}
                        {/* <div className="progress-bottom">

                            <button>
                                อัปเกรดประวัติ
                            </button>

                            <small>
                                *จำเป็นต่อการสมัครงาน
                            </small>

                        </div> */}

                    </div>

                    {/* เลือกหมวด */}
                    <div className="category-card">

                        <div
                            className={`category-item ${activeMenu === "personal" ? "active" : ""
                                }`}
                            onClick={() => handleChangeMenu("personal")}
                        >
                            ข้อมูลส่วนบุคคล
                            <span className="required">*</span>
                        </div>

                        <div
                            className={`category-item ${activeMenu === "education" ? "active" : ""
                                }`}
                            onClick={() => handleChangeMenu("education")}
                        >
                            ประวัติการศึกษา
                            <span className="required">*</span>
                        </div>

                        <div
                            className={`category-item ${activeMenu === "skill" ? "active" : ""
                                }`}
                            onClick={() => handleChangeMenu("skill")}
                        >
                            ทักษะ
                        </div>

                        <div
                            className={`category-item ${activeMenu === "project" ? "active" : ""
                                }`}
                            onClick={() => handleChangeMenu("project")}
                        >
                            ผลงาน
                        </div>

                    </div>
                </div>

                {/* กล่อง 3 ขวา */}
                <div className="form-card">

                    {
                        // ข้อมูลส่วนบุคคล
                        activeMenu === "personal" &&
                        <>

                            <div className="form-title">

                                <FaUser />

                                <h2>
                                    ข้อมูลส่วนบุคคล
                                </h2>

                            </div>

                            {/* ชื่อ */}
                            <label>
                                ชื่อ <span className="required">*</span>
                            </label>
                            <input
                                placeholder="ระบุ"
                                value={formData.firstName}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        firstName: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            {/* นามสกุล */}
                            <label>
                                นามสกุล <span className="required">*</span>
                            </label>
                            <input
                                placeholder="ระบุ"
                                value={formData.lastName}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        lastName: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            <label>
                                ชื่อเล่น
                            </label>
                            <input
                                placeholder="ระบุ"
                                value={formData.nickname}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        nickname: e.target.value
                                    });

                                    setIsChanged(true);

                                }}

                            />

                            {/* <label>
                                วันเกิด <span className="required">*</span>
                            </label>

                            <div className="birth-group">

                                <select
                                    value={birthDate.day}
                                    onChange={(e) => setBirthDate({
                                        ...birthDate,
                                        day: e.target.value
                                    })}
                                >

                                    <option value="">
                                        วัน
                                    </option>

                                    {
                                        Array.from({ length: 31 }, (_, i) => (
                                            <option key={i}>
                                                {i + 1}
                                            </option>
                                        ))
                                    }

                                </select>

                                <select
                                    value={birthDate.month}
                                    onChange={(e) => setBirthDate({
                                        ...birthDate,
                                        month: e.target.value
                                    })}
                                >

                                    <option value="">
                                        เดือน
                                    </option>

                                    {
                                        [
                                            "มกราคม",
                                            "กุมภาพันธ์",
                                            "มีนาคม",
                                            "เมษายน",
                                            "พฤษภาคม",
                                            "มิถุนายน",
                                            "กรกฎาคม",
                                            "สิงหาคม",
                                            "กันยายน",
                                            "ตุลาคม",
                                            "พฤศจิกายน",
                                            "ธันวาคม"
                                        ].map((month, index) => (
                                            <option key={index}>
                                                {month}
                                            </option>
                                        ))
                                    }

                                </select>

                                <select
                                    value={birthDate.year}
                                    onChange={(e) => setBirthDate({
                                        ...birthDate,
                                        year: e.target.value
                                    })}
                                >

                                    <option value="">
                                        ปี
                                    </option>

                                    {
                                        Array.from(
                                            { length: 60 },
                                            (_, i) => 2568 - i
                                        ).map((year) => (
                                            <option key={year}>
                                                {year}
                                            </option>
                                        ))
                                    }

                                </select>

                            </div> */}
                            <label>
                                วันเกิด <span className="required">*</span>
                            </label>

                            <input
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        birthDate: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            <label>
                                เพศ <span className="required">*</span>
                            </label>

                            <div className="gender-group">

                                <button
                                    type="button"
                                    className={
                                        formData.gender === "ชาย"
                                            ? "gender-button active"
                                            : "gender-button"
                                    }
                                    onClick={() => {

                                        setFormData({
                                            ...formData,
                                            gender: "ชาย"
                                        });

                                        setIsChanged(true);

                                    }}
                                >
                                    ชาย
                                </button>

                                <button
                                    type="button"
                                    className={
                                        formData.gender === "หญิง"
                                            ? "gender-button active"
                                            : "gender-button"
                                    }
                                    onClick={() => {

                                        setFormData({
                                            ...formData,
                                            gender: "หญิง"
                                        });

                                        setIsChanged(true);

                                    }}
                                >
                                    หญิง
                                </button>

                            </div>

                            <label>
                                จังหวัด <span className="required">*</span>
                            </label>

                            <select
                                value={formData.province}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        province: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            >

                                <option value="">
                                    เลือกจังหวัด
                                </option>

                                {
                                    provinces.map((province, index) => (
                                        <option
                                            key={index}
                                            value={province}
                                        >
                                            {province}
                                        </option>
                                    ))
                                }

                            </select>

                            <label>
                                ที่อยู่ปัจจุบัน
                            </label>

                            <textarea
                                placeholder="ระบุ"
                                value={formData.address}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        address: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            <label>
                                เบอร์โทรศัพท์ <span className="required">*</span>
                            </label>
                            <input
                                placeholder="ระบุ"
                                value={formData.phone}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        phone: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            <label>
                                Line ID
                            </label>

                            <input
                                placeholder="ระบุ"
                            />

                        </>
                    }

                    {
                        activeMenu === "education" &&
                        <>

                            <div className="form-title">

                                <FaBookOpen />

                                <h2>
                                    ประวัติการศึกษา
                                </h2>

                            </div>

                            <label>
                                ระดับการศึกษา <span className="required">*</span>
                            </label>

                            <select
                                value={formData.educationLevel}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        educationLevel: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            >
                                <option value="">
                                    เลือกระดับการศึกษา
                                </option>

                                <option value="ปริญญาตรี">
                                    ปริญญาตรี
                                </option>

                                <option value="ปริญญาโท">
                                    ปริญญาโท
                                </option>

                                <option value="ปริญญาเอก">
                                    ปริญญาเอก
                                </option>

                            </select>

                            <label>
                                มหาวิทยาลัย <span className="required">*</span>
                            </label>

                            <select
                                value={formData.university}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        university: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            >

                                <option value="">
                                    เลือกมหาวิทยาลัย
                                </option>

                                <option value="มหาวิทยาลัยเกษตรศาสตร์">
                                    มหาวิทยาลัยเกษตรศาสตร์
                                </option>

                                <option value="มหาวิทยาลัยเชียงใหม่">
                                    มหาวิทยาลัยเชียงใหม่
                                </option>

                                <option value="มหาวิทยาลัยขอนแก่น">
                                    มหาวิทยาลัยขอนแก่น
                                </option>

                                <option>
                                    อื่น ๆ
                                </option>

                            </select>

                            <label >
                                คณะ <span className="required">*</span>
                            </label>

                            <input
                                value={formData.faculty}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        faculty: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                                placeholder="เช่น วิศวกรรมศาสตร์"
                            />

                            <label>
                                สาขา
                            </label>

                            <input
                                value={formData.major}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        major: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                                placeholder="เช่น วิทยาการคอมพิวเตอร์"
                            />

                            <label>
                                ชั้นปี <span className="required">*</span>
                            </label>

                            <select
                                value={formData.year}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        year: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
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

                            <label>
                                เกรดเฉลี่ย (GPA)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                placeholder="เช่น 3.50"
                            />

                        </>
                    }

                    {
                        activeMenu === "skill" &&
                        <>

                            <h2>
                                ทักษะ
                            </h2>

                            <label>
                                ทักษะที่ 1
                            </label>
                            <input
                                placeholder="เช่น React"
                                value={formData.skill1}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        skill1: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            <label>
                                ทักษะที่ 2
                            </label>
                            <input
                                placeholder="เช่น JavaScript"
                                value={formData.skill2}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        skill2: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            <label>
                                ทักษะที่ 3
                            </label>
                            <input
                                placeholder="เช่น Figma"
                                value={formData.skill3}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        skill3: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            <label>
                                ทักษะที่ 4
                            </label>
                            <input
                                placeholder="เช่น Git"
                                value={formData.skill4}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        skill4: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                            <label>
                                ทักษะที่ 5
                            </label>
                            <input
                                placeholder="เช่น SQL"
                                value={formData.skill5}
                                onChange={(e) => {

                                    setFormData({
                                        ...formData,
                                        skill5: e.target.value
                                    });

                                    setIsChanged(true);

                                }}
                            />

                        </>
                    }

                    {
                        activeMenu === "project" &&
                        <>
                            <div className="form-title">
                                <FaBookOpen />
                                <div>
                                    <h2>ผลงาน</h2>
                                    <p>เพิ่มผลงานที่ต้องการแสดงในประวัติของคุณ</p>
                                </div>
                            </div>

                            {/* =========================
                                Add Project
                            ========================= */}
                            <div className="project-form-section">

                                {/* <div className="project-section-header">
                                    <div>
                                        <h3>เพิ่มผลงานใหม่</h3>
                                        <p>
                                            แนะนำให้เพิ่มผลงานที่เกี่ยวข้องกับสายงานที่คุณสนใจ
                                        </p>
                                    </div>
                                </div> */}

                                <label>
                                    ชื่อผลงาน
                                </label>

                                <input
                                    placeholder="เช่น TernStay ระบบค้นหาที่พักและงานฝึกงาน"
                                    value={projectName}
                                    onChange={(e) => {
                                        setProjectName(e.target.value);
                                        setIsChanged(true);
                                    }}
                                />

                                <label>
                                    รายละเอียดผลงาน
                                </label>

                                <textarea
                                    className="project-description-input"
                                    placeholder="อธิบายรายละเอียดผลงาน เช่น หน้าที่ที่รับผิดชอบ เทคโนโลยีที่ใช้ หรือสิ่งที่ได้เรียนรู้"
                                    value={projectDescription}
                                    onChange={(e) => {
                                        setProjectDescription(e.target.value);
                                        setIsChanged(true);
                                    }}
                                />

                                <label>
                                    ไฟล์ผลงาน
                                    <span className="project-label-hint">
                                        สูงสุด 5 ไฟล์ / ไฟล์ละไม่เกิน 10MB
                                    </span>
                                </label>

                                <label
                                    htmlFor="project-file-input"
                                    className="project-upload-box"
                                >
                                    <div className="project-upload-icon">
                                        <FiFileText />
                                    </div>

                                    <div className="project-upload-content">
                                        <strong>
                                            คลิกเพื่อเลือกไฟล์ผลงาน
                                        </strong>

                                        <span>
                                            PDF, PNG, JPG หรือ ZIP
                                        </span>
                                    </div>

                                    <input
                                        id="project-file-input"
                                        type="file"
                                        multiple
                                        accept=".pdf,.png,.jpg,.jpeg,.zip"
                                        onChange={handleProjectFilesChange}
                                    />
                                </label>


                                {projectFiles.length > 0 && (

                                    <div className="selected-project-files">

                                        <div className="selected-files-header">
                                            <span>
                                                ไฟล์ที่เลือก
                                            </span>

                                            <small>
                                                {projectFiles.length}/5
                                            </small>
                                        </div>

                                        <div className="selected-files-list">

                                            {projectFiles.map((file, index) => (

                                                <div
                                                    key={index}
                                                    className="selected-file-item"
                                                >

                                                    <div className="selected-file-info">

                                                        <div className="selected-file-icon">
                                                            📄
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {file.name}
                                                            </strong>

                                                            <span>
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </span>
                                                        </div>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="remove-file-btn"
                                                        onClick={() => {

                                                            setProjectFiles(prev =>
                                                                prev.filter(
                                                                    (_, i) => i !== index
                                                                )
                                                            );

                                                            setIsChanged(true);

                                                        }}
                                                    >
                                                        ×
                                                    </button>

                                                </div>

                                            ))}

                                        </div>

                                    </div>
                                )}


                                <button
                                    type="button"
                                    className="add-project-btn"
                                    onClick={handleAddProject}
                                >
                                    <span>＋</span>
                                    เพิ่มผลงาน
                                </button>

                            </div>


                            {/* =========================
            Project List
        ========================= */}
                            <div className="project-list">

                                <div className="project-list-header">

                                    <div>
                                        <h3>
                                            ผลงานของฉัน
                                        </h3>

                                        <p>
                                            ผลงานที่แสดงในประวัติของคุณ
                                        </p>
                                    </div>

                                    <span className="project-count">
                                        {projects.length} ผลงาน
                                    </span>

                                </div>


                                {projects.length === 0 ? (

                                    <div className="project-empty">

                                        <div className="project-empty-icon">
                                            📁
                                        </div>

                                        <h4>
                                            ยังไม่มีผลงาน
                                        </h4>

                                        <p>
                                            เพิ่มผลงานของคุณเพื่อให้บริษัทเห็นความสามารถมากขึ้น
                                        </p>

                                    </div>

                                ) : (

                                    <div className="project-items">

                                        {projects.map((project) => (

                                            <div
                                                className="project-item"
                                                key={project.id}
                                            >

                                                <div className="project-item-icon">
                                                    📁
                                                </div>

                                                <div className="project-item-content">

                                                    <div className="project-item-top">

                                                        <h3>
                                                            {project.name}
                                                        </h3>

                                                        <button
                                                            type="button"
                                                            className="delete-project-btn"
                                                            onClick={() =>
                                                                handleDeleteProject(project.id)
                                                            }
                                                            title="ลบผลงาน"
                                                        >
                                                            ×
                                                        </button>

                                                    </div>

                                                    <p className="project-item-description">
                                                        {project.description || "ไม่มีรายละเอียดผลงาน"}
                                                    </p>


                                                    {project.files?.length > 0 && (

                                                        <div className="project-file-list">

                                                            {project.files.map((file) => (

                                                                <a
                                                                    key={file.id}
                                                                    href={`http://localhost:5000${file.filePath}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="project-file-link"
                                                                >
                                                                    <span>📎</span>
                                                                    {file.originalName}
                                                                </a>

                                                            ))}

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </>
                    }
                    <button
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                    </button>
                </div>

            </div>

            {/* POPUP */}
            {showPopup && (
                <div
                    className="profile-edit-popup-overlay"
                    onClick={closePopup}
                >
                    <div
                        className={`profile-edit-popup ${popupType}`}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="profile-edit-popup-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="profile-edit-popup-close"
                            onClick={closePopup}
                            aria-label="ปิด"
                        >
                            <RxCross2 />
                        </button>

                        <div className="profile-edit-popup-icon">
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                <IoIosCloseCircle />
                            )}
                        </div>

                        <h3 id="profile-edit-popup-title">
                            {popupTitle}
                        </h3>

                        <p>{popupMessage}</p>

                        {popupType === "confirm" ? (
                            <div className="profile-edit-popup-actions">
                                <button
                                    type="button"
                                    className="profile-edit-popup-cancel"
                                    onClick={closePopup}
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    type="button"
                                    className="profile-edit-popup-confirm"
                                    onClick={handlePopupConfirm}
                                >
                                    ยืนยัน
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="profile-edit-popup-btn"
                                onClick={closePopup}
                            >
                                ตกลง
                            </button>
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}

export default ProfileEdit;