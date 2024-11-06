
module.exports = {
    // chuyển mảng thành object
    multipleMongooseToObject: function (mongooses) {
        return mongooses.map(mongoose => mongoose.toObject());
    },

    // chuyển 1 document thành object thuần túy
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
}
