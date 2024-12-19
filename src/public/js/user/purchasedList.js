import { showToast, showModal } from '../common.js';

document.addEventListener('DOMContentLoaded', function () {
  $(document).ready(function () {
    // Lắng nghe sự kiện click vào nút "Đánh giá sản phẩm"
    $('.view-details').on('click', function (e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
      $('#addReviewModal').modal('show'); // Hiển thị modal
    });
  });
});
