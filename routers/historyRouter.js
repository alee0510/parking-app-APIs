// import module
const router = require('express').Router()

// import our controllers
const { history } = require('../controllers')

// apply our controllers
router.get('/data/total', history.getTotalHistory)
router.get('/user/:id', history.getHistoryByUser)
router.get('/data', history.getInitialHistory)
router.get('/data/next', history.getNextHistory)
router.get('/data/prev', history.getPrevHistory)

router.get('/data/active/total', history.getTotalOnActive )
router.get('/data/active', history.getInitialOnActive)
router.get('/data/active/next', history.getNexOnActive)
router.get('/data/active/prev', history.getPrevOnActive)

// export our routers
module.exports = router