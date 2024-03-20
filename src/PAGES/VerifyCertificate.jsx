import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCertificateDetails } from '../SERVICES/operations/UserOperations'
import { formatDate } from '../UTILS/formatDate'

const VerifyCertificate = () => {
    const { certificateId } = useParams()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState()
    let result
    useEffect(() => {
        ; (async () => {
            setLoading(true)
            result = await getCertificateDetails(certificateId)
            console.log(result)
            setData(result)
            setLoading(false)
        })()
    }, [])
    return (
        <div className='w-full h-screen flex justify-center items-center'>
        <img src='/logo.png' className='absolute top-4 w-[150px]' alt="logo" />
            {
                !loading && (
                    <div className='w-fit border p-4 space-y-4 mt-15'>
                        <h1 className='text-4xl text-center font-bold'> Certificate Details</h1>
                        <div className='flex gap-4 text-xl'>
                            <div className='flex flex-col gap-4'>
                            <div className='w-fit flex justify-between'>
                                    <h1 className='text-btn-red text-xl'>Certificate Holder Name : </h1>
                                </div>
                                <div className='w-full flex justify-between'>
                                    <h1 className='text-btn-red text-xl'>Course Name  </h1>
                                    <span className='text-end text-btn-red'>:</span> 
                                </div>
                                <div className='w-full flex justify-between'>
                                    <h1 className='text-btn-red text-xl'>Date of Completion </h1>
                                    <span className='text-end text-btn-red'>:</span> 
                                </div>
                                <div className = 'w-full flex justify-between'> 
                                    <h1 className='text-btn-red '>Certificate ID</h1>
                                    <span className='text-end text-btn-red'>:</span> 
                                </div>
                                <div className='w-full flex justify-between'>
                                    <h1 className='text-btn-red text-xl'>Issued By </h1>
                                    <span className='text-end text-btn-red'>:</span> 
                                </div>
                            </div>
                            <div className='flex flex-col gap-4'>
                            <div>
                                    <span className='text-text-gray'>{data?.name}</span>
                                </div>
                                <div>
                                    <span className='text-text-gray'>{data?.courseName}</span>
                                </div>
                                <div>
                                    <span className='text-text-gray'>{formatDate(data?.dateOfCompletion)}</span>
                                </div>
                                <div>
                                    <span className='text-text-gray'>{data?._id}</span>
                                </div>
                                <div>
                                    <span className='text-text-gray'>Zieglar Byte</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default VerifyCertificate