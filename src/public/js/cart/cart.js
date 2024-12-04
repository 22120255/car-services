import { loadCartData } from '../common.js';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        let cart = await loadCartData();

        if (cart && cart.items) {
            renderCartTable(cart);
            $('#checkout').attr('href', '/payment/' + cart._id);
        } else {
            console.error('Cart is empty or invalid.');
            $('#cart-table').html('<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>');
            $('#total-price').html('');
        }   
    } catch (error) {
        console.error('Error:', error);
    }
});

function renderCartTable(cart) {
    let items = cart.items;
    let tableContent = '';
    $('#cart-table').empty();
    if (items.length > 0) {
        tableContent += `<thead>
              <tr>
                <th class="text-center py-3 px-4" style="min-width: 240px;">Product Name &amp; Details</th>
                <th class="text-right py-3 px-4" style="width: 100px;">Price</th>
                <th class="text-center py-3 px-4" style="width: 120px;">Quantity</th>
                <th class="text-right py-3 px-4" style="width: 100px;">Total</th>
                <th class="text-center align-middle py-3 px-0" style="width: 80px;">Delete</th>
              </tr>
            </thead>`;
        items.forEach((item) => {
            tableContent += `
            <tr>
                <td class="p-4">
                    <div class="media align-items-center">
                        <div class="media-body">
                            <a href="/products/${item.productId}" class="d-block text-dark">${item.name}</a>
                        </div>
                    </div>
                </td>
                <td class="text-right font-weight-semibold align-middle p-4">$${item.price.toFixed(2)}</td>
                <td class="align-middle p-4">
                    <div class="d-flex align-items-center justify-content-center">
                        <button class="btn btn-handler btn-outline-secondary btn-sm decrease-quantity ${item.quantity <= 1 ? 'disabled' : ''}" 
                            data-id="${item.productId}">-</button>
                        <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" 
                            data-id="${item.productId}" readonly>
                        <button class="btn btn-handler btn-outline-secondary btn-sm increase-quantity" 
                            data-id="${item.productId}">+</button>
                    </div>
                </td>
                <td class="text-right font-weight-semibold align-middle p-4">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="text-center align-middle justify-content-center px-0">
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-handler btn-danger remove-item" data-id="${item.productId}">×</button>   
                    </div>
                </td>
            </tr>`
            ;
        });
        $('#total-price').html(`<b>$${cart.total.toFixed(2)}</b>`);
    }
    else if (items.length === 0) {
        tableContent += `<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>`;
        $('#total-price').html('');
    }

    $('#cart-table').append(tableContent);

    // Attach event listeners for buttons
    attachQuantityEventHandlers(cart);
    removeItemHandler(cart);
}

function attachQuantityEventHandlers(cart) {
    document.querySelectorAll('.increase-quantity').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            await updateQuantity(cart, productId, 1);
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            await updateQuantity(cart, productId, -1);
        });
    });
}

function removeItemHandler(cart) {
    // Attach remove item listener dynamically
    document.querySelectorAll('.remove-item').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            await removeItem(cart, productId);
        });    
    });
}

async function updateQuantity(cart, productId, delta) {
    const item = cart.items.find((item) => item.productId === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity > 0) {
        // Update local cart data
        item.quantity = newQuantity;
        cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // Gửi cập nhật lên backend
        try {
            const response = await fetch(`/api/cart/update/quantity/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartId: cart._id,
                    newQuantity,
                }),
            });

            const data = await response.json();
            if (response.ok && data.cart) {
                console.log('Cart updated successfully', data.cart);
                renderCartTable(data.cart);
            } else {
                console.error('Error:', data.message || 'Unexpected response');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }
}    


async function removeItem(cart, productId) {
    try {
        const cartId = cart._id;

        // Gửi yêu cầu xóa sản phẩm
        const response = await fetch(`/api/cart/remove/${productId}?cartId=${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok && data.cart) {
            console.log('Item removed successfully', data.cart);
            renderCartTable(data.cart);
        } else {
            console.error('Error:', data.message || 'Unexpected response');
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
}