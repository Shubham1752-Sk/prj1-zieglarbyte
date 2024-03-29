// Import necessary modules
const Section = require("../MODELS/Section.model")
const SubSection = require("../MODELS/SubSection.model")
const Post = require('../MODELS/Post.model')
const { uploadImageToCloudinary } = require("../UTILS/imageUploader")

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description, video, post } = req.body

    console.log(post)
    console.log(video)

    // const video = req.files.video 

    // Check if all necessary fields are provided
    if (!sectionId || !title ) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" })
    }
    // console.log(video)

    // Upload the video file to Cloudinary
    let uploadDetails
    if(video){
      uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
    }
    console.log(uploadDetails)
    // Create a new sub-section with the necessary information

    let SubSectionDetails
    if(post){
      const postDetails = await Post.create({
        file: post
      })
      console.log(postDetails)
      SubSectionDetails = await SubSection.create({
        title: title,
        isMedia: true,
        description: description,
        post: postDetails._id
      })
    }
    else {
      SubSectionDetails = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails?.secure_url,
        
      })
    }    
    console.log(SubSectionDetails)
    // return
    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate({
      path: "subSection",
      model: 'SubSection',
      populate: {
        path: "post",
        model: 'Post'
      }
    })

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description, video } = req.body
    // console.log("subSectionId",subSectionId)
    // console.log("SectionId",sectionId)
    
    const subSection = await SubSection.findById(subSectionId)
    console.log("subsectionvideoUrl",subSection.videoUrl)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (video !== undefined) {
    //   const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      console.log("uploadDetails: ",uploadDetails)
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}
