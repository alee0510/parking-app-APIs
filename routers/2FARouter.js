// import module
const router = require('express').Router()

// import our controllers
const { OTPDemo } = require('../controllers')

// apply our controllers
router.post('/request/pin', OTPDemo.requestOTP)
router.post('/check/pin', OTPDemo.checkOTP)

// export our routers
module.exports = router