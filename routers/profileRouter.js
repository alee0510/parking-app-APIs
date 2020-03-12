// import module
const router = require('express').Router()
const PATH = './public/assets'

// import multer setup
const { upload } = require('../helpers/multerSetup')
const uploader = upload(PATH)

// import our controllers
const { profile } = require('../controllers')

// apply our controllers
router.get('/profile/:id', profile.getUserProfileByID)
router.patch('/profile/edit/:id',  profile.editUserProfile)
router.patch('/profile/upload/:id', uploader.single('IMG'), profile.uploadImageProfile)

// export our routers
module.exports = router