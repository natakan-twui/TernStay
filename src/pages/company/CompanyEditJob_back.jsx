import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


function CompanyEditJob(){

    const {id} = useParams();
    const navigate = useNavigate();


    const [form,setForm] = useState({
        title:"",
        category:"",
        jobType:"",
        location:"",
        workType:"",
        salaryType:"",
        salary:"",
        salaryUnit:"",
        description:"",
        qualification:"",
        welfare:"",
        contactName:"",
        contactEmail:"",
        contactPhone:""
    });



    useEffect(()=>{

        const fetchJob = async()=>{

            const token = localStorage.getItem("companyToken");


            const res = await fetch(
                `http://localhost:5000/api/company/jobs/${id}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );


            const data = await res.json();

            setForm(data);

        };


        fetchJob();

    },[id]);



    const handleChange=(e)=>{

        setForm({
            ...form,
            [e.target.name]:e.target.value
        });

    };



    const handleSubmit=async()=>{


        const token = localStorage.getItem("companyToken");


        await fetch(
            `http://localhost:5000/api/company/jobs/${id}`,
            {
                method:"PUT",

                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                },

                body:JSON.stringify(form)
            }
        );


        alert("แก้ไขประกาศสำเร็จ");

        navigate("/company/dashboard");

    };



    return(
        <div>

            <h1>
                แก้ไขประกาศงาน
            </h1>


            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="ชื่อตำแหน่ง"
            />


            <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="สายงาน"
            />


            <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="สถานที่"
            />


            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="รายละเอียดงาน"
            />


            <button onClick={handleSubmit}>
                บันทึก
            </button>


        </div>
    )

}


export default CompanyEditJob;