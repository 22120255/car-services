// JS will execute when load website 

import { loadCartData } from './common.js'
import { updateAmountCart } from './store/index.js'

document.addEventListener('DOMContentLoaded', async () => {
    const cart = await loadCartData();
    if (!cart || cart.items?.length == 0) return;

    const totalItems = cart.items.reduce((acc, cur) => cur.quantity + acc, 0);
    updateAmountCart(totalItems)
});