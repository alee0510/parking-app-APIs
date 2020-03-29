// import module
const router = require('express').Router()

// import our controllers
const { admin } = require('../controllers')

// apply our controllers
router.get('/get/users', admin.getUserAccount)
router.get('/get/profiles/', admin.getUserProfile)
router.get('/get/total', admin.getTotalUserAccount)
router.get('/get/roles', admin.getUserRole)
router.patch('/users/edit/:id', admin.editUserRole)
router.delete(`/users/delete/:id`, admin.deleteUserAccount)

// export our routers
module.exports = router