const UserService = require('../services/UserService');
const { clearCache } = require('../utils/helperCache');
const { errorLog } = require('../utils/customLog');
const User = require('../models/User');

class UserController {
  // [GET] /admin/dashboard
  index(req, res) {
    res.render('admin/dashboard', { layout: 'admin', title: 'Dashboard' });
  }

  // [GET] /admin/users/accounts
  accounts(req, res) {
    try {
      res.render('admin/accounts', {
        layout: 'admin',
        title: 'Account Management',
      });
    } catch (error) {
      errorLog('UserController', 20, error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [GET] /admin/users
  async getUsers(req, res) {
    const { limit, offset, key, direction, search, status, role } = req.query;
    try {
      const { users, total } = await UserService.getUsers({
        limit: limit || 10,
        offset: offset || 0,
        key,
        direction,
        search,
        status,
        role,
      });
      return res.status(200).json({ data: users, total });
    } catch (error) {
      errorLog('AdminController', 24, error.message);
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
      errorLog('AdminController', 36, error.message);
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
      errorLog('UserController', 69, error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [DELETE] /admin/users/:id
  async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id, req.user);
      res.status(200).json({ message: 'Account deleted successfully!' });
    } catch (error) {
      errorLog('UserController', 80, error.message);
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
      logger.error(error.message);
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
      errorLog('UserController', 137, error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [POST] /api/inventory/create-product
  async createProduct(req, res) {
    try {
      console.log(req.body);
      const { brand, model, year, style, status, price, mileage, horsepower, transmission, description, images } = req.body;
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
        images
      );
      if (product) return res.status(201).json({ message: 'Create product successfully' });
    } catch (error) {
      errorLog('UserController', 36, error.message);
      return res.status(403).json({ error: error.message });
    }
  }

  // [GET] /api/inventory/:id
  async getProduct(req, res) {
    try {
      const product = await UserService.getProduct(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      errorLog('UserController', 48, error.message);
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
      errorLog('UserController', 62, error.message);
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
      errorLog('UserController', 74, error.message);
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
      errorLog('UserController', 137, error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [GET] /admin/inventory/trash
  async trashAndGetProducts(req, res) {
    const { limit, offset } = req.query;
    try {
      const { products, total } = await UserService.trashAndGetProducts({
        limit: limit || 10,
        offset: offset || 1,
      });
      return res.status(200).json({ products, total });
    } catch (error) {
      errorLog('UserController', 137, error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
    }
  }

  // [GET] /admin/orders
  async orders(req, res) {
    try {
      res.render('admin/orders', {
        layout: 'admin',
        title: 'Order Management',
      });
    } catch (error) {
      errorLog('UserController', 137, error.message);
      res.status(500).json({ error: 'An error occurred, please try again later!' });
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
      errorLog('UserController', 150, error.message);
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
      errorLog('UserController', 163, error.message);
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
      errorLog('UserController', 178, error.message);
      res.status(404).json({ message: error.message });
    }
  }

  // [PATCH] /api/user
  async updateProfile(req, res) {
    try {
      const { id } = req.body;
      const user = await UserService.updateProfile(id, req.body);
      clearCache(`/profile/${id}`);
      res.status(200).json(user);
    } catch (error) {
      errorLog('UserController', 15, error.message);
      res.status(500).json({ message: error.message });
    }
  }

  // [PATCH] /user/avatar/store
  async updateAvatar(req, res) {
    try {
      const pathFile = req.file.path;
      const userId = req.body.userId;

      const result = await UserService.updateAvatar(userId, pathFile);
      res.status(200).json(result);
    } catch (error) {
      errorLog('UserController', 29, error.message);
      res.status(500).json({
        error: 'Failed to update avatar',
      });
    }
  }

  // [GET] /profile/:id
  async profile(req, res) {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render('user/profile', {
      _user: user,
      title: 'Personal information',
    });
  }
}

module.exports = new UserController();
