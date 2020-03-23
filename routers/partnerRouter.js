// import module
const router = require('express').Router()

// import our controllers
const { partner } = require('../controllers')

// apply our controllers
router.get('/data/:id', partner.getPartnersData)
router.get('/data', partner.getAllPartner)
router.delete('/delete/:id', partner.deletePartner)
router.post('/add', partner.addPartner)
router.patch('/edit/:id', partner.editPartner)

// export our routers
module.exports = router