import NavbarCompany from "../../components/NavbarCompany";
import "./CompanyHome.css";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const CompanyHome = () => {

    const navigate = useNavigate();
    const companyToken = localStorage.getItem("companyToken");
    const isLogin = !!companyToken;

    return (
        <>
            <NavbarCompany />

            <div className="company-container">
                <section className="company-hero">
                    <div className="company-content">
                        <h1>
                            ลงประกาศงานกับ <span>TernStay</span> <br />เข้าถึง <span>Candidate</span> จำนวนมากตอบโจทย์ทุกช่องทางการใช้งาน
                        </h1>

                        <p>
                            แพลตฟอร์มยอดนิยมสำหรับค้นหาที่ฝึกงานช่วยให้บริษัทของคุณค้นหาคนที่ใช่ ได้ง่าย รวดเร็ว และมีประสิทธิภาพ
                        </p>

                        <button
                            className="company-register-btn"
                            onClick={() =>
                                navigate(
                                    isLogin
                                        ? "/company/create-job"
                                        : "/company/login"
                                )
                            }
                        >
                            {isLogin ? "+ สร้างประกาศงาน" : "เข้าสู่ระบบเพื่อลงประกาศงาน"}
                        </button>
                    </div>

                    {/* รูปภาพฝั่งขวา */}
                    <div className="company-image">
                        <img
                            src="/image/1.png"
                            alt="Company Hiring"
                        />
                    </div>

                </section>

                <section className="company-benefits">

                    <div className="benefit-grid">

                        <div className="benefit-card">
                            <div className="benefit-number">1</div>
                            <img src="/image/c1.jpeg" alt="" />

                            <div className="benefit-text">
                                <h3>แพลตฟอร์มสำหรับ<br />ค้นที่ฝึกงานครบในที่เดียว</h3>

                                <ul className="benefit-list">
                                    <li>ค้นหาตำแหน่งฝึกงานที่ตรงกับความสนใจและสาขาวิชา</li>
                                    <li>ค้นหางานจากบริษัทและพื้นที่ที่ต้องการได้ง่าย</li>
                                </ul>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">2</div>
                            <img src="/image/c22.png" alt="" />

                            <div className="benefit-text">
                                <h3>จัดการประกาศ<br />ได้ง่ายและสะดวก</h3>

                                <ul className="benefit-list">
                                    <li>บริษัทสามารถสร้างและแก้ไขประกาศงานได้ด้วยตัวเอง</li>
                                    <li>ปรับรายละเอียด ตำแหน่ง ประเภทงาน และข้อมูลการรับสมัครได้</li>
                                </ul>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">3</div>
                            <img src="/image/c3.png" alt="" />

                            <div className="benefit-text">
                                <h3>เข้าถึงผู้สมัครที่<br />ตรงกับความต้องการ</h3>

                                <ul className="benefit-list">
                                    <li>บริษัทสามารถค้นหาผู้สมัครตามสาขาวิชาได้</li>
                                    <li>ดูข้อมูลและทักษะของผู้สมัครเพื่อประกอบการคัดเลือก</li>
                                </ul>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">4</div>
                            <img src="/image/c4.png" alt="" />

                            <div className="benefit-text">
                                <h3>Company Profile<br />บอกเล่าข้อมูลบริษัท</h3>

                                <ul className="benefit-list">
                                    <li>แสดงข้อมูลและรายละเอียดของบริษัทให้ผู้สมัครรู้จัก</li>
                                    <li>ช่วยให้ผู้สมัครตัดสินใจเลือกบริษัทที่เหมาะกับตัวเอง</li>
                                </ul>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">5</div>
                            <img src="/image/c5.png" alt="" />

                            <div className="benefit-text">
                                <h3>จัดการผู้สมัคร<br />ได้อย่างเป็นระบบ</h3>

                                <ul className="benefit-list">
                                    <li>ดูรายชื่อผู้สมัครของแต่ละประกาศงาน</li>
                                    <li>ตรวจสอบข้อมูล Resume และผลงานของผู้สมัครได้</li>
                                </ul>
                            </div>
                        </div>


                        <div className="benefit-card">
                            <div className="benefit-number">6</div>
                            <img src="/image/c6.png" alt="" />

                            <div className="benefit-text">
                                <h3>TernStay<br />ช่วยเชื่อมต่อผู้สมัครกับบริษัท</h3>

                                <ul className="benefit-list">
                                    <li>ค้นหาที่ฝึกงานที่เหมาะกับผู้สมัคร</li>
                                    <li>ค้นหาหอพักใกล้สถานที่ฝึกงาน</li>
                                    <li>ช่วยให้การหาที่ฝึกงานและการสมัครฝึกงานสะดวกในแพลตฟอร์มเดียว</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                </section>


            </div>
        </>

    );
};

export default CompanyHome;