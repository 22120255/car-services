import { renderSelectOptions, showToast } from '../../common.js';
import { getFilterConfigProduct } from '../../config.js';

document.addEventListener('DOMContentLoaded', function () {
  const { years, brands, statuses, transmissions, styles, fuelTypes } = getFilterConfigProduct();

  renderSelectOptions($('#product-brand'), brands);
  renderSelectOptions($('#product-status'), statuses);
  renderSelectOptions($('#product-transmission'), transmissions);
  renderSelectOptions($('#product-style'), styles);
  renderSelectOptions($('#product-fuelType'), fuelTypes);
  renderSelectOptions($('#product-year'), years);
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
          if (jqXHR.status === 200 && response.secure_url) {
            input.val(response.secure_url);
          } else {
            showToast('Error', 'Failed to upload image');
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
