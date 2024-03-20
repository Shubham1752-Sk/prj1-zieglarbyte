const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
	title: { 
        type: String 
    },
    isMedia:{
        type: Boolean,
        default:false
    },
	timeDuration: { 
        type: String 
    },
	description: { 
        type: String 
    },
	videoUrl: { 
        type: String 
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
