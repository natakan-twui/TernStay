const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const userAuthRoute = require("./routes/userAuth");
const companyAuthRoute = require("./routes/companyAuth");
const companyRoute = require("./routes/company");
const jobRoute = require("./routes/job");
const jobPublicRoute = require("./routes/jobPublic");

// ตั้งค่า Middleware ก่อน Routes และ Static Files
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// บันทึก Request ใน Console
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// เปิดให้เข้าถึงไฟล์ในโฟลเดอร์ uploads
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use("/api/user", userAuthRoute);
app.use("/api/company", companyAuthRoute);

// บริษัทจัดการประกาศงาน
app.use("/api/company/jobs", jobRoute);

// ข้อมูลบริษัท
app.use("/api/company", companyRoute);

// นักศึกษาดูประกาศงาน
app.use("/api/job", jobPublicRoute);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
