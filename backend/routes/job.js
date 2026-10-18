const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();
const router = express.Router();

// อัปโหลด Logo
const logoDir = path.join(__dirname, "../uploads/company-logos");

if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir, { recursive: true });
}

const logoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, logoDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();

        const filename =
            `company-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

        cb(null, filename);
    }
});

const uploadLogo = multer({
    storage: logoStorage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowed = [".png", ".jpg", ".jpeg"];
        const ext = path.extname(file.originalname).toLowerCase();

        if (!allowed.includes(ext)) {
            return cb(
                new Error("รองรับเฉพาะไฟล์ PNG, JPG และ JPEG")
            );
        }

        cb(null, true);
    }
});

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
    } catch {
        return res.status(401).json({
            message: "Token ไม่ถูกต้อง"
        });
    }
};

router.post("/", authCompany, async (req, res) => {
    try {
        console.log("===== CREATE JOB =====");
        console.log("LATITUDE:", req.body.latitude);
        console.log("LONGITUDE:", req.body.longitude);
        console.log("JOB DATA:", req.body);
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
            skills,
            welfare,
            contactName,
            contactEmail,
            contactPhone,
        } = req.body;

        const job = await prisma.job.create({
            data: {
                companyId: Number(req.company.id),

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
                skills: skills || null,
                welfare,

                contactName,
                contactEmail,
                contactPhone,

                status: "open"
            }
        });

        await prisma.activity.create({
            data: {
                companyId: Number(req.company.id),
                jobId: job.id,

                type: "published",

                title: "ประกาศงานถูกเผยแพร่",

                description:
                    `คุณได้เผยแพร่ประกาศงาน ${job.title}`
            }
        });

        res.status(201).json({
            message: "สร้างประกาศงานสำเร็จ",
            job
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});
// เปลี่ยนสถานะการรับสมัคร
router.put("/:id/status", authCompany, async (req, res) => {

    try {

        const jobId = Number(req.params.id);
        const { status } = req.body;

        const allowedStatus = ["open", "closed"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "สถานะไม่ถูกต้อง"
            });
        }

        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                companyId: Number(req.company.id)
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "ไม่พบประกาศงาน"
            });
        }

        const updatedJob = await prisma.job.update({
            where: {
                id: jobId
            },
            data: {
                status
            }
        });

        res.json({
            message:
                status === "open"
                    ? "เปิดรับสมัครสำเร็จ"
                    : "ปิดรับสมัครสำเร็จ",

            job: updatedJob
        });

    } catch (error) {

        console.log("UPDATE JOB STATUS ERROR:", error);

        res.status(500).json({
            message: "ไม่สามารถเปลี่ยนสถานะได้"
        });

    }

});
router.get("/", authCompany, async (req, res) => {
    try {
        console.log("GET COMPANY JOBS RUN");

        const jobs = await prisma.job.findMany({
            where: {
                companyId: Number(req.company.id)
            },

            orderBy: {
                createdAt: "desc"
            },

            include: {
                _count: {
                    select: {
                        applications: true
                    }
                },

                applications: {
                    select: {
                        status: true,
                        createdAt: true
                    }
                }
            }
        });

        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7
        );

        const jobsWithStatistics = jobs.map(job => {

            // เอาเฉพาะผู้สมัครที่ยังไม่ยกเลิก
            const activeApplications = job.applications.filter(
                application => application.status !== "cancelled"
            );

            // ผู้สมัครใหม่ในช่วง 7 วัน
            const newApplicants = activeApplications.filter(
                application =>
                    new Date(application.createdAt) >= sevenDaysAgo
            ).length;

            return {
                ...job,

                // แก้จำนวนผู้สมัครทั้งหมด
                _count: {
                    ...job._count,
                    applications: activeApplications.length
                },

                newApplicants,

                applications: undefined
            };
        });

        console.log(
            "JOBS RESPONSE:",
            jobsWithStatistics
        );

        res.json(jobsWithStatistics);

    } catch (error) {

        console.log(
            "GET COMPANY JOBS ERROR:",
            error
        );

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});

// ========================================
// ดึงกิจกรรมล่าสุดของบริษัท
// ========================================

router.get("/activity", authCompany, async (req, res) => {
    try {
        const companyId = Number(req.company.id);

        console.log("GET COMPANY ACTIVITY");
        console.log("COMPANY ID:", companyId);

        const activities = await prisma.activity.findMany({
            where: {
                companyId: companyId
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 10,
            select: {
                id: true,
                type: true,
                title: true,
                description: true,
                createdAt: true,
                jobId: true
            }
        });

        console.log("ACTIVITIES RESPONSE:", activities);

        res.json(activities);

    } catch (error) {
        console.error("GET COMPANY ACTIVITY ERROR:", error);

        res.status(500).json({
            message: "ไม่สามารถโหลดกิจกรรมได้"
        });
    }
});



// ดึงผู้สมัครของประกาศงาน
router.get("/:id/applicants", authCompany, async (req, res) => {

    try {

        const jobId = Number(req.params.id);

        // ตรวจสอบว่าเป็นงานของบริษัทนี้จริง
        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                companyId: Number(req.company.id)
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "ไม่พบประกาศงาน"
            });
        }

        const applications = await prisma.application.findMany({

            where: {
                jobId: jobId
            },

            orderBy: {
                createdAt: "desc"
            },

            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true, // เพิ่มบรรทัดนี้
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
                        skill1: true,
                        skill2: true,
                        skill3: true,
                        skill4: true,
                        skill5: true,

                        // =========================
                        // ผลงานของผู้สมัคร
                        // =========================
                        projects: {
                            orderBy: {
                                createdAt: "desc"
                            },

                            include: {
                                files: true
                            }
                        }
                    }
                },
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
// ดึงรายละเอียดผู้สมัคร
router.get(
    "/:jobId/applicants/:applicationId",
    authCompany,
    async (req, res) => {

        try {

            const jobId = Number(req.params.jobId);
            const applicationId = Number(req.params.applicationId);

            const application = await prisma.application.findFirst({

                where: {
                    id: applicationId,
                    jobId: jobId,

                    job: {
                        companyId: Number(req.company.id)
                    }
                },

                include: {

                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true, // เพิ่มบรรทัดนี้
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

                            skill1: true,
                            skill2: true,
                            skill3: true,
                            skill4: true,
                            skill5: true,

                            // =========================
                            // ผลงานของผู้สมัคร
                            // =========================
                            projects: {
                                orderBy: {
                                    createdAt: "desc"
                                },

                                include: {
                                    files: true
                                }
                            }
                        }
                    },

                    job: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            jobType: true,
                            location: true,
                            workType: true,
                            salaryType: true,
                            salary: true,
                            salaryUnit: true,
                            companyId: true
                        }
                    }

                }

            });

            if (!application) {

                return res.status(404).json({
                    message: "ไม่พบข้อมูลผู้สมัคร"
                });

            }

            res.json(application);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "เกิดข้อผิดพลาด"
            });

        }

    }
);
// เปลี่ยนสถานะผู้สมัคร
router.put(
    "/:jobId/applicants/:applicationId/status",
    authCompany,
    async (req, res) => {

        try {

            const jobId = Number(req.params.jobId);
            const applicationId = Number(req.params.applicationId);
            const { status } = req.body;

            // สถานะที่อนุญาต
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

            // ตรวจสอบว่า Job เป็นของบริษัทนี้จริง
            const job = await prisma.job.findFirst({
                where: {
                    id: jobId,
                    companyId: Number(req.company.id)
                }
            });

            if (!job) {
                return res.status(404).json({
                    message: "ไม่พบประกาศงาน"
                });
            }

            // ตรวจสอบว่ามีใบสมัครนี้จริง
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
                message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ"
            });

        }

    }
);
// ========================================
// ค้นหาประวัติ Candidate
// ต้อง Login บริษัท
// ========================================
router.get("/candidates", authCompany, async (req, res) => {

    try {

        const { major } = req.query;

        const candidates = await prisma.user.findMany({

            where: {
                role: "user",

                // คนที่เปิดให้บริษัทค้นหาเท่านั้น
                searchable: true,

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

        console.log(
            "SEARCH CANDIDATES ERROR:",
            error
        );

        res.status(500).json({
            message: "ไม่สามารถค้นหาประวัติได้"
        });

    }

});
// ดึงงานตาม id
// ดึงงานตาม id
router.get("/:id", authCompany, async (req, res) => {
    try {
        const jobId = Number(req.params.id);

        // ตรวจสอบว่าเป็นงานของบริษัทนี้จริง
        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                companyId: Number(req.company.id)
            },

            include: {
                company: {
                    select: {
                        companyName: true,
                    }
                }
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "ไม่พบประกาศงาน"
            });
        }

        // วันที่ย้อนหลัง 7 วัน
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7
        );

        // ผู้สมัครทั้งหมด
        // ไม่นับคนที่ยกเลิก
        const totalApplicants = await prisma.application.count({
            where: {
                jobId: jobId,
                status: {
                    not: "cancelled"
                }
            }
        });

        // ผู้สมัครใหม่ใน 7 วัน
        // ไม่นับคนที่ยกเลิก
        const newApplicants = await prisma.application.count({
            where: {
                jobId: jobId,
                status: {
                    not: "cancelled"
                },
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        });

        // จำนวนผู้สมัครที่กำลังพิจารณา
        const pendingApplicants = await prisma.application.count({
            where: {
                jobId: jobId,
                status: "pending"
            }
        });

        // จำนวนผู้สมัครที่ถูกปฏิเสธ
        const rejectedApplicants = await prisma.application.count({
            where: {
                jobId: jobId,
                status: "rejected"
            }
        });

        res.json({
            ...job,

            statistics: {
                total: totalApplicants,
                newApplicants: newApplicants,
                pending: pendingApplicants,
                rejected: rejectedApplicants
            }
        });

    } catch (error) {

        console.log("GET JOB DETAIL ERROR:", error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });

    }
});
// แก้ไขงาน
router.put(
    "/:id",
    authCompany,
    uploadLogo.single("logo"),
    async (req, res) => {

        try {

            const jobId = Number(req.params.id);
            const companyId = Number(req.company.id);

            // ตรวจสอบก่อนว่าเป็นงานของบริษัทนี้
            const existingJob = await prisma.job.findFirst({
                where: {
                    id: jobId,
                    companyId: companyId
                }
            });

            if (!existingJob) {

                return res.status(404).json({
                    message: "ไม่พบประกาศงาน"
                });

            }

            // แก้ไขงาน
            const job = await prisma.job.update({
                where: {
                    id: jobId
                },

                data: {
                    title: req.body.title,
                    category: req.body.category,
                    jobType: req.body.jobType,

                    location: req.body.location,

                    latitude: req.body.latitude
                        ? Number(req.body.latitude)
                        : existingJob.latitude,

                    longitude: req.body.longitude
                        ? Number(req.body.longitude)
                        : existingJob.longitude,

                    workType: req.body.workType,

                    salaryType: req.body.salaryType,

                    salary:
                        req.body.salaryType === "paid"
                            ? Number(req.body.salary)
                            : null,

                    salaryUnit: req.body.salaryUnit,


                    description: req.body.description,
                    qualification: req.body.qualification,
                    skills: req.body.skills ?? null,
                    welfare: req.body.welfare,


                    contactName: req.body.contactName,
                    contactEmail: req.body.contactEmail,
                    contactPhone: req.body.contactPhone,

                    ...(req.file && {
                        logo: `/uploads/company-logos/${req.file.filename}`
                    })
                }
            });



            await prisma.activity.create({
                data: {
                    companyId: companyId,
                    jobId: job.id,
                    type: "edited",
                    title: "มีการแก้ไขประกาศงาน",
                    description: `คุณได้แก้ไขรายละเอียดของงาน ${job.title}`
                }
            });


            console.log("JOB UPDATED:", job);

            res.json({

                message: "แก้ไขสำเร็จ",

                job

            });

        } catch (error) {

            console.log("UPDATE JOB ERROR:", error);

            res.status(500).json({

                message: "เกิดข้อผิดพลาด"

            });

        }

    });

// ลบงาน
router.delete("/:id", authCompany, async (req, res) => {
    try {
        const jobId = Number(req.params.id);

        // เช็คว่าใช่งานของบริษัทตัวเองมั้ย
        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                companyId: Number(req.company.id)
            }
        });
        if (!job) {
            return res.status(404).json({
                message: "ไม่พบประกาศงาน"
            });
        }

        await prisma.job.delete({
            where: {
                id: jobId
            }
        });

        res.json({
            message: "ลบประกาศงานสำเร็จ"
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});

/* ดาวน์โหลดไฟล์โปรเจกต์ของผู้สมัคร */
router.get(
    "/:jobId/applicants/:applicationId/project-files/:fileId/download",
    authCompany,
    async (req, res) => {
        try {
            const jobId = Number(req.params.jobId);
            const applicationId = Number(req.params.applicationId);
            const fileId = Number(req.params.fileId);
            const companyId = Number(req.company.id);

            if (
                !Number.isInteger(jobId) ||
                !Number.isInteger(applicationId) ||
                !Number.isInteger(fileId)
            ) {
                return res.status(400).json({
                    message: "รหัสข้อมูลไม่ถูกต้อง",
                });
            }

            // ตรวจสอบว่าใบสมัครเป็นงานของบริษัทที่เข้าสู่ระบบ
            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    jobId,
                    job: {
                        companyId,
                    },
                },
                select: {
                    userId: true,
                },
            });

            if (!application) {
                return res.status(404).json({
                    message: "ไม่พบข้อมูลผู้สมัคร",
                });
            }

            // ตรวจสอบว่าไฟล์เป็นของผู้สมัครรายนี้จริง
            const file = await prisma.projectFile.findFirst({
                where: {
                    id: fileId,
                    project: {
                        userId: application.userId,
                    },
                },
            });

            if (!file) {
                return res.status(404).json({
                    message: "ไม่พบไฟล์โปรเจกต์",
                });
            }

            // รองรับ filePath ที่บันทึกเป็น /uploads/...
            // หรือ uploads/...

            if (!file.filePath) {
                console.error("PROJECT FILE PATH IS EMPTY:", file);
                return res.status(404).json({
                    message: "ไม่พบตำแหน่งไฟล์ในฐานข้อมูล",
                });
            }


            const relativePath = file.filePath.replace(/^[/\\]+/, "");

            const uploadsRoot = path.resolve(__dirname, "../uploads");

            const absolutePath = path.resolve(
                uploadsRoot,
                relativePath.replace(/^uploads[/\\]/, "")
            );

            console.log("========== DOWNLOAD PROJECT FILE ==========");
            console.log("FILE ID:", file.id);
            console.log("ORIGINAL NAME:", file.originalName);
            console.log("FILE PATH IN DATABASE:", file.filePath);
            console.log("ABSOLUTE PATH:", absolutePath);
            console.log("UPLOADS ROOT:", uploadsRoot);
            console.log("FILE EXISTS:", fs.existsSync(absolutePath));

            if (
                !absolutePath.startsWith(uploadsRoot + path.sep) ||
                !fs.existsSync(absolutePath) ||
                !fs.statSync(absolutePath).isFile()
            ) {
                console.error("PROJECT FILE NOT FOUND:", absolutePath);

                return res.status(404).json({
                    message: "ไม่พบไฟล์ในเซิร์ฟเวอร์",
                });
            }

            return res.download(absolutePath, file.originalName);

        } catch (error) {
            console.error("DOWNLOAD PROJECT FILE ERROR:", error);

            if (!res.headersSent) {
                return res.status(500).json({
                    message: "ไม่สามารถดาวน์โหลดไฟล์ได้",
                });
            }
        }
    }
);

module.exports = router;