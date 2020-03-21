// import module
const router = require('express').Router()
const PATH = './public/profiles'

// import multer setup
const { upload } = require('../helpers/multerSetup')
const uploader = upload(PATH)

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
router.put('/account/edit/username/:id', account.changeUsername)
router.put('/account/edit/password/:id', account.changePassword)
router.post('/account/confirm/:id', users.passwordConfirm)

// profile
router.get('/profile/:id', profile.getUserProfileByID)
router.put('/profile/edit/:id', profile.editUserProfile)
router.put('/profile/upload/:id', uploader.single('IMG'), profile.uploadImageProfile)

// vehicle
router.get('/vehicle/:id', vehicles.getUserVehicle)
router.put('/vehicle/edit/:id', vehicles.editVehicleData)
router.get('/vehicle/car/brand', vehicles.getAllCarBrand)
router.get('/vehicle/car/type/:id', vehicles.getCarTypeByBrand)
router.get('/vehicle/motor/brand', vehicles.getAllMotorBrand)
router.get('/vehicle/motor/type/:id', vehicles.getMotorTypeByBrand)

// rating
router.get('/rating/:id', rating.getRatingByUser)
router.post('/rating', rating.addRating)

// history
router.get('/history/:id', history.getHistoryByUser)

// wallet
router.get('/wallet/saldo/:id', payment.getSaldo)
router.post('/wallet/topup/:id', payment.topUpSaldo)
router.get('/wallet/history/:id', payment.checkTransactionHistory)

// parking : enter and leave including payment transactions
router.get('/parking/area', parking_area.getParkingAreaData)
router.post('/parking/pay/:id', payment.payParking)
router.post('/parking/enter/:id', history.addOnActive)
router.post('/parking/leave/:id', history.changeOnActiveStatus)

// export our routers
module.exports = router