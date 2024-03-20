import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../SERVICES/operations/CourseOperations"
import { setCourse } from "../../../../../SLICES/CourseSlice"
import IconBtn from "../../../../COMMON/IconBtn"
import Upload from "../Upload"
import { enqueueSnackbar } from "notistack"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const [document, setDocument] = useState("")
  const [isSelected, setSelected] = useState(false)

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (view || edit) {
      console.log("modalData", modalData)
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData()
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo)
    }

    
    const payloadData = {
      sectionId: modalData.sectionId,
      subSectionId: modalData._id,
      title: currentValues.lectureTitle,
      description: currentValues.lectureDesc,
      video: currentValues.lectureVideo
    }

    setLoading(true)
    const result = await updateSubSection(payloadData, token)
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    // console.log(data)
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        enqueueSnackbar("No changes made to the form",{variant:'warning'})
      } else {
        handleEditSubsection()
      }
      return
    }

    if(document){
      console.log("document is present");
    }
    // return
    const payloadData = {
      sectionId: modalData,
      title: data.lectureTitle,
      description: data.lectureDesc,
      video: data?.lectureVideo,
      post: document
    }
    console.log(payloadData)
    setLoading(true)
    const result = await createSubSection(payloadData, token)
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const handleChange = async(event) =>{
    // console.log(event)
    console.log("In the handle Change Function")
    const file = event.target.files[0];
    console.log(file)
    let reader = new FileReader();
    const res = reader.readAsDataURL(file);
    console.log(res)
    reader.onloadend = () =>{
      // console.log(reader.result)
      const result = reader.result
      // console.log(result)
      // console.log(isSelected)
      setDocument(result)
      setSelected(true)
      // console.log(isSelected)
      // console.log("document is: ",document)
    }
  }

  // async function handleChange(e){
  //   e.preventDefault();
  //   console.log("In the handle change func")
  // }

  // useEffect(()=>{
  //   alert('document Changed')
    
  // },[document])
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border bg-white bg-opacity-30">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}

          {
            !modalData.isMedia && (
              <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            docSelected = {isSelected}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
            )
          }
          {
            !view && !edit && (
              <div className="flex gap-4 items-center">
            <label className="text-sm text-richblack-5" htmlFor="document">Documents</label>
            <input
              type="file"
              onChange={handleChange}
              accept=".pdf"
              // {...register("post" )}
            />
          </div>
            )
          }
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture/Document Title {!view && <sup className="text-red-700">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full p-2"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-red-700">
                Lecture/Document title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture/Document Description{" "}
              {!view && <sup className="text-red-700">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc")}
              className="form-style resize-x-none min-h-[130px] w-full p-2"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-red-700">
                Lecture/Document Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
