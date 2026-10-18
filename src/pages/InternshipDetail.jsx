import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { dorms } from "../data/dorms";
import { useNavigate } from "react-router-dom";
import "./InternshipDetail.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoIosCloseCircle } from "react-icons/io";
import {
    FiMapPin,
    FiDollarSign,
    FiBriefcase,
    FiClock,
    FiFileText,
    FiUserCheck,
    FiGift,
    FiPhone,
    FiCode
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
};

function InternshipDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);

    
const [showApplyLoginPopup, setShowApplyLoginPopup] = useState(false);
const [applyLoginPopupMessage, setApplyLoginPopupMessage] = useState("");

    useEffect(() => {

        const fetchJob = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/job/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log(data);
                    return;
                }

                setInternship(data);
                console.log("JOB DATA:", data);
                console.log("LAT:", data.latitude);
                console.log("LNG:", data.longitude);
            } catch (error) {

                console.log("FETCH JOB ERROR:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchJob();

    }, [id]);

    if (loading) {
        return <h2>กำลังโหลดข้อมูล...</h2>;
    }

    if (!internship) {
        return <h2>ไม่พบข้อมูลประกาศงาน</h2>;
    }

    const nearByDorms =
        internship.latitude != null &&
            internship.longitude != null
            ? dorms
                .filter(
                    dorm =>
                        dorm.latitude != null &&
                        dorm.longitude != null
                )
                .map(dorm => {

                    const distance = calculateDistance(
                        Number(internship.latitude),
                        Number(internship.longitude),
                        Number(dorm.latitude),
                        Number(dorm.longitude)
                    );

                    return {
                        ...dorm,
                        calculatedDistance: distance
                    };
                })
                .sort(
                    (a, b) =>
                        a.calculatedDistance -
                        b.calculatedDistance
                )
                .slice(0, 3)
            : [];

    
