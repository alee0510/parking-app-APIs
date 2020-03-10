// import module
const router = require('express').Router()

// import our controllers
const { parking_area } = require('../controllers')

// apply our controllers
router.get('/area/data', parking_area.getParkingAreaData)
router.post('/area/add', parking_area.addParkingArea)
router.delete('/area/delete/:id', parking_area.deleteParkingArea)

// export our routers
module.exports = router