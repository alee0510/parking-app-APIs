// import module
const router = require('express').Router()

// import our controllers
const { users } = require('../controllers')

// apply our controllers
router.post('/register', users.register)
router.post('/login', users.login)
router.patch('/edit/pass/:id', users.changePassword)
router.patch('/edit/username/:id', users.editUsername)
router.delete('/delete/:id', users.delete)

// export our routers
module.exports = router