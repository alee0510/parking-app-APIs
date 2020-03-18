// import module
const router = require('express').Router()
const PATH = './public/areas'

// import multer setup
const { upload } = require('../helpers/multerSetup')
const uploader = upload(PATH)

// import our controllers
const { parking_area } = require('../controllers')

// apply our controllers
router.get('/area/data', parking_area.getParkingAreaData)
router.post('/area/add', parking_area.addParkingArea)
router.delete('/area/delete/:id', parking_area.deleteParkingArea)
router.patch('/area/edit/:id', parking_area.editParkingArea)
router.patch('/area/upload/:id', parking_area.addPhoto)

// export our routers
module.exports = router