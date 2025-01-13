import { showToast, showModal } from '../common.js';

document.addEventListener('DOMContentLoaded', function () {
  const stars = document.querySelectorAll('#starRating i');
  let starRatingValue = 0;
  let productId = null;
  let orderId = null;
  $('.btn-rate-product').on('click', function (e) {
    e.preventDefault();
    productId = $(this).data('id');
    orderId = $(this).data('order-id');
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach((s) => s.classList.remove('selected', 'hover'));
    starRatingValue = 0;
    $('#ratingError').text('');
    $('#comment').val('');
    $('.image-preview-wrapper').remove();
    $('#addReviewModal').modal('show');
  });

  stars.forEach((star) => {
    // Xử lý sự kiện hover
    star.addEventListener('mouseover', () => {
      stars.forEach((s) => s.classList.remove('hover'));
      star.classList.add('hover');
      let prevStar = star.previousElementSibling;
      while (prevStar) {
        prevStar.classList.add('hover');
        prevStar = prevStar.previousElementSibling;
      }
    });

    // Xử lý sự kiện click
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-value');

      // Xóa trạng thái selected cũ
      stars.forEach((s) => s.classList.remove('selected'));

      // Thêm trạng thái selected mới
      star.classList.add('selected');
      let prevStar = star.previousElementSibling;
      while (prevStar) {
        prevStar.classList.add('selected');
        prevStar = prevStar.previousElementSibling;
      }
      starRatingValue = rating;
    });
  });

  // Xóa trạng thái hover khi rời khỏi vùng chứa sao
  const starRating = document.getElementById('starRating');
  starRating.addEventListener('mouseleave', () => {
    stars.forEach((s) => s.classList.remove('hover'));
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
        formData.append('review', file);

        const loadingSpinner = $(`
          <div class="loading-spinner" style="margin-top: auto;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Uploading...</span>
            </div>
          </div>
        `);

        addImageBtn.before(loadingSpinner);

        $.ajax({
          url: '/api/user/review/store',
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

  // Lắng nghe sự kiện click vào nút "Gửi đánh giá"
  $('#submitReviewBtn').on('click', function () {
    const rating = starRatingValue;
    if (rating === 0) {
      $('#ratingError').text('Please select a rating.');
      return;
    }
    const comment = $('#comment').val();
    const images = [];
    $('#imageContainer .image-preview-wrapper img').each(function () {
      images.push($(this).attr('src'));
    });

    const data = { productId, rating, comment, images, orderId };
    $.ajax({
      url: '/api/orders/review',
      type: 'POST',
      data: data,
      success: function (response) {
        showToast('success', 'Gửi đánh giá thành công.');

        $('#addReviewModal').modal('hide');
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      error: function (xhr, status, error) {
        showToast('error', 'You have already reviewed this product.');
      },
    });
  });
});
