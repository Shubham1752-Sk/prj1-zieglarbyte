const express = require("express")
const {auth} = require("../MIDDLEWARE/auth")
const {
    getUserDetails,
    // getEnrolledCourses,
} = require("../CONTROLLERS/User.controller")

const router = express.Router()

router.get('/getuserdetails',auth, getUserDetails)
// router.get("/getEnrolledCourses", auth, getEnrolledCourses)

module.exports = router