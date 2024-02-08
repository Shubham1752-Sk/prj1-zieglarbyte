const express = require('express')
const { auth, isInstructor, isStudent } = require('../MIDDLEWARE/auth')

const {
    createCourse,
    editCourse,
    deleteCourse,
    getInstructorCourses,
    getCourseDetails,
    getFullCourseDetails,
    updateCourseProgress
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

const router = express.Router()

router.post('/addcourse', auth, isInstructor, createCourse)
router.post("/editcourse", auth, isInstructor, editCourse)
router.post('/deletecourse',auth, isInstructor, deleteCourse)
//Add a Section to a Course
router.post("/addsection", auth, isInstructor, createSection)
// Update a Section
router.post("/updatesection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deletesection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updatesubsection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deletesubsection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addsubsection", auth, isInstructor, createSubSection)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

router.post("/getCourseDetails", getCourseDetails)

router.post("/getFullCourseDetails", auth, getFullCourseDetails)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

module.exports = router