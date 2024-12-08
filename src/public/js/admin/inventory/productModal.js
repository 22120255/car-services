import { getFilterConfigProduct } from '../../config.js';

document.addEventListener('DOMContentLoaded', function () {
  const { years, brands, statuses, transmissions, styles, fuelTypes } = getFilterConfigProduct();
  // TODO: here
  const $years = $('#product-year');
  const $brand = $('#product-brand');
  const $status = $('#product-status');
  const $transmission = $('#product-transmission');
  const $style = $('#product-style');
  const $fuelType = $('#product-fuelType');

  // Render options
  const renderSelectOptions = (element, options, defaultText) => {
    if (defaultText !== 'Items per page') {
      element.empty().append(`<option value="">${defaultText}</option>`);
    }
    options.forEach((option) => {
      if (defaultText === 'Select price') {
        element.append(`<option value="${option.priceMin}-${option.priceMax}">$${option.priceMin}-$${option.priceMax}</option>`);
      } else element.append(`<option value="${option.value}">${option.name} ${defaultText === 'Items per page' ? '/trang' : ''}</option>`);
    });
  };

  renderSelectOptions($brand, brands, 'Select brand');
  renderSelectOptions($status, statuses, 'Select status');
  renderSelectOptions($transmission, transmissions, 'Select transmission');
  renderSelectOptions($style, styles, 'Select style');
  renderSelectOptions($fuelType, fuelTypes, 'Select fuel type');
  renderSelectOptions($years, years, 'Select year');
});

document.addEventListener('DOMContentLoaded', function () {
  $(document).ready(function () {
    const fileInput = $('#image-file-input');

    // Gán sự kiện click cho các nút upload
    $('.upload-btn').on('click', function () {
      const targetInput = $(this).data('input'); // Lấy data-input của nút được nhấn
      fileInput.data('input', targetInput); // Gắn input tương ứng cho fileInput
      fileInput.click();
    });

    // Gán sự kiện cho file input chỉ một lần
    fileInput.on('change', function (event) {
      const file = event.target.files[0];
      if (!file) return;

      // Lấy targetInput từ data của fileInput
      const targetInput = fileInput.data('input');
      const input = $(`[name="${targetInput}"]`);
      input.val('Uploading...');

      const formData = new FormData();
      formData.append('image', file);

      $.ajax({
        url: '/api/user/product/store',
        type: 'PATCH',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response, textStatus, jqXHR) {
          if (jqXHR.status === 200) {
            if (response.secure_url) {
              input.val(response.secure_url); // Gán link ảnh vào ô input
            } else {
              alert('Failed to upload image');
              input.val('');
            }
          } else {
            alert('Unexpected response status: ' + jqXHR.status);
            input.val('');
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          if (jqXHR.status >= 400 && jqXHR.status < 500) {
            alert('Client error: ' + jqXHR.status + ' - ' + errorThrown);
          } else if (jqXHR.status >= 500) {
            alert('Server error: ' + jqXHR.status + ' - ' + errorThrown);
          } else {
            alert('Error uploading image');
          }
          input.val('');
        },
      });
    });
  });
});
