import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player, ControlBar, ForwardControl, ReplayControl, PlaybackRateMenuButton, ClosedCaptionButton } from "video-react"
import { Worker, Viewer } from '@react-pdf-viewer/core';

import { markLectureAsComplete } from "../../../../SERVICES/operations/CourseOperations"
import { updateCompletedLectures } from "../../../../SLICES/viewCourseSlice"
import IconBtn from "../../../COMMON/IconBtn"
import { enqueueSnackbar } from "notistack"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    ; (async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        // console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        // console.log("filteredData", filteredData)
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        // console.log("filteredVideoData", filteredVideoData)
        setVideoData(filteredVideoData[0])
        // console.log(videoData)
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const {timeDuration: totalDuration} = videoData
    const minWatchTime = Math.floor(totalDuration * 25/100)
    // console.log(minWatchTime)
    // console.log("durration",duration)
    if(duration < minWatchTime){
      enqueueSnackbar(`You need to see minimun 25% of video i.e. ${Math.floor(minWatchTime/60)} mins`,{variant:'info'})
      setLoading(false)
      return
    }
    else{
      const res = await markLectureAsComplete(
        { courseId: courseId, subsectionId: subSectionId },
        token
      )
      if (res) {
        dispatch(updateCompletedLectures(subSectionId))
      }
    }
    setLoading(false)
  }

  const handlePlayState = () =>{
    console.log("In the play function")
    setIsPlaying(true)
    console.log(playerRef.current.getState().operation.operation.action)
   
  }

  const handlePauseState = () =>{
    console.log("In the pause function")
    setIsPlaying(false)
    console.log(playerRef.current.getState())
  }

  useEffect(()=>{
    let interval
    if(isPlaying){
      interval = setInterval(()=>{
        setDuration((duration)=> duration+1)
        // console.log(duration)
      },1000)
      // console.log(duration)
    }
    return () =>{
      clearInterval(interval)
    }
  },[isPlaying])

  // if(!videoData.isMedia){
  //   console.log(duration)
  // }

  useEffect(()=>{
    setDuration(0)
  },[sectionId, subSectionId])

  
    
  return (
    <div className=" relative flex flex-col gap-5 ">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <>
          {
            videoData.isMedia ? (
              <div className="flex flex-col gap-4">
                <div className="w-full h-fit mt-2 text-end">
                  <button 
                    className="w-fit p-3 bg-btn-red rounded-md font-semibold text-lg text-white"
                    disabled={loading}
                    onClick={() => handleLectureCompletion()}
                  >
                    Mark Completed
                  </button>
                </div>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={videoData.post.file} />
                </Worker> 
              </div>) : (
              <>
                <Player
                  ref={playerRef}
                  playsInline
                  onPause={()=>setIsPlaying(false)}
                  onPlay={()=>setIsPlaying(true)}
                  onEnded={() => setVideoEnded(true)}
                  src={videoData?.videoUrl}
                >
                  <source
                    src={videoData?.videoUrl}
                    type="video/mp4"
                  />
                  <track
                    kind="captions"
                    src={videoData?.videoUrl}
                    srcLang="en"
                    label="English"
                    default
                  />
                  <track
                    kind="chapters"
                    src={videoData?.videoUrl}
                    srcLang="en"
                    label="English"
                  />
                  <BigPlayButton position="center" />
                  <ControlBar >
                    <ReplayControl seconds={5} order={2.1} />
                    <ForwardControl seconds={5} order={3.1} />
                    <PlaybackRateMenuButton rates={[ 2, 1.5, 1, 0.5]} />
                    {/* <ClosedCaptionButton order={7} /> */}
                  </ControlBar>
                  {/* Render When Video Ends */}
                  {videoEnded && (
                    <div
                      style={{
                        backgroundImage:
                          "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                      }}
                      className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                    >
                      {!completedLectures.includes(subSectionId) && (
                        <IconBtn
                          disabled={loading}
                          onclick={() => handleLectureCompletion()}
                          text={!loading ? "Mark As Completed" : "Loading..."}
                          customClasses="text-xl text-white bg-black max-w-max px-4 mx-auto"
                        />
                      )}
                      <IconBtn
                        disabled={loading}
                        onclick={() => {
                          if (playerRef?.current) {
                            // set the current time of the video to 0
                            playerRef?.current?.seek(0)
                            setVideoEnded(false)
                            playerRef?.current?.play()
                          }
                        }}
                        text="Rewatch"
                        customClasses="text-xl text-white max-w-max px-4 mx-auto mt-2"
                      />
                      <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                        {!isFirstVideo() && (
                          <button
                            disabled={loading}
                            onClick={goToPrevVideo}
                            className="text-white text-base bg-black bg-opacity-20 p-2 rounded-md"
                          >
                            Prev
                          </button>
                        )}
                        {!isLastVideo() && (
                          <button
                            disabled={loading}
                            onClick={goToNextVideo}
                            className="text-white text-base bg-black bg-opacity-20 p-2 rounded-md"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Player>
                <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
                <p className="pt-2 pb-6">{videoData?.description}</p>
              </>
            )
          }
          
        </>
      )}
    </div>
  )
}

export default VideoDetails
// video
