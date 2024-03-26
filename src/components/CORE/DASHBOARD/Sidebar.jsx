import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { sidebarLinks } from "../../../UTILS/dashboard-links"
import { logout } from "../../../SERVICES/operations/AuthOperations"
import { RxCross2 } from "react-icons/rx";

import ConfirmationModal from "../../COMMON/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar({ viewSideBar, setViewSideBar, viewHamBurgerMenuButton, setViewHamBurgerMenuButton }) {
  const { user, loading } = useSelector(
    (state) => state.auth
  )

  const dispatch = useDispatch()
  const navigate = useNavigate()
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (loading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className={`${viewSideBar && "ease-out w-full origin-right transition-[width] duration-[.5s] z-10 "} ${viewSideBar ? "block absolute w-full bg-white z-20" : " relative"} `}>
        <div className={`flex h-[100vh] sm:h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] py-10 sm:block ${!viewSideBar && "w-0 hidden"}`}>
          <RxCross2 className={`sm:hidden -mt-4 ml-2 p-2 text-4xl hover:bg-[#e5e2e2] hover:cursor-pointer ${viewSideBar && !viewHamBurgerMenuButton && "block"}`} onClick={() => { setViewSideBar((prev) => !prev); setViewHamBurgerMenuButton((prev) => !prev) }} />
          <div className="flex flex-col">
            {sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null
              return (
                <SidebarLink key={link.id} link={link} iconName={link.icon} viewSideBar={viewSideBar} setViewSideBar={setViewSideBar} setViewHamBurgerMenuButton={setViewHamBurgerMenuButton}/>
              )
            })}
          </div>
          <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
          <div className="flex flex-col">
            <SidebarLink
              link={{ name: "Settings", path: "/dashboard/settings" }}
              iconName="VscSettingsGear"
            />
            <button
              onClick={() =>
                setConfirmationModal({
                  text1: "Are you sure?",
                  text2: "You will be logged out of your account.",
                  btn1Text: "Logout",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(logout(navigate)),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
              className="px-8 py-2 text-sm font-medium text-richblack-300"
            >
              <div className="flex items-center gap-x-2">
                <VscSignOut className="text-lg" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      </div>
    </>
  )
}
