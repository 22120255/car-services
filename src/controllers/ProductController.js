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
} = require('../data/mockProducts')

class ProductController {
    index(req, res) {
        res.render('products/index')
    }

    detail(req, res) {
        res.render('products/detail')
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
    //         if (req.query.price_min && req.query.price_max) {
    //             query.price = {
    //                 $gte: req.query.price_min,
    //                 $lte: req.query.price_max,
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
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    pagination = async (req, res, next) => {
        const page = parseInt(req.query.page) || 1
        const perPage = 8

        const filters = {
            year: req.query.year || '',
            category: req.query.category || '',
            brand: req.query.brand || '',
            status: req.query.status || '',
            transmission: req.query.transmission || '',
            price_min: req.query.price_min || '',
            price_max: req.query.price_max || '',
        }

        const query = {}
        if (filters.year) query.year = filters.year
        if (filters.category) query.category = filters.category
        if (filters.brand) query.brand = filters.brand
        if (filters.status) query.status = filters.status
        if (filters.transmission) query.transmission = filters.transmission
        if (filters.price_min) query.price = { $gte: filters.price_min }
        if (filters.price_max)
            query.price = { ...query.price, $lte: filters.price_max }

        try {
            const products = await ProductService.getPaginatedProducts(
                query,
                page,
                perPage
            )

            res.render('products/index', {
                products: multipleMongooseToObject(products.products),
                queries: query,
                years: years,
                categories: categories,
                brands: brands,
                transmissions: transmissions,
                statuses: statuses,
                total: products.total,
                pages: products.totalPages,
                current: products.currentPage,
                pagesArray: products.pagesArray,
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = new ProductController()
