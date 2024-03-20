import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/CORE/DASHBOARD/Sidebar"

function Dashboard() {

  const { loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh)]">
      <Sidebar />
      <div className="h-full flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
