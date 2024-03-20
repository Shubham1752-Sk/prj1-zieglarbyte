import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ courses, setSelectedCourse, selectedCourse }) => {

  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [hoveredLink, setHoverdLink] = useState()

  const filterCourse = (id) => {
    const filteredCourse = courses.filter((course) => course._id === id)
    setSelectedCourse(filteredCourse[0])
    // console.log(filteredCourse)
  }

  return (
    <div className='w-3/12 sm:w-2/12  h-full border-r-2'>
      <div className='h-full flex-col justify-center items-start gap-16'>
        <h1 className='text-lg sm:text-2xl font-bold text-black p-2'>Zieglar Byte</h1>
        <div className='w-full sm:h-[77%] h-[80%] overflow-y-scroll gap-6 text-lg flex flex-col mt-4 overflow-auto overflow-x-hidden p-1'>
          {
            courses.map((course) => {
              return (
                <div key={course._id}
                  className='w-[99%] ml-0.5'
                  onMouseEnter={() => {
                    if (selectedCourse._id !== course._id) {
                      setHoverdLink(() => course._id)
                    }
                  }}
                  onMouseLeave={() => { setHoverdLink(null) }}
                >
                  <p
                    className={`w-full font-normal cursor-pointer flex items-center gap-2 ${hoveredLink === course._id && " bg-yellow-600 text-white font-medium py-2 px-4 duration-75 ease-linear"}`}
                    onClick={() => filterCourse(course._id)}
                  >
                    <span className={`text-base sm:text-lg md:text-xl${selectedCourse._id === course._id && " w-full bg-yellow-600 text-white font-medium py-2 px-4 duration-75 ease-linear"}`}>{course.courseName}</span>
                  </p>
                </div>
              )
            })
          }
        </div>
        <div className='p-2 flex justify-center '>
          <div className='w-full md:w-10/12 lg:w-full bg-btn-red text-white text-sm md:text-lg sm:text-lg p-1 lg:p-3 rounded-md m font-semibold text-center hover:cursor-pointer '
            onClick={() => {
              if (!token) {
                navigate('/login')
              } else {
                navigate('/dashboard/my-profile')
              }
            }}
          >
            {
              !token ? "Login" : "Dashboard"
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar