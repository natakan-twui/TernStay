import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { dorms } from "../data/dorms";
import "./Dorm.css";

function Dorms() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />

            <div style={containerStyle}>

                <h1 style={titleStyle}>
                    หอพักทั้งหมด
                </h1>

                <div style={gridStyle}>
                    {dorms.map((dorm) => (
                        <div
                            key={dorm.id}
                            className="dorm-card"
                            onClick={() => navigate(`/dorm/${dorm.id}`)}
                        >
                            <div style={imageWrapperStyle}>
                                <img
                                    src={dorm.image}
                                    alt={dorm.name}
                                    style={imageStyle}
                                />


                            </div>

                            <div style={contentStyle}>
                                <h2 style={nameStyle}>
                                    {dorm.name}
                                </h2>

                                <p style={infoStyle}>
                                    📍 {dorm.location}
                                </p>

                                <p style={infoStyle}>
                                    💰 {dorm.price}
                                </p>

                                <p style={infoStyle}>
                                    🚶 {dorm.distance} จากสถานที่ฝึกงาน
                                </p>

                                <p style={infoStyle}>
                                    ⭐ {dorm.rating}
                                </p>
                                <button
                                    type="button"
                                    className="detail-btn"
                                    style={detailBtnStyle}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/dorm/${dorm.id}`);
                                    }}
                                >
                                    ดูรายละเอียด
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Dorms;
