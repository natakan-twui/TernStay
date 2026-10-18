import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function VerifyEmail() {
    const navigate = useNavigate();
    const { state } = useLocation();

    return (
        <div>
            <Navbar isLoginPage={true} />

            <div style={containerStyle}>
                <FaCheckCircle
                    size={70}
                    color="#22C55E"
                />

                <h2 style={titleStyle}>
                    ตรวจสอบอีเมลของคุณ เพื่อยืนยันการสมัครสมาชิก
                </h2>

                <p style={textStyle}>
                    TernStay ได้ส่งอีเมลเพื่อยืนยันการสมัครสมาชิกแล้วที่
                </p>

                <p style={emailStyle}>
                    {state?.email}
                </p>

                <p style={textStyle}>
                    หากไม่พบอีเมลจาก TernStay ในกล่องจดหมาย
                    ให้ตรวจสอบที่
                </p>

                <p style={textStyle}>
                    <strong>"อีเมลขยะ"</strong> หรือ{" "}
                    <strong>"โปรโมชัน"</strong>
                </p>

                <p style={textStyle}>
                    และยืนยันการสมัครสมาชิกภายใน
                    <strong> 48 ชม.</strong>
                </p>

                <button
                    style={buttonStyle}
                    onClick={() => navigate("/login")}
                >
                    ตกลง
                </button>

            </div>
        </div>

    )
}
const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 70px)",
    background: "#f5f7fa",
    textAlign: "center",
    
};

const cardStyle = {
    width: "500px",
    background: "#fff",
    padding: "45px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
};

const titleStyle = {
    marginTop: "20px",
    marginBottom: "10px",
};

const textStyle = {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.5",
    margin: "2px 0",
};

const emailStyle = {
    color: "#048BAD",
    fontWeight: "bold",
    fontSize: "17px",
    margin: "10px 0",
};

const buttonStyle = {
    marginTop: "35px",
    width: "150px",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#048BAD",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
};

export default VerifyEmail;