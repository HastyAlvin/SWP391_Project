const formidable = require("formidable")
const { responseReturn } = require("../../utiles/response")
const cloudinary = require('cloudinary').v2
const productModel = require('../../models/productModel')

class productController {

    add_product = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true })

        form.parse(req, async (err, field, files) => {
            let { name, category, description, stock, price, discount, shopName, brand } = field;
            let { images } = files;
            name = name.trim()
            const slug = name.split(' ').join('-')

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })

            try {
                let allImageUrl = [];

                if (!Array.isArray(images)) {
                    images = [images];
                }

                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(images[i].filepath, { folder: 'products' });
                    allImageUrl.push(result.url);
                }

                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    shopName,
                    category: category.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images: allImageUrl,
                    brand: brand.trim()
                })
                responseReturn(res, 201, { message: 'Product Added Successfully' })

            } catch (error) {
                responseReturn(res, 500, { error: error.message })
            }

        })

    }

    /// end method 

    products_get = async (req, res) => {
        // Lấy các tham số từ query string
        const { page = 1, searchValue, parPage = 10 } = req.query
        const { id } = req;

        try {
            // Kiểm tra id người bán
            if (!id) {
                return responseReturn(res, 400, { error: 'Seller ID is required' });
            }

            // Tính toán số trang cần bỏ qua cho phân trang
            const skipPage = parseInt(parPage) * (parseInt(page) - 1);

            // Tạo query cơ bản với điều kiện sellerId
            const query = { sellerId: id };

            // Thêm điều kiện tìm kiếm theo tên nếu có searchValue
            if (searchValue?.trim()) {
                query.name = { $regex: searchValue.trim(), $options: 'i' }; // i: không phân biệt hoa thường
            }

            // Thực thi song song query lấy sản phẩm và đếm tổng số sản phẩm
            const [products, totalProduct] = await Promise.all([
                productModel.find(query)
                    .skip(skipPage)
                    .limit(parseInt(parPage))
                    .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
                    .select('-__v'),
                productModel.countDocuments(query)
            ]);

            // Trả về kết quả
            responseReturn(res, 200, {
                products,
                totalProduct,
                currentPage: parseInt(page),
                perPage: parseInt(parPage)
            });

        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    // End Method 

    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId)
            responseReturn(res, 200, { product })
        } catch (error) {
            console.log(error.message)
        }
    }
    // End Method 

    product_update = async (req, res) => {
        let { name, description, stock, price, discount, brand, productId, category } = req.body;
        name = name.trim()
        const slug = name.split(' ').join('-')

        try {
            await productModel.findByIdAndUpdate(productId, {
                name, description, stock, price, discount, brand, productId, slug, category
            })
            const product = await productModel.findById(productId)
            responseReturn(res, 200, { product, message: 'Product Updated Successfully' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }


    }

    // End Method 

    product_image_update = async (req, res) => {
        const form = formidable({ multiples: true })

        form.parse(req, async (err, field, files) => {
            const { oldImage, productId } = field;
            const { newImage } = files

            if (err) {
                responseReturn(res, 400, { error: err.message })
            } else {
                try {

                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    })

                    const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'products' })

                    if (result) {
                        let { images } = await productModel.findById(productId)
                        const index = images.findIndex(img => img === oldImage)
                        images[index] = result.url;
                        await productModel.findByIdAndUpdate(productId, { images })

                        const product = await productModel.findById(productId)
                        responseReturn(res, 200, { product, message: 'Product Image Updated Successfully' })

                    } else {
                        responseReturn(res, 404, { error: 'Image Upload Failed' })
                    }


                } catch (error) {
                    responseReturn(res, 404, { error: error.message })
                }
            }



        })
    }
    // End Method 

    deleteProduct = async (req, res) => {
        try {
            const productId = req.params.id;
            const deleteProduct = await productModel.findByIdAndDelete(productId);

            if (!deleteProduct) {
                console.log(`Product with id ${productId} not found`);
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });

        } catch (error) {
            console.log(`Error delete product with id ${productId}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    }
}

module.exports = new productController()