const cloudinary = require("./cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
        transformation: [{ width: 400, height: 400, crop: 'fill' }]
    }
});
const uploadImage = multer({ storage });

module.exports = { uploadImage };
