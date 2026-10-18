import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { dorms } from "../data/dorms";
import "./DormDetail.css";
import { MdLocalLaundryService } from "react-icons/md";
import {
    FaWifi,
    FaSnowflake,
    FaParking,
    FaDumbbell,
    FaShieldAlt,
    FaCouch,
    FaTv,
    FaUtensils,
    FaStore,
    FaTrain,
    FaHospital,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPhoneAlt
} from "react-icons/fa";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

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
const jobIcon = L.divIcon({
    className: "job-marker",
    html: `
        <div class="job-marker-pin"></div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
});
L.Marker.prototype.options.icon = defaultIcon;

const facilityIcons = {
    "Wi-Fi": <FaWifi />,
    "เครื่องปรับอากาศ": <FaSnowflake />,
    "ที่จอดรถ": <FaParking />,
    "ฟิตเนส": <FaDumbbell />,
    "ระบบรักษาความปลอดภัย": <FaShieldAlt />,
    "เฟอร์นิเจอร์": <FaCouch />,
    "ทีวี": <FaTv />,
    "ห้องครัว": <FaUtensils />,
    "เครื่องซักผ้า": <MdLocalLaundryService />,
};

const nearbyIcons = {
    "7-Eleven": <FaStore />,
    "Lotus Go Fresh": <FaStore />,
    "BTS อารีย์": <FaTrain />,
    "โรงพยาบาล": <FaHospital />,
    "โรงพยาบาลพญาไท": <FaHospital />,
    "ร้านอาหาร": <FaUtensils />,
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // รัศมีโลก หน่วยกิโลเมตร

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}
function DormDetail() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const jobId = searchParams.get("jobId");

    const [internship, setInternship] = useState(null);
    const [calculatedDistance, setCalculatedDistance] = useState(null);

    const dorm = dorms.find(
        (item) => item.id === Number(id)
    );

    // ===============================
    // ดึงข้อมูลงานจาก Backend
    // ===============================
    useEffect(() => {
        const fetchJob = async () => {
            if (!jobId) return;

            try {
                const response = await fetch(
                    `http://localhost:5000/api/job/${jobId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log("GET JOB ERROR:", data);
                    return;
                }

                console.log("JOB DATA:", data);

                setInternship(data);

            } catch (error) {
                console.log("FETCH JOB ERROR:", error);
            }
        };

        fetchJob();
    }, [jobId]);


    // ===============================
    // คำนวณระยะทางหอพัก → สถานที่ฝึกงาน
    // ===============================
    useEffect(() => {
    if (
        dorm?.latitude == null ||
        dorm?.longitude == null ||
        internship?.latitude == null ||
        internship?.longitude == null
    ) {
        setCalculatedDistance(null);
        return;
    }

    const jobLat = Number(internship.latitude);
    const jobLng = Number(internship.longitude);

    const dormLat = Number(dorm.latitude);
    const dormLng = Number(dorm.longitude);

    console.log("========== DORM DETAIL ==========");
    console.log("Job ID:", jobId);
    console.log("Job latitude:", jobLat);
    console.log("Job longitude:", jobLng);
    console.log("Dorm ID:", dorm.id);
    console.log("Dorm name:", dorm.name);
    console.log("Dorm latitude:", dormLat);
    console.log("Dorm longitude:", dormLng);

    const distance = calculateDistance(
        jobLat,
        jobLng,
        dormLat,
        dormLng
    );

    console.log("Distance:", distance);
    console.log("================================");

    setCalculatedDistance(distance);
}, [dorm, internship, jobId]);

    if (!dorm) {
        return <h2>ไม่พบข้อมูลหอพัก</h2>;
    }

    return (
        <div>
            <Navbar />

            {/* Content */}
            <div className="containerStyle">

                {/* Logo */}
                <div className="companySectionStyle">
                    <img
            src={dorm.image}
            alt={dorm.name}
            className="logoStyle"
        />

                    <div>
                        <h2>{dorm.name}</h2>
                    </div>
                </div>

                {/* Hero */}
                <div className="heroStyle">

                    <div className="leftHeroStyle">

                        <h1 className="dormTitle-detail">
                            {dorm.name}
                        </h1>

                        <div className="infoRowStyle">
                            <span className="labelStyle">คะแนน</span>
                            <span>⭐ {dorm.rating}</span>
                        </div>

                        <div className="infoRowStyle">
                            <span className="labelStyle">ราคา</span>
                            <span>{dorm.price}</span>
                        </div>

                        <div className="infoRowStyle">
                            <span className="labelStyle">ที่ตั้ง</span>
                            <span>{dorm.location}</span>
                        </div>

                        <div className="infoRowStyle">
                            <span className="labelStyle">ระยะทาง</span>
                            <span>
                                {calculatedDistance !== null
                                    ? `${calculatedDistance.toFixed(1)} กม.`
                                    : "ไม่สามารถคำนวณได้"}
                            </span>
                        </div>

                    </div>

                    <div className="buttonContainerStyle">
                        <button
                            className="contactBtn"
                            onClick={() =>
                                document.getElementById("contact").scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                        >
                            ติดต่อหอพัก
                        </button>
                    </div>

                </div>

                {/* รายละเอียด */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">
                        <span className="sectionIcon">
                            <FaInfoCircle />
                        </span>
                        รายละเอียดหอพัก
                    </h2>

                    <p className="sectionContent">
                        {dorm.description}
                    </p>
                </div>

                {/* สิ่งอำนวยความสะดวก */}
                <div className="sectionStyle">

                    <h2 className="sectionTitle">
                        <span className="sectionIcon">
                            <FaWifi />
                        </span>
                        สิ่งอำนวยความสะดวก
                    </h2>

                    <ul className="listStyle">
                        {dorm.facilities.map((item, index) => (
                            <li key={index} className="facilityItemStyle">
                                <span className="iconStyle">
                                    {facilityIcons[item]}
                                </span>

                                <span>
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>

                </div>
                {/* สถานที่ใกล้เคียง */}
                <div className="sectionStyle">
                    <h2 className="sectionTitle">
                        <span className="sectionIcon">
                            <FaMapMarkerAlt />
                        </span>
                        สถานที่ใกล้เคียง
                    </h2>

                    <ul className="listStyle">
                        {dorm.nearbyPlaces.map((place, index) => (
                            <li key={index} className="facilityItemStyle">

                                <span className="iconStyle">
                                    {nearbyIcons[place.name]}
                                </span>

                                <span>
                                    {place.name}
                                </span>

                                <span className="placeDistance">
                                    {place.distance}
                                </span>

                            </li>
                        ))}
                    </ul>
                </div>

                {/* ติดต่อ */}
                <div
                    id="contact"
                    className="sectionStyle"
                >

                    <h2 className="sectionTitle">
                        <span className="sectionIcon">
                            <FaPhoneAlt />
                        </span>
                        ติดต่อ
                    </h2>

                    <p>
                        ชื่อผู้ดูแล :
                        {" "}
                        {dorm.contact.name}
                    </p>

                    <p>
                        อีเมล :
                        {" "}
                        {dorm.contact.email}
                    </p>

                    <p>
                        เบอร์โทร :
                        <span className="phoneStyle">
                            {dorm.contact.phone}
                        </span>
                    </p>

                </div>

                {/* แผนที่ */}
                <div className="sectionStyle">

                    <h2 className="sectionTitle">
                        <span className="sectionIcon">
                            <FaMapMarkerAlt />
                        </span>
                        แผนที่หอพัก
                    </h2>

                    {dorm.latitude != null &&
                        dorm.longitude != null ? (

                        <>
                            <MapContainer
                                center={[
                                    Number(dorm.latitude),
                                    Number(dorm.longitude)
                                ]}
                                zoom={14}
                                scrollWheelZoom={false}
                                className="dorm-map"
                            >

                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* หมุดหอพัก */}
                                <Marker
                                    position={[
                                        Number(dorm.latitude),
                                        Number(dorm.longitude)
                                    ]}
                                >
                                    <Popup>
                                        <strong>
                                            {dorm.name}
                                        </strong>

                                        <br />

                                        {dorm.location}

                                        <br />

                                        {dorm.price}
                                    </Popup>
                                </Marker>

                                {/* หมุดสถานที่ฝึกงาน */}
                                {internship?.latitude != null &&
                                    internship?.longitude != null && (

                                        <Marker
                                            position={[
                                                Number(internship.latitude),
                                                Number(internship.longitude)
                                            ]}
                                            icon={jobIcon}
                                        >
                                            <Popup>

                                                <strong>
                                                    📍 สถานที่ฝึกงาน
                                                </strong>

                                                <br />

                                                {internship.company?.companyName || "-"}

                                                <br />

                                                {internship.location || "-"}

                                            </Popup>

                                        </Marker>

                                    )}

                            </MapContainer>

                            <a
                                href={
                                    dorm.mapLink ||
                                    `https://www.google.com/maps?q=${dorm.latitude},${dorm.longitude}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="google-map-link"
                            >
                                ดูเส้นทางบน Google Maps
                            </a>
                        </>

                    ) : (

                        <p>
                            ไม่มีข้อมูลตำแหน่งหอพัก
                        </p>

                    )}

                </div>

            </div>

        </div>
    );
}

export default DormDetail;