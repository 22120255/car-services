const ProductService = require('../services/ProductService');
const { multipleMongooseToObject, mongooseToObject } = require('../utils/mongoose');
const { years, styles, brands, transmissions, statuses, prices, perPages } = require('../data/mockProducts');

class ProductController {
  index(req, res) {
    res.render('products/index', {
      title: 'Product',
    });
  }

  // detail(req, res) {
  //   res.render('products/detail', {
  //     title: 'Product details',
  //   });
  // }

  // [GET] /api/products/related/:id/:by
  getRelatedProducts = async (req, res, next) => {
    const { id, by } = req.params;
    const { limit = 4, offset = 1 } = req.query;
    console.log(`Tìm sản phẩm liên quan với ${id} theo ${by}`);
    console.log(req.query);
    try {
      let products, total;

      // Đảm bảo limit và offset là kiểu số
      const limitNumber = parseInt(limit);
      const offsetNumber = parseInt(offset);

      const baseQuery = { _id: { $ne: id } };

      switch (by) {
        case 'brand':
          const brandQuery = { ...baseQuery, brand: req.query.brand };
          ({ products, total } = await ProductService.getPaginatedProducts(brandQuery, offsetNumber, limitNumber));
          break;

        case 'year':
          const yearQuery = { ...baseQuery, year: req.query.year };
          ({ products, total } = await ProductService.getPaginatedProducts(yearQuery, offsetNumber, limitNumber));
          break;

        case 'price':
          // Tạm thời hard code delta = 10000
          const delta = 10000;
          const currentPrice = parseFloat(req.query.price) || 0; // Lấy giá từ query, mặc định là 0 nếu không có
          const priceQuery = {
            ...baseQuery,
            price: {
              $gte: currentPrice - delta,
              $lte: currentPrice + delta,
            },
          };
          ({ products, total } = await ProductService.getPaginatedProducts(priceQuery, offsetNumber, limitNumber));
          break;

        default:
          ({ products, total } = await ProductService.getPaginatedProducts(baseQuery, offsetNumber, limitNumber));
          break;
      }

      console.log(`Tìm thấy ${products.length} sản phẩm liên quan (${by})`);
      return res.status(200).json({
        products: multipleMongooseToObject(products),
        total: total,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  // [GET] /products/:id
  getDetail = async (req, res, next) => {
    try {
      const product = await ProductService.getDetail(req.params.id);
      if (!product) return next();
      res.render('products/detail', {
        product: mongooseToObject(product),
        title: 'Product details',
      });
    } catch (error) {
      console.log(error);
      next();
    }
  };

  // [GET] /products
  products = async (req, res, next) => {
    try {
      res.render('products/index', {
        years,
        styles,
        brands,
        transmissions,
        statuses,
        prices,
        perPages,
        title: 'Sản phẩm',
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  // [GET] /api/products
  productsAndGetProducts = async (req, res, next) => {
    const page = parseInt(req.query.offset) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const query = {};
    const search = req.query.search;

    // Lọc theo các trường cụ thể
    if (req.query.year) query.year = req.query.year;
    if (req.query.style) query.style = req.query.style;
    if (req.query.brand) query.brand = req.query.brand;
    if (req.query.status) query.status = req.query.status;
    if (req.query.transmission) query.transmission = req.query.transmission;

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
        $or: [{ brand: { $regex: key, $options: 'i' } }, { model: { $regex: key, $options: 'i' } }],
      }));

      const descriptionSearch = keywords.map((key) => ({
        description: { $regex: key, $options: 'i' },
      }));

      query.$or = [...brandAndModel, ...descriptionSearch];
    }

    try {
      // Lấy dữ liệu từ service
      const { products, total } = await ProductService.getPaginatedProducts(query, page, limit);

      const isAjax = req.xhr || req.get('X-Requested-With') === 'XMLHttpRequest';
      // Kiểm tra header X-Requested-With để phân biệt yêu cầu Ajax
      if (isAjax && req.headers.referer?.includes('/products')) {
        // Trả về JSON cho yêu cầu Ajax
        return res.status(200).json({
          products: multipleMongooseToObject(products),
          total,
          filters: {
            years,
            styles,
            brands,
            transmissions,
            statuses,
            prices,
            perPages,
          },
          title: 'Products',
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

module.exports = new ProductController();
