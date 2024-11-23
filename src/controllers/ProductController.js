const ProductService = require('../services/ProductService')
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../utils/mongoose')
const {
    years,
    categories,
    brands,
    transmissions,
    statuses,
    price,
    perPage,
} = require('../data/mockProducts')

class ProductController {
    index(req, res) {
        res.render('products/index', {
            title: 'Sản phẩm'
        })
    }

    detail(req, res) {
        res.render('products/detail', {
            title: 'Chi tiết sản phẩm'
        })
    }

    // getFilteredProducts = async (req, res, next) => {
    //     // Xem xét tạo bảng riêng cho brands

    //     try {
    //         const query = {}

    //         // Lọc sản phẩm theo brand
    //         if (req.query.brand) {
    //             query.brand = req.query.brand
    //         }
    //         if (req.query.transmission) {
    //             query.transmission = req.query.transmission
    //         }
    //         if (req.query.category) {
    //             query.category = req.query.category
    //         }
    //         if (req.query.priceMin && req.query.priceMax) {
    //             query.price = {
    //                 $gte: req.query.priceMin,
    //                 $lte: req.query.priceMax,
    //             }
    //         }
    //         if (req.query.year) {
    //             query.year = req.query.year
    //         }
    //         if (req.query.status) {
    //             query.status = req.query.status
    //         }

    //         const products = await ProductService.getFilteredProducts(query)
    //         res.render('products/index', {
    //             products: multipleMongooseToObject(products),
    //             queries: query,
    //             years: years,
    //             categories: categories,
    //             brands: brands,
    //             transmissions: transmissions,
    //             statuses: statuses,
    //         })
    //     } catch (error) {
    //         console.log(error)
    //         next(error)
    //     }
    // }

    getDetail = async (req, res, next) => {
        try {
            const product = await ProductService.getDetail(req.params.id)
            // Tạm thời hard code delta = 10000
            const delta = 10000
            const sameBrandProducts = await ProductService.getFilteredProducts({
                brand: product.brand,
                _id: { $ne: product._id },
            })
            const sameYearProducts = await ProductService.getFilteredProducts({
                year: product.year,
                _id: { $ne: product._id },
            })
            const similarPriceProducts =
                await ProductService.getFilteredProducts({
                    price: {
                        $gte: product.price - delta,
                        $lte: product.price + delta,
                    },
                    _id: { $ne: product._id },
                })

            res.render('products/detail', {
                product: mongooseToObject(product),
                sameBrandProducts: multipleMongooseToObject(sameBrandProducts),
                sameYearProducts: multipleMongooseToObject(sameYearProducts),
                similarPriceProducts:
                    multipleMongooseToObject(similarPriceProducts),
                title: 'Chi tiết sản phẩm'
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    pagination = async (req, res, next) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 8
        const query = {}
        const search = req.query.search

        if (req.query.year) query.year = req.query.year
        if (req.query.category) query.category = req.query.category
        if (req.query.brand) query.brand = req.query.brand
        if (req.query.status) query.status = req.query.status
        if (req.query.transmission) query.transmission = req.query.transmission

        if (req.query.priceMin || req.query.priceMax) {
            query.price = {}
            if (req.query.priceMin) query.price.$gte = req.query.priceMin
            if (req.query.priceMax) query.price.$lte = req.query.priceMax
        }

        if (search) {
            const keywords = search.split(' ')

            const brandAndModel = keywords.map((key) => ({
                $or: [
                    { brand: { $regex: key, $options: 'i' } },
                    { model: { $regex: key, $options: 'i' } },
                ],
            }))

            const descriptionSearch = keywords.map((key) => ({
                description: { $regex: key, $options: 'i' },
            }))

            query.$or = [...brandAndModel, ...descriptionSearch]
        }

        try {
            const { products, total, totalPages, currentPage } =
                await ProductService.getPaginatedProducts(query, page, limit)
            res.render('products/index', {
                products: multipleMongooseToObject(products),
                years,
                categories,
                brands,
                transmissions,
                statuses,
                total,
                price,
                pages: totalPages,
                current: currentPage,
                perPage,
                title: 'Sản phẩm'
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = new ProductController()
