// function changeTab(event, tabId) {
//     event.preventDefault();

import { showToast } from '../common.js';

//     // Xóa lớp 'active' khỏi tất cả các tab và nội dung tab
//     $('.nav-link').removeClass('active').attr('aria-selected', 'false');
//     $('.tab-pane').removeClass('show active');
//     $(`#${tabId}-tab`).addClass('active').attr('aria-selected', 'true');
//     $(`#${tabId}`).addClass('show active');
// }
document.addEventListener('DOMContentLoaded', function () {
  // Lắng nghe sự kiện click vào tab
  $('.add-to-cart').on('click', function (event) {
    event.preventDefault();
    const quantity = 1;
    console.log($(this));
    $.ajax({
      url: '/api/cart/add/' + $(this).data('id'),
      type: 'POST',
      data: { quantity },
      success: function (response) {
        console.log(response);
        showToast('success', 'Product added to cart successfully');
      },
      error: function (error) {
        console.log(error);
        showToast('error', 'Error adding product to cart');
      },
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);

  let products = null;
  let limit = urlParams.get('limit') || 4;
  let offset = parseInt(urlParams.get('offset')) || 1;
  let totalPages = null;
  let totalItems = null;
  let fieldData = null;

  let brand = $('#product-brand').val();
  let year = $('#product-year').val();
  let price = $('#product-price').val();

  fieldData = brand;

  function syncFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    limit = parseInt(urlParams.get('limit')) || 8;
    offset = parseInt(urlParams.get('offset')) || 1;
    // Đồng bộ với giao diện
    $('#limit').val(limit);
  }

  // Hàm xử lý khi quay lại bằng nút "quay lại" trên trình duyệt
  window.addEventListener('popstate', async function () {
    syncFiltersFromURL();
    await refresh();
  });

  // Xử lí sự kiện click related-by-brand-tab
  $('#related-by-brand-tab').on('click', function () {
    offset = 1;
    fieldData = brand;
    updateQueryParams({ offset: offset });
    loadData('brand', fieldData);
    updatePagination();
  });

  // Xử lí sự kiện click related-by-year-tab
  $('#related-by-year-tab').on('click', function () {
    offset = 1;
    fieldData = year;
    loadData('year', fieldData);
    updateQueryParams({ offset: offset });
    updatePagination();
  });

  // Xử lí sự kiện click related-by-price-tab
  $('#related-by-price-tab').on('click', function () {
    offset = 1;
    fieldData = price;
    loadData('price', fieldData);
    updateQueryParams({ offset: offset });
    updatePagination();
  });

  // LoadData
  async function loadData(relatedBy = 'brand', fieldData = null) {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    console;
    if (!id) {
      console.error('Product ID không xác định từ URL');
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const apiQuery = urlParams.toString();
    const apiUrl = `/api/products/related/${id}/${relatedBy}?${relatedBy}=${fieldData}&${apiQuery}`;
    await $.ajax({
      url: apiUrl,
      type: 'GET',
      statusCode: {
        200(resp) {
          products = resp.products || [];
          totalItems = resp.total || 0;
          totalPages = Math.ceil(totalItems / (resp.limit || 4));
          renderProducts(products, relatedBy);
          console.log(`Tìm thấy ${products.length} sản phẩm liên quan (${relatedBy})`);
        },
        500(resp) {
          console.error('Lỗi khi tải dữ liệu:', resp);
        },
      },
    });
  }

  function renderProducts(products, targetId) {
    const productListId = `${targetId}-related-product-list`; // Ví dụ: brand-related-product-list
    const productList = $(`#${productListId}`);

    // Xóa nội dung cũ
    productList.empty();

    // Nếu không có sản phẩm, hiển thị thông báo
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
    // Render danh sách sản phẩm
    products.forEach((product) => {
      const { _id, images, status, brand, price, year } = product;
      const imageSrc = images?.image1 || '/default-image.jpg'; // Ảnh mặc định nếu không có ảnh

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
                            <span class='star'>★</span>
                            <span class='star'>★</span>
                            <span class='star'>★</span>
                            <span class='star'>★</span>
                            <span class='star star-empty'>★</span>
                            <span class='rating-text'>(4.0)</span>
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
    const $pagination = $('.pagination');
    $pagination.empty();

    const visibleRange = 1;
    const firstPage = 1;
    const lastPage = totalPages;

    // Nút "First" và "Prev"
    $pagination.append(`
            <li class="page-item ${offset === firstPage ? 'disabled' : ''}">
                <a class="page-link" href="#" id="prevPage">&laquo;</a>
            </li>
        `);

    // Vòng lặp hiển thị trang
    for (let i = firstPage; i <= lastPage; i++) {
      if (
        i === firstPage || // Trang đầu
        i === lastPage || // Trang cuối
        (i >= offset - visibleRange && i <= offset + visibleRange) // Trang trong khoảng gần offset
      ) {
        $pagination.append(`
                    <li class="page-item ${offset === i ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `);
      } else if (
        (i === offset - visibleRange - 1 && i > firstPage) || // Dấu "..." trước nhóm trang
        (i === offset + visibleRange + 1 && i < lastPage) // Dấu "..." sau nhóm trang
      ) {
        $pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `);
      }
    }

    // Nút "Next" và "Last"
    $pagination.append(`
        <li class="page-item ${offset === lastPage ? 'disabled' : ''}">
            <a class="page-link" href="#" id="nextPage">&raquo;</a>
        </li>
    `);
  }

  $('.pagination').on('click', 'a.page-link', async function (e) {
    e.preventDefault();
    const $this = $(this);

    // Kiểm tra nếu nút bị disable thì không thực hiện gì
    if ($this.parent().hasClass('disabled')) return;

    // Cập nhật giá trị của offset dựa trên nút bấm
    switch ($this.attr('id')) {
      case 'firstPage':
        offset = 1; // Trang đầu tiên
        break;
      case 'prevPage':
        if (offset > 1) offset--; // Tránh giá trị < 1
        break;
      case 'nextPage':
        if (offset < totalPages) offset++; // Tránh giá trị > totalPages
        break;
      case 'lastPage':
        offset = totalPages; // Trang cuối cùng
        break;
      default:
        offset = parseInt($this.data('page')); // Điều hướng theo trang cụ thể
    }
    // Cập nhật query params và tải lại dữ liệu
    updateQueryParams({ offset: offset });
    await refresh();
  });

  // Handle items per page change
  $('#limit').change(async function () {
    limit = $(this).val();
    totalPages = Math.ceil(totalItems / limit);
    offset = 1;
    updateQueryParams({ limit: limit, offset: offset });
    await refresh();
  });

  // updateQuery
  function updateQueryParams(paramsToUpdate) {
    const params = new URLSearchParams(window.location.search);
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value == null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  async function refresh() {
    await loadData('brand', fieldData);
    updatePagination();
  }

  refresh();
});
