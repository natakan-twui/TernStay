import NavbarCompany from "../../components/NavbarCompany";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyJobs.css";

import {
    FiSearch,
    FiPlus,
    FiDownload,
    FiEye,
    FiEdit,
    FiUsers,
    FiMoreVertical,
    FiBriefcase,
    FiMapPin,
    FiCalendar
} from "react-icons/fi";

function CompanyJobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jobTypeFilter, setJobTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("newest");

    const fetchJobs = async () => {

        try {

            const token = localStorage.getItem("companyToken");

            if (!token) {
                navigate("/company/login");
                return;
            }

            const res = await fetch(
                "http://localhost:5000/api/company/jobs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "ไม่สามารถโหลดประกาศงานได้");
                return;
            }

            setJobs(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error("Fetch company jobs error:", error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    /* =========================
       STATUS
    ========================= */

    const getStatus = (job) => {

        if (job.status === "pending") {
            return {
                label: "รอตรวจสอบ",
                className: "pending"
            };
        }

        if (job.status === "closed") {
            return {
                label: "ปิดรับสมัคร",
                className: "closed"
            };
        }

        if (job.status === "rejected") {
            return {
                label: "ไม่ผ่านการอนุมัติ",
                className: "rejected"
            };
        }

        return {
            label: "เปิดรับสมัคร",
            className: "active"
        };
    };

    /* =========================
       DATE
    ========================= */

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    };

    /* =========================
       FILTER
    ========================= */

    const filteredJobs = useMemo(() => {

        let result = [...jobs];

        /* Search */

        if (search.trim()) {

            const keyword = search.toLowerCase().trim();

            result = result.filter((job) =>
                job.title?.toLowerCase().includes(keyword) ||
                job.category?.toLowerCase().includes(keyword) ||
                job.location?.toLowerCase().includes(keyword)
            );

        }

        /* Status */

        if (statusFilter !== "all") {

            result = result.filter(
                (job) => job.status === statusFilter
            );

        }

        /* Job Type */

        if (jobTypeFilter !== "all") {

            result = result.filter(
                (job) => job.jobType === jobTypeFilter
            );

        }

        /* Date */

        result.sort((a, b) => {

            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            if (dateFilter === "oldest") {
                return dateA - dateB;
            }

            return dateB - dateA;

        });

        return result;

    }, [
        jobs,
        search,
        statusFilter,
        jobTypeFilter,
        dateFilter
    ]);

    /* =========================
       EXPORT CSV
    ========================= */

    const handleExport = () => {

        if (!filteredJobs.length) {
            alert("ไม่มีข้อมูลสำหรับส่งออก");
            return;
        }

        const headers = [
            "ตำแหน่งงาน",
            "สายงาน",
            "ประเภทงาน",
            "สถานะ",
            "ผู้สมัคร",
            "เผยแพร่เมื่อ"
        ];

        const rows = filteredJobs.map((job) => {

            const status = getStatus(job);

            return [
                job.title || "-",
                job.category || "-",
                job.jobType || "-",
                status.label,
                job._count?.applications || 0,
                formatDate(job.createdAt)
            ];

        });

        const csv = [
            headers,
            ...rows
        ]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value).replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "ประกาศงานของฉัน.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    };

    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <>
                <NavbarCompany />



                <div className="company-jobs-page">

                    <div className="company-jobs-loading">
                        กำลังโหลดประกาศงาน...
                    </div>

                </div>
            </>
        );

    }

    return (
        <>
            <NavbarCompany />
            <div className="company-jobs-breadcrumb">
                <button
                    type="button"
                    onClick={() => navigate("/company/dashboard")}
                >
                    งานของฉัน
                </button>

                <span>&gt;</span>

                <span className="breadcrumb-current">
                    งานที่ประกาศ
                </span>
            </div>
            <div className="company-jobs-page">

                {/* ================= HEADER ================= */}

                <section className="company-jobs-header">

                    <div className="company-jobs-header-content">

                        <h1>
                            งานประกาศของฉัน
                        </h1>

                        <p>
                            จัดการและติดตามประกาศงานฝึกงานทั้งหมดของคุณ
                        </p>

                    </div>

                    <button
                        className="company-jobs-add-btn"
                        onClick={() =>
                            navigate("/company/create-job")
                        }
                    >
                        <FiPlus />
                        เพิ่มประกาศงาน
                    </button>

                </section>


                {/* ================= TABLE CARD ================= */}

                <section className="company-jobs-card">

                    {/* ================= FILTER ================= */}

                    <div className="company-jobs-filter">

                        {/* Search */}

                        <div className="company-jobs-search">

                            <FiSearch />

                            <input
                                type="text"
                                placeholder="ค้นหาตำแหน่งงาน..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        {/* Status */}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >

                            <option value="all">
                                สถานะทั้งหมด
                            </option>

                            <option value="active">
                                เปิดรับสมัคร
                            </option>

                            <option value="pending">
                                รอตรวจสอบ
                            </option>

                            <option value="closed">
                                ปิดรับสมัคร
                            </option>

                            <option value="rejected">
                                ไม่ผ่านการอนุมัติ
                            </option>

                        </select>


                        {/* Job Type */}

                        <select
                            value={jobTypeFilter}
                            onChange={(e) =>
                                setJobTypeFilter(e.target.value)
                            }
                        >

                            <option value="all">
                                ประเภทงานทั้งหมด
                            </option>

                            {[...new Set(
                                jobs
                                    .map((job) => job.jobType)
                                    .filter(Boolean)
                            )].map((type) => (

                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>

                            ))}

                        </select>


                        {/* Date */}

                        <select
                            value={dateFilter}
                            onChange={(e) =>
                                setDateFilter(e.target.value)
                            }
                        >

                            <option value="newest">
                                วันที่ประกาศล่าสุด
                            </option>

                            <option value="oldest">
                                วันที่ประกาศเก่าสุด
                            </option>

                        </select>


                        {/* Export */}

                        <button
                            className="company-jobs-export-btn"
                            onClick={handleExport}
                        >
                            <FiDownload />
                            ส่งออกข้อมูล
                        </button>

                    </div>


                    {/* ================= TABLE ================= */}

                    <div className="company-jobs-table-wrapper">

                        <table className="company-jobs-table">

                            <thead>

                                <tr>

                                    <th>
                                        ตำแหน่งงาน
                                    </th>

                                    <th>
                                        ประเภทงาน
                                    </th>

                                    <th>
                                        สถานะ
                                    </th>

                                    <th>
                                        ผู้สมัคร
                                    </th>

                                    <th>
                                        เผยแพร่เมื่อ
                                    </th>

                                    <th>
                                        การจัดการ
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredJobs.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="company-jobs-empty"
                                        >

                                            <FiBriefcase />

                                            <strong>
                                                ไม่พบประกาศงาน
                                            </strong>

                                            <span>
                                                ลองเปลี่ยนคำค้นหาหรือตัวกรอง
                                            </span>

                                        </td>

                                    </tr>

                                ) : (

                                    filteredJobs.map((job) => {

                                        const status = getStatus(job);

                                        return (

                                            <tr key={job.id}>

                                                {/* ตำแหน่ง */}

                                                <td>

                                                    <div className="company-job-title">

                                                        <strong>
                                                            {job.title || "-"}
                                                        </strong>

                                                        <span>
                                                            <FiBriefcase />
                                                            {job.category || "-"}
                                                        </span>

                                                        {job.location && (
                                                            <span>
                                                                <FiMapPin />
                                                                {job.location}
                                                            </span>
                                                        )}

                                                    </div>

                                                </td>


                                                {/* ประเภทงาน */}

                                                <td>

                                                    <span className="job-type-text">
                                                        {job.jobType || "-"}
                                                    </span>

                                                </td>


                                                {/* สถานะ */}

                                                <td>

                                                    <span
                                                        className={`job-status-badge ${status.className}`}
                                                    >

                                                        <span className="status-dot"></span>

                                                        {status.label}

                                                    </span>

                                                </td>


                                                {/* ผู้สมัคร */}

                                                <td>

                                                    <div className="applicant-count">


                                                        <strong>
                                                            {job._count?.applications || 0}
                                                        </strong>

                                                        <span>
                                                            คน
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* วันที่ */}

                                                <td>

                                                    <div className="job-date">

                                                        {formatDate(job.createdAt)}

                                                    </div>

                                                </td>


                                                {/* Actions */}

                                                <td>

                                                    <div className="company-job-actions">

                                                        <button
                                                            className="job-action-view"
                                                            title="ดูรายละเอียด"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/company/jobs/${job.id}`
                                                                )
                                                            }
                                                        >
                                                            <FiEye />

                                                        </button>

                                                        <button
                                                            className="job-action-edit"
                                                            title="แก้ไขประกาศ"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/company/jobs/edit/${job.id}`
                                                                )
                                                            }
                                                        >
                                                            <FiEdit />
                                                            แก้ไข
                                                        </button>

                                                        <button
                                                            className="job-action-applicant"
                                                            title="ดูผู้สมัคร"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/company/jobs/${job.id}/applicants`
                                                                )
                                                            }
                                                        >
                                                            <FiUsers />
                                                            ผู้สมัคร
                                                        </button>

                                                        <button
                                                            className="job-action-more"
                                                            title="เพิ่มเติม"
                                                        >
                                                            <FiMoreVertical />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* ================= FOOTER ================= */}

                    <div className="company-jobs-footer">

                        <span>
                            แสดง {filteredJobs.length} จาก {jobs.length} ประกาศงาน
                        </span>

                    </div>

                </section>

            </div>
        </>
    );
}

export default CompanyJobs;

