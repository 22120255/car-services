// JS will execute when load website

import { loadCartData, showModal } from './common.js';
import { updateAmountCart } from './store/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (!user) return;
  const cart = await loadCartData();
  if (!cart || cart.items?.length == 0) return;

  const totalItems = cart.items.reduce((acc, cur) => cur.quantity + acc, 0);
  updateAmountCart(totalItems);
});
document.addEventListener('DOMContentLoaded', () => {
  $('#btn-cart').on('click', () => {
    if (!user) {
      showModal({
        title: 'Notify',
        content: 'Please login to view cart',
        callback: () => {
          window.location.href = `/auth/login?returnTo=/cart`;
        },
      });
    } else {
      window.location.href = '/cart';
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
