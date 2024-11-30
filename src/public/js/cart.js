import { loadCartData } from './loadCartData.js';

document.addEventListener('DOMContentLoaded', async function() {
    try {   
        let cart = await loadCartData();

        if (cart && cart.items) {
            renderCartTable(cart);
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
            <td class="align-middle p-4"><input type="text" class="form-control text-center" value="${item.quantity}"></td>
            <td class="text-right font-weight-semibold align-middle p-4">$${(item.price * item.quantity).toFixed(2)}</td>
            <td class="text-center align-middle px-0">
                <a href="#" class="shop-tooltip close float-none text-danger remove-item" data-id="${item.productId}" title="Remove">×</a>
            </td>
        </tr>
        `;
    });
    $('#total-price').html(`<b>$${cart.total.toFixed(2)}</b>`);
    $('#cart-table').append(tableContent);
}