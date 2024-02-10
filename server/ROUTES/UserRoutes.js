const express = require("express")
const {auth, isInstructor} = require("../MIDDLEWARE/auth")
const {
    getUserDetails,
    getEnrolledCourses,
    instructorDashboard,
    enrollStudents
} = require("../CONTROLLERS/User.controller")

const router = express.Router()

router.get('/getuserdetails',auth, getUserDetails)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.post('/enroll',enrollStudents)

module.exports = router