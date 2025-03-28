const customerModel = require('../../models/customerModel')
const { responseReturn } = require('../../utiles/response')
const bcrypt = require('bcrypt')
const {createToken} = require('../../utiles/tokenCreate')
const jwt = require('jsonwebtoken'); 
class customerAuthController{

    customer_register = async(req,res) => {
        const {name, email, password } = req.body

        try {
            const customer = await customerModel.findOne({email}) 
            if (customer) {
                responseReturn(res, 404,{ error : 'Email Already Exits'} )
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password, 10),
                    method: 'menualy'
                })
                const token = await createToken({
                    id : createCustomer.id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    method: createCustomer.method 
                })
                res.cookie('customerToken',token,{
                    expires : new Date(Date.now() + 7*24*60*60*1000 )
                })
                responseReturn(res,201,{message: "User Register Success", token})
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    // End Method

    customer_login = async(req, res) => {
        const { email, password } = req.body;
    try {
        const customer = await customerModel.findOne({ email }).select("+password");
        
        if (!customer) {
            return res.status(404).json({ error: "Email not found" });
        }

        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = await createToken({ id: customer.id, role: "customer" }); // Kiểm tra role
        console.log("✅ Token created:", token); // Log token để kiểm tra

        res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true
        });

        return res.status(200).json({ token, message: "Login Success" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    }
  // End Method

  customer_logout = async(req, res) => {
    res.cookie('customerToken',"",{
        expires : new Date(Date.now())
    })
    responseReturn(res, 200,{ message :  'Logout Success'})
  }
    // End Method
    change_password = async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const authHeader = req.headers.authorization;
    
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
            }
    
            const token = authHeader.split(' ')[1];
    
            try {
                const decoded = jwt.verify(token, process.env.SECRET);
                const customer = await customerModel.findById(decoded.id).select('+password'); // Chắc chắn lấy được password
    
                if (!customer) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
    
                const isMatch = await bcrypt.compare(oldPassword, customer.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Incorrect old password' });
                }
    
                customer.password = await bcrypt.hash(newPassword, 10);
                await customer.save();
    
                res.json({ message: 'Password changed successfully!' });
            } catch (err) {
                console.error('JWT Verification Error:', err.message); // Log lỗi JWT
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
        } catch (error) {
            console.error('Change Password Error:', error); // Log lỗi chi tiết
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}

module.exports = new customerAuthController()