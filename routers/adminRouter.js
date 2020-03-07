// import module
const router = require('express').Router()

// import our controllers
const { admin } = require('../controllers')

// apply our controllers
router.get('/get/users/', admin.getInitialUserData) // need exception input, id , and limit
router.get('/get/users/next/', admin.getNextUserData)
router.get('/get/users/prev/', admin.getPrevUserData)
router.get('/get/users/total', admin.getTotalUser)
router.get('/get/users/profile/', admin.getInitialUserProfileData)
router.get('/get/users/profile/next/', admin.getNextUserProfileData)
router.get('/get/users/profile/prev/', admin.getPrevUserProfileData)
router.get('/get/roles/', admin.getUserRole)
router.patch('/edit/roles/:id', admin.editUserRole)
router.delete('/delete/users/:id', admin.deletUser)

// export our routers
module.exports = router