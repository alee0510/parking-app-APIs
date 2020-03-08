// import module
const router = require('express').Router()

// import our controllers
const { rating } = require('../controllers')

// apply our controllers
router.get('/total', rating.getTotalRating)
router.get('/data', rating.getInitialRatings)
router.get('/data/next', rating.getNextRatings)
router.get('/data/prev', rating.getPrevRatings)
router.get('/user/get/:id', rating.getRatingByUser)
router.post('/user/add', rating.addRating)

// export our routers
module.exports = router