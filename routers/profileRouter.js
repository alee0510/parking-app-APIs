// import module
const router = require('express').Router()
// const { verify } = require('../helpers/jwt')

// import our controllers
const { profile } = require('../controllers')

// apply our controllers
router.get('/profile/:id', profile.getUserProfileByID)
router.patch('/profile/edit/:id',  profile.editUserProfile)
router.patch('/profile/upload', profile.uploadImageProfile)

// export our routers
module.exports = router