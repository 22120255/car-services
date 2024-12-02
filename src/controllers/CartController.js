const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { errorLog } = require('../utils/customLog');

class CartController {
    cart(req, res) {
        res.render('cart/cart', {
            title: 'Giỏ hàng'
        });
    }

    async getCartData(req, res) {
        try {
            const userId = req.user._id;
            // console.log(userId);
            const cart = await Cart.findOne({ userId, isPaid: false });
            if (!cart) {
                errorLog("CartController.js", 44, error.message);
                return res.status(404).json({ message: 'Cart not found' });
            }
            // console.log(cart);
            return res.status(200).json(cart);
        } catch (error) {
            errorLog("CartController.js", 44, error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async addToCart(req, res) {
        try {
            const userId = req.user._id;
            const { productId } = req.params;
            const quantity = parseInt(req.body.quantity);

            let cart = await Cart.findOne({ userId, isPaid: false });
            if (!cart) {
                cart = new Cart({
                    userId,
                    items: [],
                    total: 0
                });
            }

            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            console.log(existingItem);
            if (existingItem) {
                existingItem.quantity += quantity;
                cart.total += existingItem.price * quantity
            }
            else {
                const product = await Product.findById(productId);

                cart.items.push({
                    productId,
                    quantity: quantity,
                    price: product.price
                });
                cart.total += product.price * quantity;
            }
            await cart.save();
            req.flash('success', 'Added to cart');
            res.redirect('back')
        }
        catch (error) {
            errorLog("CartController.js", 63, error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updatePaymentStatus(req, res) {
        try {
            const { cartID } = req.params;
            const { isPaid } = req.body;

            const cart = await Cart.findOne({ _id: cartID });

            if (!cart) {
                errorLog("CartController.js", 77, error.message);
                return res.status(404).json({ message: 'Cart not found' });
            }

            cart.isPaid = isPaid;
            await cart.save();
            return res.status(200).json({ message: 'Update cart payment status successful' });
        } 
        catch (error) {
            errorLog("CartController.js", 77, error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CartController();
