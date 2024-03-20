const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    file:{
        type:String, 
    },
})

module.exports = mongoose.model('Post',postSchema)