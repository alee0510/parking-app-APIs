// import module
const router = require('express').Router()
const jwt = require('../helpers/jwt')

// import our controllers
const { history } = require('../controllers')

// apply our controllers
router.get('/total', history.getTotalHistory)
router.get('/user/:id', history.getHistoryByUser)

// export our routers
module.exports = router