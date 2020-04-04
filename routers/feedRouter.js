// import module
const router = require('express').Router()

// import our controllers
const { feed } = require('../controllers')

// apply our controllers
router.get('/income', feed.getTotalIncome)
router.get('/guest', feed.getGuestByVehilce)

// export our routers
module.exports = router