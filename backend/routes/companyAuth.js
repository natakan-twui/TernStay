const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const router = express.Router();


// Company Register
router.post("/register", async (req, res) => {

    try {

        const {
            companyName,
            businessType,
            contactName,
            phone,
            contactEmail,
            email,
            password
        } = req.body;


        const existCompany = await prisma.company.findUnique({
            where: {
                email
            }
        });


        if (existCompany) {
            return res.status(400).json({
                message: "Email นี้ถูกใช้งานแล้ว"
            });
        }


        const hashPassword = await bcrypt.hash(
            password,
            10
        );


        const company = await prisma.company.create({

            data: {
                companyName,
                businessType,
                contactName,
                phone,
                contactEmail,
                email,
                password: hashPassword
            }

        });


        res.json({

            message: "สมัครบริษัทสำเร็จ",

            company: {
                id: company.id,
                email: company.email
            }

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });

    }

});

// Middleware ตรวจ Token ของบริษัท
const authCompany = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "ไม่ได้เข้าสู่ระบบ"
        });
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        if (decoded.role !== "company") {
            return res.status(403).json({
                message: "ไม่มีสิทธิ์"
            });


        }
        req.company = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Token ไม่ถูกต้อง"
        });
    }
};

// Company Login
router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // หา company จาก email
        const company = await prisma.company.findUnique({
            where: {
                email
            }
        });


        if (!company) {
            return res.status(400).json({
                message: "ไม่พบ Email นี้"
            });
        }


        // ตรวจ password
        const checkPassword = await bcrypt.compare(
            password,
            company.password
        );


        if (!checkPassword) {
            return res.status(400).json({
                message: "รหัสผ่านไม่ถูกต้อง"
            });
        }


        // สร้าง token
        const token = jwt.sign(
            {
                id: company.id,
                email: company.email,
                role: "company"
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }
        );


        res.json({

            message: "Login สำเร็จ",

            token,

            company: {
                id: company.id,
                companyName: company.companyName,
                email: company.email
            }

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });

    }

});

// ===============================
// Company Forgot Password
// ===============================
router.put("/forgot-password", async (req, res) => {
    try {
        const {
            phone,
            newPassword
        } = req.body;

        // ตรวจสอบว่ากรอกข้อมูลมาครบไหม
        if (!phone || !newPassword) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบ"
            });
        }

        // ค้นหาบริษัทจากเบอร์โทรศัพท์
        const company = await prisma.company.findFirst({
            where: {
                phone: phone
            }
        });

        // ไม่พบเบอร์โทรศัพท์
        if (!company) {
            return res.status(400).json({
                message: "ไม่พบเบอร์โทรศัพท์นี้ในระบบ"
            });
        }

        // เข้ารหัสรหัสผ่านใหม่
        const hashPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // อัปเดตรหัสผ่าน
        await prisma.company.update({
            where: {
                id: company.id
            },
            data: {
                password: hashPassword
            }
        });

        res.json({
            message: "เปลี่ยนรหัสผ่านสำเร็จ"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});

module.exports = router;