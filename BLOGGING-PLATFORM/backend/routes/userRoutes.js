const express = require('express')
const router = express.Router()

const {register, logIn, checkUser, update, updatePassword} = require('../controller/userController.js')
 const authMiddleware = require('../middleware/authMiddleware.js')

router.post('/register', register)
router.post('/login', logIn)
router.get('/check', authMiddleware, checkUser)
router.put('/update', authMiddleware, updatePassword)
module.exports = router