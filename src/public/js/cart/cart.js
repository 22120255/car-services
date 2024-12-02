import { loadCartData } from '../common.js';

document.addEventListener('DOMContentLoaded', async function() {
    try {   
        let cart = await loadCartData();
        console.log('Cart:', cart);

        if (cart && cart.items) {
            renderCartTable(cart);
            $('#checkout').attr('href', '/payment/' + cart._id);
        } else {
            console.error('Cart is empty or invalid.');
            $('#cart-table').html('<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>');
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
});

function renderCartTable(cart) {
    let items = cart.items;
    let tableContent = '';

    if (items.length > 0) {
        tableContent += `<thead>
              <tr>
                <!-- Set columns width -->
                <th class="text-center py-3 px-4" style="min-width: 400px;">Product Name &amp; Details</th>
                <th class="text-right py-3 px-4" style="width: 100px;">Price</th>
                <th class="text-center py-3 px-4" style="width: 120px;">Quantity</th>
                <th class="text-right py-3 px-4" style="width: 100px;">Total</th>
                <th class="text-center align-middle py-3 px-0" style="width: 40px;"><a href="#" class="shop-tooltip float-none text-light" title="" data-original-title="Clear cart"><i class="ino ion-md-trash"></i></a></th>
              </tr>
            </thead>`;
    }
    $('#cart-table').empty(); // Clear the table content before appending new content
    items.forEach(item => {
        if (item.quantity > 1) {
            tableContent += `
            <tr>
            <td class="p-4">
                <div class="media align-items-center">
                
                    <div class="media-body">
                        <a href="#" class="d-block text-dark">${item.name}</a>
                    </div>
                </div>
            </td>
            <td class="text-right font-weight-semibold align-middle p-4">$${item.price.toFixed(2)}</td>
            <td class="align-middle p-4">
                <div class="d-flex align-items-center justify-content-center">
                    <button class="btn btn-outline-secondary btn-sm decrease-quantity" data-id="${item.productId}">-</button>
                    <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" data-id="${item.productId}" readonly>
                    <button class="btn btn-outline-secondary btn-sm increase-quantity" data-id="${item.productId}">+</button>
                </div>
            </td>
            <td class="text-right font-weight-semibold align-middle p-4">$${(item.price * item.quantity).toFixed(2)}</td>
            <td class="text-center align-middle px-0">
                <a href="#" class="shop-tooltip close float-none text-danger remove-item" data-id="${item.productId}" title="Remove">×</a>
            </td>
        </tr>
        `;
        }
        else if (item.quantity <= 1) {
            tableContent += `
            <tr>
            <td class="p-4">
                <div class="media align-items-center">
                
                    <div class="media-body">
                        <a href="#" class="d-block text-dark">${item.name}</a>
                    </div>
                </div>
            </td>
            <td class="text-right font-weight-semibold align-middle p-4">$${item.price.toFixed(2)}</td>
            <td class="align-middle p-4">
                <div class="d-flex align-items-center justify-content-center">
                    <button class="btn btn-outline-secondary btn-sm decrease-quantity btn-disable" data-id="${item.productId}">-</button>
                    <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" data-id="${item.productId}" readonly>
                    <button class="btn btn-outline-secondary btn-sm increase-quantity" data-id="${item.productId}">+</button>
                </div>
            </td>
            <td class="text-right font-weight-semibold align-middle p-4">$${(item.price * item.quantity).toFixed(2)}</td>
            <td class="text-center align-middle px-0">
                <a href="#" class="shop-tooltip close float-none text-danger remove-item" data-id="${item.productId}" title="Remove">×</a>
            </td>
        </tr>
        `;
        }
        
    });
    $('#total-price').html(`<b>$${cart.total.toFixed(2)}</b>`);
    $('#cart-table').append(tableContent);
    // Attach event listeners for buttons
    attachQuantityEventHandlers(cart);
}

// <input type="text" class="form-control text-center" value="${item.quantity}">

function attachQuantityEventHandlers(cart) {
    // Increase quantity button
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            updateQuantity(cart, productId, 1); // Increase quantity by 1
        });
    });

    // Decrease quantity button
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            updateQuantity(cart, productId, -1); // Decrease quantity by 1
        });
    });
}

async function updateQuantity(cart, productId, delta) {
    const item = cart.items.find(item => item.productId === productId);
    if (!item) return;

    const cartId = cart._id;
    const newQuantity = item.quantity + delta;

    if (newQuantity > 0) {
        item.quantity = newQuantity;
        item.total = item.quantity * item.price;

        // Update the total price in the cart
        cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // Re-render the cart table
        renderCartTable(cart);
        // console.log(cartId, productId, newQuantity);
        // Send an API call to update the backend
        try {
            const response = await fetch(`/api/cart/update/quantity/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartId,
                    newQuantity
                })
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Cart updated successfully', data.cart);

            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }

    }
}