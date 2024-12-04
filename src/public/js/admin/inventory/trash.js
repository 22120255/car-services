import { showToast, showModal } from '../../common.js';
import { getFilterConfigProduct } from '../../config.js';

function formatDate(date) {
  return new Date(date).toLocaleString();
}

document.addEventListener('DOMContentLoaded', function () {
  const { perPages } = getFilterConfigProduct();
  const $limit = $('#limit');

  // Render options
  const renderSelectOptions = (element, options, defaultText) => {
    if (defaultText !== 'Items per page') {
      element.empty().append(`<option value="">${defaultText}</option>`);
    }

    options.forEach((option) => {
      if (defaultText === 'Select price') {
        element.append(`<option value="${option.priceMin}-${option.priceMax}">$${option.priceMin}-$${option.priceMax}</option>`);
      } else element.append(`<option value="${option.value}">${option.name} ${defaultText === 'Items per page' ? '/trang' : ''}</option>`);
    });
  };

  renderSelectOptions($limit, perPages, 'Items per page');
});

document.addEventListener('DOMContentLoaded', function () {
  // ------------------------------------ Declare variables -----------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);

  let products = null;
  let limit = urlParams.get('limit') || 8;
  let offset = parseInt(urlParams.get('offset')) || 1;
  let totalPages = null;
  let totalItems = null;

  const $btnDelete = $('#btnDelete');
  const $btnRestore = $('#btnRestore');
  const $limit = $('#limit');

  $limit.val(limit);

  // ------------------------------------js for CRUD products-----------------------------------------------

  // Đăng ký sự kiện cho nút Delete
  $('#trashTable').on('click', '#btnDelete', function () {
    const productId = $(this).closest('tr').data('product-id');
    console.log(productId);
    showModal('Delete Product', 'Are you sure you want to delete permanently this product?', 'Delete ', () => {
      $.ajax({
        url: `/api/user/trash/delete/${productId}`,
        type: 'DELETE',
        statusCode: {
          200: function (response) {
            showToast('success', response.message);
            refresh();
          },
          403: function (xhr) {
            const message = xhr.responseJSON?.error || 'You are not authorized to delete this product!';
            showToast('error', message);
          },
          404: function (xhr) {
            const message = xhr.responseJSON?.error || 'Product not found!';
            showToast('error', message);
          },
          500: function (xhr) {
            const message = xhr.responseJSON?.error || 'Server error. Please try again later!';
            showToast('error', message);
          },
        },
      });
    });
  });

  // Đăng ký sự kiện cho nút Restore
  $('#trashTable').on('click', '#btnRestore', function () {
    const productId = $(this).closest('tr').data('product-id');
    console.log(productId);
    $.ajax({
      url: `/api/user/trash/restore/${productId}`,
      type: 'PATCH',
      statusCode: {
        200: function (response) {
          showToast('success', response.message);
          refresh();
        },
        403: function (xhr) {
          const message = xhr.responseJSON?.error || 'You are not authorized to restore this product!';
          showToast('error', message);
        },
        404: function (xhr) {
          const message = xhr.responseJSON?.error || 'Product not found!';
          showToast('error', message);
        },
        500: function (xhr) {
          const message = xhr.responseJSON?.error || 'Server error. Please try again later!';
          showToast('error', message);
        },
      },
    });
  });

  // --------------------------------------------------js for all pages-------------------------------------------

  function updatePagination() {
    const $pagination = $('.pagination');
    $pagination.empty();

    const visibleRange = 1; // Số trang liền kề cần hiển thị
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

  // LoadData
  async function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    const apiQuery = $.param(params);
    await $.ajax({
      url: `/api/user/trash?${apiQuery}`,
      type: 'GET',
      statusCode: {
        200(resp) {
          products = resp.products;
          totalItems = resp.total;
          totalPages = Math.ceil(totalItems / limit);
        },
        500(resp) {
          console.error('Lỗi khi tải dữ liệu:', resp);
        },
      },
    });
    renderProducts(products);
  }

  // render products
  function renderProducts(products) {
    console.log(1);
    $('#trashTable').empty();
    let count = 0;
    if (!products || products.length === 0) {
      $('#trashTable').append(`<div class='col-lg-12'>
                      <div class='find-nothing text-center' >
                              <h2 style = "font-size: large; color: #978e8e">Nothing in trash!</h2>
                      </div>
                  </div>`);
      return;
    }
    products.forEach((product) => {
      const { _id, images, brand, model, deletedBy, createdAt, deletedAt, status, deleted } = product;

      // Xác định class CSS và văn bản dựa trên trạng thái
      let statusBadge;
      switch (status) {
        case 'New':
          statusBadge = 'status-new';
          break;
        case 'Sold':
          statusBadge = 'status-sold';
          break;
        case 'Used':
          statusBadge = 'status-used';
          break;
        default:
          statusBadge = 'status-unknown';
      }

      const imageSrc = images?.at(0) || '/default-image.jpg';
      // Thêm hàng mới vào bảng
      // Kiểm tra nếu trường 'deleted' không có hoặc có giá trị là false
      if (deleted && deleted !== false) {
        count++;
        $('#trashTable').append(`
      <tr data-product-id="${_id}">
        <td>
          <img src="${imageSrc}" alt="${brand} ${model}" class="product-image">
        </td>
        <td>${brand} ${model}</td>
        <td>${deletedBy}</td>
        <td>${formatDate(createdAt)}</td>
        <td>${formatDate(deletedAt)}</td>
        <td>
          <span class="status-badge ${statusBadge}">
            ${status}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-action btn-delete" data-id="${_id}" id="btnDelete">
              <i class="fas fa-trash"></i> 
            </button>
            <button class="btn-action btn-restore" data-id="${_id}" id="btnRestore" >
              <i class="fas fa-undo"></i> 
            </button>
          </div>
        </td>
      </tr>
    `);
      }
    });
    if (count === 0) {
      $('#trashTable').append(`<div class='col-lg-12'>
                      <div class='find-nothing text-center' >
                              <h2 style = "font-size: large; color: #978e8e">Nothing in trash!</h2>
                      </div>
                  </div>`);
      return;
    }
  }

  // Xử lý sự kiện click pagination
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
    // updatePagination();
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
    await loadData();
    updatePagination();
  }

  refresh();
});
