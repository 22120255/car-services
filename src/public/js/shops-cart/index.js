import { loadCartData, showModal } from '../common.js';
import { store, updateAmountCart } from '../store/index.js';

document.addEventListener('DOMContentLoaded', async function () {
  let cart = await loadCartData();
  console.log('Cart:', cart);
  if (cart && cart.items.length > 0) {
    renderCartTable(cart);

    $('#checkout').on('click', function (event) {
      const modalContent = `
          <form id="shipping-form">
            <div class="form-group mb-3">
              <label for="fullName">Họ và tên</label>
              <input type="text" class="form-control" id="fullName" required>
            </div>
            <div class="form-group mb-3">
              <label for="phone">Số điện thoại</label>
              <input type="tel" class="form-control" id="phone" required>
            </div>
            <div class="form-group mb-3">
              <label for="address">Địa chỉ giao hàng</label>
              <textarea class="form-control" id="address" rows="3" required></textarea>
            </div>
            <div class="form-group mb-3">
              <label for="note">Ghi chú (không bắt buộc)</label>
              <textarea class="form-control" id="note" rows="2"></textarea>
            </div>
          </form>
        `;

      showModal({
        title: 'Thông tin giao hàng',
        content: modalContent,
        btnSubmit: 'Tiến hành thanh toán',
        callback: () => {
          const form = document.getElementById('shipping-form');
          if (!form.checkValidity()) {
            form.reportValidity();
            return false;
          }

          const submitBtn = $('#notify-modal .btn-submit');
          submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang xử lý...');

          $.ajax({
            url: '/api/orders/create',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify({
              shippingDetails: {
                fullName: $('#fullName').val().trim(),
                phone: $('#phone').val().trim(),
                address: $('#address').val().trim(),
                note: $('#note').val().trim(),
              },
            }),
            success: function (response) {
              console.log('Order Response:', response);
              if (response.order) {
                // Chuyển hướng đến URL thanh toán
                const paymentUrl = response.order
                  ? `/payment/create_payment_url?amount=${response.order.totalAmount}&orderId=${response.order._id}`
                  : response.paymentUrl;
                window.location.href = paymentUrl;
              } else {
                showModal({
                  title: 'Lỗi',
                  content: 'Không thể tạo đơn hàng. Vui lòng thử lại.',
                });
              }
            },
            error: function (xhr, status, error) {
              console.error('Order Error:', error);
              showModal({
                title: 'Lỗi',
                content: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
              });
            },
            complete: function () {
              console.log('flag2');
              submitBtn.prop('disabled', false).text('Tiến hành thanh toán');
            },
          });
          return true;
        },
        onShowCallback: () => {
          $('#fullName').focus();
        },
      });
    });
  } else {
    console.error('Cart is empty or invalid.');
    $('#cart-table').html('<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>');
    $('#total-price').html('');
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
                <td class="product-cell">
                    <div class="product-container">
                        <a href="/products/${item.productId._id}" class="product-link">
                            <div class="product-content">
                                <div class="product-image">
                                    <img src="${item.productId.images[0]}" alt="${item.productId.brand} ${item.productId.model}" />
                                </div>
                                <div class="product-details">
                                    <h3 class="product-title">${item.productId.brand} ${item.productId.model}</h3>
                                    <div class="product-specs">
                                        <span class="spec-item">
                                            <i class="fa-regular fa-calendar"></i>
                                            ${item.productId.year}
                                        </span>
                                        •
                                        <span class="spec-item">
                                            <i class="fa-solid fa-gauge"></i>
                                            ${item.productId.mileage.toLocaleString()} km
                                        </span>
                                        •
                                        <span class="spec-item">
                                            <i class="fa-solid fa-gear"></i>
                                            ${item.productId.transmission}
                                        </span>
                                    </div>
                                    <div class="product-meta">
                                        <span class="car-style">${item.productId.style}</span>
                                        <span class="fuel-type">
                                            <i class="bi bi-fuel-pump"></i>
                                            ${item.productId.fuelType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </td>
                <td class="text-right font-weight-semibold align-middle p-4">$${item.price.toFixed(2)}</td>
                <td class="align-middle p-4">
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <button class="btn btn-handler btn-outline-secondary btn-sm decrease-quantity ${item.quantity <= 1 ? 'disabled' : ''}" 
                            data-id="${item.productId._id}">-</button>
                        <input type="text" class="form-control text-center quantity-input flex-1" value="${item.quantity}" 
                            data-id="${item.productId._id}" readonly>
                        <button class="btn btn-handler btn-outline-secondary btn-sm increase-quantity" 
                            data-id="${item.productId._id}">+</button>
                    </div>
                </td>
                <td class="text-right font-weight-semibold align-middle p-4">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="text-center align-middle justify-content-center px-0">
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-handler btn-danger remove-item" data-id="${item.productId._id}">×</button>   
                    </div>
                </td>
            </tr>`;
    });
    $('#total-price').html(`<b>$${cart.total.toFixed(2)}</b>`);
  } else if (items.length === 0) {
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
      updateAmountCart(store.getState().amountCart + 1);
    });
  });

  document.querySelectorAll('.decrease-quantity').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-id');
      await updateQuantity(cart, productId, -1);
      updateAmountCart(store.getState().amountCart - 1);
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
  const item = cart.items.find((item) => item.productId._id === productId);
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
      renderCartTable(data.cart);
      updateAmountCart(data.cart.items.reduce((acc, cur) => cur.quantity + acc, 0));
    } else {
      console.error('Error:', data.message || 'Unexpected response');
    }
  } catch (error) {
    console.error('Error removing item:', error);
  }
}
// Handle click checkout
