const { responseReturn } = require("../../utiles/response");
const sellerModel = require("../../models/sellerModel");
const bcrypt = require("bcrypt");
const { mongo: { ObjectId } } = require("mongoose");

class adminController {
  // Lấy tất cả người bán với phân trang, tìm kiếm và bộ lọc
  get_all_sellers = async (req, res) => {
    let { page, searchValue, parPage, status } = req.query;
    page = parseInt(page) || 1;
    parPage = parseInt(parPage) || 10;
    status = status || "all";

    const skipPage = parPage * (page - 1);

    try {
      let query = {};

      // Tối ưu tìm kiếm với nhiều trường
      if (searchValue) {
        query.$or = [
          { name: { $regex: searchValue, $options: 'i' } }
        ];
      }

      if (status !== "all") {
        query.status = status;
      }

      // Sử dụng aggregation để tối ưu hiệu suất
      const [result] = await sellerModel.aggregate([
        { $match: query },
        {
          $facet: {
            sellers: [
              { $sort: { createdAt: -1 } },
              { $skip: skipPage },
              { $limit: parPage }
            ],
            totalCount: [
              { $count: 'count' }
            ]
          }
        }
      ]);

      const sellers = result.sellers;
      const totalSeller = result.totalCount[0]?.count || 0;

      responseReturn(res, 200, { totalSeller, sellers });
    } catch (error) {
      console.log("Error getting sellers:", error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End method

  // Lấy thông tin người bán theo ID
  get_seller = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const seller = await sellerModel.findById(sellerId);

      if (!seller) {
        return responseReturn(res, 404, { error: "Seller not found" });
      }

      responseReturn(res, 200, { seller });
    } catch (error) {
      console.log("Error getting seller details:", error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End method

  // Thêm người bán mới
  add_seller = async (req, res) => {
    const { name, email, password, shopName, division, district, sub_district } = req.body;

    try {
      // Kiểm tra email đã tồn tại chưa
      const emailExists = await sellerModel.findOne({ email });
      if (emailExists) {
        return responseReturn(res, 400, { error: "This email is already registered" });
      }

      // Tạo người bán mới
      const newSeller = await sellerModel.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        status: "active", // Admin có thể tạo tài khoản đã kích hoạt
        method: "manual",
        shopInfo: {
          shopName,
          division,
          district,
          sub_district
        }
      });

      responseReturn(res, 201, {
        message: "Seller created successfully",
        seller: newSeller
      });
    } catch (error) {
      console.log("Error creating seller:", error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End method

  // Cập nhật thông tin người bán
  update_seller = async (req, res) => {
    const { sellerId } = req.params;
    const { name, email, shopName, division, district, sub_district, status, payment } = req.body;

    try {
      // Kiểm tra người bán có tồn tại không
      const seller = await sellerModel.findById(sellerId);
      if (!seller) {
        return responseReturn(res, 404, { error: "Seller not found" });
      }

      // Xây dựng đối tượng cập nhật
      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (status) updateData.status = status;
      if (payment) updateData.payment = payment;

      // Cập nhật thông tin cửa hàng nếu có dữ liệu được cung cấp
      if (shopName || division || district || sub_district) {
        updateData.shopInfo = {
          ...seller.shopInfo,
          ...(shopName && { shopName }),
          ...(division && { division }),
          ...(district && { district }),
          ...(sub_district && { sub_district })
        };
      }

      // Cập nhật người bán
      const updatedSeller = await sellerModel.findByIdAndUpdate(
        sellerId,
        updateData,
        { new: true }
      );

      responseReturn(res, 200, {
        message: "Seller information updated successfully",
        seller: updatedSeller
      });
    } catch (error) {
      console.log("Error updating seller:", error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End method

  // Đổi mật khẩu người bán
  change_seller_password = async (req, res) => {
    const { sellerId } = req.params;
    const { newPassword } = req.body;

    try {
      // Kiểm tra người bán có tồn tại không
      const seller = await sellerModel.findById(sellerId);
      if (!seller) {
        return responseReturn(res, 404, { error: "Seller not found" });
      }

      // Cập nhật mật khẩu
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await sellerModel.findByIdAndUpdate(sellerId, { password: hashedPassword });

      responseReturn(res, 200, { message: "Password updated successfully" });
    } catch (error) {
      console.log("Error changing seller password:", error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End method

  // Xóa người bán
  delete_seller = async (req, res) => {
    const { sellerId } = req.params;

    try {
      // Kiểm tra người bán có tồn tại không
      const seller = await sellerModel.findById(sellerId);
      if (!seller) {
        return responseReturn(res, 404, { error: "Seller not found" });
      }

      // Xóa người bán
      await sellerModel.findByIdAndDelete(sellerId);

      responseReturn(res, 200, {
        message: "Seller deleted successfully",
        sellerId
      });
    } catch (error) {
      console.log("Error deleting seller:", error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };
  // End method
}

module.exports = new adminController();