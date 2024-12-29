const UserService = require('../services/UserService');
const DataAnalytics = require('../models/DataAnalytics');
const { clearCache } = require('../utils/helperCache');
const { errorLog } = require('../utils/customLog');
const { mongooseToObject } = require('../utils/mongoose');
const User = require('../models/User');
const Formatter = require('../utils/formatter');

class UserController {
  // [GET] /admin/dashboard
  async index(req, res) {
    res.render('admin/dashboard', {
      layout: 'admin',
      title: 'Dashboard',
    });
  }

  // [GET] /admin/users/accounts
  accounts(req, res) {
    try {
      res.render('admin/accounts', {
        layout: 'admin',
        title: 'Account Management',
      });
    } catch (error) {
      errorLog('UserController', 'accounts', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [GET] /admin/users
  async getUsers(req, res) {
    const { limit = 10, offset = 0, key, direction, search, status, role } = req.query;
    try {
      const { users, total } = await UserService.getUsers({
        limit,
        offset,
        key,
        direction,
        search,
        status,
        role,
      });
      return res.status(200).json({ data: users, total });
    } catch (error) {
      errorLog('AdminController', 'getUsers', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [PATCH] /admin/users/update-role
  async updateRole(req, res) {
    try {
      const { userId, role } = req.body;
      await UserService.updateUserRole(userId, role, req.user);
      return res.status(200).json({ message: 'Role update successful!' });
    } catch (error) {
      errorLog('AdminController', 'updateRole', error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [PATCH] /admin/users/update-status
  async updateStatus(req, res) {
    try {
      const { userId, status } = req.body;
      await UserService.updateUserStatus(userId, status, req.user);
      return res.status(200).json({ message: 'Status update successful!' });
    } catch (error) {
      errorLog('UserController', 'updateStatus', error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [DELETE] /admin/users/:id
  async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id, req.user);
      res.status(200).json({ message: 'Account deleted successfully!' });
    } catch (error) {
      errorLog('UserController', 'deleteUser', error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [GET] /admin/inventory/products
  async products(req, res) {
    try {
      res.render('admin/inventory/products', {
        layout: 'admin',
        title: 'Product Management',
      });
    } catch (error) {
      errorLog('UserController', 'products', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [GET] /admin/inventory/
  async getProducts(req, res) {
    const { limit, offset, search, status, brand, model, priceMin, priceMax } = req.query;
    try {
      const { products, total } = await UserService.getProducts({
        limit: limit || 10,
        offset: offset || 1,
        search,
        status,
        brand,
        model,
        priceMin,
        priceMax,
      });
      return res.status(200).json({ products, total });
    } catch (error) {
      errorLog('UserController', 'getProducts', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [POST] /api/inventory/create-product
  async createProduct(req, res) {
    try {
      const { brand, model, year, style, status, price, mileage, horsepower, transmission, description, images, importPrice, fuelType } = req.body;
      const product = await UserService.createProduct(
        brand,
        model,
        year,
        style,
        status,
        price,
        mileage,
        horsepower,
        transmission,
        description,
        images,
        importPrice,
        fuelType
      );
      if (product) return res.status(201).json({ message: 'Create product successfully' });
    } catch (error) {
      errorLog('UserController', 'createProduct', error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [GET] /api/inventory/:id
  async getProduct(req, res) {
    try {
      const product = await UserService.getProduct(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      errorLog('UserController', 'getProduct', error.message);
      return res.status(404).json({ error: error.message });
    }
  }

  // [PATCH] /api/inventory/update-product.
  async updateProduct(req, res) {
    try {
      const { id } = req.params; // Lấy id từ params
      const data = req.body; // Lấy các thông tin còn lại
      const product = await UserService.updateProduct(id, data);
      if (product) return res.status(200).json({ message: 'Update product successfully' });
    } catch (error) {
      errorLog('UserController', 'updateProduct', error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [DELETE] /api/inventory/delete-product/:id
  async deleteProduct(req, res) {
    try {
      const userId = req.user?._id || req.session?.userId;
      await UserService.deleteProduct(req.params.id, userId);
      return res.status(200).json({ message: 'Delete product successfully' });
    } catch (error) {
      errorLog('UserController', 'deleteProduct', error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [GET] /admin/inventory/trash
  async trash(req, res) {
    try {
      const { limit, offset, search, status, brand, model, priceMin, priceMax } = req.query;
      const products = await UserService.getProducts({ limit, offset, search, status, brand, model, priceMin, priceMax });
      res.render('admin/inventory/trash', {
        layout: 'admin',
        title: 'Trash',
        products,
      });
    } catch (error) {
      errorLog('UserController', 'trash', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [DELETE] /admin/inventory/trash/delete
  async forceDeleteProduct(req, res) {
    try {
      const productId = req.params.id;
      await UserService.forceDeleteProduct(productId);
      return res.status(200).json({ message: 'Delete product successfully' });
    } catch (error) {
      errorLog('UserController', 74, error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [PATCH] /admin/inventory/trash/restore
  async restoreProduct(req, res) {
    try {
      const productId = req.params.id;
      await UserService.restoreProduct(productId);
      return res.status(200).json({ message: 'Restore product successfully' });
    } catch (error) {
      errorLog('UserController', 74, error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [GET] /admin/inventory/trash
  async trashAndGetProducts(req, res) {
    const { limit, offset } = req.query;
    try {
      const { products, total } = await UserService.trashAndGetProducts({
        limit: limit || 8,
        offset: offset || 1,
      });
      return res.status(200).json({ products, total });
    } catch (error) {
      errorLog('UserController', 'trashAndGetProducts', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [PATCH] /api/user/product/store
  async storeProduct(req, res) {
    if (req.file) {
      return res.json({ secure_url: req.file.path }); // Sử dụng secure_url thay vì path
    }
    return res.status(400).json({ message: 'Failed to upload image' });
  }

  // [GET] /admin/orders
  async orders(req, res) {
    try {
      res.render('admin/orders', {
        layout: 'admin',
        title: 'Order Management',
      });
    } catch (error) {
      errorLog('UserController', 'orders', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [GET] /api/user/orders
  async getOrders(req, res) {
    const { limit = 10, offset = 0, key, direction, search, status, priceMin, priceMax } = req.query;
    try {
      const { orders, total } = await UserService.getOrders({
        limit,
        offset,
        key,
        direction,
        search,
        status,
        priceMin,
        priceMax,
      });
      return res.status(200).json({ orders, total });
    } catch (error) {
      errorLog('UserController', 'getOrders', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [GET] /api/user/orders/:id
  async getOrder(req, res) {
    try {
      const order = await UserService.getOrder(req.params.id);
      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // [PATCH] /api/user/orders/status/:id
  async updateOrderStatus(req, res) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      if (!orderId || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      await UserService.updateOrderStatus(orderId, status);
      return res.status(200).json({ message: 'Update order status successfully' });
    } catch (error) {
      errorLog('UserController', 'updateOrderStatus', error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [GET] /admin/reports
  async reports(req, res) {
    try {
      res.render('admin/reports', {
        layout: 'admin',
        title: 'Statistical report',
      });
    } catch (error) {
      errorLog('UserController', 'reports', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [GET] /admin/settings
  async settings(req, res) {
    try {
      res.render('admin/settings', {
        layout: 'admin',
        title: 'Cài đặt hệ thống',
      });
    } catch (error) {
      errorLog('UserController', 'settings', error.message);
      res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau!' });
    }
  }

  // [GET] /api/user/:id
  async getUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await UserService.getUser(userId);
      res.render('admin/detail', {
        user,
        layout: false,
      });
    } catch (error) {
      errorLog('UserController', 'getUser', error.message);
      res.status(404).json({ message: error.message });
    }
  }

  // [PATCH] /api/user
  async updateProfile(req, res) {
    try {
      const { id } = req.body;
      const user = await UserService.updateProfile(id, req.body);
      if (req.isAuthenticated()) clearCache(`user/profile/${id}/${req.user._id}`);
      else clearCache(`user/profile/${id}`);
      res.status(200).json(user);
    } catch (error) {
      errorLog('UserController', 'updateProfile', error.message);
      res.status(500).json({ message: error.message });
    }
  }

  // [PATCH] /user/avatar/store
  async updateAvatar(req, res) {
    try {
      const pathFile = req.file.path;
      const userId = req.body.userId;

      await UserService.updateAvatar(userId, pathFile);
      clearCache(`user/profile/${userId}`);
      res.status(200).json({
        avatar: pathFile,
      });
    } catch (error) {
      errorLog('UserController', 'updateAvatar', error.message);
      res.status(500).json({
        error: 'Failed to update avatar',
      });
    }
  }

  // [GET] /profile/:id
  async profile(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId)
        .populate({
          path: 'metadata.purchasedProducts.product', // Populate theo đường dẫn mới
          select: 'brand model year mileage price images reviewStatus',
        })
        .lean()
        .exec();
      res.render('user/profile', {
        _user: user,
        title: 'Personal information',
      });
    } catch (error) {
      errorLog('UserController', 'profile', error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }
  async getPurchasedList(req, res) {
    try {
      // Lấy thông tin người dùng và populate sản phẩm đã mua
      const user = await User.findById(req.user._id)
        .populate({
          path: 'metadata.purchasedProducts.product',
          select: 'brand model year mileage price images reviewStatus',
        })
        .lean()
        .exec();

      const orders = await Order.find({ userId: req.user._id })
        .select('items')
        .populate({
          path: 'items.productId',
          select: 'reviewStatus',
        })
        .lean();

      const productReviewStatuses = {};

      orders.forEach((order) => {
        order.items.forEach((item) => {
          const productId = item.productId._id.toString();
          const reviewStatus = item.reviewStatus;

          if (!productReviewStatuses[productId]) {
            productReviewStatuses[productId] = 'not-reviewed';
          }

          if (reviewStatus === 'reviewed') {
            productReviewStatuses[productId] = 'reviewed';
          }
        });
      });

      user.metadata.purchasedProducts.forEach((purchasedProduct) => {
        const productId = purchasedProduct.product._id.toString();

        if (productReviewStatuses[productId] === 'reviewed') {
          if (purchasedProduct.reviewStatus !== 'reviewed') {
            purchasedProduct.reviewStatus = 'reviewed';
          }
        } else {
          purchasedProduct.reviewStatus = 'not-reviewed';
        }
      });

      if (user.metadata.recentActivity) {
        user.metadata.recentActivity.sort((a, b) => b.date - a.date);
      }

      res.render('user/purchasedList', {
        layout: 'main',
        user,
      });
    } catch (error) {
      console.error('Error getting purchased cars:', error);
      res.status(500).render('error');
    }
  }

  // [POST] /api/user/review/store
  async storeReview(req, res) {
    if (req.file) {
      // console.log(req.file);
      return res.json({ secure_url: req.file.path });
    }
    return res.status(400).json({ message: 'Failed to upload image' });
  }
}

module.exports = new UserController();
