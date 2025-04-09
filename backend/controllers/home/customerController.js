const Customer = require('../../models/customerModel');
const { responseReturn } = require('../../utiles/response');
const bcrypt = require('bcrypt');

class CustomerController {
    // [GET] /api/customers - Get all customers
    getAllCustomers = async (req, res) => {
        try {
            const customers = await Customer.find().select('-password');
            return responseReturn(res, 200, { customers });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    // [GET] /api/customers/:id - Get a customer by ID
    getCustomer = async (req, res) => {
        try {
            const { id } = req.params;
            const customer = await Customer.findById(id).select('-password');

            if (!customer) {
                return responseReturn(res, 404, { error: 'Customer not found' });
            }

            return responseReturn(res, 200, { customer });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    // [POST] /api/customers - Create a new customer
    createCustomer = async (req, res) => {
        try {
            const { name, email, password, method } = req.body;

            // Check if email already exists
            const existingCustomer = await Customer.findOne({ email });
            if (existingCustomer) {
                return responseReturn(res, 400, { error: 'Email is already in use' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // Create new customer
            const customer = await Customer.create({
                name,
                email,
                password: hashPassword,
                method: method || 'manual'
            });

            return responseReturn(res, 201, {
                message: 'Customer created successfully',
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

    // [PUT] /api/customers/:id - Update customer information
    updateCustomer = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;

            // Check if customer exists
            const customer = await Customer.findById(id);
            if (!customer) {
                return responseReturn(res, 404, { error: 'Customer not found' });
            }

            // If updating email, check if email already exists
            if (email && email !== customer.email) {
                const existingCustomer = await Customer.findOne({ email });
                if (existingCustomer) {
                    return responseReturn(res, 400, { error: 'Email is already in use' });
                }
            }

            // Update information
            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;

            // If updating password
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            // Update and return new customer
            const updatedCustomer = await Customer.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).select('-password');

            return responseReturn(res, 200, {
                message: 'Customer updated successfully',
                customer: updatedCustomer
            });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    // [DELETE] /api/customers/:id - Delete a customer
    deleteCustomer = async (req, res) => {
        try {
            const { id } = req.params;

            // Check if customer exists
            const customer = await Customer.findById(id);
            if (!customer) {
                return responseReturn(res, 404, { error: 'Customer not found' });
            }

            // Delete customer
            await Customer.findByIdAndDelete(id);

            return responseReturn(res, 200, { message: 'Customer deleted successfully' });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }
}

module.exports = new CustomerController();