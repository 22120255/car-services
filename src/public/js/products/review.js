import { showToast, updateQueryParams } from '../common.js';
import { store, updateAmountCart } from '../store/index.js';

document.addEventListener('DOMContentLoaded', function () {
  const productId = product._id;
  let username = '';
  let createAt = '';
  let rating = 0;
  let comment = '';
  let images = [];
  let reviews = [];

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
  function renderReviews(reviews) {
    const reviewsContainer = document.querySelector('.reviews-container');
    reviewsContainer.innerHTML = ''; // Clear previous content

    if (!reviews || reviews.length === 0) {
      reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet</p>';
      return;
    }

    reviews.forEach((review, reviewIndex) => {
      // Tạo thẻ chứa từng review
      const reviewItem = document.createElement('div');
      reviewItem.classList.add('review-item', 'mb-4', 'pb-3', 'border-bottom');

      // Rating và ngày tạo
      const reviewHeader = document.createElement('div');
      reviewHeader.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');
      const ratingDiv = document.createElement('div');
      ratingDiv.classList.add('rating');
      const createdAt = document.createElement('small');
      createdAt.classList.add('text-muted');
      createdAt.textContent = formatDate(review.createdAt);

      reviewHeader.appendChild(ratingDiv);
      reviewHeader.appendChild(createdAt);

      // Comment
      const comment = document.createElement('p');
      comment.classList.add('mb-2');
      comment.textContent = review.comment;

      // Review images
      if (review.images && review.images.length > 0) {
        const reviewImages = document.createElement('div');
        reviewImages.classList.add('review-images', 'row', 'g-2', 'mb-2');

        review.images.forEach((image, imageIndex) => {
          // Thumbnail
          const imageCol = document.createElement('div');
          imageCol.classList.add('col-3', 'col-md-2');
          const thumbnail = document.createElement('img');
          thumbnail.src = image;
          thumbnail.alt = 'Review image';
          thumbnail.classList.add('img-thumbnail', 'review-thumbnail');
          thumbnail.dataset.bsToggle = 'modal';
          thumbnail.dataset.bsTarget = `#imageModal${reviewIndex}-${imageIndex}`;
          imageCol.appendChild(thumbnail);
          reviewImages.appendChild(imageCol);

          // Modal
          const modal = document.createElement('div');
          modal.classList.add('modal', 'fade');
          modal.id = `imageModal${reviewIndex}-${imageIndex}`;
          modal.tabIndex = -1;
          modal.setAttribute('aria-hidden', 'true');

          const modalDialog = document.createElement('div');
          modalDialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-lg');

          const modalContent = document.createElement('div');
          modalContent.classList.add('modal-content');

          const modalBody = document.createElement('div');
          modalBody.classList.add('modal-body', 'p-0');

          const modalImage = document.createElement('img');
          modalImage.src = image;
          modalImage.alt = 'Review image full size';
          modalImage.classList.add('img-fluid', 'w-100');

          modalBody.appendChild(modalImage);
          modalContent.appendChild(modalBody);
          modalDialog.appendChild(modalContent);
          modal.appendChild(modalDialog);

          // Append modal to the container
          reviewsContainer.appendChild(modal);
        });

        reviewItem.appendChild(reviewImages);
      }

      // Append header and comment to review item
      reviewItem.appendChild(reviewHeader);
      reviewItem.appendChild(comment);

      // Append review item to container
      reviewsContainer.appendChild(reviewItem);
    });
  }

  // Helper function to format the date
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
});
