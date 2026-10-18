import "./Home.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

import { FaSearch } from "react-icons/fa"; // Search
import { FaBuilding, FaHome } from "react-icons/fa";
import { MdHomeWork } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa"; //ปักหมุด
import { FiDollarSign } from "react-icons/fi";
// import { FaArrowRight } from "react-icons/fa"; //ลูกศรขวา

function Home() {
    const navigate = useNavigate();

    // State เก็บงานที่บริษัทเพิ่มมา
    const [jobs, setJobs] = useState([]);

    // เก็บค่าตัวกรอง
    const [workType, setWorkType] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");

    const getLogoUrl = (logo) => {
        if (!logo) {
            return "/image/default-company.png";
        }

        if (logo.startsWith("http")) {
            return logo;
        }

        return `http://localhost:5000${logo}`;
    };

const getProvince = (location) => {
    if (!location) return "-";

    const address = location.trim();

    // รองรับที่อยู่ที่มีคำว่า จังหวัด หรือ จ.
    const provinceMatch = address.match(
        /(?:จังหวัด|จ\.)\s*([^\s,]+)/
    );

    if (provinceMatch) {
        return provinceMatch[1];
    }

    // รองรับกรณีเก็บเป็นชื่อจังหวัดโดยตรง
    const provinces = [
        "กรุงเทพมหานคร",
        "เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน",
        "แม่ฮ่องสอน", "น่าน", "พะเยา", "แพร่",
        "อุตรดิตถ์", "พิษณุโลก", "สุโขทัย", "เพชรบูรณ์",
        "พิจิตร", "กำแพงเพชร", "นครสวรรค์", "อุทัยธานี",
        "ตาก", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ",
        "สมุทรสาคร", "สมุทรสงคราม", "นครปฐม",
        "พระนครศรีอยุธยา", "อ่างทอง", "ลพบุรี", "สระบุรี",
        "สิงห์บุรี", "ชัยนาท", "สุพรรณบุรี", "กาญจนบุรี",
        "ราชบุรี", "เพชรบุรี", "ประจวบคีรีขันธ์",
        "นครนายก", "สระแก้ว", "ฉะเชิงเทรา", "จันทบุรี",
        "กาฬสินธุ์", "ขอนแก่น", "ชัยภูมิ", "นครพนม",
        "นครราชสีมา", "บึงกาฬ", "บุรีรัมย์", "มหาสารคาม",
        "มุกดาหาร", "ยโสธร", "ร้อยเอ็ด", "เลย",
        "ศรีสะเกษ", "สกลนคร", "สุรินทร์", "หนองคาย",
        "หนองบัวลำภู", "อำนาจเจริญ", "อุดรธานี",
        "อุบลราชธานี", "ชุมพร", "ระนอง", "สุราษฎร์ธานี",
        "นครศรีธรรมราช", "กระบี่", "พังงา", "ภูเก็ต",
        "ตรัง", "พัทลุง", "สตูล", "สงขลา",
        "ปัตตานี", "ยะลา", "นราธิวาส"
    ];

    return provinces.find((province) =>
        address.includes(province)
    ) || address;
};


    const [searchFilter, setSearchFilter] = useState({
        location: "",
        category: "",
        workType: "",
        salary: "",
    });

    const [sortBy, setSortBy] = useState("latest");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/job"
                );

                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchJobs();
    }, []);

    // ตัวกรองที่ฝึกงาน
    const filteredJobs = jobs
        .filter((job) => {
            const matchLocation =
                searchFilter.location === "" ||

                (searchFilter.location === "กรุงเทพฯ" &&
                    job.location === "กรุงเทพมหานคร") ||

                (searchFilter.location === "ภาคเหนือ" &&
                    [
                        "เชียงใหม่",
                        "เชียงราย",
                        "ลำปาง",
                        "ลำพูน",
                        "แม่ฮ่องสอน",
                        "น่าน",
                        "พะเยา",
                        "แพร่",
                        "อุตรดิตถ์",
                        "พิษณุโลก",
                        "สุโขทัย",
                        "เพชรบูรณ์",
                        "พิจิตร",
                        "กำแพงเพชร",
                        "นครสวรรค์",
                        "อุทัยธานี",
                        "ตาก"
                    ].includes(job.location)) ||

                (searchFilter.location === "ภาคกลาง" &&
                    [
                        "กรุงเทพมหานคร",
                        "นนทบุรี",
                        "ปทุมธานี",
                        "สมุทรปราการ",
                        "สมุทรสาคร",
                        "สมุทรสงคราม",
                        "นครปฐม",
                        "พระนครศรีอยุธยา",
                        "อ่างทอง",
                        "ลพบุรี",
                        "สระบุรี",
                        "สิงห์บุรี",
                        "ชัยนาท",
                        "สุพรรณบุรี",
                        "กาญจนบุรี",
                        "ราชบุรี",
                        "เพชรบุรี",
                        "ประจวบคีรีขันธ์",
                        "นครนายก",
                        "สระแก้ว",
                        "ฉะเชิงเทรา",
                        "จันทบุรี"
                    ].includes(job.location)) ||
                (searchFilter.location === "ภาคอีสาน" &&
                    [
                        "กาฬสินธุ์",
                        "ขอนแก่น",
                        "ชัยภูมิ",
                        "นครพนม",
                        "นครราชสีมา",
                        "บึงกาฬ",
                        "บุรีรัมย์",
                        "มหาสารคาม",
                        "มุกดาหาร",
                        "ยโสธร",
                        "ร้อยเอ็ด",
                        "เลย",
                        "ศรีสะเกษ",
                        "สกลนคร",
                        "สุรินทร์",
                        "สุราษฎร์ธานี",
                        "หนองคาย",
                        "หนองบัวลำภู",
                        "อำนาจเจริญ",
                        "อุดรธานี",
                        "อุบลราชธานี"
                    ].includes(job.location)) ||

                (searchFilter.location === "ภาคใต้" &&
                    [
                        "ชุมพร",
                        "ระนอง",
                        "สุราษฎร์ธานี",
                        "นครศรีธรรมราช",
                        "กระบี่",
                        "พังงา",
                        "ภูเก็ต",
                        "ตรัง",
                        "พัทลุง",
                        "สตูล",
                        "สงขลา",
                        "ปัตตานี",
                        "ยะลา",
                        "นราธิวาส"
                    ].includes(job.location));

            const matchCategory =
                searchFilter.category === "" ||
                job.category === searchFilter.category;

            const workTypeMap = {
                onsite: "on-site",
                hybrid: "hybrid",
                wfh: "work from home",
            };

            const matchWorkType =
                searchFilter.workType === "" ||
                job.workType?.toLowerCase() === workTypeMap[searchFilter.workType];

            const matchSalary =
                searchFilter.salary === "" ||
                (searchFilter.salary === "paid" &&
                    job.salaryType === "paid") ||
                (searchFilter.salary === "unpaid" &&
                    job.salaryType !== "paid");

            return (
                matchLocation &&
                matchCategory &&
                matchWorkType &&
                matchSalary
            );
        })
        .sort((a, b) => {
            if (sortBy === "salaryHigh") {
                const salaryA =
                    a.salaryType === "paid"
                        ? Number(a.salary || 0)
                        : 0;

                const salaryB =
                    b.salaryType === "paid"
                        ? Number(b.salary || 0)
                        : 0;

                return salaryB - salaryA;
            }

            if (sortBy === "salaryLow") {
                const salaryA =
                    a.salaryType === "paid"
                        ? Number(a.salary || 0)
                        : 0;

                const salaryB =
                    b.salaryType === "paid"
                        ? Number(b.salary || 0)
                        : 0;

                return salaryA - salaryB;
            }
            if (sortBy === "latest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });

    return (
        <div>
            <Navbar />

            {/* MAIN LAYOUT */}
            <div className="layout">

                {/* กล่องตัวกรอง */}
                <div className="box-filter">
                    <div className="filter">

                        <div className="filter-title">
                            <div className="search-icon">
                                <FaSearch />
                            </div>

                            <h2>
                                ค้นหาที่ฝึกงาน
                            </h2>
                        </div>

                        {/* ตัวเลือกสถานที่ปฏิบัติงาน */}
                        <div className="filter-group">
                            <p className="filter-label">สถานที่ปฏิบัติงาน</p>

                            <select
                                className="filter-input"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <option value="">ทั้งหมด</option>
                                <option value="กรุงเทพฯ">กรุงเทพฯ</option>
                                <option value="ภาคเหนือ">ภาคเหนือ</option>
                                <option value="ภาคกลาง">ภาคกลาง</option>
                                <option value="ภาคอีสาน">ภาคอีสาน</option>
                                <option value="ภาคใต้">ภาคใต้</option>
                            </select>
                        </div>

                        {/* ตัวเลือกประเภทงาน */}
                        <div className="filter-group">
                            <p className="filter-label">หมวดหมู่งาน</p>

                            <select
                                className="filter-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">ทั้งหมด</option>
                                <option value="IT">IT / Developer</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>

                        {/* ตัวกรองรูปแบบการทำงาน */}
                        <div className="filter-group">
                            <p className="filter-label">รูปแบบการทำงาน</p>

                            <label className="check-item">
                                <input
                                    type="checkbox"
                                    className="filter-radio"
                                    checked={workType === "onsite"}
                                    onChange={() =>
                                        setWorkType(workType === "onsite" ? "" : "onsite")
                                    }
                                />

                                <FaBuilding className="work-icon" />
                                Onsite
                            </label>


                            <label className="check-item">
                                <input
                                    type="checkbox"
                                    className="filter-radio"
                                    checked={workType === "hybrid"}
                                    onChange={() =>
                                        setWorkType(workType === "hybrid" ? "" : "hybrid")
                                    }
                                />

                                <MdHomeWork className="work-icon" />
                                Hybrid
                            </label>


                            <label className="check-item">
                                <input
                                    type="checkbox"
                                    className="filter-radio"
                                    checked={workType === "wfh"}
                                    onChange={() =>
                                        setWorkType(workType === "wfh" ? "" : "wfh")
                                    }
                                />

                                <FaHome className="work-icon" />
                                Work from home
                            </label>
                        </div>

                        {/* ตัวกรองค่าตอบแทน */}
                        <div className="filter-group">
                            <p className="filter-label">ค่าตอบแทน</p>

                            <label className="check-item">
                                <input
                                    type="checkbox"
                                    className="filter-radio"
                                    checked={salary === "paid"}
                                    onChange={() =>
                                        setSalary(salary === "paid" ? "" : "paid")
                                    }
                                />
                                <span className="check-text">
                                    มีค่าตอบแทน
                                </span>
                            </label>

                            <label className="check-item">
                                <input
                                    type="checkbox"
                                    className="filter-radio"
                                    checked={salary === "unpaid"}
                                    onChange={() =>
                                        setSalary(salary === "unpaid" ? "" : "unpaid")
                                    }
                                />
                                <span className="check-text">
                                    ไม่มีค่าตอบแทน
                                </span>
                            </label>
                        </div>

                        {/* ปุ่มค้นหา */}
                        <button
                            type="button"
                            className="search-btn"
                            onClick={() =>
                                setSearchFilter({
                                    location,
                                    category,
                                    workType,
                                    salary,
                                })
                            }
                        >
                            <FaSearch />
                            ค้นหา
                        </button>



                    </div>

                </div>

                {/* ---- list ที่ฝึกงาน ---- */}
                <div className="list">

                    {/* จำนวนงาน */}
                    <div className="result-section">
                        <h2 className="result-count">
                            พบ <span className="job-number">{filteredJobs.length}</span> งาน
                        </h2>

                        <div className="search-info">
                            <span className="search-title">ผลการค้นหา:</span>

                            <span className="search-detail">
                                งานใน {searchFilter.location || "สถานที่ปฏิบัติงานทั้งหมด"} •{" "}
                                {searchFilter.category || "ประเภทงานทั้งหมด"}
                            </span>
                        </div>
                    </div>

                    {/* เรียงตาม */}
                    <div className="sort-container">
                        <span>เรียงตาม :</span>
                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="latest">ตำแหน่งงานล่าสุด</option>
                            <option value="salaryHigh">ค่าตอบแทนสูงสุด</option>
                            <option value="salaryLow">ค่าตอบแทนต่ำสุด</option>
                        </select>
                    </div>

                    {/* Card งาน */}

                    {filteredJobs.length === 0 ? (
                        <div className="no-job">
                            ไม่พบงานที่ตรงกับเงื่อนไข
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => navigate(`/internship/${job.id}`)}
                                className="job-card"
                            >
                                <div className="card-header">

                                    {/* ข้อมูลฝั่งซ้าย */}
                                    <div className="job-content">
                                        <h3 className="job-title">
                                            {job.title}
                                        </h3>

                                        <p className="company">
                                            {job.company?.companyName || "-"}
                                        </p>

                                        <div className="job-info">
                                            <span className="info">
                                                <FaMapMarkerAlt className="location-icon" />
                                                {getProvince(job.location)}
                                            </span>

                                            <span className="info-divider">|</span>

                                            <span className="info">
                                                <FiDollarSign className="salary-icon" />{" "}
                                                {job.salaryType === "paid"
                                                    ? `${job.salary || "-"} ${job.salaryUnit || ""}`
                                                    : "ไม่มีค่าตอบแทน"
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* โลโก้ฝั่งขวา */}

                                    {/* โลโก้และชื่อบริษัทฝั่งขวา */}

                                    <div className="card-right">
                                        <div className="company-logo-wrap">
                                            <img
                                                src={getLogoUrl(job.company?.logo)}
                                                alt={job.company?.companyName || "บริษัท"}
                                                className="job-logo"
                                            />

                                            <p className="card-company-name">
                                                {job.company?.companyName || "-"}
                                            </p>
                                        </div>

                                        <div className="card-arrow">
                                            <span>›</span>
                                        </div>
                                    </div>



                                </div>

                                {/* Skills */}
                                <div className="skill-container-home">
                                    {(typeof job.skills === "string"
                                        ? job.skills.split(/[\n,]+/)
                                        : Array.isArray(job.skills)
                                            ? job.skills
                                            : []
                                    )
                                        .map((skill) => skill.trim())
                                        .filter((skill) => skill !== "")
                                        .map((skill, index) => (
                                            <span key={index} className="skill-tag-home">
                                                {skill}
                                            </span>
                                        ))}
                                </div>

                                <p className="post-date">
                                    โพสต์เมื่อ{" "}
                                    {new Date(job.createdAt).toLocaleDateString("th-TH", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
}

export default Home;