import { showToast, showModal } from '../../common.js';
import { getFilterConfigProduct } from '../../config.js';

// show product modal for create or update
function showProductModal(title, productID = null, product = null) {
  $('#product-modal .modal-title').text(title);

  // Nếu product tồn tại, tức là đang chỉnh sửa
  if (product) {
    $('#product-modal').data('is-editing', true); // Đang chỉnh sửa
    $('#product-modal').data('product-id', productID); // Lưu ID sản phẩm

    // Điền dữ liệu sản phẩm vào modal
    $('#product-brand').val(product.brand);
    $('#product-model').val(product.model);
    $('#product-year').val(product.year);
    $('#product-style').val(product.style);
    $('#product-status').val(product.status);
    $('#product-price').val(product.price);
    $('#product-mileage').val(product.mileage);
    $('#product-horsepower').val(product.horsepower);
    $('#product-transmission').val(product.transmission);
    $('#product-description').val(product.description);
    product.images.forEach((index, image) => {
      $(`input[name="images.image${index + 1}"]`).val(image);
    });
    for (let i = 0; i < product.images.length; i++) {
      $(`input[name="images.${i + 1}"]`).val(product.images[i]);
    }
  } else {
    // Nếu không có sản phẩm, tức là tạo mới
    $('#product-modal').data('is-editing', false); // Tạo mới
    $('#product-modal').data('product-id', null); // Xóa ID sản phẩm

    // Reset các trường input
    $('#product-form')[0].reset();
  }

  // Hiển thị modal
  $('#product-modal').modal('show');
}

// Hàm hiển thị modal chi tiết sản phẩm
function showModalDetail(product) {
  // Cập nhật tiêu đề modal
  $('#detailModalTitle').text('Product Details');

  // Cập nhật hình ảnh chính
  $('#mainDetailImage')
    .attr('src', product.images?.image1 || 'https://th.bing.com/th/id/OIP.bacWE2DlJQTSbG6kvNrzegHaEK?w=294&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7')
    .attr('alt', `${product.brand || 'Unknown Brand'} ${product.model || ''}`);

  // Cập nhật các hình ảnh thu nhỏ
  const $thumbnailContainer = $('#detailThumbnailImages');
  $thumbnailContainer.empty();

  if (product.images && typeof product.images === 'object') {
    Object.values(product.images).forEach((image) => {
      const $img = $('<img>')
        .attr('src', image)
        .attr('alt', 'thumbnail')
        .addClass('detail-thumbnail')
        .on('click', function () {
          $('#mainDetailImage').attr('src', image);
        });
      $thumbnailContainer.append($img);
    });
  } else {
    $thumbnailContainer.append('<p>No images available</p>');
  }

  // Cập nhật thông tin sản phẩm
  $('#detailProductTitle').text(`${product.brand || 'N/A'} ${product.model || ''}`);
  $('#detailProductPrice').text(product.price ? `$${product.price}` : 'N/A');
  $('#detailProductDescription').text(product.description || 'No description available.');

  // Cập nhật thông số kỹ thuật
  const $specsContainer = $('#detailProductSpecs');
  $specsContainer.empty();
  const specs = [
    { label: 'Model Year', value: product.year || 'N/A' },
    { label: 'Mileage', value: product.mileage ? `${product.mileage} mi` : 'N/A' },
    { label: 'Horsepower', value: product.horsepower ? `${product.horsepower}HP` : 'N/A' },
    { label: 'Transmission', value: product.transmission || 'N/A' },
    { label: 'Style', value: product.style || 'N/A' },
  ];

  specs.forEach((spec) => {
    const $specItem = $('<div>').addClass('detail-spec-item').html(`
      <span class="detail-spec-label">${spec.label}:</span>
      <span class="detail-spec-value">${spec.value}</span>
    `);
    $specsContainer.append($specItem);
  });

  $('#productDetailModal').modal('show');
}

