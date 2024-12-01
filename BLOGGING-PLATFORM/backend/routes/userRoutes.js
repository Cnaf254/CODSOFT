const express = require('express')
const router = express.Router()

const register = require('../controller/userController.js')
 

router.post('/register', register)
module.exports = router