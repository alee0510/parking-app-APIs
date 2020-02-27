// import module
const router = require('express').Router()

// import our controllers
const { users } = require('../controllers')

// apply our controllers
router.post('/register', users.register)
router.post('/login', users.login)
router.get('/staylogin', users.stayLogin)

// export our routers
module.exports = router