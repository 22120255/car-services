const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

class UserService {
  async getUsers({ limit, offset, key, direction, search, status, role }) {
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

    const users = await User.find(filter).skip(offset).limit(limit).sort(sort);
    const total = await User.countDocuments(filter);

    return { users, total };
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

      // Tìm tất cả các sản phẩm đã bị xóa, và sử dụng populate để lấy thông tin người xóa
      const allDeletedProducts = await Product.findDeleted()
        .populate({
          path: 'deletedBy', // Trường này tham chiếu tới ObjectId của User
          model: 'User', // Tham chiếu đến model 'User'
          select: 'fullName', // Lấy trường fullName của User
        })
        .exec();

      const startIndex = (offset - 1) * limit;
      const endIndex = startIndex + limit;

      const products = allDeletedProducts.slice(startIndex, endIndex);

      const total = allDeletedProducts.length;

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

  // Lấy danh sách đơn hàng

  async getOrders({ limit = 10, offset = 0, key, direction, search, status, priceMin, priceMax }) {
    try {
      let filter = {};
      // Xử lý search
      if (search) {
        // Tìm users có tên match với search term
        const users = await User.find({
          fullName: { $regex: search, $options: 'i' },
        }).select('_id');
        const userIds = users.map((user) => user._id);
        // Tìm products có brand hoặc model match với search term
        const products = await Product.find({
          $or: [{ brand: { $regex: search, $options: 'i' } }, { model: { $regex: search, $options: 'i' } }],
        }).select('_id');
        const productIds = products.map((product) => product._id);
        // Build filter cho orders
        filter.$or = [
          { userId: { $in: userIds } }, // Orders của users match
          { 'items.productId': { $in: productIds } }, // Orders có products match
        ];
      }

      // Filter theo status
      if (status) {
        filter.status = status;
      }
      if (priceMin && priceMax) {
        filter.totalAmount = { $gte: priceMin, $lte: priceMax };
      }

      // Xử lý sort
      let sort = {};
      if (key) {
        direction ||= 'asc';
        const sortDirection = direction === 'asc' ? 1 : -1;
        sort[key] = sortDirection;
      }

      // Query orders với populate
      const orders = await Order.find(filter)
        .populate({
          path: 'userId',
          select: 'fullName email phone',
        })
        .populate({
          path: 'items.productId',
          select: 'brand model price images',
        })
        .skip(offset)
        .limit(limit)
        .sort(sort)
        .lean();

      const total = await Order.countDocuments(filter);

      return { orders, total };
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  }

  async getOrder(orderId) {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    try {
      const order = await Order.findById(orderId)
        .populate({
          path: 'userId',
          select: 'fullName email phone',
        })
        .populate({
          path: 'items.productId',
          select: 'brand model price images',
        })
        .lean()
        .exec();

      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }

      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async getUserOrders(userId) {
    // Fetch orders for the logged-in user with populated product data
    const orders = await Order.find({ userId })
      .populate({
        path: 'items.productId',
        select: 'name images price',
        model: 'Product'
      })
      .sort({ createdAt: -1 });

    // Transform orders data to match template requirements
    return orders.map(order => {
      const orderObj = order.toObject();
      
      // Transform items to match template structure
      orderObj.items = orderObj.items.map(item => ({
        product: {
          images: item.productId.images,
          name: item.productId.name
        },
        quantity: item.quantity,
        price: item.price
      }));

      return orderObj;
    });
  }

  async updateOrderStatus(orderId, status) {
    try {
      if (!status) {
        throw new Error('Status is required');
      }
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
