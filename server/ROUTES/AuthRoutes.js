const express = require('express')
const {
    signup,
    login
} = require('../CONTROLLERS/Auth.controller')

const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)

module.exports = router