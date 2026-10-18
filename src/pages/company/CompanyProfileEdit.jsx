import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiUser,
    FiEdit,
    FiSettings,
    FiLogOut,
    FiCamera,
    FiPlus,
    FiTrash2,
    FiSave,
    FiGlobe,
    FiX,
    FiHome,
    FiChevronDown
} from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import NavbarCompany from "../../components/NavbarCompany";
import "./CompanyProfileEdit.css";
import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";

function CompanyProfileEdit() {
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState("edit");

    const [company, setCompany] = useState({
        companyName: "",
        businessType: "",
        description: "",
        contactName: "",
        contactPosition: "",
        phone: "",
        contactEmail: "",
        address: "",
        website: "",
        logo: ""
    });

    const [socialMedia, setSocialMedia] = useState([]);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("success");
    const [popupMessage, setPopupMessage] = useState("");

    const socialMediaToSave = [
        { platform: "Facebook", url: company.facebook || "" },
        { platform: "LinkedIn", url: company.linkedin || "" },
        { platform: "Instagram", url: company.instagram || "" },
        { platform: "YouTube", url: company.youtube || "" },
    ].filter((item) => item.url.trim() !== "");

    const handleRemoveLogo = () => {
        setCompany(prev => ({
            ...prev,
            logo: ""
        }));
    };
    // const socialMediaToSave = [
    //     { platform: "Facebook", url: company.facebook || "" },
    //     { platform: "LinkedIn", url: company.linkedin || "" },
    //     { platform: "Instagram", url: company.instagram || "" },
    //     { platform: "YouTube", url: company.youtube || "" },
    // ].filter((item) => item.url.trim() !== "");
    // =========================
    // ดึงข้อมูลบริษัท
    // =========================
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

            setCompany({
                companyName: data.companyName || "",
                businessType: data.businessType || "",
                description: data.description || "",
                contactName: data.contactName || "",
                contactPosition: data.contactPosition || "",
                phone: data.phone || "",
                contactEmail: data.contactEmail || "",
                address: data.address || "",
                website: data.website || "",
                logo: data.logo || "",

                facebook: data.socialMedia?.find(
                    (item) => item.platform === "Facebook"
                )?.url || "",

                linkedin: data.socialMedia?.find(
                    (item) => item.platform === "LinkedIn"
                )?.url || "",

                instagram: data.socialMedia?.find(
                    (item) => item.platform === "Instagram"
                )?.url || "",

                youtube: data.socialMedia?.find(
                    (item) => item.platform === "YouTube"
                )?.url || "",
            });

            setLatitude(data.latitude ?? null);
            setLongitude(data.longitude ?? null);

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

    // =========================
    // เปลี่ยนข้อมูล
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setCompany((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // Social Media
    // =========================
    const addSocialMedia = () => {
        setSocialMedia((prev) => [
            ...prev,
            {
                platform: "Facebook",
                url: ""
            }
        ]);
    };

    const updateSocialMedia = (index, field, value) => {
        setSocialMedia((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [field]: value
                    }
                    : item
            )
        );
    };

    const removeSocialMedia = (index) => {
        setSocialMedia((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const geocodeAddress = async (address) => {
        if (!address || !address.trim()) {
            return null;
        }

        try {
            const query = `${address}, Thailand`;

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=th&q=${encodeURIComponent(query)}`
            );

            if (!res.ok) {
                throw new Error("ไม่สามารถค้นหาพิกัดจากที่อยู่ได้");
            }

            const data = await res.json();

            if (!data || data.length === 0) {
                return null;
            }

            return {
                latitude: Number(data[0].lat),
                longitude: Number(data[0].lon)
            };
        } catch (error) {
            console.error("GEOCODE ERROR:", error);
            return null;
        }
    };

    // =========================
    // บันทึกข้อมูล
    // =========================
    const handleSave = async () => {
        try {
            setSaving(true);

            const token = localStorage.getItem("companyToken");

            if (!token) {
                navigate("/company/login");
                return;
            }

            // =========================
            // แปลงที่อยู่เป็นพิกัด
            // =========================
            let newLatitude = latitude;
            let newLongitude = longitude;

            if (company.address.trim()) {
                const coordinates = await geocodeAddress(company.address);

                if (!coordinates) {
                    setPopupType("error");
                    setPopupMessage(
                        "ไม่พบตำแหน่งจากที่อยู่ที่กรอก กรุณาตรวจสอบที่อยู่ให้ละเอียดขึ้น"
                    );
                    setShowPopup(true);
                    return;
                }

                newLatitude = coordinates.latitude;
                newLongitude = coordinates.longitude;

                setLatitude(newLatitude);
                setLongitude(newLongitude);
            }

            // =========================
            // บันทึกข้อมูลบริษัท
            // =========================
            const res = await fetch(
                "http://localhost:5000/api/company/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        companyName: company.companyName,
                        businessType: company.businessType,
                        description: company.description,
                        contactName: company.contactName,
                        contactPosition: company.contactPosition,
                        phone: company.phone,
                        contactEmail: company.contactEmail,
                        address: company.address,
                        website: company.website,
                        socialMedia: socialMediaToSave,
                        latitude: newLatitude,
                        longitude: newLongitude
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setPopupType("error");
                setPopupMessage(
                    data.message || "ไม่สามารถบันทึกข้อมูลได้"
                );
                setShowPopup(true);
                return;
            }

            setPopupType("success");
            setPopupMessage(
                "บันทึกข้อมูลบริษัทและตำแหน่งที่ตั้งเรียบร้อยแล้ว"
            );
            setShowPopup(true);

            fetchCompanyProfile();

        } catch (error) {
            console.error("UPDATE COMPANY PROFILE ERROR:", error);

            setPopupType("error");
            setPopupMessage("ไม่สามารถเชื่อมต่อ Server ได้");
            setShowPopup(true);

        } finally {
            setSaving(false);
        }
    };

    // =========================
    // เปลี่ยนโลโก้
    // =========================
    const handleLogoChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];

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

    // =========================
    // Logout
    // =========================
    const handleLogout = () => {
        localStorage.removeItem("companyToken");
        localStorage.removeItem("company");

        navigate("/company/login");
    };

    // =========================
    // Loading
    // =========================
    if (loading) {
        return (
            <>
                <NavbarCompany />

                <div className="company-profile-loading">
                    กำลังโหลดข้อมูลบริษัท...
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarCompany />

            <div className="cpe-company-profile-page">

                {/* =========================
                    Left Menu
                ========================= */}
                <aside className="company-profile-sidebar">

                    <div className="company-profile-menu">

                        <button
                            className={
                                activeMenu === "profile"
                                    ? "company-menu-item active"
                                    : "company-menu-item"
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
                                    ? "company-menu-item active"
                                    : "company-menu-item"
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
                        className="company-logout-menu"
                        onClick={handleLogout}
                    >
                        <FiLogOut />
                        <span>ออกจากระบบ</span>
                    </button>

                </aside>


                {/* =========================
                    Right Content
                ========================= */}
                <main className="company-profile-content">

                    <div className="company-profile-header">
                        <div>
                            <h1>แก้ไขข้อมูลบริษัท</h1>
                            <p>
                                จัดการข้อมูลบริษัทและข้อมูลสำหรับผู้สมัคร
                            </p>
                        </div>
                    </div>


                    {/* =========================
                        Logo
                    ========================= */}
                    <section className="company-profile-card">


                        <div className="company-main-info">

                            {/* ฝั่งโลโก้บริษัท */}
                            <div className="company-logo-area">

                                <h2>โลโก้บริษัท</h2>

                                <div className="company-logo-preview">

                                    {company.logo ? (
                                        <>
                                            <img
                                                src={
                                                    company.logo.startsWith("http")
                                                        ? company.logo
                                                        : `http://localhost:5000${company.logo}`
                                                }
                                                alt="Company Logo"
                                            />

                                            <button
                                                type="button"
                                                className="remove-logo-btn"
                                                onClick={handleRemoveLogo}
                                                title="ลบโลโก้"
                                            >
                                                <FiX />
                                            </button>
                                        </>
                                    ) : (
                                        <FiGlobe />
                                    )}

                                </div>

                                <label className="change-logo-btn">
                                    <FiCamera />
                                    เปลี่ยนโลโก้

                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleLogoChange}
                                        hidden
                                    />
                                </label>

                                <span className="logo-help">
                                    รองรับ JPG, PNG ขนาดไม่เกิน 2MB
                                </span>

                            </div>


                            {/* ฝั่งข้อมูลบริษัท */}
                            <div className="company-basic-info">

                                <h2>
                                    ข้อมูลบริษัท
                                </h2>

                                {/* ชื่อบริษัท + ประเภทธุรกิจ */}
                                <div className="company-name-type">

                                    <div className="cpe-form-group">
                                        <label>
                                            ชื่อบริษัท <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={company.companyName}
                                            onChange={handleChange}
                                            placeholder="กรอกชื่อบริษัท"
                                        />
                                    </div>

                                    <div className="cpe-form-group">
    <label>
        ประเภทธุรกิจ <span className="required">*</span>
    </label>

    <div className="cpe-select-wrapper">
        <select
            name="businessType"
            value={company.businessType}
            onChange={handleChange}
        >
            <option value="">เลือกประเภทธุรกิจ</option>
            <option value="เทคโนโลยีสารสนเทศ">เทคโนโลยีสารสนเทศ</option>
            <option value="ซอฟต์แวร์">ซอฟต์แวร์</option>
            <option value="การตลาด">การตลาด</option>
            <option value="การเงิน">การเงิน</option>
            <option value="การศึกษา">การศึกษา</option>
            <option value="การผลิต">การผลิต</option>
            <option value="ค้าปลีก">ค้าปลีก</option>
            <option value="อื่น ๆ">อื่น ๆ</option>
        </select>

        <FiChevronDown className="cpe-select-arrow" />
    </div>
</div>

                                </div>

                                {/* รายละเอียดบริษัท */}
                                <div className="cpe-form-group company-description">
                                    <label>
                                        รายละเอียดบริษัท <span className="required">*</span>
                                    </label>

                                    <textarea
                                        name="description"
                                        value={company.description}
                                        onChange={handleChange}
                                        placeholder="แนะนำข้อมูลเกี่ยวกับบริษัท"
                                        rows="4"
                                    />
                                </div>

                            </div>

                        </div>
                    </section>




                    {/* =========================
                        Contact
                    ========================= */}
                    <section className="company-profile-card">

                        <h2>ข้อมูลผู้ติดต่อ</h2>

                        <div className="form-grid contact-grid">

                            <div className="cpe-form-group">
                                <label>
                                    ชื่อผู้ติดต่อ <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactName"
                                    value={company.contactName}
                                    onChange={handleChange}
                                    placeholder="ชื่อผู้ติดต่อ"
                                />
                            </div>

                            <div className="cpe-form-group">
                                <label>
                                    ตำแหน่ง <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactPosition"
                                    value={company.contactPosition}
                                    onChange={handleChange}
                                    placeholder="เช่น HR, ฝ่ายบุคคล"
                                />
                            </div>

                            <div className="cpe-form-group">
                                <label>
                                    เบอร์โทรศัพท์ <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={company.phone}
                                    onChange={handleChange}
                                    placeholder="08X-XXX-XXXX"
                                />
                            </div>

                            <div className="cpe-form-group">
                                <label>
                                    อีเมล <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={company.contactEmail}
                                    onChange={handleChange}
                                    placeholder="company@example.com"
                                />
                            </div>

                        </div>

                    </section>


                    {/* =========================
                        Address
                    ========================= */}
                    <section className="company-profile-card">

                        <h2>ที่อยู่บริษัท</h2>

                        <div className="cpe-form-group full-width">

                            <label>
                                ที่อยู่ <span className="required">*</span>
                            </label>

                            <textarea
                                name="address"
                                value={company.address}
                                onChange={handleChange}
                                placeholder="กรอกที่อยู่บริษัท"
                                rows="4"
                            />

                        </div>

                    </section>


                    <div className="company-bottom-info">

                        {/* Website */}
                        <section className="company-profile-card">

                            <h2>Website</h2>

                            <div className="cpe-form-group cpe-website-input">
                                <FiGlobe className="cpe-website-icon" />
                                <input
                                    type="url"
                                    name="website"
                                    value={company.website}
                                    onChange={handleChange}
                                    placeholder="https://www.example.com"
                                />
                            </div>

                        </section>


                        {/* Social Media */}
                        <section className="company-profile-card">
                            <h2>Social Media</h2>

                            <div className="cpe-social-grid">
                                <div className="cpe-social-item">
                                    <FaFacebookF className="facebook-icon" />
                                    <input
                                        type="url"
                                        placeholder="facebook.com/yourpage"
                                        value={company.facebook || ""}
                                        onChange={(e) =>
                                            setCompany({ ...company, facebook: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="cpe-social-item">
                                    <FaLinkedinIn className="linkedin-icon" />
                                    <input
                                        type="url"
                                        placeholder="linkedin.com/company/yourpage"
                                        value={company.linkedin || ""}
                                        onChange={(e) =>
                                            setCompany({ ...company, linkedin: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="cpe-social-item">
                                    <FaInstagram className="instagram-icon" />
                                    <input
                                        type="url"
                                        placeholder="instagram.com/yourpage"
                                        value={company.instagram || ""}
                                        onChange={(e) =>
                                            setCompany({ ...company, instagram: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="cpe-social-item">
                                    <FaYoutube className="youtube-icon" />
                                    <input
                                        type="url"
                                        placeholder="youtube.com/@yourpage"
                                        value={company.youtube || ""}
                                        onChange={(e) =>
                                            setCompany({ ...company, youtube: e.target.value })
                                        }
                                    />
                                </div>

                                {/* <button
                                    type="button"
                                    className="cpe-social-add"
                                    onClick={() => { }}
                                >
                                    <FiPlus />
                                    เพิ่มช่องทาง
                                </button> */}
                            </div>
                        </section>

                    </div>


                    {/* =========================
                        Save
                    ========================= */}
                    <div className="company-profile-actions">

                        <button
                            className="cancel-profile-btn"
                            onClick={() => navigate("/company")}
                        >
                            ยกเลิก
                        </button>

                        <button
                            className="save-profile-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >


                            {saving
                                ? "กำลังบันทึก..."
                                : "บันทึกข้อมูล"}
                        </button>

                    </div>

                </main>

            </div>

            {showPopup && (
                <div className="company-popup-overlay">
                    <div className="company-popup">

                        <button
                            type="button"
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
                            {popupType === "success" ? (
                                <FaRegCircleCheck />
                            ) : (
                                "!"
                            )}
                        </div>

                        <h3>
                            {popupType === "success"
                                ? "ดำเนินการสำเร็จ"
                                : "ไม่สามารถดำเนินการได้"}
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

export default CompanyProfileEdit;