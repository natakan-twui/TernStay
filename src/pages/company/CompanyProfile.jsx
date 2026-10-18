import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaYoutube
} from "react-icons/fa";
import {
    FiUser,
    FiEdit,
    FiSettings,
    FiLogOut,
    FiGlobe,
    FiBriefcase,
    FiMapPin,
    FiPhone,
    FiMail,
    FiExternalLink,
    FiPlus,
    FiFacebook,
    FiInstagram,
    FiCamera
} from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import {
    IoBusinessOutline,
    IoLocationOutline
} from "react-icons/io5";
import { ImSphere } from "react-icons/im";
import { PiShareNetwork } from "react-icons/pi";
import { FaRegCircleCheck } from "react-icons/fa6";

import NavbarCompany from "../../components/NavbarCompany";
import "./CompanyProfile.css";

function CompanyProfile() {
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState("profile");
    const [company, setCompany] = useState(null);
    const [socialMedia, setSocialMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");

    useEffect(() => {
        fetchCompanyProfile();
    }, []);

    const fetchCompanyProfile = async () => {
        try {
            const token = localStorage.getItem("companyToken");

            if (!token) {
                navigate("/company/login");
                return;
            }

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
                alert(data.message || "ไม่สามารถโหลดข้อมูลบริษัทได้");
                return;
            }

            setCompany(data);

            setSocialMedia(
                Array.isArray(data.socialMedia)
                    ? data.socialMedia
                    : []
            );

        } catch (error) {
            console.error("GET COMPANY PROFILE ERROR:", error);
            alert("ไม่สามารถเชื่อมต่อ Server ได้");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("companyToken");
        localStorage.removeItem("company");
        navigate("/company/login");
    };

    const getLogoUrl = () => {
        if (!company?.logo) return null;

        return company.logo.startsWith("http")
            ? company.logo
            : `http://localhost:5000${company.logo}`;
    };

    const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
        case "facebook":
            return <FaFacebookF />;

        case "linkedin":
            return <FaLinkedinIn />;

        case "instagram":
            return <FaInstagram />;

        case "youtube":
            return <FaYoutube />;

        default:
            return <FiGlobe />;
    }
};

