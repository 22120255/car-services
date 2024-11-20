const Product = require('../models/Product');
const Cart = require('../models/Cart');

class CartController {
    getCart(req, res) {
        res.render('cart');
    }
    
    async addToCart(req, res) {
        try {
                const user = req.user._id;
                const { product_id } = req.params;
                const quantity = parseInt(req.body.quantity);
                console.log("product_id: ", product_id);
                console.log("quantity: ", typeof quantity);

                let cart = await Cart.findOne({ user_id: user });
                if (!cart) {
                    cart = new Cart({
                        user_id: user,
                        items: [],
                        total: 0
                    });
                }

                const existingItem = cart.items.find(item => item.product_id.toString() === product_id);
                console.log("existingItem: ", typeof existingItem);
                if (existingItem) {
                    console.log("existingItem: ", typeof existingItem.quantity);
                    existingItem.quantity += quantity;
                    existingItem.price = existingItem.quantity * existingItem.price;
                }
                else {
                    const product = await Product.findById(product_id);

                    cart.items.push({
                        product_id: product_id,
                        quantity: quantity,
                        price: product.price
                    });
                }
                await cart.save();
                console.log(cart);
                req.flash('success', 'Added to cart');
                res.redirect('back')
        }
        catch (error) {
            console.log(error);
        }
    }
    
}

module.exports = new CartController();
