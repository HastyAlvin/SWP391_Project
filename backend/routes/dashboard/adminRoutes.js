const adminController = require('../../controllers/dasboard/adminController')
const { authMiddleware } = require('../../middlewares/authMiddleware')
const router = require('express').Router()

// Rutas para gestionar vendedores por el admin
router.get('/admin/sellers', authMiddleware, adminController.get_all_sellers)
router.get('/admin/seller/:sellerId', authMiddleware, adminController.get_seller)
router.post('/admin/seller/add', authMiddleware, adminController.add_seller)
router.put('/admin/seller/update/:sellerId', authMiddleware, adminController.update_seller)
router.put('/admin/seller/change-password/:sellerId', authMiddleware, adminController.change_seller_password)
router.delete('/admin/seller/delete/:sellerId', authMiddleware, adminController.delete_seller)

module.exports = router