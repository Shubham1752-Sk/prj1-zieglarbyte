import React, { useEffect, useState, useRef } from "react"
// import { BiInfoCircle } from "react-icons/bi"
// import { HiOutlineGlobeAlt } from "react-icons/hi"
// import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import ConfirmationModal from "../../COMMON/ConfirmationModal"
// import RatingStars from "../../COMMON/RatingStars"
import CourseAccordionBar from "../../CORE/Course/CourseAccordionBar"
import CourseDetailsCard from "../../CORE/Course/CourseDetailsCard"
// import { formatDate } from "../../../UTILS/formatDate"
// import { fetchCourseDetails } from "../../../SERVICES/operations/CourseOperations"
// import { BuyCourse } from "../SERVICES/operations/studentFeaturesAPI"
import { addToCart } from "../../../SLICES/CartSlice"
import GetAvgRating from "../../../UTILS/avgRating"
// import Spinner from "../../COMMON/Spinner"
import { enqueueSnackbar } from "notistack"
import { ACCOUNT_TYPE } from "../../../UTILS/constants"

const CourseDetails = ({ selectedCourse }) => {

  const { user, token } = useSelector((state) => state.auth)
  // const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // console.log(user)
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(selectedCourse?.ratingAndReviews)
    setAvgReviewCount(count)
  }, [selectedCourse])

  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e !== id)
    )
  }

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    selectedCourse?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [selectedCourse])

  //   if ( !selectedCourse) {
  //     return (
  //       <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
  //         <Spinner />
  //       </div>
  //     )
  //   }
  //   useEffect(() => {
  //     // Calling fetchCourseDetails fucntion to fetch the details
  //     ;(async () => {
  //       try {
  //         if(selectedCourse){
  //             console.log(selectedCourse)
  //             const res = await fetchCourseDetails()
  //             console.log("course details res: ", res)
  //             setResponse(res)
  //         }
  //       } catch (error) {
  //         console.log("Could not fetch Course Details")
  //       }
  //     })()
  //   }, [])
  // console.log(selectedCourse)
  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnroled,
    createdAt,
    duration
  } = selectedCourse

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      enqueueSnackbar("You are an Instructor. You can't buy a course.", { variant: 'error' })
      return
    }
    if (token) {
      dispatch(addToCart(selectedCourse))
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

  return (
    <>
      <div className="mt-6 sm:mt-0 relative">
        <div className="mx-auto px-4 ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={` my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5 `}
            >
              <div>
                <p className='text-2xl sm:text-5xl font-serif font-semibold leading-15 text-btn-red'>
                  {courseName}
                </p>
              </div>
              <p className={`text-richblack-200 lg:w-8/12 xl:w-10/12 2xl:w-full  `}>{courseDescription}</p>
              {/* ratings */}
              {/* <div className="text-md flex flex-wrap items-center gap-2">
                                <span >{avgReviewCount}</span>
                                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                                <span>{`${studentsEnroled.length} students enrolled`}</span>
                            </div>
                            date of creation
                            <div className="flex flex-wrap gap-5 text-lg">
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <BiInfoCircle /> Created at {formatDate(createdAt)}
                                </p>
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <HiOutlineGlobeAlt /> English
                                </p>
                            </div> */}
              <div>
                <p className="text-2xl font-bold text-btn-red">What You'll learn: </p>
                {
                  whatYouWillLearn.split('\n').map((learning, index) => {
                    return <li key={index} className=" m-2 lg:m-4 ml-6">{learning}</li>
                  })
                }
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-[#c8bfbf] py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold ">
                Rs. {price}
              </p>
              <button className="bg-btn-red rounded-full animate-pulse text-white font-bold py-2 hover:animate-none" >
                Buy Now
              </button>
              <button className="border border-btn-red rounded-full py-2 font-bold hover:text-white hover:bg-btn-red ease-in duration-75" onClick={() => handleAddToCart()}>Add to Cart</button>
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-[2rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-fit translate-y-32 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailsCard
              course={selectedCourse}
              setConfirmationModal={setConfirmationModal}
            //handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">

          {/* Course Content Section */}
          <div className="max-w-[830px] ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span><span className="text-btn-red font-semibold">{duration}</span> total length</span>
                </div>
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Details */}
            {/* <div className="mb-12 py-4">
                      <p className="text-[28px] font-semibold">Author</p>
                      <div className="flex items-center gap-4 py-4">
                        <img
                          src={
                            instructor.image
                              ? instructor.image
                              : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                          }
                          alt="Author"
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                      </div>
                      <p className="text-richblack-50">
                        {instructor?.additionalDetails?.about}
                      </p>
                    </div> */}
          </div>
        </div>
      </div>
      {
        confirmationModal && <ConfirmationModal modalData={confirmationModal} />
      }
    </>
  )
}

export default CourseDetails