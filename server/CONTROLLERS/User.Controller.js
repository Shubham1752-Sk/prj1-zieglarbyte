const User = require("../MODELS/User.model")
// const CourseProgress = require("../models/CourseProgressModel")
// const { convertSecondsToDuration } = require("../utils/secToDuration")

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
