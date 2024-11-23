const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { errorLog } = require('../utils/customLog');

class CartController {
    getCart(req, res) {
        res.render('cart');
    }

    async addToCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;
            const quantity = parseInt(req.body.quantity);

            let cart = await Cart.findOne({ userId });
            if (!cart) {
                cart = new Cart({
                    userId,
                    items: [],
                    total: 0
                });
            }

            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.price = existingItem.quantity * existingItem.price;
            }
            else {
                const product = await Product.findById(productId);

                cart.items.push({
                    productId,
                    quantity: quantity,
                    price: product.price
                });
            }
            await cart.save();
            req.flash('success', 'Added to cart');
            res.redirect('back')
        }
        catch (error) {
            errorLog("CartController.js", 44, error.message);
        }
    }

}

module.exports = new CartController();
