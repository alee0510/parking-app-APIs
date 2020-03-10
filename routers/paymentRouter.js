// import module
const router = require('express').Router()

// import our controllers
const { payment } = require('../controllers')

// apply our controllers
router.get('/data/total', payment.getTotalTransactionHistoryData)
router.get('/data', payment.getInitialTransactionHistory)
router.get('/data/next', payment.getNextTransactionHistory)
router.get('/data/prev', payment.getPrevTransactionHIstory)

// export our routers
module.exports = router