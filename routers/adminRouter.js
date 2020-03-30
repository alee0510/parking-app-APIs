// import module
const router = require('express').Router()

// import our controllers
const { admin } = require('../controllers')

// apply our controllers
router.get('/member/account', admin.getUserAccount)
router.get('/member/profiles/', admin.getUserProfile)
router.get('/member/total', admin.getTotalUserAccount)
router.get('/member/roles', admin.getUserRole)
router.put('/member/edit/:id', admin.editUserRole)
router.delete(`/member/delete/:id`, admin.deleteUserAccount)

// export our routers
module.exports = router