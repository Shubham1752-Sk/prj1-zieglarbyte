import React from "react"
import copy from "copy-to-clipboard"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addToCart } from "../../../SLICES/CartSlice"
import { ACCOUNT_TYPE } from "../../../UTILS/constants"
import { enqueueSnackbar } from "notistack"
import calculateDiscount from "../../../UTILS/calcDiscount"

// const CourseIncludes = [
//   "8 hours on-demand video",
//   "Full Lifetime access",
//   "Access on Mobile and TV",
//   "Certificate of completion",
// ]

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user, token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  console.log(token)

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    enqueueSnackbar("Link copied to clipboard",{variant:'success'})
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      enqueueSnackbar("You are an Instructor. You can't buy a course.",{variant:'error'})
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700  p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl mt-4 object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 flex items-center text-3xl font-semibold">
            {
              course?.discountedPrice ? (
                <>
                <p>
                Rs.<strike className="text-sm"> {course.price}</strike>  /- <span className="text-green-500">{course.discountedPrice} <span className="text-red-500 text-base">{calculateDiscount(course.price, course.discountedPrice)}% OFF</span></span>
                </p>
                <p></p>
                </>
              ) : (
                <p>{course.price}</p>
              )
            }
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="bg-btn-red rounded-full animate-pulse text-white font-bold py-2 hover:animate-none"
              onClick={
                user && course?.studentsEnroled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnroled.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !course?.studentsEnroled.includes(user?._id)) && (
              <button onClick={handleAddToCart} className="border border-btn-red rounded-full py-2 font-bold hover:text-white hover:bg-btn-red ease-in duration-75 ">
                Add to Cart
              </button>
            )}
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              Instruction/ pre-requisites :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard
