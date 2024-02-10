import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { enqueueSnackbar } from "notistack"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
} from "../../../../../SERVICES/operations/CourseOperations"
import {
  fetchCourseCategories,
} from "../../../../../SERVICES/operations/CategoryOperations"
import { setCourse, setStep } from "../../../../../SLICES/CourseSlice"
import { COURSE_STATUS } from "../../../../../UTILS/constants"
import IconBtn from "../../../../COMMON/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementsField"
import Spinner from "../../../../COMMON/IconBtn"
import { useLocation } from "react-router-dom"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const currentLocation = useLocation()
  let courseId

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)

      const categories = await fetchCourseCategories()
      if (categories.length > 0) {
        // console.log("categories", categories)
        setCourseCategories(categories)
      }
      setLoading(false)
    }
    // if form is in edit mode
    if (editCourse) {
      courseId = currentLocation.pathname.split('/').at(-1);

      // console.log("data populated", editCourse)
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data) => {
    
    if (editCourse) {
      // console.log(courseId)
      if (isFormUpdated()) {
        const currentValues = getValues()

        let payloadData ={}
        // console.log(data)
        payloadData.courseId = course._id
        if (currentValues.courseTitle !== course.courseName) {
          payloadData.courseName = data.courseTitle
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          payloadData.courseDescription = data.courseShortDesc
        }
        if (currentValues.coursePrice !== course.price) {
          payloadData.price = data.coursePrice
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          payloadData.tag = JSON.stringify(data.courseTags)
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          payloadData.whatYouWillLearn = data.courseBenefits
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          payloadData.category = data.courseCategory
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          payloadData.instructions = JSON.stringify(data.courseRequirements)
          
        }
        if (currentValues.courseImage !== course.thumbnail) {
          payloadData.thumbnailImage = data.courseImage
        }
        payloadData.token = token
        setLoading(true)
        const result = await editCourseDetails(payloadData, courseId, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        enqueueSnackbar("No changes made to the form",{variant:'error'})
      }
      return
    }

    setLoading(true)
    const payloadData ={
      courseName: data.courseTitle,
      courseDescription: data.courseShortDesc,
      price: data.coursePrice,
      tag: data.courseTags,
      whatYouWillLearn: data.courseBenefits,
      category: data.courseCategory,
      status: COURSE_STATUS.DRAFT,
      instructions: data.courseRequirements,
      thumbnail: data.courseImage
    }

    const result = await addCourseDetails(payloadData, token)
    
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full p-2 text-black placeholder:text-black "
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>
      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] p-2 w-full text-black placeholder:text-black"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>
      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full p-2 !pl-12 text-black placeholder:text-black"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>
      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full p-2 text-black placeholder:text-black"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>
      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] p-2 w-full text-black placeholder:text-black"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={ !editCourse ? "Next" : "Save Changes"}
          type='submit'
        >
          {loading ? <Spinner /> : <MdNavigateNext />}
        </IconBtn>
      </div>
    </form>
  )
}
