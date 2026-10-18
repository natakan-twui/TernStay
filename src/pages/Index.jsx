import Navbar from "../components/Navbar";
import "./Index.css";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const Index = () => {

    const navigate = useNavigate();

    return (
        <>
            <Navbar />

            <div className="company-container">

                {/* กล่อง 1  */}
                <section className="company-hero">
                    <div className="company-content">
                        <h1>
                            Tern<span>Stay</span>
                        </h1>

                        <h2>
                            แพลตฟอร์มหาที่ฝึกงาน <br />พร้อม<span>หอพัก</span>ใกล้ที่ทำงาน
                        </h2>

                        <p>
                            ค้นหาที่ฝึกงาน ค้นหาหอพัก และสมัครได้ในที่เดียว <br />ลดเวลาในการค้นหา พร้อมแผนที่และข้อมูลครบถ้วน
                        </p>

                        <div className="hero-buttons">
                            <button
                                className="company-search-btn"
                                onClick={() => navigate("/home")}
                            >

                                ค้นหาที่ฝึกงาน
                            </button>

                            <button
                                className="company-btn"
                                onClick={() => navigate("/company")}
                            >

                                สำหรับบริษัท
                            </button>

                        </div>

                    </div>
                    <div className="company-image">
                        <img
                            src="/image/index.png"
                            alt="Company Hero"
                        />
                    </div>


                </section>

                {/* กล่อง 2  */}
                <section className="company-benefits">

                    <div className="benefit-grid">

                        <div className="benefit-card">
                            <div className="benefit-number">1</div>
                            <img src="/image/u1.png" alt="" />

                            <div className="benefit-text">
                                <h3>หาที่ฝึกงานได้ง่าย<br /><span>หาที่ฝึกงานจากหลายบริษัท</span></h3>
                                <p>
                                    • ค้นหาตามจังหวัด
                                    <br />
                                    • ประเภทงาน
                                    <br />
                                    • ตำแหน่งงาน
                                </p>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">2</div>
                            <img src="/image/u2.png" alt="" />

                            <div className="benefit-text">
                                <h3>หอพักใกล้บริษัท<br /><span>หอพักใกล้สถานที่ฝึกงาน</span></h3>
                                <p>
                                    • แสดงราคา
                                    <br />
                                    • สิ่งอำนวยความสะดวก
                                    <br />
                                    • ระยะทางจากที่ฝึกงาน
                                    <br />
                                </p>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">3</div>
                            <img src="/image/u3.png" alt="" />

                            <div className="benefit-text">
                                <h3>แผนที่ช่วยวางแผน<br /><span>ดูตำแหน่งบริษัทและหอพัก</span></h3>
                                <p>
                                    • เชื่อมโยงข้อมูลกับแผนที่
                                    <br />
                                    • ช่วยเลือกหอพักที่เดินทางสะดวก
                                </p>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">4</div>
                            <img src="/image/u4.png" alt="" />

                            <div className="benefit-text">
                                <h3>สมัครฝึกงานสะดวก<br /><span>สมัครได้ในไม่กี่ขั้นตอน</span></h3>
                                <p>
                                    • กรอกข้อมูลส่วนตัว
                                    <br />
                                    • อัปโหลด Resume
                                    <br />
                                    • ส่งใบสมัครได้ในทันที
                                </p>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">5</div>
                            <img src="/image/u5.png" alt="" />

                            <div className="benefit-text">
                                <h3>บริษัทลงประกาศฟรี<br /><span>เปิดรับนักศึกษาฝึกงานได้ง่าย</span></h3>
                                <p>
                                    • ลงประกาศตำแหน่งฝึกงาน
                                    <br />
                                    • แก้ไขข้อมูลได้ตลอดเวลา
                                    <br />
                                    • จัดการตำแหน่งและผู้สมัคร
                                </p>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">6</div>
                            <img src="/image/u6.png" alt="" />

                            <div className="benefit-text">
                                <h3>นักศึกษาและบริษัทเชื่อมต่อกัน<br /><span>ครบทุกอย่างในแพลตฟอร์มเดียว</span></h3>
                                <p>
                                    • ทีมงานมืออาชีพพร้อมดูแล
                                    <br />
                                    • ช่วยให้ประกาศงานของคุณดึงดูด Candidate ได้มากขึ้น
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </>

    );
};

export default Index;