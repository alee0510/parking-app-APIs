// import module
const router = require('express').Router()
const jwt = require('../helpers/jwt')

// import our controllers
const { profile } = require('../controllers')

// apply our controllers
router.get('/profile', jwt.verify, profile.getUserProfileByID)
// router.post('/profile/add', verify, profile.addUserProfile)
// router.patch('/profile/edit', verify,  profile.editUserProfile)
// router.patch('/profile/upload', verify, profile.uploadImageProfile)

// export our routers
module.exports = router