import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { resetViewCourse } from "../../../../SLICES/viewCourseSlice"
import { generateCertificateData } from "../../../../SERVICES/operations/UserOperations"
// import { certificate } from "../../../utils/certificateTemplate"
// import { PDFDocument, rgb } from "pdf-lib"
// import certificate from "../../../assets/certificate.pdf"

import IconBtn from "../../../COMMON/IconBtn"
import { setData } from "../../../../SLICES/certificate"
// import Certificate from "./Certificate"

export default function VideoDetailsSidebar({ setReviewModal, setViewCertificate, setCertificatePayload }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  // const [viewCertificate, setViewCertificate] = useState(false)
  // const [payload, setPayload] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseName,
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ; (() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname, ])

  const { user, token } = useSelector((state) => state.auth)

  const generateCertificate = async () => {

      await dispatch(generateCertificateData(`${user.firstName} ${user.lastName}`,courseName, token)).then(
        navigate(`/certificate`)
      )
  
  }

  return (
    <>
      <div className=" relative flex h-[calc(100vh-3.5rem)]  w-3/12 flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[35px] w-auto sm:w-[35px] items-center justify-center rounded-full bg-richblack-100 sm:p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} onClick={() => dispatch(resetViewCourse())} />
            </div>
            <IconBtn
              text="Add Review"
              customClasses="ml-auto text-white"
              onclick={() => setReviewModal(true)}
            />
          </div>
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((course, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(course?._id)}
              key={index}
            >
              {/* Section */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {course?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  {/* <span className="text-[12px] font-medium">
                    Lession {course?.subSection.length}
                  </span> */}
                  <span
                    className={`${activeStatus === course?.sectionName
                        ? "rotate-0"
                        : "rotate-180"
                      } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.subSection.map((topic, i) => (
                    <div
                      className={`flex gap-3  px-5 py-2 ${videoBarActive === topic._id
                          ? "bg-yellow-500 text-white font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                        } `}
                      key={i}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        )
                        setVideoBarActive(topic._id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => { }}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {completedLectures.length === totalNoOfLectures && (
          <div className="w-10/12 mx-auto flex justify-center text-lg
           text-white items-center mt-4 p-2 py-4 rounded-md bg-btn-red font-bold">
            <button onClick={generateCertificate}>
              Download Certificate 
            </button>
          </div>
        )
        }
        {/* <img src={certificateURL} alt="certificate" className="absolute bg-black" title="certificate" id="certificate"  height="100px" width="100px" /> */}
      </div>
    </>
  )
}
