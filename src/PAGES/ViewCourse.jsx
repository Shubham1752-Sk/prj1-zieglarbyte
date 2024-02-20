import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/CORE/DASHBOARD/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/CORE/DASHBOARD/ViewCourse/VideoDetailsSidebar"
// import Certificate from "../components/CORE/DASHBOARD/Certificate"
import { getFullDetailsOfCourse } from "../SERVICES/operations/CourseOperations"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../SLICES/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [viewCertificate, setViewCertificate] = useState(false)
  const [certificatePayload, setCertificatePayload] = useState("")

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      // console.log("Course Data here... ", courseData.courseDetails)
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="relative flex h-[100vh]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} setViewCertificate={setViewCertificate} setCertificatePayload={setCertificatePayload} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
      {/* { viewCertificate && <Certificate payload={certificatePayload} setViewCertificate={setViewCertificate} />} */}
    </>
  )
}
