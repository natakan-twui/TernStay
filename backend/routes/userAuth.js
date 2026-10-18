const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config();
console.log("JWT_SECRET =", process.env.JWT_SECRET);
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const decodeFilename = (filename) => {
    try {
        return Buffer.from(filename, "latin1").toString("utf8");
    } catch {
        return filename;
    }
};

const router = express.Router();



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/resumes/");
    },

    filename: (req, file, cb) => {

        const ext = path.extname(file.originalname);

        const filename =
            `resume-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;

        cb(null, filename);
    }
});


const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            ".pdf",
            ".doc",
            ".docx",
            ".rtf"
        ];

        const ext =
            path.extname(file.originalname).toLowerCase();

        if (!allowedTypes.includes(ext)) {

            return cb(
                new Error(
                    "รองรับเฉพาะไฟล์ PDF, DOC, DOCX และ RTF"
                )
            );

        }

        cb(null, true);
    }
});

const fs = require("fs");

const profileImageDir = "uploads/profile-images";

if (!fs.existsSync(profileImageDir)) {
    fs.mkdirSync(profileImageDir, {
        recursive: true
    });
}

const profileImageStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, profileImageDir);
    },

    filename: (req, file, cb) => {

        const ext =
            path.extname(file.originalname).toLowerCase();

        const filename =
            `profile-${req.user?.id || Date.now()}-${Date.now()}${ext}`;

        cb(null, filename);

    }

});

const uploadProfileImage = multer({

    storage: profileImageStorage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            ".png",
            ".jpg",
            ".jpeg"
        ];

        const ext =
            path.extname(file.originalname).toLowerCase();

        if (!allowedTypes.includes(ext)) {

            return cb(
                new Error(
                    "รองรับเฉพาะไฟล์ PNG, JPG และ JPEG"
                )
            );

        }

        cb(null, true);

    }

});
const projectFileDir = "uploads/project-files";

if (!fs.existsSync(projectFileDir)) {
    fs.mkdirSync(projectFileDir, {
        recursive: true
    });
}

const projectFileStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, projectFileDir);
    },

    filename: (req, file, cb) => {

        const ext =
            path.extname(file.originalname).toLowerCase();

        const filename =
            `project-${req.user.id}-${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${ext}`;

        cb(null, filename);
    }

});

const uploadProjectFiles = multer({

    storage: projectFileStorage,

    limits: {
        files: 5,
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            ".pdf",
            ".png",
            ".jpg",
            ".jpeg",
            ".zip"
        ];

        const ext =
            path.extname(file.originalname).toLowerCase();

        if (!allowedTypes.includes(ext)) {

            return cb(
                new Error(
                    "รองรับเฉพาะไฟล์ PDF, PNG, JPG, JPEG และ ZIP"
                )
            );

        }

        cb(null, true);
    }

});
// เพิ่ม Middleware ตรวจ Token
// const auth = (req,res,next) => {
//     const token = req.headers.authorization?.split(" ")[1];

//     if(!token){
//         return res.status(401).json({
//             message: "ไม่ได้เข้าสู่ระบบ"
//         });
//     }
//     try{
//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );

//         req.user = decoded;
//         next();
//     }catch{
//         return res.status(401).json({
//             message: "Token ไม่ถูกต้อง"
//         });
//     }
// };
const auth = (req, res, next) => {

    console.log("Authorization:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token:", token);

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Decoded:", decoded);

        req.user = decoded;

        next();

    } catch (err) {

        console.log(err);

        return res.status(401).json({
            message: "Token ไม่ถูกต้อง"
        });

    }

};
// Register
router.post("/register", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const exisUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (exisUser) {
            return res.status(400).json({
                message: "Email นี้ถูกใช้งานแล้ว"
            });
        }

        const hashPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashPassword,
                role: "user"
            }
        });

        res.json({
            message: "สมัครสมาชิกสำเร็จ",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // หา user จาก email
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "ไม่พบ Email นี้"
            });
        }

        // ตรวจ password
        const checkPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!checkPassword) {
            return res.status(400).json({
                message: "รหัสผ่านไม่ถูกต้อง"
            });
        }

        // สร้าง token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login สำเร็จ",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }

});

// Profile 

router.get("/profile", auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.user.id)
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                nickname: true,
                email: true,
                role: true,

                // วันที่สมัครสมาชิก
                createdAt: true,

                phone: true,
                address: true,
                province: true,
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
                profileImage: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลผู้ใช้"
            });
        }

        res.json(user);

    } catch (err) {
        console.error("GET PROFILE ERROR:", err);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});

// Profile แก้ไขข้อมูล
router.put("/profile", auth, async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            nickname,
            gender,
            birthDate,
            phone,
            address,
            province,
            educationLevel,
            university,
            faculty,
            major,
            year,
            skill1,
            skill2,
            skill3,
            skill4,
            skill5
        } = req.body;

        const user = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                firstName,
                lastName,
                nickname,
                gender,
                birthDate: birthDate ? new Date(birthDate) : null,
                phone,
                address,
                province,
                educationLevel,
                university,
                faculty,
                major,
                year,
                skill1,
                skill2,
                skill3,
                skill4,
                skill5
            }
        });
        res.json({
            message: "อัปเดตข้อมูลสำเร็จ",
            user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });
    }
});
router.put(
    "/profile/image",
    auth,
    uploadProfileImage.single("profileImage"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    message: "กรุณาเลือกรูปภาพ"
                });

            }

            const profileImage =
                `/uploads/profile-images/${req.file.filename}`;

            const user = await prisma.user.update({

                where: {
                    id: Number(req.user.id)
                },

                data: {
                    profileImage
                },

                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    gender: true,
                    birthDate: true,
                    university: true,
                    province: true,
                    major: true,
                    profileImage: true
                }

            });

            res.json({

                message: "เปลี่ยนรูปโปรไฟล์สำเร็จ",

                user

            });

        } catch (error) {

            console.error(
                "UPLOAD PROFILE IMAGE ERROR:",
                error
            );

            res.status(500).json({
                message:
                    "ไม่สามารถเปลี่ยนรูปโปรไฟล์ได้"
            });

        }

    }
);
// สมัครงาน
router.post(
    "/applications",
    auth,
    upload.single("resume"),
    async (req, res) => {

        try {

            const {
                jobId,
                firstName,
                lastName,
                address,
                phone,
                email,
                university,
                major,
                year
            } = req.body;


            // =========================
            // ตรวจว่ามีงานนี้จริง
            // =========================

            const job = await prisma.job.findUnique({
                where: {
                    id: Number(jobId)
                }
            });

            if (!job) {

                return res.status(404).json({
                    message: "ไม่พบประกาศงานนี้"
                });

            }


            // =========================
            // ตรวจว่าสมัครแล้วหรือยัง
            // =========================

            const existingApplication = await prisma.application.findFirst({
                where: {
                    userId: req.user.id,
                    jobId: Number(jobId),
                    status: {
                        not: "cancelled"
                    }
                }
            });

            if (existingApplication) {

                return res.status(400).json({
                    message: "คุณสมัครงานนี้ไปแล้ว"
                });

            }


            // =========================
            // อัปเดตข้อมูล User
            // =========================

            await prisma.user.update({

                where: {
                    id: req.user.id
                },

                data: {
                    firstName,
                    lastName,
                    address,
                    phone,
                    email,
                    university,
                    major,
                    year
                }

            });


            // =========================
            // Resume
            // =========================

            const resumePath = req.file
                ? `/uploads/resumes/${req.file.filename}`
                : null;



            // =========================
            // สร้าง Application
            // =========================

            const application = await prisma.application.create({
                data: {
                    userId: req.user.id,
                    jobId: Number(jobId),
                    status: "pending",
                    resume: resumePath
                }
            });

            // =========================
            // บันทึกกิจกรรมผู้สมัครใหม่
            // =========================

            try {
                const newActivity = await prisma.activity.create({
                    data: {
                        companyId: Number(job.companyId),
                        jobId: Number(job.id),
                        type: "application",
                        title: "มีผู้สมัครงานใหม่",
                        description: `มีผู้สมัครงานในตำแหน่ง ${job.title}`
                    }
                });

                console.log("บันทึกกิจกรรมผู้สมัครสำเร็จ:", newActivity);

            } catch (activityError) {
                console.error("บันทึกกิจกรรมผู้สมัครไม่สำเร็จ:", activityError);
            }

            // =========================
            // ส่งผลการสมัครกลับไปยัง Frontend
            // =========================

            res.status(201).json({
                message: "สมัครงานสำเร็จ",
                application
            });



        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    error.message ||
                    "เกิดข้อผิดพลาดในการสมัครงาน"

            });

        }

    }
);
// ==========================================
// ดึงงานที่ผู้ใช้สมัครไว้
// ==========================================

router.get("/applications/my", auth, async (req, res) => {

    try {

        const applications = await prisma.application.findMany({

            where: {
                userId: req.user.id
            },

            include: {

                job: {
                    include: {
                        company: true
                    }
                }

            },

            orderBy: {
                createdAt: "desc"
            }

        });

        console.log(
            "MY APPLICATIONS:",
            applications
        );

        res.json(applications);

    } catch (error) {

        console.log(
            "GET MY APPLICATIONS ERROR:",
            error
        );

        res.status(500).json({
            message: "ไม่สามารถดึงข้อมูลการสมัครงานได้"
        });

    }

});
// ==========================================
// ยกเลิกการสมัครงาน
// ==========================================

router.put("/applications/:id/cancel", auth, async (req, res) => {
    try {
        const applicationId = Number(req.params.id);
        const userId = Number(req.user.id);

        // ตรวจสอบ ID
        if (isNaN(applicationId)) {
            return res.status(400).json({
                message: "ID ใบสมัครไม่ถูกต้อง"
            });
        }

        // ตรวจสอบว่าใบสมัครเป็นของ User คนนี้
        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                userId: userId
            }
        });

        if (!application) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลการสมัครงาน"
            });
        }

        // ยกเลิกได้เฉพาะตอนรอการพิจารณา
        if (application.status !== "pending") {
            return res.status(400).json({
                message: "ไม่สามารถยกเลิกการสมัครงานนี้ได้"
            });
        }

        // เปลี่ยนสถานะเป็น cancelled
        const updatedApplication = await prisma.application.update({
            where: {
                id: applicationId
            },
            data: {
                status: "cancelled"
            }
        });

        res.json({
            message: "ยกเลิกการสมัครงานสำเร็จ",
            application: updatedApplication
        });

    } catch (error) {
        console.error(
            "CANCEL APPLICATION ERROR:",
            error
        );

        res.status(500).json({
            message: "ไม่สามารถยกเลิกการสมัครงานได้"
        });
    }
});
// ==========================================
// ลืมรหัสผ่าน
// ==========================================
router.put("/forgot-password", async (req, res) => {
    try {
        const { phone, newPassword } = req.body;

        // =========================
        // ตรวจข้อมูล
        // =========================
        if (!phone || !newPassword) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบ"
            });
        }

        // =========================
        // ล้างช่องว่าง
        // =========================
        const cleanPhone = String(phone).trim();

        // =========================
        // ตรวจรูปแบบเบอร์โทรศัพท์
        // =========================
        if (!/^0[0-9]{9}$/.test(cleanPhone)) {
            return res.status(400).json({
                message: "เบอร์โทรศัพท์ไม่ถูกต้อง"
            });
        }

        // =========================
        // ตรวจรหัสผ่านใหม่
        // =========================
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"
            });
        }

        // =========================
        // ค้นหา User จากเบอร์โทร
        // =========================
        const user = await prisma.user.findFirst({
            where: {
                phone: cleanPhone
            }
        });

        // =========================
        // ไม่พบเบอร์ในระบบ
        // =========================
        if (!user) {
            return res.status(404).json({
                message: "ไม่พบเบอร์โทรศัพท์นี้ในระบบ"
            });
        }

        // =========================
        // ตรวจว่ารหัสผ่านใหม่ซ้ำกับของเดิมหรือไม่
        // =========================
        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {
            return res.status(400).json({
                message: "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม"
            });
        }

        // =========================
        // Hash Password ใหม่
        // =========================
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // =========================
        // Update Database
        // =========================
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword
            }
        });

        // =========================
        // Response
        // =========================
        return res.json({
            message: "เปลี่ยนรหัสผ่านสำเร็จ"
        });

    } catch (error) {
        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );

        return res.status(500).json({
            message: "ไม่สามารถเปลี่ยนรหัสผ่านได้"
        });
    }
});

// ==========================================
// เปลี่ยนรหัสผ่าน
// ==========================================

router.put("/change-password", auth, async (req, res) => {

    try {

        const userId = Number(req.user.id);

        const {
            currentPassword,
            newPassword
        } = req.body;


        // =========================
        // ตรวจสอบข้อมูล
        // =========================

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบ"
            });

        }


        if (newPassword.length < 8) {

            return res.status(400).json({
                message:
                    "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"
            });

        }


        // =========================
        // ดึง User
        // =========================

        const user = await prisma.user.findUnique({

            where: {
                id: userId
            }

        });


        if (!user) {

            return res.status(404).json({
                message: "ไม่พบข้อมูลผู้ใช้"
            });

        }


        // =========================
        // ตรวจรหัสผ่านปัจจุบัน
        // =========================

        const isPasswordCorrect =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(400).json({
                message:
                    "รหัสผ่านปัจจุบันไม่ถูกต้อง"
            });

        }


        // =========================
        // ป้องกันใช้รหัสเดิม
        // =========================

        const isSamePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );


        if (isSamePassword) {

            return res.status(400).json({
                message:
                    "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม"
            });

        }


        // =========================
        // Hash Password ใหม่
        // =========================

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        // =========================
        // Update Database
        // =========================

        await prisma.user.update({

            where: {
                id: userId
            },

            data: {
                password: hashedPassword
            }

        });


        res.json({
            message: "เปลี่ยนรหัสผ่านสำเร็จ"
        });


    } catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );

        res.status(500).json({
            message:
                "ไม่สามารถเปลี่ยนรหัสผ่านได้"
        });

    }

});

router.get("/privacy", auth, async (req, res) => {

    try {

        const userId = Number(req.user.id);

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },

            select: {
                searchable: true,
                publicProfile: true,
                hideEmail: true,
                hidePhone: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลผู้ใช้"
            });
        }

        res.json(user);

    } catch (error) {

        console.error(
            "GET PRIVACY ERROR:",
            error
        );

        res.status(500).json({
            message: "ไม่สามารถโหลดการตั้งค่าได้"
        });

    }

});

router.put("/privacy", auth, async (req, res) => {

    try {

        const userId = Number(req.user.id);

        const {
            searchable,
            publicProfile,
            hideEmail,
            hidePhone
        } = req.body;

        const user = await prisma.user.update({
            where: {
                id: userId
            },

            data: {
                searchable: Boolean(searchable),
                publicProfile: Boolean(publicProfile),
                hideEmail: Boolean(hideEmail),
                hidePhone: Boolean(hidePhone)
            },

            select: {
                searchable: true,
                publicProfile: true,
                hideEmail: true,
                hidePhone: true
            }
        });

        res.json({
            message: "บันทึกการตั้งค่าสำเร็จ",
            settings: user
        });

    } catch (error) {

        console.error(
            "UPDATE PRIVACY ERROR:",
            error
        );

        res.status(500).json({
            message: "ไม่สามารถบันทึกการตั้งค่าได้"
        });

    }

});
// ดึงผลงานทั้งหมด
router.get("/projects", auth, async (req, res) => {

    try {

        const projects =
            await prisma.project.findMany({

                where: {
                    userId: Number(req.user.id)
                },

                include: {
                    files: true
                },

                orderBy: {
                    createdAt: "desc"
                }

            });

        res.json(projects);

    } catch (error) {

        console.error(
            "GET PROJECTS ERROR:",
            error
        );

        res.status(500).json({
            message: "ไม่สามารถโหลดผลงานได้"
        });

    }

});
// เพิ่มผลงาน
router.post(
    "/projects",
    auth,
    uploadProjectFiles.array("files", 5),
    async (req, res) => {

        try {

            const {
                name,
                description
            } = req.body;

            if (!name || !name.trim()) {

                return res.status(400).json({
                    message: "กรุณากรอกชื่อผลงาน"
                });

            }

            const project =
                await prisma.project.create({

                    data: {

                        userId:
                            Number(req.user.id),

                        name:
                            name.trim(),

                        description:
                            description?.trim() || null

                    }

                });

            const files = req.files || [];

            if (files.length > 0) {

                await prisma.projectFile.createMany({
                    data: files.map(file => ({
                        projectId: project.id,

                        originalName:
                            decodeFilename(file.originalname),

                        filePath:
                            `/uploads/project-files/${file.filename}`
                    }))
                });

            }

            const result =
                await prisma.project.findUnique({

                    where: {
                        id: project.id
                    },

                    include: {
                        files: true
                    }

                });

            res.status(201).json({

                message: "เพิ่มผลงานสำเร็จ",

                project: result

            });

        } catch (error) {

            console.error(
                "CREATE PROJECT ERROR:",
                error
            );

            res.status(500).json({
                message:
                    error.message ||
                    "ไม่สามารถเพิ่มผลงานได้"
            });

        }

    }
);

// ลบผลงาน
router.delete("/projects/:id", auth, async (req, res) => {

    try {

        const projectId = Number(req.params.id);

        const project =
            await prisma.project.findFirst({

                where: {
                    id: projectId,
                    userId: Number(req.user.id)
                }

            });

        if (!project) {

            return res.status(404).json({
                message: "ไม่พบผลงาน"
            });

        }

        await prisma.project.delete({

            where: {
                id: projectId
            }

        });

        res.json({
            message: "ลบผลงานสำเร็จ"
        });

    } catch (error) {

        console.error(
            "DELETE PROJECT ERROR:",
            error
        );

        res.status(500).json({
            message: "ไม่สามารถลบผลงานได้"
        });

    }

});
module.exports = router;