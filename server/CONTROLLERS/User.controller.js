const User = require("../MODELS/User.model")
const Profile = require('../MODELS/Profile.model')
const Course = require("../MODELS/Course.model")
const CourseProgress = require("../MODELS/CourseProgress.model")
const { convertSecondsToDuration } = require("../UTILS/secToDuration")
const { uploadImageToCloudinary } = require('../UTILS/imageUploader')

exports.getUserDetails = async (req, res) => {
    try {
    
      const id = req.user.id
      const userDetails = await User.findById(id).populate("additionalDetails")
        
      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find()
  
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
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }

  function getCourseDuration(courseDetails){
    let subSectionLength = 0
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
          subSectionLength++
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
      // return ({...courseDetails, totalDuration})
      return {totalDuration, subSectionLength}
  }

  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      console.log(userDetails.courses)

      for(var i = 0; i< userDetails.courses.length; i++){
        // let duration = 
        let {totalDuration: duration, subSectionLength} = getCourseDuration(userDetails.courses[i])
        // console.log("duration: ",duration)
        // console.log("sub Section Length: ",subSectionLength)
        userDetails.courses[i].totalDuration = duration
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        // console.log(courseProgressCount)
        courseProgressCount = courseProgressCount?.completedVideos.length
        // console.log("no of videos: ",courseProgressCount)
        console.log(subSectionLength)
        if (subSectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / subSectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
      // for (var i = 0; i < userDetails.courses.length; i++) {
      //   let totalDurationInSeconds = 0
      //   SubsectionLength = 0
      //   for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
      //     totalDurationInSeconds += userDetails.courses[i].courseContent[
      //       j
      //     ].subSection.reduce((acc, curr) => acc + parseInt(curr?.timeDuration), 0)
      //     userDetails.courses[i].totalDuration = convertSecondsToDuration(
      //       totalDurationInSeconds
      //     )
      //     SubsectionLength +=
      //       userDetails.courses[i].courseContent[j].subSection.length
      //   }
      //   let courseProgressCount = await CourseProgress.findOne({
      //     courseID: userDetails.courses[i]._id,
      //     userId: userId,
      //   })
      //   courseProgressCount = courseProgressCount?.completedVideos.length
      //   if (SubsectionLength === 0) {
      //     userDetails.courses[i].progressPercentage = 100
      //   } else {
      //     // To make it up to 2 decimal point
      //     const multiplier = Math.pow(10, 2)
      //     userDetails.courses[i].progressPercentage =
      //       Math.round(
      //         (courseProgressCount / SubsectionLength) * 100 * multiplier
      //       ) / multiplier
      //   }
      // }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.enrollStudents = async (req, res) => {
    // if (!courses || !userId) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Please Provide Course ID and User ID" })
    // }
    const {courses, userId} = req.body
    console.log('courses are: ',courses)

      try {
        // Find the course and enroll the student in it
        
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courses },
          { $push: { studentsEnroled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courses,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courses,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        res.status(200).json({
          success: true
        })
        } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    
  }

  exports.updateDisplayPicture = async (req, res) => {
    try {
      console.log(req.body)
      console.log(req.files)
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.updateProfile = async (req, res) => {
    try {
      const {
        firstName = "",
        lastName = "",
        dateOfBirth = "",
        about = "",
        contactNumber = "",
        gender = "",
      } = req.body
      const id = req.user.id
  
      // Find the profile by id
      const userDetails = await User.findById(id)
      const profile = await Profile.findById(userDetails.additionalDetails)
  
      const user = await User.findByIdAndUpdate(id, {
        firstName,
        lastName,
      })
      await user.save()
  
      // Update the profile fields
      profile.dateOfBirth = dateOfBirth
      profile.about = about
      profile.contactNumber = contactNumber
      profile.gender = gender
  
      // Save the updated profile
      await profile.save()
  
      // Find the updated user details
      const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()
  
      return res.json({
        success: true,
        message: "Profile updated successfully",
        updatedUserDetails,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }
  