// import module
const router = require('express').Router()

// import verifier
const { verify } = require ('../helpers/jwt')

// import our controllers
const { users } = require('../controllers')

// apply our controllers
router.post('/register', users.register)
router.post('/register/vehicle', users.regisVehicleInfo)
router.post('/login', users.login)
router.get('/staylogin', verify, users.stayLogin)

// export our routers
module.exports = router