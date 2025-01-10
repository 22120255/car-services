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

  $(document).ready(function () {
    const imageInput = $('#imageInput');
    const imageContainer = $('#imageContainer');
    const addImageBtn = $('#addImageBtn');

    addImageBtn.on('click', function () {
      imageInput.click();
    });

    imageInput.on('change', function () {
      const files = this.files;
      if (files && files.length > 0) {
        const file = files[0];
        const formData = new FormData();
        formData.append('image', file);

        const loadingSpinner = $(`
          <div class="loading-spinner" style="margin-top: auto;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Uploading...</span>
            </div>
          </div>
        `);

        addImageBtn.before(loadingSpinner);

        $.ajax({
          url: '/api/user/product/store',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
            console.log('Upload thành công:', response);

            loadingSpinner.remove();

            const imageWrapper = $(`
              <div class="image-preview-wrapper" style="margin-top: auto;">
                <img src="${response.secure_url}" alt="Preview" class="image-preview">
                <button class="remove-image-btn">&times;</button>
              </div>
            `);

            addImageBtn.before(imageWrapper);

            imageWrapper.find('.remove-image-btn').on('click', function () {
              imageWrapper.remove();
            });
          },
          error: function (xhr, status, error) {
            console.error('Upload thất bại:', error);
            alert('Có lỗi xảy ra khi upload file.');

            loadingSpinner.remove();
          },
        });

        imageInput.val('');
      }
    });
  });
});
