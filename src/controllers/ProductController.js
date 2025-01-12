const ProductService = require('../services/ProductService');
const OrderService = require('../services/OrderService');
const { errorLog } = require('../utils/customLog');
const { multipleMongooseToObject, mongooseToObject } = require('../utils/mongoose');
const { clearCache } = require('../utils/helperCache');

class ProductController {
  index(req, res) {
    res.render('products/index', {
      title: 'Product',
    });
  }
  // [GET] /api/products/related/:id/:by
  getRelatedProducts = async (req, res, next) => {
    const { id } = req.params;
    const { limit = 4, offset = 1, ...query } = req.query;

    try {
      let products = [];
      let total = 0;

      const limitNumber = parseInt(limit);
      const offsetNumber = parseInt(offset);

      const baseQuery = { _id: { $ne: id } };

      const [activeTab, fieldData] = Object.entries(query)[0] || [];
      if (!activeTab || !fieldData) {
        return res.status(400).json({ message: 'Thiếu hoặc không hợp lệ activeTab và fieldData trong query.' });
      }

      // Xử lý các trường hợp của activeTab
      switch (activeTab) {
        case 'brand':
          {
            const brandQuery = { ...baseQuery, brand: fieldData };
            ({ products, total } = await ProductService.getPaginatedProducts(brandQuery, offsetNumber, limitNumber));
            break;
          }
        case 'year':
          {
            const yearQuery = { ...baseQuery, year: fieldData };
            ({ products, total } = await ProductService.getPaginatedProducts(yearQuery, offsetNumber, limitNumber));
            break;
          }

        case 'price':
          // TODO: Tạm thời mặc định 10000
          {
            const delta = 10000;
            const currentPrice = parseFloat(fieldData);
            if (isNaN(currentPrice)) {
              return res.status(400).json({ message: 'Giá (price) không hợp lệ.' });
            }
            const priceQuery = {
              ...baseQuery,
              price: {
                $gte: currentPrice - delta,
                $lte: currentPrice + delta,
              },
            };
            ({ products, total } = await ProductService.getPaginatedProducts(priceQuery, offsetNumber, limitNumber));
            break;
          }
        default:
          return res.status(400).json({ message: `Loại tìm kiếm "${activeTab}" không hợp lệ.` });
      }

      res.status(200).json({ products, total });
    } catch (error) {
      errorLog('ProductController', 'getRelatedProducts', error);
    }
  };

  // [GET] /products/:id
  getDetail = async (req, res, next) => {
    try {
      const product = await ProductService.getDetail(req.params.id);
      const totalRating = (await OrderService.updateAverageRating(req.params.id)) || 0;
      const reviews = await OrderService.getReviews(req.params.id);
      if (!product) return next();
      clearCache(`products/${req.params.id}`);
      res.render('products/detail', {
        product: mongooseToObject(product),
        title: 'Product details',
        totalRating,
        reviews,
      });
    } catch (error) {
      errorLog('ProductController', 'getDetail', error);
      next();
    }
  };

  // [GET] /products
  products = async (req, res, next) => {
    try {
      res.render('products/index', {
        title: 'Products',
      });
    } catch (error) {
      errorLog('ProductController', 'products', error);
      next(error);
    }
  };

  // [GET] /api/products
  getProducts = async (req, res, next) => {
    const page = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const query = {};
    const search = req.query.search;

    // Lọc theo các trường cụ thể với không phân biệt hoa thường
    if (req.query.year) query.year = req.query.year;
    if (req.query.style) query.style = { $regex: new RegExp(req.query.style, 'i') }; // Không phân biệt hoa thường
    if (req.query.brand) query.brand = { $regex: new RegExp(req.query.brand, 'i') }; // Không phân biệt hoa thường
    if (req.query.status) query.status = { $regex: new RegExp(req.query.status, 'i') }; // Không phân biệt hoa thường
    if (req.query.transmission) query.transmission = { $regex: new RegExp(req.query.transmission, 'i') }; // Không phân biệt hoa thường

    // Lọc theo giá
    if (req.query.priceMin || req.query.priceMax) {
      query.price = {};
      if (req.query.priceMin) query.price.$gte = req.query.priceMin;
      if (req.query.priceMax) query.price.$lte = req.query.priceMax;
    }

    // Tìm kiếm theo từ khóa
    if (search) {
      const keywords = search.split(' ');

      const brandAndModel = keywords.map((key) => ({
        $or: [
          { brand: { $regex: key, $options: 'i' } },
          { model: { $regex: key, $options: 'i' } },
          { year: { $regex: key, $options: 'i' } },
          { style: { $regex: key, $options: 'i' } },
          { transmission: { $regex: key, $options: 'i' } },
          { status: { $regex: key, $options: 'i' } },
        ],
      }));

      const descriptionSearch = keywords.map((key) => ({
        description: { $regex: key, $options: 'i' },
      }));

      query.$or = [...brandAndModel, ...descriptionSearch];
    }

    try {
      // Lấy dữ liệu từ service
      const { products, total } = await ProductService.getPaginatedProducts(query, page, limit);


      return res.status(200).json({
        products: multipleMongooseToObject(products),
        total,
      });
    } catch (error) {
      errorLog('ProductController', 'getProducts', error);
    }
  };

  // [GET] /api/products/reviews/:id
  getReviews = async (req, res) => {
    try {
      const { filter } = req.query;
      const { reviews } = await OrderService.getReviews(req.params.id, filter);
      return res.status(200).json({ reviews });
    } catch (error) {
      console.error('Error in getReviews:', error);
      return res.status(500).json({ message: 'Có lỗi xảy ra khi lấy đánh giá sản phẩm.' });
    }
  };

  // [GET] /api/products/reviews/filter/:id
  statsReviews = async (req, res) => {
    try {
      const stats = await OrderService.getAllReviewStats(req.params.id);
      res.status(200).json({ stats });
    } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra khi lấy số lượng đánh giá sản phẩm.' });
    }
  };
}

module.exports = new ProductController();
