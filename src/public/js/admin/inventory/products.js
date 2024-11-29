import { showModal, showToast, showProductModal, showModalDetail } from '../../common.js';

document.addEventListener('DOMContentLoaded', function () {
  // loại bỏ thuộc tính aria-hidden khi modal được hiển thị
  $('#productDetailModal').on('show.bs.modal', function () {
    $(this).removeAttr('aria-hidden');
  });
  $('#productDetailModal').on('hidden.bs.modal', function () {
    $(this).attr('aria-hidden', 'true');
  });

  // Hiển thị modal chi tiết sản phẩm
  $('#inventoryTable').on('click', '.detail', function () {
    const productId = $(this).closest('tr').data('product-id');
    console.log('ID sản phẩm:', productId);
    $.get(`/api/user/inventory/${productId}`)
      .done(function (data) {
        showModalDetail(data);
      })
      .fail(function () {
        showToast('error', 'Cannot load data. Please try again!');
      });
  });

  // Nút thêm sản phẩm (not working)
  $('#add-car-btn').on('click', function () {
    // Gọi modal với tiêu đề "Add new car" và không có sản phẩm (product = null)
    showProductModal('Add new car');
  });

  // Đăng ký sự kiện cho nút Save trong modal
  $('#add-car-btn').on('click', function () {
    // Gọi modal với tiêu đề "Add new car" và không có sản phẩm (product = null)
    showProductModal('Add new car');
  });

  // Đăng ký sự kiện cho nút Save trong modal
  $('#save-product-btn').on('click', function () {
    // Lấy dữ liệu từ các trường input
    const productData = {
      brand: $('#product-brand').val(),
      model: $('#product-model').val(),
      year: parseInt($('#product-year').val()),
      style: $('#product-style').val(),
      status: $('#product-status').val(),
      price: parseFloat($('#product-price').val()),
      mileage: parseInt($('#product-mileage').val()),
      horsepower: parseInt($('#product-horsepower').val()),
      transmission: $('#product-transmission').val(),
      description: $('#product-description').val(),
      images: {
        image1: $('input[name="images.image1"]').val(),
        image2: $('input[name="images.image2"]').val(),
        image3: $('input[name="images.image3"]').val(),
        image4: $('input[name="images.image4"]').val(),
        image5: $('input[name="images.image5"]').val(),
      },
    };

    // Gửi dữ liệu qua AJAX
    $.ajax({
      url: '/api/user/inventory/create-product', // Địa chỉ API của bạn
      type: 'POST',
      data: productData, // Gửi dữ liệu
      success: function (response) {
        if (response.success) {
          showToast('success', 'Sản phẩm đã được thêm thành công!');
          $('#product-modal').modal('hide'); // Đóng modal
        } else {
          showToast('error', 'Thêm sản phẩm thất bại!');
        }
      },
      error: function () {
        showToast('error', 'Đã có lỗi xảy ra, vui lòng thử lại!');
      },
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);

  let products = null;
  let limit = urlParams.get('limit') || 10;
  let offset = parseInt(urlParams.get('offset')) || 1;
  let totalPages = null;
  let totalItems = null;

  let priceMinFilter = parseFloat(urlParams.get('priceMin')) || null;
  let priceMaxFilter = parseFloat(urlParams.get('priceMax')) || null;
  let brandFilter = urlParams.get('brand') || null;
  let statusFilter = urlParams.get('status') || null;
  let searchText = urlParams.get('search') || '';

  $('#searchInput').val(searchText);
  $('#limit').val(limit);
  $('#statusFilter').val(statusFilter);
  $('#brandFilter').val(brandFilter);
  if (priceMinFilter && priceMaxFilter) $('#priceFilter').val(`${priceMinFilter}-${priceMaxFilter}`);

  function setupFilterHandlers(filterElement, paramKey) {
    $(filterElement).on('change', async function () {
      offset = 1;
      updateQueryParams({ [paramKey]: $(this).val(), offset: offset });
      await refresh();
    });
  }

  // Gọi hàm cho các bộ lọc
  setupFilterHandlers('#statusFilter', 'status');
  setupFilterHandlers('#brandFilter', 'brand');
  setupFilterHandlers('#limit', 'limit');

  $('#searchInput').on('keyup', async function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const search = $('#searchInput').val();
      offset = 1;
      updateQueryParams({ search: search, offset: offset });
      await refresh();
    }
  });

  $('#btn-search').on('click', async function (event) {
    event.preventDefault();
    const search = $('#searchInput').val();
    offset = 1;
    updateQueryParams({ search: search, offset: offset });
    await refresh();
  });

  $('#priceFilter').on('change', async function () {
    const price = $(this).val();
    const [min, max] = price ? price.split('-') : ['', ''];
    offset = 1;
    updateQueryParams({ priceMin: min, priceMax: max, offset: offset });
    refresh();
  });

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
      url: `/api/user/inventory?${apiQuery}`,
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
    $('#inventoryTable').empty();

    if (!products || products.length === 0) {
      $('#inventoryTable').append(`<div class='col-lg-12'>
                    <div class='find-nothing text-center' >
                            <h2 style = "font-size: large; color: #978e8e">Find nothing!</h2>
                    </div>
                </div>`);
      return;
    }

    products.forEach((product) => {
      const { _id, images, status, brand, model, price, year } = product;
      console.log(_id);
      const isSelected = status === 'used' || status === 'new';
      const imageSrc = images?.image1 || '/default-image.jpg'; // Sử dụng ảnh mặc định nếu không có ảnh
      $('#inventoryTable').append(`
                <tr data-product-id="${_id}">
                    <td>
                        <img
                            src='${imageSrc}'
                            alt='Toyota Camry'
                            class='car-image'
                        />
                    </td>
                    <td>${brand} ${model}</td>
                    <td>${year}</td>
                    <td>$${price}</td>
                    <td><span class='status ${isSelected ? 'available' : 'sold'}'>${status}</span></td>
                    <td class='actions'>
                        <button class='detail' data-bs-toggle="modal" data-bs-target="#productDetailModal"><i
                                class='fa-solid fa-circle-info'
                            ></i>
                            Detail</button>
                        <button class='edit'><i class='fas fa-edit'></i>
                            Edit</button>
                        <button class='delete'><i class='fas fa-trash'></i>
                            Delete</button>
                    </td>
                </tr>
            `);
    });
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
