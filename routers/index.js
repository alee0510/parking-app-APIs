// import routers
const adminRouter = require('./adminRouter')
const userRouter = require('./userRouter')
const profileRouter = require('./profileRouter')
const historyRouter = require('./historyRouter')
const vehicleRouter = require('./vehicleRouter')
const ratingRouter = require('./ratingRouter')
const paymentRouter = require('./paymentRouter')

// export our routers
module.exports = { 
    adminRouter, 
    userRouter, 
    profileRouter, 
    vehicleRouter, 
    ratingRouter, 
    historyRouter, 
    paymentRouter
}