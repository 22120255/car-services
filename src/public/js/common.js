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
function showModal(title, content, callback = () => {}) {
  const modal = $('#notify-modal');
  // modal.off('hidden.bs.modal')

  modal.find('.modal-title').text(title);
  modal.find('.modal-body').text(content);

  modal.on('hidden.bs.modal', () => {
    callback();
    modal.off('hidden.bs.modal');
  });

  modal.modal('show').css('background-color', 'rgba(0, 0, 0, 0.4)');
}

// show product modal for create or update
function showProductModal(title, productID = null, product = null) {
  $('#product-modal .modal-title').text(title);

  // Nếu product tồn tại, tức là đang chỉnh sửa
  if (product) {
    $('#product-modal').data('is-editing', true); // Đang chỉnh sửa
    $('#product-modal').data('product-id', productID); // Lưu ID sản phẩm

    // Điền dữ liệu sản phẩm vào modal
    $('#product-brand').val(product.brand);
    $('#product-model').val(product.model);
    $('#product-year').val(product.year);
    $('#product-style').val(product.style);
    $('#product-status').val(product.status);
    $('#product-price').val(product.price);
    $('#product-mileage').val(product.mileage);
    $('#product-horsepower').val(product.horsepower);
    $('#product-transmission').val(product.transmission);
    $('#product-description').val(product.description);
    $('input[name="images.image1"]').val(product.images.image1);
    $('input[name="images.image2"]').val(product.images.image2);
    $('input[name="images.image3"]').val(product.images.image3);
    $('input[name="images.image4"]').val(product.images.image4);
    $('input[name="images.image5"]').val(product.images.image5);
  } else {
    // Nếu không có sản phẩm, tức là tạo mới
    $('#product-modal').data('is-editing', false); // Tạo mới
    $('#product-modal').data('product-id', null); // Xóa ID sản phẩm

    // Reset các trường input
    $('#product-form')[0].reset();
  }

  // Hiển thị modal
  $('#product-modal').modal('show');
}

// Hàm hiển thị modal chi tiết sản phẩm
function showModalDetail(product) {
  $('#modalTitle').text(`ProductID: ${product._id}`);
  $('#mainImage')
    .attr('src', product.images?.image1 || '/path/to/default-image.jpg')
    .attr('alt', `${product.brand || 'Unknown Brand'} ${product.model || ''}`);

  const $thumbnailContainer = $('#thumbnailImages');
  $thumbnailContainer.empty();

  if (product.images && typeof product.images === 'object') {
    Object.values(product.images).forEach((image) => {
      const $img = $('<img>')
        .attr('src', image)
        .attr('alt', 'thumbnail')
        .addClass('thumbnail')
        .on('click', function () {
          $('#mainImage').attr('src', image);
        });
      $thumbnailContainer.append($img);
    });
  } else {
    $thumbnailContainer.append('<p>No images available</p>');
  }

  $('#productTitle').text(`${product.brand || 'N/A'} ${product.model || ''}`);
  $('#productPrice').text(product.price ? `$${product.price}` : 'N/A');
  $('#productDescription').text(product.description || 'No description available.');

  const $specsContainer = $('#productSpecs');
  $specsContainer.empty();
  const specs = [
    { label: 'Model Year', value: product.year || 'N/A' },
    { label: 'Mileage', value: product.mileage ? `${product.mileage} mi` : 'N/A' },
    { label: 'Horsepower', value: product.horsepower ? `${product.horsepower}HP` : 'N/A' },
    { label: 'Transmission', value: product.transmission || 'N/A' },
    { label: 'Style', value: product.style || 'N/A' },
  ];
  specs.forEach((spec) => {
    const $specItem = $('<div>').addClass('spec-item').html(`
          <span class="spec-label">${spec.label}:</span>
          <span class="spec-value">${spec.value}</span>
        `);
    $specsContainer.append($specItem);
  });

  $('#productDetailModal').modal('show');
}

function handleProductAction(action, productId) {
  $.get(`/api/user/inventory/${productId}`)
    .done(function (data) {
      if (action === 'detail') {
        showModalDetail(data);
      } else if (action === 'edit') {
        showProductModal('Edit car', productId, data);
      }
    })
    .fail(function () {
      showToast('error', 'Cannot load data. Please try again!');
    });
}

export { showToast, showModal, showProductModal, showModalDetail, handleProductAction };
