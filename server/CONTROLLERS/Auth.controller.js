const bcrypt = require("bcrypt")
const User = require("../MODELS/User.model")
const Profile = require('../MODELS/Profile.model')
// const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
// const otpGenerator = require("otp-generator")
// const mailSender = require("../utils/mailSender")
// const { passwordUpdated } = require("../mail/templates/passwordUpdate")

require("dotenv").config()


exports.signup = async (req, res) => {
    try {
      // Destructure fields from the request body
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
      } = req.body
      
      // Check if All Details are there or not
      if (
        !accountType ||
        !firstName ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        return res.status(403).send({
          success: false,
          message: "All Fields are required",
        })
      }
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Password and Confirm Password do not match. Please try again.",
        })
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists. Please sign in to continue.",
        })
      }
  
      // Find the most recent OTP for the email
    //   const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    //   console.log(response)
    //   if (response.length === 0) {
    //     // OTP not found for the email
    //     return res.status(400).json({
    //       success: false,
    //       message: "The OTP is not valid",
    //     })
    //   } else if (otp !== response[0].otp) {
    //     // Invalid OTP
    //     return res.status(400).json({
    //       success: false,
    //       message: "The OTP is not valid",
    //     })
    //   }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)
  
      // Create the user
    //   let approved = ""
    //   approved === "Instructor" ? (approved = false) : (approved = true)
  
      // Create the Additional Profile For User
      const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: contactNumber,
      })
      const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType: accountType,
        additionalDetails: profileDetails._id,
        image: "",
      })
  
      return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "User cannot be registered. Please try again.",
      })
    }
  }