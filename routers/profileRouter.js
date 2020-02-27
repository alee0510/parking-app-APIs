// import module
const router = require('express').Router()

// import our controllers
const { profile } = require('../controllers')

// apply our controllers
router.get('/profile', profile.getUserProfileByID)
router.post('/profile/add', profile.addUserProfile)
router.patch('/profile/edit', profile.editUserProfile)
router.patch('/profile/upload', profile.uploadImageProfile)

// export our routers
module.exports = router