document.addEventListener('DOMContentLoaded', function () {
  const stars = document.querySelectorAll('#starRating i');

  stars.forEach((star) => {
    // Xử lý sự kiện hover
    star.addEventListener('mouseover', () => {
      stars.forEach((s) => s.classList.remove('hover'));
      star.classList.add('hover');
      star.previousElementSibling?.classList.add('hover');
    });

    // Xử lý sự kiện click
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-value');

      // Xóa trạng thái selected cũ
      stars.forEach((s) => s.classList.remove('selected'));

      // Thêm trạng thái selected mới
      stars.forEach((s) => {
        if (s.getAttribute('data-value') <= rating) {
          s.classList.add('selected');
        }
      });

      console.log(`Bạn đã chọn ${rating} sao!`);
    });
  });

  $(document).ready(function () {
    const addImageBtn = $('#addImageBtn');
    const imageInput = $('#imageInput');
    const imageContainer = $('#imageContainer');
    const imagePaths = $('#imagePaths');
    let imageUrls = [];

    addImageBtn.on('click', function () {
      imageInput.click();
    });

    imageInput.on('change', function (event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        imageUrls.push(imageUrl);

        const img = $('<img>').attr('src', imageUrl).addClass('image-preview');

        const removeBtn = $('<button>')
          .html('&times;')
          .addClass('btn btn-danger btn-sm position-absolute top-0 end-0')
          .on('click', function () {
            const index = imageUrls.indexOf(imageUrl);
            if (index > -1) {
              imageUrls.splice(index, 1);
            }
            wrapper.remove();
            updateImagePaths();
          });

        const wrapper = $('<div>').addClass('position-relative').append(img).append(removeBtn);

        addImageBtn.before(wrapper);
        updateImagePaths();
      }
    });

    function updateImagePaths() {
      imagePaths.val(JSON.stringify(imageUrls));
    }
  });
});
