const router = require('express').Router()
const bannerController = require('../../controllers/dasboard/bannerController')
const { authMiddleware } = require('../../middlewares/authMiddleware')

// Banner routes with authentication middleware
router.post('/create', authMiddleware, bannerController.create)
router.get('/get', bannerController.get)
router.get('/get/:bannerId', bannerController.getById)
router.put('/update/:bannerId', authMiddleware, bannerController.update)
router.delete('/delete/:bannerId', authMiddleware, bannerController.delete)

module.exports = router