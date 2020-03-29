// import module
const router = require('express').Router()

// import our controllers
const { payment } = require('../controllers')

// apply our controllers
router.get('/data/total', payment.getTotalTransactionHistoryData)
router.get('/data', payment.getTransactionHistory)
router.get('/data/types', payment.getPaymentTypes)
router.get('/data/status', payment.getPaymentStatus)
router.get('/approval/:id', payment.topUpApprovalByAdmin)
router.get('/reject/:id', payment.topUpRejectByAdmin)

// export our routers
module.exports = router