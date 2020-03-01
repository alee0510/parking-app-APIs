// import module
const router = require('express').Router()

// import our controllers
const { admin } = require('../controllers')

// apply our controllers
router.get('/get/users/', admin.paginationGetUsers) // need exception input, id , and limit
router.get('/get/users/next/', admin.paginationGetNextUsers)
router.get('/get/users/prev/', admin.paginationGetPreviousUsers)
router.get('/get/users/total', admin.getTotalUser)
router.get('/get/users/profile/', admin.paginationGetUserProfile)
router.get('/get/users/profile/next/', admin.paginationGetUserProfileNext)
router.get('/get/users/profile/prev/', admin.paginationGetUserProfilePrev)
router.get('/get/roles', admin.getUserRole)
router.patch('/edit/roles/:id', admin.editUserRole)
router.delete('/delete/users/:id', admin.deletUser)

// export our routers
module.exports = router