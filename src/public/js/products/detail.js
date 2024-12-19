import { showToast, updateQueryParams } from '../common.js';
import { store, updateAmountCart } from '../store/index.js';

document.addEventListener('DOMContentLoaded', function () {
  const { averageRating = 0 } = product;

  let starsHtml = '';
  if (averageRating > 0) {
    const fullStars = Math.floor(averageRating); // Số sao đầy
    const hasHalfStar = averageRating % 1 >= 0.5; // Xác định có nửa sao không

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHtml += `<span class='star'>★</span>`; // Sao đầy
      } else if (i === fullStars + 1 && hasHalfStar) {
        starsHtml += `<span class='star-half'>★</span>`; // Nửa sao
      } else {
        starsHtml += `<span class='star-empty'>★</span>`; // Sao rỗng
      }
    }
    starsHtml += `<span class='rating-text'>${averageRating.toFixed(1)}</span>`;
  } else {
    starsHtml = `<span class='no-rating'>Chưa có đánh giá</span>`;
  }

  $('.stars').append(starsHtml);
});

document.addEventListener('DOMContentLoaded', function () {
  // Lắng nghe sự kiện click vào tab
  $('.add-to-cart').on('click', function (event) {
    event.preventDefault();
    const quantity = 1;
    $('#icon-loading').removeClass('d-none');

    $.ajax({
      url: '/api/cart/add/' + $(this).data('id'),
      type: 'POST',
      data: { quantity },
      success: function (response) {
        showToast('Success', 'Added to cart');
        const amountCart = store.getState().amountCart;
        updateAmountCart(amountCart + 1);
      },
      error: function (error) {
        if (error.status === 401) {
          showToast('Error', 'Please login to add to cart');
        } else {
          console.log(error);
          showToast('Error', 'Failed to add to cart');
        }
      },
      complete: function () {
        $('#icon-loading').addClass('d-none');
      },
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  let products = null;
  let limit = urlParams.get('limit') || 4;
  let offset = parseInt(urlParams.get('offset')) || 1;
  let totalPages = null;
  let totalItems = null;
  let fieldData = null;
  let activeTab = 'brand'; // Default to 'brand' tab

  let brand = product.brand;
  let year = product.year;
  let price = product.price;
  const id = product._id;
  fieldData = brand;

  function syncFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    limit = parseInt(urlParams.get('limit')) || 8;
    offset = parseInt(urlParams.get('offset')) || 1;
    $('#limit').val(limit);
  }

  window.addEventListener('popstate', async function () {
    syncFiltersFromURL();
    await refresh();
  });

  $('#related-by-brand-tab').on('click', async function () {
    if (activeTab === 'brand' && fieldData === brand) return;

    activeTab = 'brand';
    offset = 1;
    fieldData = brand;

    await refresh();
  });

  $('#related-by-year-tab').on('click', async function () {
    if (activeTab === 'year' && fieldData === year) return;

    activeTab = 'year';
    offset = 1;
    fieldData = year;

    await refresh();
  });

  $('#related-by-price-tab').on('click', async function () {
    if (activeTab === 'price' && fieldData === price) return;

    activeTab = 'price';
    offset = 1;
    fieldData = price;

    await refresh();
  });

  async function loadData() {
    const apiQuery = new URLSearchParams({ limit, offset }).toString();
    const apiUrl = `/api/products/related/${id}/?${activeTab}=${fieldData}&${apiQuery}`;

    try {
      const response = await $.ajax({ url: apiUrl, type: 'GET' });

      products = response.products || [];
      totalItems = response.total || 0;
      totalPages = Math.ceil(totalItems / limit);

      renderProducts();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  function renderProducts() {
    const productListId = `${activeTab}-related-product-list`;
    const productList = $(`#${productListId}`);

    productList.empty();

    if (!products || products.length === 0) {
      productList.append(`
          <div class='col-lg-12'>
              <div class='find-nothing text-center'>
                  <h2 style="font-size: large; color: #978e8e">There are no related products!</h2>
              </div>
          </div>
        `);
      return;
    }

    products.forEach((product) => {
      const { _id, images, status, brand, price, year, averageRating = 0 } = product;
      const imageSrc = images[0] || '/default-image.jpg'; // Sử dụng ảnh mặc định nếu không có ảnh

      let starsHtml = '';
      if (averageRating > 0) {
        const fullStars = Math.floor(averageRating); // Số sao đầy
        const hasHalfStar = averageRating % 1 >= 0.5; // Xác định có nửa sao không

        for (let i = 1; i <= 5; i++) {
          if (i <= fullStars) {
            starsHtml += `<span class='star'>★</span>`; // Sao đầy
          } else if (i === fullStars + 1 && hasHalfStar) {
            starsHtml += `<span class='star-half'>★</span>`; // Nửa sao
          } else {
            starsHtml += `<span class='star-empty'>★</span>`; // Sao rỗng
          }
        }
        starsHtml += `<span class='rating-text'>${averageRating.toFixed(1)}</span>`;
      } else {
        starsHtml = `<span class='no-rating'>Chưa có đánh giá</span>`;
      }

      productList.append(`
          <div class='col-lg-3 col-md-6 col-sm-12'>
              <div class='card-product__container'>
                  <div class='card-product__header'>
                      <a href='/products/${_id}'>
                          <img src='${imageSrc}' alt='car' />
                          ${status === 'new' ? `<div class='new-arrival-badge'>New Arrival</div>` : ''}
                      </a>
                  </div>
                  <div class='card-product__body'>
                      <div class='product-header'>
                          <a href='/products/${_id}' class='card-product__brand'>${brand || 'Unknown'}</a>
                          <h3 class='card-product__price'>$${price || '0.00'}</h3>
                      </div>
                      <div class='star-rating'>
                       ${starsHtml}
                      </div>
                  </div>
                  <div class='card-product__footer'>
                      <p>
                          <span class='car-spec-label'>Model: </span>
                          <span class='car-spec-value'>${year || 'N/A'}</span>
                      </p>
                      <a href='/products/${_id}' class='view-details-btn'>View Details</a>
                  </div>
              </div>
          </div>
        `);
    });
  }

  function updatePagination() {
    const $pagination = $('#related-products-pagination');
    $pagination.empty();

    const visibleRange = 1;
    const firstPage = 1;
    const lastPage = totalPages;

    $pagination.append(`
        <li class="page-item ${offset === firstPage ? 'disabled' : ''}">
            <a class="page-link" href="#" id="prevPage">&lsaquo;</a>
        </li>
      `);

    for (let i = firstPage; i <= lastPage; i++) {
      if (i === firstPage || i === lastPage || (i >= offset - visibleRange && i <= offset + visibleRange)) {
        $pagination.append(`
            <li class="page-item ${offset === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
          `);
      } else if ((i === offset - visibleRange - 1 && i > firstPage) || (i === offset + visibleRange + 1 && i < lastPage)) {
        $pagination.append(`
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>
          `);
      }
    }

    $pagination.append(`
        <li class="page-item ${offset === lastPage ? 'disabled' : ''}">
            <a class="page-link" href="#" id="nextPage">&rsaquo;</a>
        </li>
      `);
  }

  $('#related-products-pagination').on('click', 'a.page-link', async function (e) {
    e.preventDefault();
    const $this = $(this);

    if ($this.parent().hasClass('disabled')) return;

    switch ($this.attr('id')) {
      case 'prevPage':
        if (offset > 1) offset--;
        break;
      case 'nextPage':
        if (offset < totalPages) offset++;
        break;
      default:
        offset = parseInt($this.data('page'));
    }

    updateQueryParams({ offset });
    await refresh();
  });

  $('#limit').change(async function () {
    limit = $(this).val();
    totalPages = Math.ceil(totalItems / limit);
    offset = 1;
    updateQueryParams({ limit, offset });
    await refresh();
  });

  async function refresh() {
    await loadData(); // Tải dữ liệu mới
    updatePagination(); // Cập nhật phân trang
  }

  refresh();
});
