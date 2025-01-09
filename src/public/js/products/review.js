import { showToast, updateQueryParams } from '../common.js';
import { store, updateAmountCart } from '../store/index.js';

document.addEventListener('DOMContentLoaded', function () {
  // ----------------- Declaration -----------------
  const productId = product._id;
  let username = '';
  let createAt = '';
  let images = [];
  let reviews = [];
  let currentIndex = 0;
  let stats = {};

  let activeFilter = null;

  // ----------------- Event listeners -----------------

  $(document).ready(function () {
    // Show modal when clicking on thumbnail
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

    // Close modal when clicking close button or pressing ESC
    $('.close, .modal').click(function () {
      $('#imageModal').fadeOut();
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        $('#imageModal').fadeOut();
      }
    });

    // Switch to previous image
    $('.prev').click(function (e) {
      e.stopPropagation();
      if (currentIndex > 0) {
        currentIndex--;
        $('#modalImage').attr('src', images[currentIndex]);
      }
    });

    // Switch to next image
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
        url: `/api/products/reviews/filter/${productId}`,
        type: 'GET',
        success: function (response) {
          stats = response.stats;
          renderFilter(stats);
        },
        error: function (error) {
          console.error('Error:', error);
          $('.reviews-container').html('<p class="error">Unable to fetch reviews. Please check your connection.</p>');
        },
      });
      refresh();
    });

    // Filter reviews
    $('.reviews-container').on('click', '.filter-btn', function (e) {
      e.preventDefault();
      const filterType = $(this).data('value') || $(this).attr('id');
      if ($(this).hasClass('active')) {
        return;
      }

      $('.filter-btn').removeClass('active');
      $(this).addClass('active');
      activeFilter = filterType;

      const query = activeFilter ? `filter=${activeFilter}` : '';
      console.log(query);
      refresh(query);
    });
  });

  // ----------------- Functions -----------------

  async function loadData(apiQuery = '') {
    try {
      const reviewsList = $('.reviews-list');
      $.ajax({
        url: `/api/products/reviews/${productId}?${apiQuery}`,
        type: 'GET',
        statusCode: {
          200: function (response) {
            reviews = response.reviews;
            stats = response.stats;
            console.log(reviews);
            renderReviews(reviews);
          },
        },
        error: function (error) {
          console.error('Error:', error);
          $('.reviews-list').empty();
          $('.reviews-list').html('<p class="error">Unable to fetch reviews. Please check your connection.</p>');
        },
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      $('.reviews-list').empty();
      $('.reviews-list').html('<p class="error">An unexpected error occurred. Please try again later.</p>');
    }
  }

  function renderReviews(reviews) {
    const reviewList = $('.review-list');
    reviewList.empty();

    // Render the reviews
    reviews.forEach((review) => {
      const { avatar, userName, createdAt, rating, comment, images, likes } = review;
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
                <span>Helpful?</span>
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
    if (!reviews || reviews.length === 0) {
      reviewList.empty();
      reviewList.append(`<h5 class="no-reviews">No reviews found.</h5>`);
    }
  }

  async function renderFilter(stats) {
    const filters = $('.rating-filters');
    filters.empty();

    $('.rating-score .stars .rating-text').remove();
    filters.append(`
      <div class="filter-row">
        <button class="filter-btn active" id="all">All (${stats.totalReviews})</button>
        <button class="filter-btn" id="fivestars" data-value="5">5 Star (${stats.starCounts[5]})</button>
        <button class="filter-btn" id="fourstars" data-value="4">4 Star (${stats.starCounts[4]})</button>
        <button class="filter-btn" id="threestars" data-value="3">3 Star (${stats.starCounts[3]})</button>
        <button class="filter-btn" id="twostars" data-value="2">2 Star (${stats.starCounts[2]})</button>
        <button class="filter-btn" id="onestar" data-value="1">1 Star (${stats.starCounts[1]})</button>
      </div>
      <div class="filter-row">
        <button class="filter-btn" id="comments">With Comments (${stats.withComment})</button>
        <button class="filter-btn" id="images-videos">With Images / Videos (${stats.withMedia})</button>
      </div>
    `);
  }

  async function updatePagination() {}

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
  async function refresh(query = '') {
    await loadData(query);
    updatePagination();
  }
});
