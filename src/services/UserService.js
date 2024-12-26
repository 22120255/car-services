const User = require('../models/User');
const Product = require('../models/Product');
const DataAnalytics = require('../models/DataAnalytics');
const { getDataReport } = require('../config/analytics');
const Formatter = require('../utils/formatter');
const { mongooseToObject } = require('../utils/mongoose');

class UserService {
  async getUsers({ limit, offset, key, direction, search, status, role }) {
    try {
      let filter = {};
      if (search) {
        filter.$or = [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
      }
      if (status) {
        filter.status = status;
      }
      if (role) {
        filter['role.name'] = role;
      }
      let sort = {};
      if (key) {
        direction ||= 'asc';
        const sortDirection = direction === 'asc' ? 1 : -1;
        sort[key] = sortDirection;
      }
      const users = await User.find(filter)
        .skip(offset * limit)
        .limit(limit)
        .sort(sort);
      const total = await User.countDocuments(filter);

      return { users, total };
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(userId, role, currentUser) {
    const targetUser = await User.findById(userId);

    if (targetUser.role.name === 'sadmin') {
      throw new Error('Unable to update super admin role');
    }

    if (targetUser.role.name === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
      throw new Error("Admin cannot update other admin's role");
    }

    await User.findByIdAndUpdate(userId, { role });
  }

  async updateUserStatus(userId, status, currentUser) {
    const targetUser = await User.findById(userId);

    if (targetUser.role.name === 'sadmin') {
      throw new Error('Cannot change super admin status');
    }

    if (targetUser.role.name === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
      throw new Error("Admin cannot change other admin's status");
    }

    await User.findByIdAndUpdate(userId, { status });
  }

  async deleteUser(userId, currentUser) {
    const targetUser = await User.findById(userId);

    if (targetUser.role.name === 'sadmin') {
      throw new Error('Cannot delete super admin account');
    }

    if (targetUser.role.name === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
      throw new Error("Admin cannot delete another admin's account");
    }

    // await User.findByIdAndDelete(userId);
  }

  // Lấy thông tin user
  async getUser(userId) {
    const user = await User.findById(userId).populate({
      path: 'metadata.purchasedProducts',
      model: 'Product',
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Cập nhật thông tin profile
  async updateProfile(id, data) {
    const updateData = {
      fullName: data.fullName,
      email: data.email,
      'metadata.phone': data.phone,
      'metadata.address': data.address,
    };

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    return user;
  }

  // Cập nhật avatar
  async updateAvatar(userId, pathFile) {
    const user = await User.findByIdAndUpdate(userId, { avatar: pathFile }, { new: true });

    if (!user) {
      throw new Error('User not found');
    }
  }

  // Lấy danh sách sản phẩm
  async getProducts({ limit, offset, search, status, brand, model, priceMin, priceMax }) {
    try {
      let filter = {};

      // Chuẩn hóa giá trị search, status, brand, model về chữ thường
      if (search) {
        filter.$or = [{ brand: { $regex: search.toLowerCase(), $options: 'i' } }, { model: { $regex: search.toLowerCase(), $options: 'i' } }];
      }
      if (status) {
        filter.status = { $regex: `^${status.toLowerCase()}$`, $options: 'i' };
      }
      if (brand) {
        filter.brand = { $regex: `^${brand.toLowerCase()}$`, $options: 'i' };
      }
      if (model) {
        filter.model = { $regex: `^${model.toLowerCase()}$`, $options: 'i' };
      }
      if (priceMin && priceMax) {
        filter.price = { $gte: priceMin, $lte: priceMax };
      }

      // Tiến hành truy vấn với filter đã chuẩn hóa
      const products = await Product.find(filter)
        .skip(offset * limit - limit)
        .limit(limit);
      const total = await Product.countDocuments(filter);

      return { products, total };
    } catch (error) {
      throw error;
    }
  }

  // Lấy một sản phẩm
  async getProduct(productId) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Tạo sản phẩm

  async createProduct(brand, model, year, style, status, price, mileage, horsepower, transmission, description, images, importPrice, fuelType) {
    try {
      const product = await Product.create({
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
        fuelType,
      });
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Cập nhật sản phẩm
  async updateProduct(productId, data) {
    try {
      const allowedFields = [
        'brand',
        'model',
        'year',
        'style',
        'status',
        'price',
        'mileage',
        'horsepower',
        'transmission',
        'description',
        'images',
        'importPrice',
      ];
      const updateData = Object.keys(data)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});

      const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Xoá sản phẩm
  async deleteProduct(productId, idUser) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      // Sử dụng phương thức delete của mongoose-delete
      await product.delete(idUser);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
  // Lấy danh sách sản phẩm đã xoá
  async trashAndGetProducts(query) {
    try {
      const { limit, offset } = query;
      const allDeletedProducts = await Product.findDeleted();

      const startIndex = (offset - 1) * limit;
      const endIndex = startIndex + limit;

      const products = allDeletedProducts.slice(startIndex, endIndex);

      const total = allDeletedProducts.length;

      console.log(`Total deleted products: ${total}`);
      return { products, total };
    } catch (error) {
      console.error('Error fetching deleted products:', error.message);
      throw error;
    }
  }

  // Xoá vĩnh viễn sản phẩm
  async forceDeleteProduct(productId) {
    try {
      const product = await Product.deleteOne({ _id: productId });
      if (!product.deletedCount) {
        throw new Error(`Product with ID ${productId} not found.`);
      }
    } catch (error) {
      console.error('Error force deleting product:', error);
      throw error;
    }
  }

  // Khôi phục sản phẩm
  async restoreProduct(productId) {
    try {
      const product = await Product.restore({ _id: productId });
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }
    } catch (error) {
      console.error('Error restoring product:', error);
      throw error;
    }
  }

  // Lấy dữ liệu thống kê

  async getAnalytics(options = { refresh: false }) {
    if (options.refresh) {
      await getDataReport();
    }
    try {
      const analytics = await DataAnalytics.findOne({}).sort({ createdAt: -1 });
      let result = null;

      if (analytics) {
        result = {
          ...mongooseToObject(analytics),
          createdAtStr: Formatter.formatDate(analytics.createdAt),
        }
      }
      return result;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
