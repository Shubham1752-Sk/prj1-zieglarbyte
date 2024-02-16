import React, { useState } from 'react'
import { courseLinks } from '../../../UTILS/Courses-link'

const Sidebar = () => {

  const [hoveredLink, setHoverdLink] = useState()
  const [selectedCourse, setSelectedCourse] = useState()
  return (
    <div className='w-2/12 h-full border-r-2'>
      <div className='h-full flex-col justify-center items-start gap-16'>
        <h1 className='text-2xl font-bold text-black p-2'>Zeiglar Byte</h1>
        <div className='w-full gap-6 text-lg flex flex-col mt-4 '>
          {
            courseLinks.map((courselink) => {
              return (
                <div key={courselink.id}
                  className='w-[99%] ml-0.5'
                  onMouseEnter={() => { 
                    if(selectedCourse !== courselink.id){
                      setHoverdLink(() => courselink.id) }
                    }}
                  onMouseLeave={() => { setHoverdLink(null)}}
                >
                  <p 
                    className={`w-full font-normal cursor-pointer flex items-center gap-2 ${hoveredLink === courselink.id && " bg-yellow-600 text-white font-medium py-2 px-4 duration-75 ease-linear"}`}
                    onClick={()=>{setSelectedCourse(courselink.id);console.log(selectedCourse)}}
                  >
                    <span className={`${selectedCourse === courselink.id && " w-full bg-yellow-600 text-white font-medium py-2 px-4 duration-75 ease-linear"}`}>{courselink.title}</span>
                  </p>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Sidebar