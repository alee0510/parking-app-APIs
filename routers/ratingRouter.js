// import module
const router = require('express').Router()

// import our controllers
const { rating } = require('../controllers')

// apply our controllers
router.get('/total', rating.getTotalRating)
router.get('/data', rating.getRating)

// export our routers
module.exports = router