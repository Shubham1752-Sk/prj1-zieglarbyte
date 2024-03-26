const Course = require("../MODELS/Course.model")
const Category = require("../MODELS/Category.model")
const Section = require("../MODELS/Section.model")
const SubSection = require("../MODELS/SubSection.model")
const RatingAndReview = require('../MODELS/RatingAndReviews.model')
const User = require("../MODELS/User.model")
const CourseProgress = require("../MODELS/CourseProgress.model")
const { uploadImageToCloudinary } = require("../UTILS/imageUploader")
const { convertSecondsToDuration} = require("../UTILS/secToDuration")

function getCourseDuration(courseDetails){
  // console.log(courseDetails)
  let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        // console.log(subSection?.timeDuration)
        if(subSection?.timeDuration){
          // console.log(subSection.timeDuration)
          const timeDurationInSeconds = parseInt(subSection?.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        }  
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    // return ({...courseDetails, totalDuration})
    return totalDuration
}

exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      discountedPrice,
      tag,
      category,
      status,
      thumbnail,
      instructions,
    } = req.body
    // console.log("body",req.body)

    // Convert the tag and instructions from stringified Array to Array
    // const tag = JSON.parse(_tag)
    // const instructions = JSON.parse(_instructions)

    // console.log("tag", tag)
    // console.log("instructions", instructions)
    // console.log("courseName",courseName)
    // console.log("courseDescription",courseDescription)
    // console.log("whatYouWillLearn",whatYouWillLearn)
    // console.log("price",price)
    // console.log("thumbnail",thumbnail)
    // console.log("category",category)
    // console.log("instructions",instructions)
    console.log("status: ",status)
    // return
    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    // console.log("status is: ",status)
    // return
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    })

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )
    // console.log(thumbnailImage)
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      discountedPrice: discountedPrice ? discountedPrice : 0,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    })

    console.log("new course", newCourse)

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    // console.log(courseId)
    // console.log(updates)
    if(updates.discountedPrice){
      console.log(updates.discountedPrice)
    }
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }
    course.toObject()
    // console.log("course is: ",course)
    // If Thumbnail Image is found, update it
    if (updates.thumbnailImage) {
      console.log("thumbnail update")
      // const thumbnail = req.files.thumbnailImage
      const thumbnail = await uploadImageToCloudinary(
        updates.thumbnailImage,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnail.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          // console.log(`Course key is ${course[key]} update key is ${updates[key]}`)
          course[key] = updates[key]
        }
      }
    }
    // return
    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category") 
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

      console.log(updatedCourse)

      // return

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnroled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    })
    .populate({
      path: "courseContent",
      model: 'Section',
      populate: {
        path: "subSection",
        model: 'SubSection',
        select: "-videoUrl",
      },
    })
    .sort({ createdAt: -1 })

    let instructorCoursesWithDuration = []
  
    for(let course of instructorCourses){
      const duration = getCourseDuration(course)
      // console.log('duartion is: ',duration)
      const courseObject = {...course, duration};
      // courseObject.push(duration)
      // Add the duration property
      courseObject.duration = duration;
      // console.log('course Object is: ',courseObject)
      const courseWithDuration = {...courseObject._doc, duration}
      // console.log('course Object with duration is: ',courseWithDuration)
      // instructorCourses[instructorCourses.indexof(course)] = courseWithDuration
      // console.log('Updated Instructor course is: ',instructorCourses)
      instructorCoursesWithDuration.push(courseWithDuration);
      // Im trying to add duartion property to each object(course) in the array(instructorCourses) but it's not working
      // course.duration = duration
      // course[duration] = `${duration}`
      // course.duration = `${duration}`
      // console.log("updated course: ",course)
    }
    // Return the instructor's courses
    // console.log(instructorCoursesWithDuration)
    res.status(200).json({
      success: true,
      data: instructorCoursesWithDuration,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")  
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDuration = getCourseDuration(courseDetails)
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category") 
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          populate: {
            path: "post",
            model: "Post"
          }
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let SubsectionLength = 0

    courseDetails.courseContent.forEach((content)=>{
      content.subSection.forEach((subSection)=>{
        SubsectionLength+=content.subSection.length;
      })
    })

    const totalDuration = getCourseDuration(courseDetails)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(subsectionId)
    }

    // Save the updated course progress
    await courseProgress.save()

    return res.status(200).json({ message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

exports.getAllCourses = async (req,res) =>{
  
  const role = req?.user?.role
  console.log(role)

  if(role==='Admin'){
    try {
      const courseDetails = await Course.find()
      console.log("In the Admin Dashboard",courseDetails)
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnroled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ 
        success: true,
        allCourses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }
  else{
    try{
      const courses=await Course.find().sort({createdAt: -1})
      .populate("instructor")
      .populate({
        path: "courseContent",
        model: 'Section',
        populate: {
          path: "subSection",
          model: 'SubSection',
          select: "-videoUrl",
        },
      })
      .populate("ratingAndReviews")
      
      let allCourses = []
    
      for(let course of courses){
        const duration = getCourseDuration(course)
        const courseObject = {...course, duration}
        courseObject.duration = duration;
        const courseWithDuration = {...courseObject._doc, duration}
        allCourses.push(courseWithDuration);
      }
      console.log(allCourses)
      return res.status(200).json({
        success: true,
        allCourses
      })
    }
    catch(error){
      console.log(error)
      return res.status(500).json({
        success: false,
        message: `Interval Server Error while Fetching all Courses ${error}`
      })
    }
  }
}