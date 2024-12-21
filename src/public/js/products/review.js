import { showToast, updateQueryParams } from '../common.js';
import { store, updateAmountCart } from '../store/index.js';

document.addEventListener('DOMContentLoaded', function () {
  // ----------------- Declaration -----------------
  const productId = product._id;
  let username = '';
  let createAt = '';
  let rating = 0;
  let comment = '';
  let images = [];
  let reviews = [];
  let currentIndex = 0;

  // ----------------- Event listeners -----------------

  // Hiển thị modal khi click vào thumbnail
  $(document).on('click', '.image-thumbnail img', function () {
    const reviewImages = $(this).closest('.review-images').find('img');
    images = reviewImages
      .map(function () {
        return $(this).attr('src');
      })
      .get();

    currentIndex = images.indexOf($(this).attr('src'));
    $('#modalImage').attr('src', images[currentIndex]);
    $('#imageModal').fadeIn();
  });

  // Đóng modal khi click nút đóng hoặc nhấn ESC
  $('.close, .modal').click(function () {
    $('#imageModal').fadeOut();
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('#imageModal').fadeOut();
    }
  });

  // Chuyển sang ảnh trước
  $('.prev').click(function (e) {
    e.stopPropagation();
    if (currentIndex > 0) {
      currentIndex--;
      $('#modalImage').attr('src', images[currentIndex]);
    }
  });

  // Chuyển sang ảnh tiếp theo
  $('.next').click(function (e) {
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      currentIndex++;
      $('#modalImage').attr('src', images[currentIndex]);
    }
  });

  $('#reviews-tab').on('click', function (e) {
    e.preventDefault();
    $.ajax({
      url: `/api/products/reviews/${productId}`,
      type: 'GET',
      statusCode: {
        200: function (response) {
          reviews = response.reviews;
          if (!reviews || reviews.length === 0) {
            $('.reviews-container').html('<p class="no-reviews">No reviews yet</p>');
          } else {
            renderReviews(reviews);
          }
        },
        404: function () {
          $('.reviews-container').html('<p class="no-reviews">No reviews for this product.</p>');
        },
        500: function () {
          $('.reviews-container').html('<p class="error">An error occurred. Please try again later.</p>');
        },
      },
      error: function (error) {
        console.error('Error:', error);
        $('.reviews-container').html('<p class="error">Unable to fetch reviews. Please check your connection.</p>');
      },
    });
  });

  // ----------------- Functions -----------------
  function renderReviews(reviews) {
    const reviewList = $('.review-list');
    reviewList.empty();
    reviews.forEach((review) => {
      const { avatar, userName, createdAt, rating, comment, images, likes } = review; // Destructure the review
      let starsHtml = '';

      if (rating > 0) {
        const fullStars = Math.floor(rating);
        for (let i = 1; i <= 5; i++) {
          if (i <= fullStars) {
            starsHtml += `<span class="star">★</span>`; // Full star
          } else {
            starsHtml += `<span class="star-empty">★</span>`; // Empty star
          }
        }
        starsHtml += `<span class="rating-text">${rating.toFixed(1)}</span>`;
      } else {
        starsHtml = `<span class="no-rating">No reviews yet.</span>`;
      }

      let avatarHtml = '';
      if (avatar) {
        avatarHtml = `<img src="${avatar}" alt="${userName}" class="user-avatar">`;
      } else {
        avatarHtml = `<div class="default-avatar"><i class="fas fa-user"></i></div>`;
      }

      let contentHtml = '';
      if (comment) {
        contentHtml = ` <div class="review-content">
            <p class="review-text">${comment}</p>
          </div>`;
      }

      reviewList.append(`
        <div class="review-item">
          <div class="review-body">
            <div class="user-info">
              ${avatarHtml}
              <div class="user-details">
                <span class="username">${userName}</span>
                <div class="rating-date">
                  <div class="stars">
                    ${starsHtml}
                  </div>
                  <span class="review-date">${formatDate(createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
    
          ${contentHtml}
          ${
            images.length > 0
              ? `
            <div class="review-images">
              ${images.map((image) => `<div class="image-thumbnail"><img src="${image}" alt="Review image" loading="lazy"></div>`).join('')}
            </div>
          `
              : ''
          }
    
          <div class="review-footer">
            ${
              likes === 0
                ? `
              <button class="like-button">
                <i class="far fa-thumbs-up"></i>
                <span>Hữu ích?</span>
              </button>
            `
                : `
              <button class="like-button liked">
                <i class="fas fa-thumbs-up"></i>
                <span>${likes.length}</span>
              </button>
            `
            }
          </div>
        </div>
      `);
    });
  }

  // Helper function to format the date
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);

    // Get hours and minutes manually for better formatting
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${formattedDate} ${hours}:${minutes}`;
  }
});
