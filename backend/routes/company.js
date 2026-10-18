const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
const uploadDir = path.join(__dirname, "../uploads/company");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `company-${req.company.id}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png"];

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("รองรับเฉพาะไฟล์ JPG และ PNG"));
        }

        cb(null, true);
    }
});
// ========================================
// ค้นหาประวัติ Candidate
// ต้อง Login บริษัท
// ========================================
router.get("/candidates", async (req, res) => {

    try {

        const { major } = req.query;

        const candidates = await prisma.user.findMany({

            where: {
                role: "user",

                // ถ้ามี major ให้กรอง
                // ถ้าไม่มี major ให้แสดงทั้งหมด
                ...(major && {
                    major: {
                        contains: major
                    }
                })
            },

            select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                birthDate: true,
                university: true,
                province: true,
                major: true
            }

        });

        res.json(candidates);

    } catch (error) {

        console.log("SEARCH CANDIDATES ERROR:", error);

        res.status(500).json({
            message: "ไม่สามารถค้นหาประวัติได้"
        });

    }

});

// API ดูประวัติผู้สมัคร
router.get("/candidate/:id", authCompany, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "ไม่พบผู้สมัคร"
            });
        }
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});

// API สร้างประกาศงาน
router.post("/jobs", authCompany, async (req, res) => {
    try {
        const {
            title,
            category,
            jobType,
            location,
            latitude,
            longitude,
            workType,
            salaryType,
            salary,
            salaryUnit,
            description,
            qualification,
            welfare,
            contactName,
            contactEmail,
            contactPhone,
        } = req.body;

        const job = await prisma.job.create({
            data: {
                companyId: req.company.id,
                title,
                category,
                jobType,
                location,
                latitude,
                longitude,
                workType,
                salaryType,
                salary,
                salaryUnit,
                description,
                qualification,
                welfare,
                contactName,
                contactEmail,
                contactPhone,
            },
        });

        // สร้างกิจกรรมเมื่อเผยแพร่ประกาศงาน
        await prisma.activity.create({
            data: {
                companyId: req.company.id,
                type: "published",
                title: "เผยแพร่ประกาศงาน",
                description: `เผยแพร่ประกาศ "${job.title}"`,
            },
        });

        res.status(201).json({
            message: "สร้างประกาศงานสำเร็จ",
            job,
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});
router.get("/jobs/activity", authCompany, async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            where: {
                companyId: req.company.id
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 20
        });

        res.json(activities);

    } catch (error) {
        console.error("GET COMPANY ACTIVITIES ERROR:", error);

        res.status(500).json({
            message: "ไม่สามารถโหลดกิจกรรมได้"
        });
    }
});
// API ดึงประกาศงานของบริษัท
router.get("/jobs", authCompany, async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: {
                companyId: req.company.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                _count: {
                    select: {
                        applications: true,
                    },
                },
            },
        });

        res.json(jobs);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด",
        });
    }
});
// ดูผู้สมัครของประกาศงาน
router.get("/jobs/:id/applicants", authCompany, async (req, res) => {
    try {
        const jobId = Number(req.params.id);



        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                companyId: req.company.id
            },
            include: {
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        logo: true
                    }
                }
            }
        });


        console.log(
            "JOB WITH COMPANY:",
            JSON.stringify(job, null, 2)
        );


        if (!job) {
            return res.status(404).json({
                message: "ไม่พบประกาศงาน"
            });
        }

        const applications = await prisma.application.findMany({
            where: {
                jobId: jobId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        address: true,
                        province: true,
                        nickname: true,
                        gender: true,
                        birthDate: true,
                        educationLevel: true,
                        university: true,
                        faculty: true,
                        major: true,
                        year: true,
                        profileImage: true,
                        skill1: true,
                        skill2: true,
                        skill3: true,
                        skill4: true,
                        skill5: true
                    }
                },
                job: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            job,
            applications
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});
// API ดูรายละเอียดผู้สมัครที่สมัครงาน
router.get(
    "/jobs/:jobId/applicants/:applicationId",
    authCompany,
    async (req, res) => {
        try {

            const jobId = Number(req.params.jobId);
            const applicationId = Number(req.params.applicationId);

            // ตรวจสอบว่าเป็นงานของบริษัทที่ Login อยู่จริง
            const job = await prisma.job.findFirst({
                where: {
                    id: jobId,
                    companyId: req.company.id
                }
            });

            if (!job) {
                return res.status(404).json({
                    message: "ไม่พบประกาศงาน"
                });
            }

            // ค้นหาใบสมัคร
            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    jobId: jobId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                            address: true,
                            province: true,
                            nickname: true,
                            gender: true,
                            birthDate: true,
                            educationLevel: true,
                            university: true,
                            faculty: true,
                            major: true,
                            year: true,
                            profileImage: true,
                            skill1: true,
                            skill2: true,
                            skill3: true,
                            skill4: true,
                            skill5: true
                        }
                    },
                    job: true
                }
            });

            if (!application) {
                return res.status(404).json({
                    message: "ไม่พบข้อมูลผู้สมัคร"
                });
            }

            res.json(application);

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message: "เกิดข้อผิดพลาด"
            });

        }
    }
);
// API เปลี่ยนสถานะผู้สมัคร
// API เปลี่ยนสถานะผู้สมัคร
router.put(
    "/jobs/:jobId/applicants/:applicationId/status",
    authCompany,
    async (req, res) => {
        try {
            const jobId = Number(req.params.jobId);
            const applicationId = Number(req.params.applicationId);
            const { status } = req.body;

            // ตรวจสอบสถานะที่อนุญาต
            const allowedStatus = [
                "pending",
                "interview",
                "accepted",
                "rejected"
            ];

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message: "สถานะไม่ถูกต้อง"
                });
            }

            // ตรวจสอบว่าเป็นงานของบริษัทที่ Login อยู่จริง
            const job = await prisma.job.findFirst({
                where: {
                    id: jobId,
                    companyId: req.company.id
                }
            });

            if (!job) {
                return res.status(404).json({
                    message: "ไม่พบประกาศงาน"
                });
            }

            // ตรวจสอบใบสมัคร
            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    jobId: jobId
                }
            });

            if (!application) {
                return res.status(404).json({
                    message: "ไม่พบข้อมูลผู้สมัคร"
                });
            }

            // เปลี่ยนสถานะ
            const updatedApplication =
                await prisma.application.update({
                    where: {
                        id: applicationId
                    },
                    data: {
                        status: status
                    }
                });

            res.json({
                message: "เปลี่ยนสถานะสำเร็จ",
                application: updatedApplication
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "เกิดข้อผิดพลาด"
            });
        }
    }
);
// ========================================
// API โปรไฟล์บริษัท
// ========================================

// GET ข้อมูลโปรไฟล์บริษัท
router.get("/profile", authCompany, async (req, res) => {
    try {
        const company = await prisma.company.findUnique({
            where: {
                id: req.company.id
            }
        });

        if (!company) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลบริษัท"
            });
        }

        let socialMedia = [];

        if (company.socialMedia) {
            try {
                socialMedia = JSON.parse(company.socialMedia);
            } catch (error) {
                socialMedia = [];
            }
        }

        res.json({
            id: company.id,
            companyName: company.companyName || "",
            businessType: company.businessType || "",
            description: company.description || "",
            contactName: company.contactName || "",
            contactPosition: company.contactPosition || "",
            phone: company.phone || "",
            contactEmail: company.contactEmail || "",
            address: company.address || "",

            // พิกัดบริษัท
            latitude: company.latitude ?? null,
            longitude: company.longitude ?? null,

            website: company.website || "",
            logo: company.logo || "",
            socialMedia
        });

    } catch (error) {
        console.error("GET COMPANY PROFILE ERROR:", error);

        res.status(500).json({
            message: "ไม่สามารถโหลดข้อมูลบริษัทได้"
        });
    }
});


// PUT แก้ไขข้อมูลบริษัท
router.put("/profile", authCompany, async (req, res) => {
    try {
        const {
            companyName,
            businessType,
            description,
            contactName,
            contactPosition,
            phone,
            contactEmail,
            address,
            latitude,
            longitude,
            website,
            socialMedia
        } = req.body;

        const updatedCompany = await prisma.company.update({
            where: {
                id: req.company.id
            },
            data: {
                companyName,
                businessType,
                description,
                contactName,
                contactPosition,
                phone,
                contactEmail,
                address,

                // พิกัดบริษัท
                latitude: latitude ?? null,
                longitude: longitude ?? null,

                website,
                socialMedia: JSON.stringify(
                    Array.isArray(socialMedia) ? socialMedia : []
                )
            }
        });

        res.json({
            message: "บันทึกข้อมูลบริษัทเรียบร้อยแล้ว",
            company: updatedCompany
        });

    } catch (error) {
        console.error("UPDATE COMPANY PROFILE ERROR:", error);

        res.status(500).json({
            message: "ไม่สามารถบันทึกข้อมูลบริษัทได้"
        });
    }
});


// PUT เปลี่ยนโลโก้บริษัท
router.put(
    "/profile/logo",
    authCompany,
    upload.single("logo"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "กรุณาเลือกไฟล์โลโก้"
                });
            }

            const logoPath = `/uploads/company/${req.file.filename}`;

            const updatedCompany = await prisma.company.update({
                where: {
                    id: req.company.id
                },
                data: {
                    logo: logoPath
                }
            });

            res.json({
                message: "เปลี่ยนโลโก้บริษัทเรียบร้อยแล้ว",
                logo: updatedCompany.logo
            });

        } catch (error) {
            console.error("UPDATE COMPANY LOGO ERROR:", error);

            res.status(500).json({
                message: "ไม่สามารถเปลี่ยนโลโก้บริษัทได้"
            });
        }
    }
);
module.exports = router;