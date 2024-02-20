import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { resetViewCourse } from "../../../../SLICES/viewCourseSlice"
// import { certificate } from "../../../utils/certificateTemplate"
// import { PDFDocument, rgb } from "pdf-lib"
// import certificate from "../../../assets/certificate.pdf"

import IconBtn from "../../../COMMON/IconBtn"
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

  const { user } = useSelector((state) => state.auth)

  const generateCertificate = async () => {
  
    const payload = {
      courseName: courseEntireData.courseName,
      instructorName: `${courseEntireData.instructor.firstName} ${courseEntireData.instructor.lastName}`,
      userName: `${user.firstName} ${user.lastName}`,
      dateofCompletion: new Date().toLocaleDateString('en-US')
    }
    console.log(payload)
    setCertificatePayload(payload)
    setViewCertificate(true)
    // const generatedCertificate = certificateTemplate(userName, courseName, instructorName, dateofCompletion)
    // setCertificateURL(certificate(userName, courseName, instructorName, dateofCompletion))
    // console.log(certificateURL)
    // document.querySelector("#certificate").src = generatedCertificate
    
    // // alert("Download Certiificate")
    // console.log(courseEntireData)

    // const courseName= courseEntireData.courseName
    // const payload = {
    //   courseName: courseEntireData.courseName,
    //   instructorName: `${courseEntireData.instructor.firstName} ${courseEntireData.instructor.lastName}`,
    //   userName: `${user.firstName} ${user.lastName}`,
    //   dateofCompletion: new Date().toLocaleDateString('en-US')
    // }
    // console.log(payload)

    // const execBytes = await fetch(certificate).then((res)=>{
    //   return res.arrayBuffer()
    // });

    // const pdfDoc = await PDFDocument.load(execBytes)
    // console.log(pdfDoc)

    // const uri = await pdfDoc.saveAsBase64({dataUri: true})
    // // console.log(uri)
    // document.querySelector("#certificate").src = uri;

    // const pages = pdfDoc.getPages();
    // const firstPg = pages[0];

    // firstPg.drawText(courseName,{
    //   x : 35, y : 789 , size : 12,
    // })
    // const url = window.URL.createObjectURL(uri);
    // const link = document.createElement('a');
    // link.href = url;
    //   link.download = 'downloaded-file';

    //   // Append the link to the document
    //   document.body.appendChild(link);

    //   // Trigger the download
    //   link.click();
    // const pdfBytes = await pdfDoc.save()
  }

  return (
    <>
      <div className=" relative flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} onClick={() => dispatch(resetViewCourse())} />
            </div>
            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
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
                          ? "bg-yellow-200 font-semibold text-richblack-800"
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
          <div className="w-10/12 mx-auto flex justify-center items-center mt-4 p-2 py-4 rounded-md bg-yellow-100 text-gray-500 font-bold">
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
