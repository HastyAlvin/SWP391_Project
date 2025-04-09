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
        // Lấy các tham số từ query string
        const { page, searchValue, parPage } = req.query

        try {
            // Tính toán số lượng items cần bỏ qua để phân trang
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }

            // Trường hợp 1: Có searchValue và có phân trang
            if (searchValue && page && parPage) {
                // Tìm kiếm danh mục theo text và phân trang
                const categorys = await categoryModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                // Đếm tổng số danh mục thỏa điều kiện tìm kiếm
                const totalCategory = await categoryModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { categorys, totalCategory })
            }
            // Trường hợp 2: Không có searchValue nhưng có phân trang
            else if (searchValue === '' && page && parPage) {
                // Lấy danh mục có phân trang
                const categorys = await categoryModel.find({}).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                // Đếm tổng số danh mục
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { categorys, totalCategory })
            }
            // Trường hợp 3: Lấy tất cả danh mục không phân trang
            else {
                // Lấy toàn bộ danh mục, sắp xếp theo thời gian tạo mới nhất
                const categorys = await categoryModel.find({}).sort({ createdAt: -1 })
                // Đếm tổng số danh mục
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { categorys, totalCategory })
            }

        } catch (error) {
            // Ghi log lỗi nếu có
            console.log('Error in get_category:', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
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
                console.log(`Cateogry with id ${categoryId} not found`);
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json({ message: 'Category deleted successfully' });

        } catch (error) {
            console.log(`Error delete category with id ${categoryId}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // end method
}

module.exports = new categoryController()