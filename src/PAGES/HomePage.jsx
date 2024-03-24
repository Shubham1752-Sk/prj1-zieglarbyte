import React, { useEffect, useRef, useState } from 'react'
// import Sidebar from '../components/COMMON/Sidebar'
import Sidebar from '../components/CORE/HOME/Sidebar'
// import { courseData } from '../UTILS/CourseData'
import { getAllCoursesHomePage } from '../SERVICES/operations/CourseOperations'
import Spinner from "../components/COMMON/Spinner"
import CourseDetails from '../components/CORE/HOME/CourseDetails'
import { GiHamburgerMenu } from "react-icons/gi";

const HomePage = () => {

    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState()
    const [loading, setLoading] = useState(true)
    const [viewSideBar, setViewSideBar] = useState(false)
    const [viewHamBurgerMenuButton, setViewHamBurgerMenuButton] = useState(true)

    const getCourses = async () => {
        const result = await getAllCoursesHomePage()
        if (result) {
            setCourses(result)
        }
        setSelectedCourse(result[0])
    }

    useEffect(() => {
        document.title = "Zieglar Byte | Courses"
        setLoading(true)
        getCourses()
        setLoading(false)
    }, [])

    return (
        <div className='h-screen w-screen flex overflow-hidden '>
            {
                loading ? <Spinner /> :
                    <>
                        <div className="relative flex h-100vh">
                            {
                                <div className='sm:hidden w-[100vw] h-16 z-10 absolute bg-[#fac5c5a3]'>
                                    {viewHamBurgerMenuButton && <GiHamburgerMenu className='absolute sm:hidden mt-4 ml-2 p-2 text-4xl  hover:bg-[#e5e2e2] hover:cursor-pointer' onClick={() => { setViewSideBar((prev) => !prev); setViewHamBurgerMenuButton((prev) => !prev) }} />}
                                </div>
                            }
                            <Sidebar courses={courses} setSelectedCourse={setSelectedCourse} selectedCourse={selectedCourse} viewSideBar={viewSideBar} setViewSideBar={setViewSideBar} viewHamBurgerMenuButton={viewHamBurgerMenuButton} setViewHamBurgerMenuButton={setViewHamBurgerMenuButton} />
                            <div className="h-full md:w-[calc(100vw-10vw)] overflow-y-auto overflow-x-hidden">
                                <div className='p-4'>
                                    {
                                        selectedCourse && <CourseDetails selectedCourse={selectedCourse} />
                                    }
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>

    )
}

export default HomePage