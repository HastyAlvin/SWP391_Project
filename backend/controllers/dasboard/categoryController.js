const formidable = require("formidable")
const { responseReturn } = require("../../utiles/response")
const cloudinary = require('cloudinary').v2
const categoryModel = require('../../models/categoryModel')

/**
 * Controller xử lý các chức năng liên quan đến Category (Danh mục sản phẩm)
 */
class categoryController {
    /**
     * Thêm mới một danh mục
     * @param {Request} req Request từ client
     * @param {Response} res Response trả về client
     */
    add_category = async (req, res) => {
        // Khởi tạo form để parse dữ liệu
        const form = formidable()
        form.parse(req, async (err, fields, files) => {
            if (err) {
                responseReturn(res, 404, { error: 'something went wrong' })
            } else {
                // Lấy tên và hình ảnh từ form data
                let { name } = fields
                let { image } = files
                name = name.trim()
                // Tạo slug từ tên danh mục
                const slug = name.split(' ').join('-')

                // Cấu hình cloudinary để upload ảnh
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                })

                try {
                    // Upload ảnh lên cloudinary
                    const result = await cloudinary.uploader.upload(image.filepath, { folder: 'categorys' })

                    if (result) {
                        // Tạo danh mục mới trong database
                        const category = await categoryModel.create({
                            name,
                            slug,
                            image: result.url
                        })
                        responseReturn(res, 201, { category, message: 'Category Added Successfully' })

                    } else {
                        responseReturn(res, 404, { error: 'Image Upload File' })
                    }

                } catch (error) {
                    responseReturn(res, 500, { error: 'Internal Server Error' })
                }
            }
        })
    }

    // end method

    /**
     * Lấy danh sách các danh mục
     * @param {Request} req Request từ client chứa các query params
     * @param {Response} res Response trả về client
     * @param {Number} req.query.page Số trang hiện tại
     * @param {String} req.query.searchValue Giá trị tìm kiếm
     * @param {Number} req.query.parPage Số item trên mỗi trang
     */
    get_category = async (req, res) => {
        const { page = 1, searchValue = '', parPage } = req.query

        try {
            // Xây dựng query object
            const query = {};
            if (searchValue) {
                query.name = { $regex: searchValue, $options: 'i' }; // Case-insensitive search
            }

            // Tính toán pagination
            const skip = parPage ? (parseInt(page) - 1) * parseInt(parPage) : 0;
            const limit = parPage ? parseInt(parPage) : null;

            // Tạo base query với điều kiện tìm kiếm
            const baseQuery = categoryModel.find(query).sort({ createdAt: -1 });

            // Thực hiện queries
            const [categorys, totalCategory] = await Promise.all([
                // Clone query để thêm skip/limit nếu cần
                limit ? baseQuery.clone().skip(skip).limit(limit) : baseQuery.clone(),
                categoryModel.countDocuments(query)
            ]);

            responseReturn(res, 200, { categorys, totalCategory });

        } catch (error) {
            console.log('Error in get_category:', error.message);
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    }

    // end method 

    /**
     * Cập nhật thông tin danh mục
     * @param {Request} req Request từ client
     * @param {Response} res Response trả về client
     */
    update_category = async (req, res) => {
        const form = formidable()
        form.parse(req, async (err, fields, files) => {
            if (err) {
                responseReturn(res, 404, { error: 'something went wrong' })
            } else {
                let { name } = fields
                let { image } = files
                const { id } = req.params;

                name = name.trim()
                const slug = name.split(' ').join('-')

                try {
                    let result = null;
                    if (image) {
                        cloudinary.config({
                            cloud_name: process.env.cloud_name,
                            api_key: process.env.api_key,
                            api_secret: process.env.api_secret,
                            secure: true
                        });

                        result = await cloudinary.uploader.upload(image.filepath, { folder: 'categorys' })
                    }

                    const updateData = {
                        name,
                        slug,
                    }

                    if (result) {
                        updateData.image = result.url;
                    }

                    const category = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });
                    responseReturn(res, 200, { category, message: 'Category Updated successfully' })

                } catch (error) {
                    responseReturn(res, 500, { error: 'Internal Server Error' })
                }
            }
        })
    }

    // end method

    /**
     * Xóa danh mục
     * @param {Request} req Request từ client
     * @param {Response} res Response trả về client
     */
    deleteCategory = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const deleteCategory = await categoryModel.findByIdAndDelete(categoryId);

            if (!deleteCategory) {
                console.log(`Category with id ${categoryId} not found`);
                return responseReturn(res, 404, { error: 'Category not found' });
            }
            responseReturn(res, 200, { message: 'Category deleted successfully' });

        } catch (error) {
            console.log(`Error deleting category:`, error);
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    }

    // end method
}

module.exports = new categoryController()