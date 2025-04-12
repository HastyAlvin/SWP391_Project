const authControllers = require('../controllers/authControllers')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router()

router.post('/admin-login',authControllers.admin_login)
router.get('/get-user',authMiddleware, authControllers.getUser)
router.get('/get-newcustomers',authMiddleware, authControllers.getAllNewCustomer)
router.post('/seller-register',authControllers.seller_register)
router.post('/seller-login',authControllers.seller_login)
router.post('/profile-image-upload',authMiddleware, authControllers.profile_image_upload)
router.post('/profile-info-add',authMiddleware, authControllers.profile_info_add)
router.put('/profile-info-update',authMiddleware, authControllers.profile_info_update)
router.get('/logout',authMiddleware, authControllers.logout)
router.post('/forgot_password', authControllers.forgotPassword)
router.post('/reset_password', authControllers.resetPassword)

module.exports = router 