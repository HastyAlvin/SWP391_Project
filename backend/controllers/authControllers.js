const adminModel = require("../models/adminModel");
const sellerModel = require("../models/sellerModel");
const { responseReturn } = require("../utiles/response");
const bcrypt = require("bcrypt");
const { createToken } = require("../utiles/tokenCreate");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");
const { clearOTP, verifyOTP } = require("../utiles/otpStore.js");
const { sendEmail } = require("../utiles/email.js");

class authControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      // console.log(admin)
      if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        // console.log(match)
        if (match) {
          const token = await createToken({
            id: admin.id,
            role: admin.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login Success" });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not Found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End Method

  seller_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select("+password");
      // console.log(admin)
      if (seller) {
        const match = await bcrypt.compare(password, seller.password);
        // console.log(match)
        if (match) {
          const token = await createToken({
            id: seller.id,
            role: seller.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login Success" });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not Found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End Method

  seller_register = async (req, res) => {
    const { email, name, password } = req.body;
    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        responseReturn(res, 404, { error: "Email Already Exit" });
      } else {
        const seller = await sellerModel.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          method: "menualy",
          shopInfo: {},
        });

        const token = await createToken({ id: seller.id, role: seller.role });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        responseReturn(res, 201, { token, message: "Register Success" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };
  // End Method

  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        const seller = await sellerModel.findById(id);
        responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  }; // End getUser Method

  profile_image_upload = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });
      const { image } = files;

      try {
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "profile",
        });
        if (result) {
          await sellerModel.findByIdAndUpdate(id, {
            image: result.url,
          });
          const userInfo = await sellerModel.findById(id);
          responseReturn(res, 201, {
            message: "Profile Image Upload Successfully",
            userInfo,
          });
        } else {
          responseReturn(res, 404, { error: "Image Upload Failed" });
        }
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  // End Method

  profile_info_add = async (req, res) => {
    const { division, district, shopName, sub_district } = req.body;
    const { id } = req;

    try {
      await sellerModel.findByIdAndUpdate(id, {
        shopInfo: {
          shopName,
          division,
          district,
          sub_district,
        },
      });
      const userInfo = await sellerModel.findById(id);
      responseReturn(res, 201, {
        message: "Profile info Add Successfully",
        userInfo,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End Method
  profile_info_update = async (req, res) => {
    const { division, district, shopName, sub_district } = req.body;
    const { id } = req;

    try {
      const updatedSeller = await sellerModel.findByIdAndUpdate(
        id,
        { shopInfo: { shopName, division, district, sub_district } },
        { new: true }
      );

      if (!updatedSeller) {
        return res.status(404).json({ error: "Seller not found" });
      }

      responseReturn(res, 200, {
        message: "Profile info updated successfully",
        userInfo: updatedSeller,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      res.cookie("accessToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      responseReturn(res, 200, { message: "logout Success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End Method

  forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
      const emailExist = await sellerModel.findOne({ email });
      if (!emailExist) {
        return responseReturn(res, 404, { error: "Email not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      await sendEmail({ recipient_email: email, OTP: otp });

      responseReturn(res, 200, { message: "OTP sent successfully" });
    } catch (error) {
      console.error("Email sending error:", error);
      responseReturn(res, 500, { error: error.message });
    }
  };

  updateUserPassword = async (userId, newPassword) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await sellerModel.findByIdAndUpdate(userId, { password: hashedPassword });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  findUserByEmail = async (email) => {
    try {
      return await sellerModel.findOne({ email });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  resetPassword = async (req, res) => {
    const { email, newPassword, otp } = req.body;
    try {
      console.log("Email:", email);
      const user = await sellerModel.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const result = verifyOTP(email, otp);
      if (!result.valid) {
        return res.status(400).json({ message: result.message });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "New password must be longer than 6 characters" });
      }
      clearOTP(email);
      await this.updateUserPassword(user._id, newPassword);
      res.status(200).json({ message: "Password successfully updated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new authControllers();
