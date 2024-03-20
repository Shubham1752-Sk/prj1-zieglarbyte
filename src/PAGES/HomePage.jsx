import React, { useEffect, useState } from 'react'
// import Sidebar from '../components/COMMON/Sidebar'
import Sidebar from '../components/CORE/HOME/Sidebar'
// import { courseData } from '../UTILS/CourseData'
import { getAllCoursesHomePage } from '../SERVICES/operations/CourseOperations'
import Spinner from "../components/COMMON/Spinner"
import CourseDetails from '../components/CORE/HOME/CourseDetails'

const HomePage = () => {

    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState()
    const [loading, setLoading] = useState(true)

    const getCourses = async () => {
        const result = await getAllCoursesHomePage()
        if (result) {
            setCourses(result)
        }
        setSelectedCourse(result[0])
    }

    useEffect(() => {
        document.title = "Home | Courses"
        setLoading(true)
        getCourses()
        setLoading(false)
    }, [])

    useEffect(() => {
        console.log(selectedCourse)
    }, [selectedCourse])
    // console.log(selectedCourse)
    return (
        <div className='h-screen w-screen flex overflow-hidden '>
            {
                loading ? <Spinner /> :
                    <>
                        <div className="relative flex h-100vh">
                            <Sidebar courses={courses} setSelectedCourse={setSelectedCourse} selectedCourse={selectedCourse} />
                            <div className="h-full md:w-[calc(100vw-10vw)] overflow-y-auto overflow-x-hidden">
                                <div className='p-4'>
                                    {
                                        selectedCourse && <CourseDetails selectedCourse={selectedCourse} />
                                    }
                                </div>                                
                            </div>
                        </div>
                        {/* <Sidebar courses={courses} setSelectedCourse={setSelectedCourse} selectedCourse={selectedCourse} /> */}
                        {/* <div className='w-full  flex-1 justify-center items-center p-2 gap-4'>
                            <div className='w-full h-full '> */}
                                {/* <img src={selectedCourse.thumbnail} alt="thumbnail" className=' aspect-auto w-11/12 mx-auto lg:hidden'/> */}
                                {
                                    
                                }
                                {/* <div className='p-2'>
                        <h1 className='text-2xl sm:text-5xl font-serif font-semibold leading-15 text-btn-red'>{selectedCourse?.courseName}</h1>
                        <p className='mt-2 leading-7 text-base sm:text-lg'>{selectedCourse?.courseDescription}</p>
                        <p className='mt-2 text-lg sm:text-2xl font-serif text-btn-red font-medium'>Duration: <span className='text-text-gray font-normal'>{selectedCourse?.duration} </span></p>
                    </div>
                    <div className='w-full h-fit bg-white flex justify-between p-1 '>
                        <div className='w-4/2 h-fit  '>
                            <p className=' text-base sm:text-xl ml-1 font-serif text-btn-red font-medium'>Content to be covered:-</p>
                            {
                                selectedCourse?.whatYouWillLearn?.split('\n').map((learning,index)=>{
                                    return <li key={index}
                                        className='m-2 ml-6 text-base sm:text-lg'
                                    >{learning}</li>
                                })   
                            }
                            <div className='mx-auto block md:hidden'>
                                <button className='bg-btn-red w-fit text-white mr-14 text-2xl font-semibold rounded-lg p-2 mt-6'>
                                    Continue
                                </button>
                            </div>
                        </div>
                        <div className='w-6/12 hidden md:flex h-fit mr-20 flex-col justify-between items-center'>
                            <div className='md:max-w-[300px] h-[220px] md:max-h-[270px] lg:h-[300px]  mr-1 md:mr-20'>
                                <img className='w-full h-full rounded-full' src={selectedCourse?.thumbnail} alt="Thumbnail-img" />
                            </div>
                            <div >
                                <button className='bg-btn-red w-fit mx-auto text-white mr-14 text-2xl font-semibold rounded-lg p-2 mt-6'>
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        selectedCourse && <CourseDetails selectedCourse={selectedCourse} />
                    } */}
                            {/* </div>
                        </div> */}
                    </>
            }
        </div>

    )
}

export default HomePage