// import module
const router = require('express').Router()

// import our controllers
const { vehicles } = require('../controllers')

// apply our controllers
// cars
router.get('/car/brands', vehicles.getCarBrands)
router.get('/car/brands/total', vehicles.getTotalCarBrand)
router.get('/car/types', vehicles.getCarTypes)
router.get('/car/types/total', vehicles.getTotalCarType)

// motor
router.get('/motor/brands', vehicles.getMotorBrands)
router.get('/motor/brands/total', vehicles.getTotalMotorBrand)
router.get('/motor/types', vehicles.getMotorTypes)
router.get('/motor/types/total', vehicles.getTotalMotorType)

// CRUD OPERATION
router.post('/car/brands/add', vehicles.addCarBrand)
router.put('/car/brands/edit/:id', vehicles.editCarBrand)
router.delete('/car/brands/delete/:id', vehicles.deleteCarBrand)
router.post('/car/types/add', vehicles.addCarType)
router.put('/car/types/edit/:id', vehicles.editCarType)
router.delete('/car/types/delete/:id', vehicles.deleteCarType)

router.put('/motor/brands/edit/:id', vehicles.editMotorBrand)
router.put('/motor/types/edit/:id', vehicles.editMotorType)
router.post('/motor/brands/add', vehicles.addMotorBrand)
router.delete('/motor/brands/delete/:id', vehicles.deleteMotorBrand)
router.post('/motor/types/add', vehicles.addMotorType)
router.delete('/motor/types/delete/:id', vehicles.deleteMotorType)

// export our routers
module.exports = router