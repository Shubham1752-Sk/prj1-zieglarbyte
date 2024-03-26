import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import Sidebar from "../components/CORE/DASHBOARD/Sidebar"

function Dashboard() {

  const { loading } = useSelector((state) => state.auth)

  const [viewSideBar, setViewSideBar] = useState(false)
  const [viewHamBurgerMenuButton, setViewHamBurgerMenuButton] = useState(true)

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh)] overflow-y-hidden">
      {
        <div className='sm:hidden w-[100vw] h-16 z-10 absolute bg-[#fac5c5a3]'>
          {viewHamBurgerMenuButton && <GiHamburgerMenu className='absolute sm:hidden mt-4 ml-2 p-2 text-4xl  hover:bg-[#e5e2e2] hover:cursor-pointer' onClick={() => { setViewSideBar((prev) => !prev); setViewHamBurgerMenuButton((prev) => !prev) }} />}
        </div>
      }
      <Sidebar viewSideBar={viewSideBar} setViewSideBar={setViewSideBar} viewHamBurgerMenuButton={viewHamBurgerMenuButton} setViewHamBurgerMenuButton={setViewHamBurgerMenuButton}/>
      <div className="h-full flex overflow-auto ">
        <div className="mx-auto sm:mr-0 w-11/12 max-w-[1000px] py-10 overflow-y-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
