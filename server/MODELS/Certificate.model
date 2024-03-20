const mongoose = require("mongoose")

const certificateSchema = new mongoose.Schema({
    name:{
        required: true,
        type: String
    },
    courseName:{
        required: true,
        type: String
    },
    dateOfCompletion:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Certificate",certificateSchema)