const Customer = require('../../models/customerModel');
const { responseReturn } = require('../../utiles/response');
const bcrypt = require('bcrypt');

class CustomerController {
    // [GET] /api/customers - Lấy danh sách tất cả khách hàng
    getAllCustomers = async (req, res) => {
        try {
            const customers = await Customer.find().select('-password');
            return responseReturn(res, 200, { customers });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    // [GET] /api/customers/:id - Lấy thông tin một khách hàng
    getCustomer = async (req, res) => {
        try {
            const { id } = req.params;
            const customer = await Customer.findById(id).select('-password');

            if (!customer) {
                return responseReturn(res, 404, { error: 'Không tìm thấy khách hàng' });
            }

            return responseReturn(res, 200, { customer });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    // [POST] /api/customers - Tạo khách hàng mới
    createCustomer = async (req, res) => {
        try {
            const { name, email, password, method } = req.body;

            // Kiểm tra email đã tồn tại
            const existingCustomer = await Customer.findOne({ email });
            if (existingCustomer) {
                return responseReturn(res, 400, { error: 'Email đã được sử dụng' });
            }

            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // Tạo khách hàng mới
            const customer = await Customer.create({
                name,
                email,
                password: hashPassword,
                method: method || 'manual'
            });

            return responseReturn(res, 201, {
                message: 'Tạo khách hàng thành công',
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    method: customer.method
                }
            });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    // [PUT] /api/customers/:id - Cập nhật thông tin khách hàng
    updateCustomer = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;

            // Kiểm tra khách hàng tồn tại
            const customer = await Customer.findById(id);
            if (!customer) {
                return responseReturn(res, 404, { error: 'Không tìm thấy khách hàng' });
            }

            // Nếu cập nhật email, kiểm tra email đã tồn tại
            if (email && email !== customer.email) {
                const existingCustomer = await Customer.findOne({ email });
                if (existingCustomer) {
                    return responseReturn(res, 400, { error: 'Email đã được sử dụng' });
                }
            }

            // Cập nhật thông tin
            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;

            // Nếu có cập nhật mật khẩu
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            // Cập nhật và trả về khách hàng mới
            const updatedCustomer = await Customer.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).select('-password');

            return responseReturn(res, 200, {
                message: 'Cập nhật thông tin khách hàng thành công',
                customer: updatedCustomer
            });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    // [DELETE] /api/customers/:id - Xóa khách hàng
    deleteCustomer = async (req, res) => {
        try {
            const { id } = req.params;

            // Kiểm tra khách hàng tồn tại
            const customer = await Customer.findById(id);
            if (!customer) {
                return responseReturn(res, 404, { error: 'Không tìm thấy khách hàng' });
            }

            // Xóa khách hàng
            await Customer.findByIdAndDelete(id);

            return responseReturn(res, 200, { message: 'Xóa khách hàng thành công' });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }
}

module.exports = new CustomerController();