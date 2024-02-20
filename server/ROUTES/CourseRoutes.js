const express = require('express')
const { auth, isInstructor, isStudent } = require('../MIDDLEWARE/auth')

const {
    createCourse,
    editCourse,
    deleteCourse,
    getInstructorCourses,
    getCourseDetails,
    getFullCourseDetails,
    updateCourseProgress,
    getAllCourses
} = require('../CONTROLLERS/Course.controller')

const {
    createSection,
    updateSection,
    deleteSection
} = require('../CONTROLLERS/Section.controller')

const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require('../CONTROLLERS/SubSection.controller')

const {
    createRating,
    getAverageRating,
    getAllRatingReview,
  } = require("../CONTROLLERS/RatingandReview.controller")
  
// const {
//     updateCourseProgress,
//     getProgressPercentage,
//   } = require("../CONTROLLERS/courseProgress.controller")

const router = express.Router()

router.post('/addcourse', auth, isInstructor, createCourse)
router.post("/editcourse", auth, isInstructor, editCourse)
router.delete('/deletecourse',auth, isInstructor, deleteCourse)
//Add a Section to a Course
router.post("/addsection", auth, isInstructor, createSection)
// Update a Section
router.post("/updatesection", auth, isInstructor, updateSection)
// Delete a Section
router.delete("/deletesection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updatesubsection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.delete("/deletesubsection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addsubsection", auth, isInstructor, createSubSection)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

router.post("/getCourseDetails", getCourseDetails)

router.post("/getFullCourseDetails", auth, getFullCourseDetails)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

router.get('/getallcourses',getAllCourses)

router.post("/createRating", auth, isStudent, createRating)

router.get("/getAverageRating", getAverageRating)

router.get("/getReviews", getAllRatingReview)
module.exports = router