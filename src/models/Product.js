const mongoose = require('mongoose');  

const ProductSchema = new mongoose.Schema({  
    name: { type: String, required: true },  
    description: { type: String, required: true },  
    price: { type: Number, required: true },  
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  
    status: { type: String, enum: ['in_stock', 'out_of_stock', 'suspended'], default: 'in_stock' },  
    created_at: { type: Date, default: Date.now },  
    updated_at: { type: Date, default: Date.now },  
});  

module.exports = mongoose.model('Product', ProductSchema); 