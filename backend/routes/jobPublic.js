const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();


// ===============================
// GET งานทั้งหมด สำหรับนักศึกษา
// ===============================
router.get("/", async (req, res) => {
    try {

        const jobs = await prisma.job.findMany({
            where: {
                status: "open"
            },

            orderBy: {
                createdAt: "desc"
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

        res.json(jobs);

    } catch (error) {

        console.log("GET PUBLIC JOBS ERROR:", error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });

    }
});


// ===============================
// GET งานตาม ID สำหรับนักศึกษา
// ===============================
router.get("/:id", async (req, res) => {

    try {

        const jobId = Number(req.params.id);

        console.log("PUBLIC JOB ID:", jobId);

        if (isNaN(jobId)) {
            return res.status(400).json({
                message: "ID งานไม่ถูกต้อง"
            });
        }

        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                status: "open"
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

        console.log("PUBLIC JOB RESULT:", job);
        console.log("PUBLIC LATITUDE:", job?.latitude);
        console.log("PUBLIC LONGITUDE:", job?.longitude);

        if (!job) {

            return res.status(404).json({
                message: "ไม่พบข้อมูลประกาศงาน"
            });

        }

        res.json(job);

    } catch (error) {

        console.log("GET PUBLIC JOB DETAIL ERROR:", error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาด"
        });

    }

});


module.exports = router;