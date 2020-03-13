// import module
const router = require('express').Router()

// import our controllers
const { partner } = require('../controllers')

// apply our controllers
router.get('/data', partner.getPartnersData)
router.delete('/delete/:id', partner.deletePartner)
router.post('/add', partner.addPartner)
router.patch('/edit', partner.editPartner)

// export our routers
module.exports = router