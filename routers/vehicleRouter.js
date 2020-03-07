// import module
const router = require('express').Router()

// import our controllers
const { vehicles } = require('../controllers')

// apply our controllers
router.get('/vehicle/car/brands', vehicles.getCarBrand)
router.get('/vehicle/car/brands/next/', vehicles.getNextCarBrand)
router.get('/vehicle/car/brands/prev/', vehicles.getPrevCarBrand)
router.get('/vehicle/car/brands/total/', vehicles.getTotalCarBrand)
router.get('/vehicle/car/types/', vehicles.getCarType)
router.get('/vehicle/car/types/next/', vehicles.getNextCarType)
router.get('/vehicle/car/types/prev/', vehicles.getPrevCarType)
router.get('/vehicle/car/types/total', vehicles.getCarTypeTotal)
// router.get('/vehicle/car/types', vehicles.getCarType)

// export our routers
module.exports = router