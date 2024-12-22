// js for all pages

function showToast(type, message) {
  const toastContainer = $('#toast-container');

  const toastElement = $(`<div class="toast toast-notify toast-${type.toLowerCase()}" role="alert" aria-live="assertive" aria-atomic="true"></div>`);
  const toastContent = `
        <div class="toast-header">
            <strong id="toast-title" class="me-auto">${type}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
  toastElement.html(toastContent);
  toastContainer.append(toastElement);

  setTimeout(() => {
    toastElement.addClass('show');
  }, 10);

  setTimeout(() => {
    toastElement.removeClass('show');
    setTimeout(() => {
      toastElement.remove();
    }, 500);
  }, 3000);
}
/* 
- callback will be done when modal hidden
- default callback will return true or undefined -> close modal
- if callback return false -> modal will not close
- onShowCallback will be done when modal shown
*/
function showModal({ title, content, btnSubmit = 'OK', callback = () => true, onShowCallback = () => {} }) {
  const modal = $('#notify-modal');

  modal.find('.modal-title').text(title);
  modal.find('.modal-body').html(content);
  modal.find('.btn-submit').text(btnSubmit);

  // Override method click of btn submit
  modal
    .find('.btn-submit')
    .off('click')
    .on('click', async () => {
      if ((await callback()) !== false) modal.modal('hide');
    });

  modal.off('shown.bs.modal').on('shown.bs.modal', () => {
    onShowCallback();
  });

  modal.modal('show').css('background-color', 'rgba(0, 0, 0, 0.4)');
}

async function loadCartData() {
  let cart = null;
  try {
    await $.ajax({
      url: '/api/cart/data',
      type: 'GET',
      statusCode: {
        200: function (data) {
          cart = data; // Lưu lại dữ liệu cart nếu có
        },
        404: function () {
          console.error('Cart data not found.');
        },
        500: function () {
          console.error('Server error occurred.');
        },
      },
    });
  } catch (error) {
    console.error('Error loading cart data:', error);
  }
  return cart;
}

function updateQueryParams(paramsToUpdate) {
  const params = new URLSearchParams(window.location.search);
  Object.entries(paramsToUpdate).forEach(([key, value]) => {
    if (value == null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
}

export { showToast, showModal, loadCartData, updateQueryParams };
