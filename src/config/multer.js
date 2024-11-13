const cloudinary = require("./cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


const storageImage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "image-cars-services",
        format: async () => "jpg"
    }
});

const uploadImage = multer({ storage: storageImage });


module.exports = { uploadImage };
