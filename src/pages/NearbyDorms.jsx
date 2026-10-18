import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { dorms } from "../data/dorms";
import "./Dorm.css";
import "./NearbyDorms.css";
import { FiChevronDown } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineTag, HiOutlineMapPin } from "react-icons/hi2";
import { FiSearch, FiChevronRight } from "react-icons/fi";
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
// ===============================
// คำนวณระยะทางระหว่าง 2 พิกัด
// ===============================
const calculateDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
};


function NearbyDorms() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const [sortBy, setSortBy] = useState("distance");


    // ===============================
    // ดึงข้อมูลงานจาก Backend
    // ===============================
    useEffect(() => {

        const fetchJob = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/job/${id}`
                );

                const data = await response.json();

                if (!response.ok) {

                    console.log(
                        "GET JOB ERROR:",
                        data
                    );

                    return;
                }

                setInternship(data);

            } catch (error) {

                console.log(
                    "FETCH JOB ERROR:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchJob();

    }, [id]);


    // ===============================
    // Loading
    // ===============================
    if (loading) {

        return (
            <>
                <Navbar />

                <div className="nearby-container">
                    <p>กำลังโหลดข้อมูล...</p>
                </div>
            </>
        );

    }


    // ===============================
    // ไม่พบงาน
    // ===============================
    if (!internship) {

        return (
            <>
                <Navbar />

                <div className="nearby-container">
                    <p>ไม่พบข้อมูลสถานที่ฝึกงาน</p>
                </div>
            </>
        );

    }


    // ===============================
    // ตรวจว่ามีพิกัดงานไหม
    // ===============================
    const hasJobLocation =
        internship.latitude != null &&
        internship.longitude != null;


    // ===============================
    // คำนวณระยะทางหอพัก
    // ===============================
    const nearbyDorms = hasJobLocation

        ? dorms
            .filter(
                dorm =>
                    dorm.latitude != null &&
                    dorm.longitude != null
            )

            .map(dorm => {

                const jobLat = Number(internship.latitude);
                const jobLng = Number(internship.longitude);

                const dormLat = Number(dorm.latitude);
                const dormLng = Number(dorm.longitude);

                const distance = calculateDistance(
                    jobLat,
                    jobLng,
                    dormLat,
                    dormLng
                );

                console.log("========== NEARBY DORMS ==========");
                console.log("Job ID:", internship.id);
                console.log("Job latitude:", jobLat);
                console.log("Job longitude:", jobLng);
                console.log("Dorm ID:", dorm.id);
                console.log("Dorm name:", dorm.name);
                console.log("Dorm latitude:", dormLat);
                console.log("Dorm longitude:", dormLng);
                console.log("Distance:", distance);
                console.log("=================================");

                return {
                    ...dorm,
                    calculatedDistance: distance
                };
            })

            // เอาเฉพาะรัศมี 5 กม.
            .filter(
                dorm =>
                    dorm.calculatedDistance <= 5
            )

        : [];


    // ===============================
    // Search + Filter + Sort
    // ===============================
    const filteredDorms =
        nearbyDorms

            .filter((dorm) => {

                const keyword =
                    search.toLowerCase();

                const matchSearch =
                    dorm.name
                        .toLowerCase()
                        .includes(keyword) ||

                    (dorm.location ?? "")
                        .toLowerCase()
                        .includes(keyword) ||

                    dorm.nearbyPlaces?.some(
                        place =>
                            place.name
                                .toLowerCase()
                                .includes(keyword)
                    );


                const price = parseInt(
                    dorm.price.replace(/,/g, "")
                );


                let matchPrice = true;


                if (priceFilter === "under3000") {

                    matchPrice =
                        price < 3000;

                }

                else if (
                    priceFilter === "3000to5000"
                ) {

                    matchPrice =
                        price >= 3000 &&
                        price <= 5000;

                }

                else if (
                    priceFilter === "over5000"
                ) {

                    matchPrice =
                        price > 5000;

                }


                return (
                    matchSearch &&
                    matchPrice
                );

            })


            .sort((a, b) => {

                if (sortBy === "priceLow") {

                    return (
                        parseInt(
                            a.price.replace(/,/g, "")
                        ) -
                        parseInt(
                            b.price.replace(/,/g, "")
                        )
                    );

                }


                if (sortBy === "priceHigh") {

                    return (
                        parseInt(
                            b.price.replace(/,/g, "")
                        ) -
                        parseInt(
                            a.price.replace(/,/g, "")
                        )
                    );

                }


                if (sortBy === "rating") {

                    return (
                        b.rating -
                        a.rating
                    );

                }


                // default = distance
                return (
                    a.calculatedDistance -
                    b.calculatedDistance
                );

            });


    return (

        <div>

            <Navbar />

            <div className="nearby-container">


                {/* =========================
                    Title
                ========================= */}

                <div className="nearby-title-wrapper">

                    <span className="nearby-title-icon-box">

                        <FaMapMarkerAlt
                            className="nearby-title-icon"
                        />

                    </span>

                    <h1 className="nearby-title">
                        หอพักใกล้สถานที่ฝึกงาน
                    </h1>

                </div>


                {/* =========================
                    Subtitle
                ========================= */}

                <p className="nearby-subtitle">

                    แสดงหอพักในรัศมี
                    {" "}
                    <span>5</span>
                    {" "}กม.
                    {" "}จาก{" "}

                    <span>
                        {internship.location || "-"}
                    </span>

                    {" "}พบทั้งหมด{" "}

                    <span>
                        {filteredDorms.length}
                    </span>

                    {" "}แห่ง

                </p>


                {/* =========================
                    Search
                ========================= */}

                <div className="dorm-search-box">

                    <FiSearch
                        className="dorm-search-icon"
                    />

                    <input
                        type="text"
                        placeholder="ค้นหาด้วยชื่อหอพัก ทำเล หรือสถานที่ใกล้เคียง"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="dorm-search"
                    />

                </div>


                {/* =========================
                    Filters
                ========================= */}

                <div className="dorm-filter-row">


                    {/* ราคา */}


                    <div className="select-wrapper-dorm">

                        <HiOutlineTag className="select-icon-dorm" />

                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="dorm-select"
                        >
                            <option value="all">ราคาทั้งหมด</option>
                            <option value="under3000">ต่ำกว่า 3,000 บาท</option>
                            <option value="3000to5000">3,000 - 5,000 บาท</option>
                            <option value="over5000">มากกว่า 5,000 บาท</option>
                        </select>

                        <FiChevronDown className="select-arrow-dorm" />

                    </div>



                    {/* เรียง */}


                    <div className="select-wrapper-dorm">

                        <HiOutlineMapPin className="select-icon-dorm" />

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="dorm-select"
                        >
                            <option value="distance">ระยะทางใกล้ที่สุด</option>
                            <option value="priceLow">ราคาต่ำสุดไปมากสุด</option>
                            <option value="priceHigh">ราคาสูงสุดไปต่ำสุด</option>
                            <option value="rating">คะแนนรีวิว</option>
                        </select>

                        <FiChevronDown className="select-arrow-dorm" />

                    </div>


                </div>
                <div className="nearby-map-section">

                    <h2 className="nearby-map-title">
                        แผนที่หอพักใกล้สถานที่ฝึกงาน
                    </h2>

                    {hasJobLocation ? (

                        <MapContainer
                            center={[
                                Number(internship.latitude),
                                Number(internship.longitude)
                            ]}
                            zoom={14}
                            scrollWheelZoom={false}
                            className="nearby-map"
                        >

                            <TileLayer
                                attribution="&copy; OpenStreetMap contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* สถานที่ฝึกงาน */}
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


                            {/* หอพัก */}
                            {filteredDorms.map((dorm) => (

                                <Marker
                                    key={dorm.id}
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

                                        📍{" "}

                                        {dorm.calculatedDistance < 1
                                            ? `${Math.round(
                                                dorm.calculatedDistance * 1000
                                            )} เมตร`
                                            : `${dorm.calculatedDistance.toFixed(
                                                1
                                            )} กม.`
                                        }

                                        <br />

                                        ⭐ {dorm.rating}

                                    </Popup>

                                </Marker>

                            ))}

                        </MapContainer>

                    ) : (

                        <div className="map-empty">
                            ไม่มีข้อมูลตำแหน่งสถานที่ฝึกงาน
                        </div>

                    )}

                </div>

                {/* =========================
                    Dorm Grid
                ========================= */}

                <div className="dorm-grid">

                    {filteredDorms.length === 0 ? (

                        <p className="empty-dorm">

                            {!hasJobLocation
                                ? "ประกาศงานนี้ยังไม่มีข้อมูลพิกัด"
                                : "ไม่พบหอพักที่ตรงกับเงื่อนไข"
                            }

                        </p>

                    ) : (

                        filteredDorms.map((dorm) => (

                            <div
                                key={dorm.id}
                                className="dorm-card"
                                onClick={() =>
                                    navigate(
                                        `/dorm/${dorm.id}?jobId=${internship.id}`
                                    )
                                }
                            >

                                <div className="dorm-image-wrapper">

                                    <img
                                        src={dorm.image}
                                        alt={dorm.name}
                                        className="dorm-image"
                                    />

                                    <span className="dorm-recommend-badge">
                                        แนะนำ
                                    </span>
                                </div>


                                <div className="dorm-content">

                                    <h2 className="dorm-name">
                                        {dorm.name}
                                    </h2>


                                    <p className="dorm-info">

                                        📍 {dorm.location}

                                    </p>


                                    <p className="dorm-info">

                                        💰 {dorm.price}

                                    </p>


                                    <p className="dorm-info">

                                        🚶{" "}

                                        {dorm.calculatedDistance < 1

                                            ? `${Math.round(
                                                dorm.calculatedDistance *
                                                1000
                                            )} เมตร`

                                            : `${dorm.calculatedDistance.toFixed(
                                                1
                                            )} กม.`

                                        }

                                        {" "}จากสถานที่ฝึกงาน

                                    </p>


                                    <p className="dorm-info">

                                        ⭐ {dorm.rating}

                                    </p>


                                    <button
                                        type="button"
                                        className="detail-btn-dorm"
                                        onClick={(e) => {

                                            e.stopPropagation();

                                            navigate(
                                                `/dorm/${dorm.id}?jobId=${internship.id}`
                                            );

                                        }}
                                    >

                                        ดูรายละเอียด

                                        <FiChevronRight
                                            className="detail-icon"
                                        />

                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}

export default NearbyDorms;