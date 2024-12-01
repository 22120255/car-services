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
function showModal(title, content, onDelete = () => {}) {
  const modal = $('#notify-modal');

  // Cập nhật tiêu đề và nội dung của modal
  modal.find('.modal-title').text(title);
  modal.find('.modal-body').text(content);

  // Gắn sự kiện cho nút Delete
  modal
    .find('.btn-danger')
    .off('click') // Gỡ các sự kiện cũ để tránh lặp callback
    .on('click', () => {
      onDelete(); // Gọi callback khi nhấn Delete
      modal.modal('hide'); // Đóng modal sau khi thực hiện
    });

  // Gắn sự kiện cho nút Close (chỉ cần đảm bảo modal đóng)
  modal
    .find('.btn-secondary')
    .off('click')
    .on('click', () => {
      modal.modal('hide'); // Đóng modal khi nhấn Close
    });

  modal.modal('show').css('background-color', 'rgba(0, 0, 0, 0.4)');
}

export { showToast, showModal };
