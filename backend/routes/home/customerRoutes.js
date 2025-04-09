const router = require('express').Router();
const customerController = require('../../controllers/home/customerController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// GET: Lấy danh sách tất cả khách hàng (Có thể cần quyền admin)
router.get('/', authMiddleware, customerController.getAllCustomers);

// GET: Lấy thông tin một khách hàng
router.get('/:id', authMiddleware, customerController.getCustomer);

// POST: Tạo khách hàng mới
router.post('/', customerController.createCustomer);

// PUT: Cập nhật thông tin khách hàng
router.put('/:id', authMiddleware, customerController.updateCustomer);

// DELETE: Xóa khách hàng
router.delete('/:id', authMiddleware, customerController.deleteCustomer);

module.exports = router;