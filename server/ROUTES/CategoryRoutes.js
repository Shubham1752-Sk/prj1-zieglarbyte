const express = require("express")
const { auth, isAdmin } = require("../MIDDLEWARE/auth") 
const { 
    createCategory,
    showAllCategories,
} = require("../CONTROLLERS/Category.controller")

const router = express.Router()

router.post('/createcategory',auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
// router.post("/getCategoryPageDetails", categoryPageDetails)

module.exports = router