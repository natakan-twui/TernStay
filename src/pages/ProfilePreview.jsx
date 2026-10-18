import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    FaUser,
    FaEdit,
    FaEye,
    FaLock,
    FaCog,
    FaCogs
} from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiUser,
    FiBookOpen,
    FiCode,
    FiFolder,
    FiArrowLeft
} from "react-icons/fi";
import { FaBriefcase } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./ProfilePreview.css";


/* =========================================================
   COMPONENT
========================================================= */

function ProfilePreview() {

    const navigate = useNavigate();
    const location = useLocation();


    /* =========================================================
       STATE
    ========================================================= */

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);


    /* =========================================================
       FETCH PROJECTS
    ========================================================= */


    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

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
                console.error("FETCH PROJECTS ERROR:", data);
                return;
            }

            // รองรับกรณี API ส่ง Array โดยตรง
            // หรือส่งข้อมูลใน property projects / data
            const projectList = Array.isArray(data)
                ? data
                : Array.isArray(data.projects)
                    ? data.projects
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

            setProjects(projectList);

            console.log("ผลงานที่ดึงได้:", projectList);

        } catch (error) {
            console.error("FETCH PREVIEW PROJECTS ERROR:", error);
            setProjects([]);
        }
    };



    /* =========================================================
       FETCH PROFILE
    ========================================================= */

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    navigate("/login");
                    return;

                }

                const response = await fetch(
                    "http://localhost:5000/api/user/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.log(data);
                    return;

                }

                setProfile(data);

            } catch (error) {

                console.log(
                    "PROFILE PREVIEW ERROR:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();
        fetchProjects();

    }, [navigate]);


    /* =========================================================
       FORMAT BIRTH DATE
    ========================================================= */

    const formatBirthDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "th-TH",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (

            <>

                <Navbar />

                <div className="profile-preview-page">

                    กำลังโหลดข้อมูล...

                </div>

            </>

        );

    }


    /* =========================================================
       PROFILE NOT FOUND
    ========================================================= */

    if (!profile) {

        return (

            <>

                <Navbar />

                <div className="profile-preview-page">

                    ไม่พบข้อมูลประวัติ

                </div>

            </>

        );

    }


    /* =========================================================
       MAIN PAGE
    ========================================================= */

    return (

        <>

            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                PAGE
            ================================================= */}

            <div className="profile-preview-page">

                <div className="profile-preview-layout">


                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="sidebar-card">

                        {/* โปรไฟล์ */}

                        <button
                            className={
                                location.pathname === "/profile"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                navigate("/profile")
                            }
                        >

                            <FaUser />

                            โปรไฟล์

                        </button>


                        {/* แก้ไขประวัติ */}

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


                        {/* ดูตัวอย่างประวัติ */}

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


                        {/* ตั้งค่าความเป็นส่วนตัว */}

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


                        {/* ตั้งค่าบัญชีผู้ใช้ */}

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


                    {/* =================================================
                        MAIN
                    ================================================= */}

                    <main className="profile-preview-main">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="preview-header">

                            <div>

                                <h1>
                                    ดูตัวอย่างประวัติ
                                </h1>

                                <p>
                                    ตัวอย่างข้อมูลที่นายจ้างจะเห็น
                                </p>

                            </div>


                            {/* ปุ่มแก้ไขข้อมูล */}

                            <button
                                className="preview-edit-btn"
                                onClick={() =>
                                    navigate("/profile/edit")
                                }
                            >

                                <FaEdit />

                                แก้ไขข้อมูล

                            </button>

                        </div>


                        {/* =================================================
                            RESUME PREVIEW GRID
                        ================================================= */}

                        <div className="resume-preview-grid">


                            {/* =================================================
                                CARD 1 : PERSONAL INFORMATION
                            ================================================= */}

                            <section className="resume-card personal-card">


                                {/* รูปโปรไฟล์ */}

                                <div className="profile-photo-wrapper">

                                    <img
                                        src={
                                            profile.profileImage
                                                ? profile.profileImage.startsWith("http")
                                                    ? profile.profileImage
                                                    : `http://localhost:5000${profile.profileImage}`
                                                : "/image/default-profile.png"
                                        }
                                        alt="Profile"
                                        className="profile-photo"
                                    />

                                </div>


                                {/* ชื่อ - นามสกุล */}

                                <h2>

                                    {profile.firstName || "-"}

                                    {" "}

                                    {profile.lastName || ""}

                                </h2>


                                {/* เส้นแบ่ง */}

                                <div className="resume-divider" />


                                {/* ข้อมูลส่วนตัว */}

                                <div className="personal-info-list">


                                    {/* Email */}

                                    <div>

                                        <FiMail />

                                        <span>
                                            {profile.email || "-"}
                                        </span>

                                    </div>


                                    {/* Phone */}

                                    <div>

                                        <FiPhone />

                                        <span>
                                            {profile.phone || "-"}
                                        </span>

                                    </div>


                                    {/* Province */}

                                    <div>

                                        <FiMapPin />

                                        <span>
                                            {profile.province || "-"}
                                        </span>

                                    </div>


                                    {/* Birth Date */}

                                    <div>

                                        <FiCalendar />

                                        <span>

                                            {formatBirthDate(
                                                profile.birthDate
                                            )}

                                        </span>

                                    </div>


                                    {/* Gender */}

                                    <div>

                                        <FiUser />

                                        <span>
                                            {profile.gender || "-"}
                                        </span>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                CARD 2 : RESUME INFORMATION
                            ================================================= */}

                            <section className="resume-card">


                                {/* =================================================
                                    ABOUT ME
                                ================================================= */}

                                <div className="resume-section">

                                    <div className="resume-section-title">

                                        <span className="resume-icon-profile">

                                            <FaRegUser />

                                        </span>

                                        <h2>
                                            เกี่ยวกับฉัน
                                        </h2>

                                    </div>


                                    <p className="about-text-preview">

                                        {profile.nickname
                                            ? `ชื่อเล่น ${profile.nickname}`
                                            : "ยังไม่ได้ระบุข้อมูลเกี่ยวกับตัวเอง"
                                        }

                                    </p>

                                </div>


                                {/* =================================================
                                    SKILLS
                                ================================================= */}

                                <div className="resume-section">

                                    <div className="resume-section-title">

                                        <span className="resume-icon-profile">

                                            <FaCogs />

                                        </span>

                                        <h2>
                                            ทักษะ (Skills)
                                        </h2>

                                    </div>


                                    <div className="skill-list-preview">

                                        {[

                                            profile.skill1,
                                            profile.skill2,
                                            profile.skill3,
                                            profile.skill4,
                                            profile.skill5

                                        ]

                                            .filter(Boolean)

                                            .map(
                                                (skill, index) => (

                                                    <span
                                                        key={index}
                                                        className="skill-tag-preview"
                                                    >

                                                        {skill}

                                                    </span>

                                                )
                                            )
                                        }


                                        {/* ไม่มีข้อมูล Skill */}

                                        {![

                                            profile.skill1,
                                            profile.skill2,
                                            profile.skill3,
                                            profile.skill4,
                                            profile.skill5

                                        ].some(Boolean) && (

                                                <span className="empty-text">

                                                    ยังไม่ได้ระบุทักษะ

                                                </span>

                                            )}

                                    </div>

                                </div>


                                {/* =================================================
                                    EDUCATION
                                ================================================= */}

                                <div className="resume-section">

                                    <div className="resume-section-title">

                                        <span className="resume-icon-profile">

                                            <IoMdSchool />

                                        </span>

                                        <h2>
                                            ประวัติการศึกษา
                                        </h2>

                                    </div>


                                    <div className="education-list">


                                        {/* ระดับการศึกษา */}

                                        <div>

                                            <strong>
                                                ระดับการศึกษา
                                            </strong>

                                            <span>
                                                {profile.educationLevel || "-"}
                                            </span>

                                        </div>


                                        {/* มหาวิทยาลัย */}

                                        <div>

                                            <strong>
                                                มหาวิทยาลัย
                                            </strong>

                                            <span>
                                                {profile.university || "-"}
                                            </span>

                                        </div>


                                        {/* สาขา */}

                                        <div>

                                            <strong>
                                                สาขา
                                            </strong>

                                            <span>
                                                {profile.major || "-"}
                                            </span>

                                        </div>


                                        {/* ชั้นปี */}

                                        <div>

                                            <strong>
                                                ชั้นปี
                                            </strong>

                                            <span>
                                                {profile.year || "-"}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    PROJECTS
                                ================================================= */}


                                {/* PROJECTS */}

                                <div className="resume-section">

                                    <div className="resume-section-title">
                                        <span className="resume-icon-profile">
                                            <FaBriefcase />
                                        </span>

                                        <h2>ผลงาน / โปรเจกต์</h2>
                                    </div>

                                    <div className="project-box">

                                        {projects.length === 0 ? (
                                            <span className="empty-text">
                                                ยังไม่ได้เพิ่มผลงาน
                                            </span>
                                        ) : (
                                            <ul className="project-list">
                                                {projects.map((project) => (
                                                    <li key={project.id}>

                                                        <strong>
                                                            {project.name || "ไม่มีชื่อผลงาน"}
                                                        </strong>

                                                        <p>
                                                            {project.description || "ไม่มีรายละเอียด"}
                                                        </p>

                                                        {/* ไฟล์ผลงาน ถ้า API ส่งข้อมูลไฟล์มา */}
                                                        {project.fileUrl && (
                                                            <a
                                                                href={
                                                                    project.fileUrl.startsWith("http")
                                                                        ? project.fileUrl
                                                                        : `http://localhost:5000${project.fileUrl}`
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                ดูไฟล์ผลงาน
                                                            </a>
                                                        )}

                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                    </div>
                                </div>



                            </section>

                        </div>

                    </main>

                </div>

            </div>

        </>

    );

}

export default ProfilePreview;