const getSocialClass = (platform) => {
    switch (platform?.toLowerCase()) {
        case "facebook":
            return "facebook";

        case "linkedin":
            return "linkedin";

        case "instagram":
            return "instagram";

        case "youtube":
            return "youtube";

        default:
            return "other";
    }
};

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
            setPopupType("error");
            setPopupMessage("รองรับเฉพาะไฟล์ JPG และ PNG");
            setShowPopup(true);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setPopupType("error");
            setPopupMessage("ขนาดไฟล์ต้องไม่เกิน 2MB");
            setShowPopup(true);
            return;
        }

        try {
            const token = localStorage.getItem("companyToken");

            const formData = new FormData();
            formData.append("logo", file);

            const res = await fetch(
                "http://localhost:5000/api/company/profile/logo",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setPopupType("error");
                setPopupMessage(
                    data.message || "ไม่สามารถเปลี่ยนโลโก้ได้"
                );
                setShowPopup(true);
                return;
            }

            setCompany((prev) => ({
                ...prev,
                logo: data.logo
            }));

            setPopupType("success");
            setPopupMessage("เปลี่ยนโลโก้บริษัทเรียบร้อยแล้ว");
            setShowPopup(true);

        } catch (error) {
            console.error("UPDATE LOGO ERROR:", error);

            setPopupType("error");
            setPopupMessage("ไม่สามารถอัปโหลดโลโก้ได้");
            setShowPopup(true);
        }
    };

    if (loading) {
        return (

            <>
                <NavbarCompany />

                <div className="company-view-loading">
                    กำลังโหลดข้อมูลบริษัท...
                </div>
            </>
        );
    }

    return (

        <>
            <NavbarCompany />

            <div className="company-view-page">

                {/* ================= Sidebar ================= */}
                <aside className="company-view-sidebar">

                    <div className="company-view-menu">

                        <button
                            className={
                                activeMenu === "profile"
                                    ? "company-view-menu-item active"
                                    : "company-view-menu-item"
                            }
                            onClick={() => {
                                setActiveMenu("profile");
                                navigate("/company/profile");
                            }}
                        >
                            <FiUser />
                            <span>โปรไฟล์บริษัท</span>
                        </button>

                        <button
                            className={
                                activeMenu === "edit"
                                    ? "company-view-menu-item active"
                                    : "company-view-menu-item"
                            }
                            onClick={() => {
                                setActiveMenu("edit");
                                navigate("/company/profile/edit");
                            }}
                        >
                            <FiEdit />
                            <span>แก้ไขข้อมูลบริษัท</span>
                        </button>

                        <button
                            className="company-view-menu-item"
                            onClick={() => navigate("/company/settings")}
                        >
                            <FiSettings />
                            <span>ตั้งค่าบัญชีผู้ใช้</span>
                        </button>

                    </div>

                    <button
                        className="company-view-logout-menu"
                        onClick={handleLogout}
                    >
                        <FiLogOut />
                        <span>ออกจากระบบ</span>
                    </button>

                </aside>


                {/* ================= Content ================= */}
                <main className="company-view-content">

                    {/* กล่อง 1 */}
                    <div className="company-view-title-card">
                        <h1>โปรไฟล์บริษัท</h1>
                        <div className="company-view-breadcrumb">
                            <button onClick={() => navigate("/")}>
                                หน้าหลัก
                            </button>
                            <span>&gt;</span>
                            <span className="current">โปรไฟล์บริษัท</span>
                        </div>
                    </div>


                    {/* กล่อง 2 */}
                    <section className="company-view-card company-view-overview-card">

                        <div className="company-view-overview-logo">
                            <div className="company-view-logo-box">
                                {getLogoUrl() ? (
                                    <img
                                        src={getLogoUrl()}
                                        alt="Company Logo"
                                    />
                                ) : (
                                    <FiGlobe />
                                )}
                            </div>

                            <label className="company-view-change-logo-btn">
                                <FiCamera />
                                เปลี่ยนโลโก้

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    onChange={handleLogoChange}
                                    hidden
                                />
                            </label>
                        </div>


                        <div className="company-view-overview-info">
                            <div className="company-view-overview-header">
                                <div className="company-view-overview-title">
                                    <h2>{company?.companyName || "-"}</h2>
                                </div>

                                <button
                                    className="company-view-edit-btn"
                                    onClick={() => navigate("/company/profile/edit")}
                                >
                                    แก้ไขข้อมูลบริษัท
                                </button>
                            </div>

                            <div className="company-overview-details">
                                <p>
                                    {company?.description || "ยังไม่มีรายละเอียดบริษัท"}
                                </p>
                            </div>

                            <div className="company-view-overview-meta">
                                <span className="company-view-business-badge">
                                    <FiBriefcase />
                                    <span>
                                        {company?.businessType || "ไม่ระบุประเภทธุรกิจ"}
                                    </span>
                                </span>
                            </div>
                        </div>


                    </section>

                    {/* กล่อง 3 - 7 */}
                    <div className="company-view-grid">

                        {/* กล่อง 3 */}

                        <section className="company-view-card company-view-info-card">
                            <h2>
                                <IoBusinessOutline />
                                ข้อมูลบริษัท
                            </h2>

                            <div className="company-view-data-item">
                                <span>ชื่อบริษัท</span>
                                <p>
                                    {company?.companyName || "-"}
                                </p>
                            </div>

                            <div className="company-view-data-item">
                                <span>รายละเอียดบริษัท</span>
                                <p>
                                    {company?.description || "-"}
                                </p>
                            </div>

                            <div className="company-view-data-item">
                                <span>ประเภทธุรกิจ</span>
                                <p>
                                    {company?.businessType || "-"}
                                </p>
                            </div>
                        </section>



                        {/* กล่อง 5 */}
                        <section className="company-view-card company-view-contact-card">

                            <h2>
                                <FiUser />
                                ข้อมูลผู้ติดต่อ
                            </h2>

                            <div className="company-view-data-item">
                                <span>ชื่อผู้ติดต่อ</span>
                                <p>
                                    {company?.contactName || "-"}
                                </p>
                            </div>

                            <div className="company-view-data-item">
                                <span>ตำแหน่ง</span>
                                <p>
                                    {company?.contactPosition || "-"}
                                </p>
                            </div>

                            <div className="company-view-data-item">
                                <span>เบอร์โทรศัพท์</span>
                                <p>
                                    {company?.phone || "-"}
                                </p>
                            </div>

                            <div className="company-view-data-item">
                                <span>Email</span>
                                <p>
                                    {company?.contactEmail || "-"}
                                </p>
                            </div>

                        </section>


                        {/* กล่อง 4 */}
                        <section className="company-view-card company-view-website-card">

                            <h2>
                                <ImSphere />
                                Website
                            </h2>

                            {company?.website ? (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="company-view-website-link"
                                >
                                    {/* <FiGlobe /> */}
                                    <span>{company.website}</span>
                                    <FiExternalLink />
                                </a>
                            ) : (
                                <div className="company-view-empty-data">
                                    ยังไม่ได้เพิ่มเว็บไซต์
                                </div>
                            )}

                        </section>


                        {/* กล่อง 6 */}
                        <section className="company-view-card company-view-address-card">

                            <h2>
                                <IoLocationOutline />
                                ที่อยู่บริษัท
                            </h2>


                            <div className="company-view-address-content">

                                <span>ที่อยู่</span>

                                <p>
                                    {company?.address ||
                                        "ยังไม่ได้เพิ่มที่อยู่บริษัท"}
                                </p>

                            </div>

                        </section>


                        {/* กล่อง 7 */}
                        <section className="company-view-card company-view-social-card">

    <div className="company-view-social-header">
        <h2>
            <PiShareNetwork />
            Social Media
        </h2>
    </div>

    <div className="company-view-social-icons">

        {socialMedia
            .filter((item) => item.url?.trim())
            .map((item, index) => (
                <a
                    key={`${item.platform}-${index}`}
                    href={item.url.startsWith("http")
                        ? item.url
                        : `https://${item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-view-social-icon-item"
                >
                    <div
                        className={`company-view-social-circle ${getSocialClass(item.platform)}`}
                    >
                        {getSocialIcon(item.platform)}
                    </div>

                    <span>{item.platform}</span>
                </a>
            ))}

        <button
            type="button"
            className="company-view-social-icon-item company-view-social-add"
            onClick={() => navigate("/company/profile/edit")}
        >
            <div className="company-view-social-circle add">
                <FiPlus />
            </div>

            <span>เพิ่มช่องทาง</span>
        </button>

    </div>

</section>

                    </div>

                </main>

            </div>

            {
                showPopup && (
                    <div className="company-popup-overlay">
                        <div className="company-popup">

                            <button
                                className="company-popup-close"
                                onClick={() => setShowPopup(false)}
                            >
                                <RxCross2 />
                            </button>

                            <div
                                className={`company-popup-icon ${popupType === "success"
                                    ? "success"
                                    : "error"
                                    }`}
                            >
                                {popupType === "success" ? <FaRegCircleCheck /> : "!"}
                            </div>

                            <h3>
                                {popupType === "success"
                                    ? "ดำเนินการสำเร็จ"
                                    : "ไม่สามารถดำเนินการได้"}
                            </h3>

                            <p>{popupMessage}</p>

                            <button
                                className="company-popup-btn"
                                onClick={() => setShowPopup(false)}
                            >
                                ตกลง
                            </button>

                        </div>
                    </div>
                )
            }
        </>
    );
}

export default CompanyProfile;