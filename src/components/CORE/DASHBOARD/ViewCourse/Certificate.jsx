import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";

const Certificate = ({payload, setViewCertificate}) => {
    const certificateRef = useRef(null);
    const [loading, setLoading] = useState(false)

    console.log("payload is: ",payload)
    const handleDownlaod = async() =>{
        alert("Downloading...")
        setLoading(true)
        html2canvas(certificateRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png')
            console.log("imgData",imgData)
            const pdf = new jsPDF('l','mm',[1000, 670])

            pdf.addImage(imgData, 'PNG', 0,0,1000,667)

            pdf.save(`${payload?.userName}_certificate`)
        })
        setLoading(false)
    }
  return (
    <>
        <div ref={certificateRef} className='absolute w-screen h-full z-100 text-white flex-col justify-center items-center bg-black bg-opacity-35'>
            <div className='mt-[1%] ml-[5%] w-11/12 p-2 text-2xl font-bold flex justify-between items-center '>
                <p className='text-4xl'>Certificate</p>
                <div className='flex items-center'>
                <button className='p-2 '
                    onClick={handleDownlaod}
                >
                    <FaDownload className='text-2xl font-normal' />
                </button>
                <button className='p-2 '
                    onClick={()=> setViewCertificate(false)}
                >
                    <IoClose className='text-3xl' />
                </button>
                </div>
            </div>
            <div className='mt-[1%] ml-[10%] box-border p-4 flex justify-center items-center w-10/12 h-[85%]  text-[#4a4a4c] border bg-slate-100 '>
                <div className='w-full h-full border-8 border-indigo-600 inset-5 flex flex-col gap-5 justify-start items-center  rounded-sm p-4 box-border'>
                    <div className='absolute w-[15rem] h-20 bg-blue-600 rotate-[90deg] mt-16 left-[6.15rem]'></div>
                    <div className='absolute w-[12rem] h-20 bg-blue-400 rotate-[90deg] mt-10 left-[12.65rem]'></div>
                    <div>
                        <h1 className='text-6xl font-bold italic text-blue-900'>Course Completion Certificate</h1>
                    </div>
                    <div className='mt-10'>
                        <p className='text-xl text-center leading-10'>This is to certify that <br/> <span className='text-6xl italic mt-5 text-blue-500'>{payload?.userName}</span> <br/> has Successfully completed {payload?.courseName} by {payload?.instructorName} <br/> on {payload?.dateofCompletion}</p>
                    </div>
                    <img alt="badge" src="https://img.freepik.com/free-vector/blue-ribbon-icon_1063-39.jpg?w=740&t=st=1705408953~exp=1705409553~hmac=8d7df9d9ff4d862b78d8fa5fa95ceda3017e5621247d8a1274b2eaa2bad41525" className='absolute w-[250px] right-[15rem] top-[15rem]' />
                    
                    <div className='absolute w-[15rem] h-20 bg-blue-600 rotate-[90deg] bottom-[7.8rem] right-[2.975rem]'></div>
                    <div className='absolute w-[12rem] h-20 bg-blue-400 rotate-[90deg] bottom-[6.3rem] right-[9.47rem]'></div>
                </div>
            </div>
            
        </div>
    </>
  )
}

export default Certificate