function handleProductAction(action, productId) {
  $.get(`/api/user/inventory/${productId}`)
    .done(function (data) {
      if (action === 'detail') {
        showModalDetail(data);
      } else if (action === 'edit') {
        console.log(data);
        showProductModal('Edit car', productId, data);
      }
    })
    .fail(function () {
      showToast('error', 'Cannot load data. Please try again!');
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const { years, styles, brands, transmissions, statuses, prices, perPages } = getFilterConfigProduct();
  const $yearFilter = $('#yearFilter');
  const $styleFilter = $('#styleFilter');
  const $brandFilter = $('#brandFilter');
  const $transmissionFilter = $('#transmissionFilter');
  const $statusFilter = $('#statusFilter');
  const $priceFilter = $('#priceFilter');
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

  renderSelectOptions($yearFilter, years, 'Select year');
  renderSelectOptions($styleFilter, styles, 'Select style');
  renderSelectOptions($brandFilter, brands, 'Select brand');
  renderSelectOptions($transmissionFilter, transmissions, 'Select transmission');
  renderSelectOptions($statusFilter, statuses, 'Select status');
  renderSelectOptions($limit, perPages, 'Items per page');
  renderSelectOptions($priceFilter, prices, 'Select price');
});

document.addEventListener('DOMContentLoaded', function () {
  // ------------------------------------ Declare variables -----------------------------------------------

  const urlParams = new URLSearchParams(window.location.search);

  let products = null;
  let limit = urlParams.get('limit') || 8;
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

  // ------------------------------------js for CRUD products-----------------------------------------------

  // view-trash-btn
  $('#view-trash-btn').on('click', function () {
    window.location.href = '/admin/inventory/trash';
  });

  // loại bỏ thuộc tính aria-hidden khi modal được hiển thị
  $('#productDetailModal').on('show.bs.modal', function () {
    $(this).removeAttr('aria-hidden');
  });
  $('#productDetailModal').on('hidden.bs.modal', function () {
    $(this).attr('aria-hidden', 'true');
  });

  // Đăng ký sự kiện click nút Detail
  $('#inventoryTable').on('click', '.detail', function () {
    const productId = $(this).closest('tr').data('product-id');
    const action = 'detail';
    handleProductAction(action, productId);
  });

  // Đăng ký sự kiện click nút Edit
  $('#inventoryTable').on('click', '.edit', function () {
    const productId = $(this).closest('tr').data('product-id');
    const modal = $('#product-modal');
    modal.find('.modal-title').text('Edit Product');
    modal.find('#save-product-btn').text('Update').removeClass('btn-primary').addClass('btn-warning');
    modal.find('.modal-header').css('background-color', '#ffc107');
    modal.data('is-editing', true);
    handleProductAction('edit', productId);
  });
  // Đăng ký sự kiện cho nút Save trong modal
  $('#add-car-btn').on('click', function () {
    const modal = $('#product-modal');

    modal.find('.modal-title').text('Add New Car');

    modal.find('#save-product-btn').text('Save').removeClass('btn-warning').addClass('btn-primary');

    modal.find('.modal-header').css('background-color', '#007bff');
    modal.data('is-editing', false);
    modal.find('form')[0].reset();
    showProductModal('Add New Car');
  });

  // Đăng ký sự kiện cho nút Delete
  $('#inventoryTable').on('click', '.delete', function () {
    const productId = $(this).closest('tr').data('product-id');

    // Hiển thị modal xác nhận xóa
    showModal('Delete Product', 'Are you sure you want to delete this product?', 'Delete', () => {
      $.ajax({
        url: `/api/user/inventory/delete-product/${productId}`,
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

  // Đăng ký sự kiện cho nút Save trong modal
  $('#save-product-btn').on('click', function () {
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

    // Kiểm tra xem có đang chỉnh sửa hay không
    const isEditing = $('#product-modal').data('is-editing');
    const productId = $('#product-modal').data('product-id');
    // Xác định URL và phương thức HTTP
    let url = '/api/user/inventory/create-product';
    let method = 'POST';
    if (isEditing) {
      url = `/api/user/inventory/update-product/${productId}`;
      method = 'PUT';
    }

    // Gửi dữ liệu qua AJAX
    $.ajax({
      url: url,
      type: method,
      contentType: 'application/json',
      data: JSON.stringify(productData),
      success: function (response) {
        if (response.message) {
          showToast('success', response.message);
          $('#product-modal').modal('hide');
          refresh();
        } else {
          showToast('error', 'Unable to save product!');
        }
      },
      error: function (xhr) {
        const errors = xhr.responseJSON?.errors || {};
        for (const field in errors) {
          const input = $(`#product-${field}`);
          input.addClass('is-invalid');
          input.siblings('.invalid-feedback').text(errors[field]);
        }
        showToast('error', 'Please check the information again!');
      },
    });
  });

  // --------------------------------------------------js for all pages-------------------------------------------

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

  $('#searchInput').on('keyup keydown', async function (event) {
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
      const imageSrc = images?.at(0) || '/default-image.jpg'; // Sử dụng ảnh mặc định nếu không có ảnh
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
