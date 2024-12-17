const express = require('express')
const router = express.Router()

const {register, logIn, checkUser, update, updatePassword, updateUserName} = require('../controller/userController.js')
 const authMiddleware = require('../middleware/authMiddleware.js')

router.post('/register', register)
router.post('/login', logIn)
router.get('/check', authMiddleware, checkUser)
router.put('/update', authMiddleware, updatePassword)
router.put('/userupdate',authMiddleware,updateUserName)
module.exports = router