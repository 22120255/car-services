const ProductService = require('../services/ProductService');
const { multipleMongooseToObject, mongooseToObject } = require('../utils/mongoose');
const { years, styles, brands, transmissions, statuses, prices, perPages } = require('../data/mockProducts');

class ProductController {
  index(req, res) {
    res.render('products/index', {
      title: 'Sản phẩm',
    });
  }

  detail(req, res) {
    res.render('products/detail', {
      title: 'Chi tiết sản phẩm',
    });
  }

  getDetail = async (req, res, next) => {
    try {
      const product = await ProductService.getDetail(req.params.id);
      // Tạm thời hard code delta = 10000
      const delta = 10000;
      const sameBrandProducts = await ProductService.getFilteredProducts({
        brand: product.brand,
        _id: { $ne: product._id },
      });
      const sameYearProducts = await ProductService.getFilteredProducts({
        year: product.year,
        _id: { $ne: product._id },
      });
      const similarPriceProducts = await ProductService.getFilteredProducts({
        price: {
          $gte: product.price - delta,
          $lte: product.price + delta,
        },
        _id: { $ne: product._id },
      });

      res.render('products/detail', {
        product: mongooseToObject(product),
        sameBrandProducts: multipleMongooseToObject(sameBrandProducts),
        sameYearProducts: multipleMongooseToObject(sameYearProducts),
        similarPriceProducts: multipleMongooseToObject(similarPriceProducts),
        title: 'Chi tiết sản phẩm',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

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
          title: 'Sản phẩm',
        });
      }

      // Nếu không phải yêu cầu Ajax, trả về HTML
      res.render('products/index', {
        products: multipleMongooseToObject(products),
        years,
        styles,
        brands,
        transmissions,
        statuses,
        prices,
        perPages,
        title: 'Sản phẩm',
        total,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

module.exports = new ProductController();