const handleApply = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        setApplyLoginPopupMessage(
            "กรุณาเข้าสู่ระบบก่อนสมัครฝึกงาน เพื่อดำเนินการสมัครงาน"
        );
        setShowApplyLoginPopup(true);
        return;
    }

    navigate(`/apply/${internship.id}`);
};

    return (
        <div>
            <Navbar />
            {/* ปุ่มย้อนกลับ */}
            <div className="back-container">
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← ย้อนกลับ
                </button>
            </div>
            {/* Content */}
            <div className="containerStyle">

                {/* Company */}
                <div className="companySectionStyle">

                    <img
                        src={
                            internship.company?.logo
                                ? `http://localhost:5000${internship.company.logo}`
                                : "/image/default-company.png"
                        }
                        alt={internship.company?.companyName || "บริษัท"}
                        className="logoStyle"
                    />

                    <div>
                        <h2 className="company-name">
                            {internship.company?.companyName || "-"}
                        </h2>
                    </div>

                </div>

                {/* Hero */}
                <div className="heroStyle">

                    <div className="leftHeroStyle">

                        <h1>
                            {internship.title}
                        </h1>

                        <div className="infoRowStyle">

                            <span className="iconStyle">
                                <FiMapPin />
                            </span>

                            <span className="labelStyle">
                                สถานที่ปฏิบัติงาน
                            </span>

                            <span>
                                {internship.location}
                            </span>

                        </div>

                        <div className="infoRowStyle">

                            <span className="iconStyle">
                                <FiDollarSign />
                            </span>

                            <span className="labelStyle">
                                เงินเดือน
                            </span>

                            <span>
                                {internship.salaryType === "paid"
                                    ? `${internship.salary || "-"} ${internship.salaryUnit || ""}`
                                    : "ไม่มีค่าตอบแทน"
                                }
                            </span>

                        </div>

                        <div className="infoRowStyle">

                            <span className="iconStyle">
                                <FiBriefcase />
                            </span>

                            <span className="labelStyle">
                                รูปแบบการทำงาน
                            </span>

                            <span>
                                {internship.workType}
                            </span>

                        </div>

                    </div>

                    <div className="buttonContainerStyle">
                        <button
                            className="applyBtn"
                            onClick={handleApply}
                        >
                            สมัครฝึกงาน
                        </button>
                    </div>

                </div>


                {/* รายละเอียดงาน */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">
                        <span className="sectionIcon">
                            <FiFileText />
                        </span>
                        รายละเอียดงาน
                    </h2>

                    <div className="sectionContent job-description">
                        {internship.description || "-"}
                    </div>
                </div>

                {/* คุณสมบัติ */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">

                        <span className="sectionIcon">
                            <FiUserCheck />
                        </span>

                        คุณสมบัติ

                    </h2>

                    {internship.qualification ? (
                        <ul className="job-list">
                            {internship.qualification
                                .split("\n")
                                .filter((item) => item.trim() !== "")
                                .map((item, index) => (
                                    <li key={index}>
                                        {item.trim()}
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p className="sectionContent">
                            -
                        </p>
                    )}
                </div>

                {/* ทักษะที่ต้องการ */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">
                        <span className="sectionIcon">
                            <FiCode />
                        </span>
                        ทักษะที่ต้องการ
                    </h2>

                    <div className="skill-container-detail">
                        {(typeof internship.skills === "string"
                            ? internship.skills.split(/[\n,]+/)
                            : Array.isArray(internship.skills)
                                ? internship.skills
                                : []
                        )
                            .map((skill) => String(skill).trim())
                            .filter((skill) => skill !== "")
                            .map((skill, index) => (
                                <span key={index} className="skill-tag-detail">
                                    {skill}
                                </span>
                            ))}
                    </div>

                    {!internship.skills ||
                        (typeof internship.skills === "string" &&
                            internship.skills.trim() === "") ? (
                        <p className="sectionContent">-</p>
                    ) : null}
                </div>

                {/* สวัสดิการ */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">

                        <span className="sectionIcon">
                            <FiGift />
                        </span>

                        สวัสดิการ

                    </h2>

                    {internship.welfare ? (
                        <ul className="job-list">
                            {internship.welfare
                                .split("\n")
                                .filter((item) => item.trim() !== "")
                                .map((item, index) => (
                                    <li key={index}>
                                        {item.trim()}
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p className="sectionContent">
                            -
                        </p>
                    )}
                </div>

                {/* ติดต่อ */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">

                        <span className="sectionIcon">
                            <FiPhone />
                        </span>

                        ช่องทางติดต่อ

                    </h2>

                    <p className="sectionContent">
                        <strong>ชื่อผู้ติดต่อ:</strong>{" "}
                        {internship.contactName || "-"}
                    </p>

                    <p className="sectionContent">
                        <strong>อีเมล:</strong>{" "}
                        {internship.contactEmail || "-"}
                    </p>

                    <p className="sectionContent">
                        <strong>เบอร์โทรศัพท์:</strong>

                        <span className="phoneStyle">
                            {internship.contactPhone || "-"}
                        </span>
                    </p>
                </div>

                {/* แผนที่ออนไลน์ */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">
                        แผนที่ออนไลน์
                    </h2>

                    {internship.latitude != null && internship.longitude != null ? (

                        <MapContainer
                            center={[
                                Number(internship.latitude),
                                Number(internship.longitude)
                            ]}
                            zoom={15}
                            scrollWheelZoom={false}
                            className="internship-map"
                        >

                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker
                                position={[
                                    Number(internship.latitude),
                                    Number(internship.longitude)
                                ]}
                            >
                                <Popup>
                                    {internship.company?.companyName || "สถานที่ฝึกงาน"}
                                    <br />
                                    {internship.location || ""}
                                </Popup>
                            </Marker>

                        </MapContainer>

                    ) : (

                        <span>ไม่มีข้อมูลแผนที่</span>

                    )}
                </div>

                {/* หัวข้อหอพัก */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">
                        หอพักใกล้สถานที่ฝึกงาน
                    </h2>

                    <div className="viewAllContainerStyle">
                        <span
                            className="viewAllStyle"
                            onClick={() => navigate(`/internship/${internship.id}/dorms`)}
                        >
                            ดูทั้งหมด
                        </span>
                    </div>
                </div>

                {/* รายละเอียดหอพัก */}
                <div className="dormGridStyle">
                    {nearByDorms.map((dorm) => (
                        <div
                            key={dorm.id}
                            className="dorm-card"
                            onClick={() => navigate(`/dorm/${dorm.id}`)}
                        >
                            {/* รูป */}
                            <img
                                src={dorm.image}
                                alt={dorm.name}
                                className="dormImageStyle"
                            />

                            {/* ข้อมูล */}
                            <div className="dormInfoStyle">
                                <h3 className="dormNameStyle">
                                    {dorm.name}
                                </h3>

                                <p>⭐ {dorm.rating}</p>
                                <p>💰 {dorm.price}</p>
                                <p className="dorm-detail">
                                    <FaMapMarkerAlt className="dorm-icon" />

                                    {dorm.calculatedDistance < 1
                                        ? `${Math.round(dorm.calculatedDistance * 1000)} เมตร`
                                        : `${dorm.calculatedDistance.toFixed(1)} กม.`
                                    }
                                </p>
                            </div>


                        </div>
                    ))}
                </div>
            </div>

{showApplyLoginPopup && (
    <div className="apply-login-popup-overlay">
        <div className="apply-login-popup">

            <button
                type="button"
                className="apply-login-popup-close"
                onClick={() => setShowApplyLoginPopup(false)}
            >
                <RxCross2 />
            </button>

            <div className="apply-login-popup-icon">
                <IoIosCloseCircle />
            </div>

            <h3>กรุณาเข้าสู่ระบบ</h3>

            <p>{applyLoginPopupMessage}</p>

            <button
                type="button"
                className="apply-login-popup-btn"
                onClick={() => navigate("/login")}
            >
                เข้าสู่ระบบ
            </button>

        </div>
    </div>
)}

        </div>
    );
}

export default InternshipDetail;