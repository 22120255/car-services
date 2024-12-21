const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('./cloudinary');

// Cấu hình storage cho avatar
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
});

// Cấu hình storage cho sản phẩm
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
    transformation: [{ width: 800, height: 800, crop: 'fill' }],
  },
});

// Cấu hình storage cho ảnh đánh giá
const reviewImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'reviews',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
    transformation: [{ width: 800, height: 800, crop: 'fill' }],
  },
});

// Khởi tạo multer với avatarStorage và productStorage
const uploadAvatar = multer({ storage: avatarStorage });
const uploadProductImage = multer({ storage: productStorage });
const uploadReviewImage = multer({ storage: reviewImageStorage });

module.exports = { uploadAvatar, uploadProductImage, uploadReviewImage };
