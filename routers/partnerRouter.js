// import module
const router = require('express').Router()

// import our controllers
const { partner } = require('../controllers')

// apply our controllers
router.get('/data', partner.getPartnersData)
router.delete('/delete', partner.deletePartners)

// export our routers
module.exports = router