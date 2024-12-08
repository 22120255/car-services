const cloudinary = require('./cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars', // Folder dành cho ảnh đại diện
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products', // Folder dành cho sản phẩm
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
    transformation: [{ width: 800, height: 800, crop: 'fill' }],
  },
});

const uploadImage = multer({ avatarStorage });
const uploadProductImage = multer({ productStorage });

module.exports = { uploadImage, uploadProductImage };
