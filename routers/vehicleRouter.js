// import module
const router = require('express').Router()

// import our controllers
const { vehicles } = require('../controllers')

// apply our controllers
// cars
router.get('/vehicle/car/brands', vehicles.getCarBrand)
router.get('/vehicle/car/brands/next', vehicles.getNextCarBrand)
router.get('/vehicle/car/brands/prev', vehicles.getPrevCarBrand)
router.get('/vehicle/car/brands/total', vehicles.getTotalCarBrand)
router.get('/vehicle/car/types', vehicles.getCarType)
router.get('/vehicle/car/types/next', vehicles.getNextCarType)
router.get('/vehicle/car/types/prev', vehicles.getPrevCarType)
router.get('/vehicle/car/types/total', vehicles.getTotalCarType)

// motor
router.get('/vehicle/motor/brands', vehicles.getMotorBrand)
router.get('/vehicle/motor/brands/next', vehicles.getNextMotorBrand)
router.get('/vehicle/motor/brands/prev', vehicles.getPrevMotorBrand)
router.get('/vehicle/motor/brands/total', vehicles.getTotalMotorBrand)
router.get('/vehicle/motor/types', vehicles.getMotorType)
router.get('/vehicle/motor/types/next', vehicles.getNextMotorType)
router.get('/vehicle/motor/types/prev', vehicles.getPrevMotorType)
router.get('/vehicle/motor/types/total', vehicles.getTotalMotorType)

// get all brands
router.get('/vehicle/car/brands/all', vehicles.getAllCarBrand)
router.get('/vehicle/motor/brands/all', vehicles.getAllMotorBrand)

// CRUD OPERATION
router.patch('/vehicle/car/brands/edit/:id', vehicles.editCarBrand)
router.patch('/vehicle/car/types/edit/:id', vehicles.editCarType)
router.post('/vehicle/car/brands/add', vehicles.addCarBrand)
router.delete('/vehicle/car/brands/delete/:id', vehicles.deleteCarBrand)
router.post('/vehicle/car/types/add', vehicles.addCarType)
router.delete('/vehicle/car/types/delete/:id', vehicles.deleteCarType)

// export our routers
module.exports = router