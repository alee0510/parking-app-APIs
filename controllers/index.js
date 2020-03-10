// import cotroller
const users = require('./users')
const account = require('./account')
const profile = require('./profile')
const admin = require('./admin')
const history = require('./history')
const rating = require('./rating')
const payment = require('./payment')
const vehicles = require('./vehicles')
const parking_area = require('./parking_area')

// export controllers
module.exports = { users, account, profile, admin, 
    history, rating, payment, vehicles, parking_area }