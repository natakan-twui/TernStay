import NavbarCompany from "../../components/NavbarCompany";
import "./CompanySearch.css";
import { FaUsers, FaCheck } from "react-icons/fa";
import { FiSearch, FiBriefcase } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

function CompanySearch() {

    const [major, setMajor] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [searched, setSearched] = useState(false);

    // ทำให้เลื่อนลงไปตรงค้นประวัติ
    const searchSectionRef = useRef(null);

    // สร้าง Func ค้นหา
    const searchCandidate = async () => {

        try {

            const url = major
                ? `http://localhost:5000/api/company/candidates?major=${encodeURIComponent(major)}`
                : `http://localhost:5000/api/company/candidates`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("companyToken")}`
                }
            });

            const data = await res.json();

            if (res.ok) {

                setCandidates(data);
                setSearched(true);

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.log(err);

            alert("ไม่สามารถค้นหาประวัติได้");

        }
    };
    useEffect(() => {

        const loadCandidates = async () => {

            try {

                const res = await fetch(
                    "http://localhost:5000/api/company/candidates",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("companyToken")}`
                        }
                    }
                );

                const data = await res.json();

                if (res.ok) {

                    setCandidates(data);
                    setSearched(true);

                } else {

                    alert(data.message);

                }

            } catch (err) {

                console.log(err);
                alert("ไม่สามารถโหลดข้อมูลผู้สมัครได้");

            }

        };

        loadCandidates();

    }, []);

    return (
        <>
            <NavbarCompany />

            <div className="company-container">

                <section className="company-hero">

                    <div className="company-content">

                        <h1>
                            ค้นประวัติ <span>คนเก่งที่ใช่</span> <br />
                            คุณภาพครบจบในที่เดียว
                        </h1>

                        <div className="candidate-count">

                            <div className="candidate-icon">
                                <FaUsers />
                            </div>

                            <p>
                                ค้นหาได้จากสาขาวิชาและข้อมูลของผู้สมัคร
                            </p>

                        </div>

                        <p className="hero-feature">
                            <span className="feature-icon">
                                <FaCheck />
                            </span>

                            ดูประวัติการศึกษา ทักษะ และผลงานเพื่อประกอบการคัดเลือก
                        </p>

                        <button
                            className="company-register-btn"
                            onClick={() => {
                                searchSectionRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });
                            }}
                        >
                            <FiSearch className="btn-icon" />
                            เริ่มค้นหาประวัติ
                        </button>

                    </div>

                    {/* รูปภาพฝั่งขวา */}
                    <div className="company-image">
                        <img
                            src="/image/companySearch-Photoroom.png"
                            alt="Candidate Search"
                        />
                    </div>

                </section>

            </div>

            {/* ล่าง */}
            <section
                className="candidate-search-section"
                ref={searchSectionRef}
            >

                <h2>
                    ทดลองค้นประวัติ
                </h2>

                <p>
                    เลือกสายงานที่ต้องการ แล้วกดดูประวัติ
                </p>

                <div className="search-box">

                    <div className="select-wrapper">
                        <FiBriefcase className="select-icon" />

                        <select
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                        >
                            <option value="">ทั้งหมด</option>
                            <option value="วิทยาการคอม">
                                วิทยาการคอมพิวเตอร์
                            </option>
                            <option value="วิศวกรรมคอมพิวเตอร์">
                                วิศวกรรมคอมพิวเตอร์
                            </option>
                            <option value="เทคโนโลยีสารสนเทศ">
                                เทคโนโลยีสารสนเทศ
                            </option>
                        </select>

                    </div>

                    <button
                        className="btn-search"
                        onClick={searchCandidate}
                    >
                        ค้นประวัติ
                    </button>

                </div>

                <div className="search-result">

                    <h3>
                        ผลการค้นหา
                    </h3>

                    {
                        searched && candidates.length === 0 ? (

                            <p className="no-result">
                                ไม่พบผู้สมัครที่ตรงกับเงื่อนไข
                            </p>

                        ) : (

                            candidates.map((candidate) => (

                                <div
                                    className="candidate-card"
                                    key={candidate.id}
                                >

                                    {/* ฝั่งซ้าย */}
                                    <div className="candidate-info">

                                        <h2>
                                            สมัครตำแหน่ง :{" "}
                                            <span>{candidate.major || "-"}</span>
                                        </h2>

                                        <div className="candidate-detail-grid">

                                            <p>
                                                <strong>เพศ : </strong>
                                                {candidate.gender || "-"}
                                            </p>

                                            <p>
                                                <strong>กำลังศึกษามหาวิทยาลัย : </strong>
                                                {candidate.university || "-"}
                                            </p>

                                            <p>
                                                <strong>อายุ : </strong>
                                                {candidate.birthDate
                                                    ? new Date().getFullYear() -
                                                    new Date(candidate.birthDate).getFullYear()
                                                    : "-"
                                                } ปี
                                            </p>

                                            <p>
                                                <strong>จังหวัด : </strong>
                                                {candidate.province || "-"}
                                            </p>

                                        </div>



                                    </div>


                                    {/* ฝั่งขวา - รูปจำลอง */}
                                    <div className="candidate-image">

                                        <img
                                            src="/image/default-profile.png"
                                            alt="Candidate"
                                        />


                                    </div>

                                </div>

                            ))

                        )
                    }

                </div>

            </section>
        </>
    );
}

export default CompanySearch;