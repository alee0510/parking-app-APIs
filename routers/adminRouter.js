// import module
const router = require('express').Router()

// import our controllers
const { admin } = require('../controllers')

// apply our controllers
router.get('/users', admin.getUserDataIncludeAdmin)
router.get('/users/get/', admin.paginationGetUsers)
router.get('/users/next/', admin.paginationGetNextUsers)
router.get('/users/prev/', admin.paginationGetPreviousUsers)

// export our routers
module.exports = router