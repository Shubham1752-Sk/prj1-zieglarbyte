const express = require("express")
const {auth, isAdmin, isStudent} = require("../MIDDLEWARE/auth")
const {
    getUserDetails,
    getEnrolledCourses,
    instructorDashboard,
    enrollStudents,
    updateDisplayPicture
} = require("../CONTROLLERS/User.controller")
const { generateCertifcate, getCertificateDetails } = require("../CONTROLLERS/Certificate.controller")

const router = express.Router()

router.get('/getuserdetails',auth, getUserDetails)
router.get("/instructorDashboard", auth, isAdmin, instructorDashboard)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.post('/enroll',enrollStudents)
router.post('/generatecertificate',auth, isStudent, generateCertifcate)
router.get('/getcertificatedetails/:id',getCertificateDetails)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router