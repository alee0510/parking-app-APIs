// import module
const router = require('express').Router()

// import our controllers
const { history } = require('../controllers')

// apply our controllers
router.get('/data/total', history.getTotalHistory)
router.get('/data', history.getParkingHistory)
router.get('/active/total', history.getTotalOnActive)
router.get('/active', history.getParkingOnActive)

// export our routers
module.exports = router