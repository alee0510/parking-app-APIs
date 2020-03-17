// import module
const router = require('express').Router()

// import verifier
// const { verify } = require ('../helpers/jwt')

// import our controllers
const { 
    account, 
    profile, 
    vehicles, 
    rating, 
    history, 
    payment,
    users,
    parking_area
} = require('../controllers')

// apply our controllers
// register process : OTP authentication
router.post('/OTP/request', users.requestOTP)
router.post('/OTP/verify/:id', users.checkOTP)

// account : edit username or password
router.get('/account/:id', account.getAccountById)
router.patch('/account/edit/username/:id', account.changeUsername)
router.patch('/account/edit/password/:id', account.changePassword)
router.post('/account/confirm/:id', users.passwordConfirm)

// profile
router.get('/profile/:id', profile.getUserProfileByID)
router.patch('/profile/edit/:id', profile.editUserProfile)
router.patch('/profile/upload/:id', profile.uploadImageProfile)

// vehicle
router.get('/vehicle/:id', vehicles.getUserVehicle)
router.patch('/vehicle/:id', vehicles.editVehicleData)

// rating
router.get('/rating/:id', rating.getRatingByUser)
router.post('/rating', rating.addRating)

// history
router.get('/history/:id', history.getHistoryByUser)

// wallet
router.get('/wallet/saldo/:id', payment.getSaldo)
router.patch('/wallet/topup/:id', payment.topUpSaldo)
router.get('/wallet/history/:id', payment.checkTransactionHistory)

// parking : enter and leave including payment transactions
router.get('/parking/area', parking_area.getParkingAreaData)
router.post('/parking/pay/:id', payment.payParking)
router.post('/parking/enter/:id', history.addOnActive)
router.post('/parking/leave/:id', history.changeOnActiveStatus)

// export our routers
module.exports = router