const bannerModel = require('../../models/bannerModel')
const { responseReturn } = require('../../utiles/response')

class bannerController {
    // Create a new banner
    create = async (req, res) => {
        const { productId, banner, link } = req.body
        try {
            const newBanner = await bannerModel.create({
                productId,
                banner,
                link
            })
            responseReturn(res, 201, { message: 'Banner created successfully', banner: newBanner })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Get all banners
    get = async (req, res) => {
        try {
            const banners = await bannerModel.find({}).sort({ createdAt: -1 })
            responseReturn(res, 200, { banners })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Get a single banner by ID
    getById = async (req, res) => {
        const { bannerId } = req.params
        try {
            const banner = await bannerModel.findById(bannerId)
            if (!banner) {
                return responseReturn(res, 404, { message: 'Banner not found' })
            }
            responseReturn(res, 200, { banner })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Update a banner
    update = async (req, res) => {
        const { bannerId } = req.params
        const { productId, banner, link } = req.body
        try {
            const updatedBanner = await bannerModel.findByIdAndUpdate(
                bannerId,
                { productId, banner, link },
                { new: true }
            )
            if (!updatedBanner) {
                return responseReturn(res, 404, { message: 'Banner not found' })
            }
            responseReturn(res, 200, { message: 'Banner updated successfully', banner: updatedBanner })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Delete a banner
    delete = async (req, res) => {
        const { bannerId } = req.params
        try {
            const deletedBanner = await bannerModel.findByIdAndDelete(bannerId)
            if (!deletedBanner) {
                return responseReturn(res, 404, { message: 'Banner not found' })
            }
            responseReturn(res, 200, { message: 'Banner deleted successfully' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new bannerController()