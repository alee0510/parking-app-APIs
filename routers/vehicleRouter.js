// import module
const router = require('express').Router()

// import our controllers
const { vehicles } = require('../controllers')

// apply our controllers
// cars
router.get('/vehicle/car/brands', vehicles.getCarBrands)
router.get('/vehicle/car/brands/total', vehicles.getTotalCarBrand)
router.get('/vehicle/car/types', vehicles.getCarTypes)
router.get('/vehicle/car/types/total', vehicles.getTotalCarType)

// motor
router.get('/vehicle/motor/brands', vehicles.getMotorBrands)
router.get('/vehicle/motor/brands/total', vehicles.getTotalMotorBrand)
router.get('/vehicle/motor/types', vehicles.getMotorTypes)
router.get('/vehicle/motor/types/total', vehicles.getTotalMotorType)

// CRUD OPERATION
router.patch('/vehicle/car/brands/edit/:id', vehicles.editCarBrand)
router.patch('/vehicle/car/types/edit/:id', vehicles.editCarType)
router.post('/vehicle/car/brands/add', vehicles.addCarBrand)
router.delete('/vehicle/car/brands/delete/:id', vehicles.deleteCarBrand)
router.post('/vehicle/car/types/add', vehicles.addCarType)
router.delete('/vehicle/car/types/delete/:id', vehicles.deleteCarType)

router.patch('/vehicle/motor/brands/edit/:id', vehicles.editMotorBrand)
router.patch('/vehicle/motor/types/edit/:id', vehicles.editMotorType)
router.post('/vehicle/motor/brands/add', vehicles.addMotorBrand)
router.delete('/vehicle/motor/brands/delete/:id', vehicles.deleteMotorBrand)
router.post('/vehicle/motor/types/add', vehicles.addMotorType)
router.delete('/vehicle/motor/types/delete/:id', vehicles.deleteMotorType)

// export our routers
module.exports = router