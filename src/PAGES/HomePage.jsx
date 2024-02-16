import React from 'react'
// import Sidebar from '../components/COMMON/Sidebar'
import Sidebar from '../components/CORE/HOME/Sidebar'
import { courseData } from '../UTILS/CourseData'

const HomePage = () => {
    console.log(courseData[0])
    return (
        <div className='h-screen w-screen flex '>
            <Sidebar />
            <div className='w-full  flex-1 justify-center items-center p-2 gap-4'>
                <div className='w-full h-full flex flex-col'>
                    <div className='p-2'>
                        <h1 className='text-5xl font-serif font-semibold leading-15 text-btn-red'>{courseData[0].heading}</h1>
                        <p className='mt-2 leading-7 text-lg'>{courseData[0].description}</p>
                        <p className='mt-2 text-2xl font-serif text-btn-red font-medium'>Duration: <span className='text-text-gray font-normal'>{courseData[0].duration} hours</span></p>
                    </div>
                    <div className='w-full h-full flex justify-between p-1 gap-2 '>
                        <div className='w-fit h-full '>
                            <p className='text-xl ml-1 font-serif text-btn-red font-medium'>Content to be covered:-</p>
                            {
                                courseData[0].Content.map((content) => {
                                    return <li className=' space-y-4 m-4 ml-8 text'>{content}</li>
                                })
                            }
                        </div>
                        <div className='w-6/12 h-full mr-20 flex flex-col justify-center items-center'>
                            <div className='max-w-[400px] h-[400px] mr-20'>
                                <img className='w-full h-full rounded-full' src={courseData[0].image} alt={courseData[0].imgAltText} />
                            </div>
                            <div className='mx-auto'>
                                <button className='bg-btn-red w-fit text-white mr-14 text-2xl font-semibold rounded-lg p-2 mt-6'>
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HomePage