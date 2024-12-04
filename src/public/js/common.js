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
// callback will be done when modal hidden
function showModal(title, content, btnSubmit = 'OK', callback = () => {}) {
  const modal = $('#notify-modal');

  // Cập nhật tiêu đề và nội dung của modal
  modal.find('.modal-title').text(title);
  modal.find('.modal-body').text(content);
  modal.find('.btn-submit').text(btnSubmit);

  // Override method click of btn submit
  modal
    .find('.btn-submit')
    .off('click') // Gỡ các sự kiện cũ để tránh lặp callback
    .on('click', () => {
      callback();
      modal.modal('hide');
    });

  modal.modal('show').css('background-color', 'rgba(0, 0, 0, 0.4)');
}

async function loadCartData() {
  let cart = null;
  await $.ajax({
      url: '/api/cart/data',
      type: 'GET',
      statusCode: {
          200: function (data) {
              cart = data;
              console.log('Cart loaded:', cart);
          },
          404: function () {
              console.log('Cart data not found.');
          },
          500: function () {
              console.log('Server error occurred.');
          }
      }
  });
  return cart;
}

export { showToast, showModal,  loadCartData };