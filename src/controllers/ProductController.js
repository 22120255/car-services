const ProductService = require("../services/productServices");
const { mongooseToObject } = require("../util/mongoose");
const { multipleMongooseToObject, mongooseToObjects } = require("../util/mongoose");

class ProductController {
    index(req, res) {
        res.render('products/index')
    }

    detail(req, res) {
        res.render('products/detail')
    }

    getFilteredProducts = async (req, res, next) => {
        try {
            const query = {};
            
            // Lọc sản phẩm theo brand
            if (req.query.brand) {
                query.brand = req.query.brand;
            }
            if (req.query.model) {
                query.model = req.query.model;
            }
            if (req.query.category) {
                query.category = req.query.category;
            }
            if (req.query.price_min && req.query.price_max) {
                query.price = {
                    $gte: req.query.price_min,
                    $lte: req.query.price_max,
                };
            }
            if (req.query.year)
            {
                query.year = req.query.year;
            }
            if (req.query.status)
            {
                query.status = req.query.status;
            }

            const products = await ProductService.findService(query);
    
            // Render trang nếu không phải là AJAX
            res.render('products/index', { 
                products: multipleMongooseToObject(products),
                queries: query,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req, res, next) => {
        try {
            const product = await ProductService.findOneService(req.params.id);
            const query = { 
                brand: product.brand,
                _id: { $ne: product._id },

            };
            const relatedProducts = await ProductService.findService(query);

            res.render('products/detail', {
                product: mongooseToObject(product),
                relatedProducts: multipleMongooseToObject(relatedProducts),
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new ProductController()
