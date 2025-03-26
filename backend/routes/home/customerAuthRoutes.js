const express = require('express');
const customerAuthController = require('../../controllers/home/customerAuthController');
const { authMiddleware, verifyCustomer } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Đăng ký & Đăng nhập
router.post('/customer/customer-register', customerAuthController.customer_register);
router.post('/customer/customer-login', customerAuthController.customer_login);

// Đăng xuất
router.get('/customer/logout', customerAuthController.customer_logout);

// Đổi mật khẩu (chỉ Customer được phép)
router.put('/customer/change-password', authMiddleware, verifyCustomer, customerAuthController.change_password);

module.exports = router;
