// import module
const router = require('express').Router()

// import our controllers
const { admin } = require('../controllers')

// apply our controllers
router.get('/get/users/', admin.paginationGetUsers) // need exception input, id , and limit
router.get('/get/users/next/', admin.paginationGetNextUsers)
router.get('/get/users/prev/', admin.paginationGetPreviousUsers)
router.get('/get/users/total', admin.getTotalUser)

// export our routers
module.exports = router