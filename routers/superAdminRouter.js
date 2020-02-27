// import module
const router = require('express').Router()

// import our controllers
const { superAdmin } = require('../controllers')

// apply our controllers
router.get('/get/users/', superAdmin.paginationGetUsers) // need exception input, id , and limit
router.get('/get/users/next/', superAdmin.paginationGetNextUsers)
router.get('/get/users/prev/', superAdmin.paginationGetPreviousUsers)

// export our routers
module.exports = router