import { getFilterConfigProduct } from "../config";

// Load filter
document.addEventListener('DOMContentLoaded', function () {
  const {
    years,
    styles,
    brands,
    transmissions,
    statuses,
    prices,
    perPages
  } = getFilterConfigProduct();
  // TODO: here
})

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);

  let products = null;
  let limit = urlParams.get('limit') || 8;
  let offset = parseInt(urlParams.get('offset')) || 1;
  let totalPages = null;
  let totalItems = null;
  let filters = null;

  let priceMinFilter = parseFloat(urlParams.get('priceMin')) || null;
  let priceMaxFilter = parseFloat(urlParams.get('priceMax')) || null;
  let styleFilter = urlParams.get('style') || null;
  let brandFilter = urlParams.get('brand') || null;
  let statusFilter = urlParams.get('status') || null;
  let transmissionFilter = urlParams.get('transmission') || null;
  let searchText = urlParams.get('search') || '';
  let yearFilter = parseInt(urlParams.get('year')) || null;

  $('#searchInput').val(searchText);
  $('#limit').val(limit);
  $('#statusFilter').val(statusFilter);
  $('#brandFilter').val(brandFilter);
  $('#styleFilter').val(styleFilter);
  $('#transmissionFilter').val(transmissionFilter);
  $('#yearFilter').val(yearFilter);
  $('#priceFilter').val(`${priceMinFilter}-${priceMaxFilter}`);

  function syncFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    limit = parseInt(urlParams.get('limit')) || 8;
    offset = parseInt(urlParams.get('offset')) || 1;
    priceMinFilter = parseFloat(urlParams.get('priceMin')) || null;
    priceMaxFilter = parseFloat(urlParams.get('priceMax')) || null;
    styleFilter = urlParams.get('style') || null;
    brandFilter = urlParams.get('brand') || null;
    statusFilter = urlParams.get('status') || null;
    transmissionFilter = urlParams.get('transmission') || null;
    searchText = urlParams.get('search') || null;
    yearFilter = parseInt(urlParams.get('year')) || null;

    // Đồng bộ với giao diện
    $('#searchInput').val(searchText);
    $('#limit').val(limit);
    $('#statusFilter').val(statusFilter);
    $('#brandFilter').val(brandFilter);
    $('#styleFilter').val(styleFilter);
    $('#transmissionFilter').val(transmissionFilter);
    $('#yearFilter').val(yearFilter);
    $('#priceFilter').val(`${priceMinFilter}-${priceMaxFilter}`);
  }

  // Hàm xử lý khi quay lại bằng nút "quay lại" trên trình duyệt
  window.addEventListener('popstate', async function () {
    syncFiltersFromURL(); // Đồng bộ lại bộ lọc từ URL
    await refresh(); // Tải lại dữ liệu
  });

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
  setupFilterHandlers('#styleFilter', 'style');
  setupFilterHandlers('#transmissionFilter', 'transmission');
  setupFilterHandlers('#yearFilter', 'year');
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
      url: `/products?${apiQuery}`,
      type: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest', // Thêm header Ajax
      },
      statusCode: {
        200(resp) {
          products = resp.products;
          totalItems = resp.total;
          totalPages = Math.ceil(totalItems / limit);
          filters = resp.filters;
        },
        500(resp) {
          console.error('Lỗi khi tải dữ liệu:', resp);
        },
      },
    });
    if (filters) {
      renderFilters(filters, params);
    }
    renderProducts(products);
  }

  // render products
  function renderProducts(products) {
    console.log(1);
    $('#product-list').empty();

    if (!products || products.length === 0) {
      $('#product-list').append(`<div class='col-lg-12'>
                    <div class='find-nothing text-center' >
                            <h2 style = "font-size: large; color: #978e8e">Find nothing!</h2>
                    </div>
                </div>`);
      return;
    }

    products.forEach((product) => {
      const { _id, images, status, brand, price, year } = product;
      const imageSrc = images?.image1 || '/default-image.jpg'; // Sử dụng ảnh mặc định nếu không có ảnh
      $('#product-list').append(`
                <div class='col-lg-3 col-md-4 col-sm-6'>
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

  // render filters
  function renderFilters(filters, params) {
    // Xử lý từng loại filter
    const renderSelectOptions = (element, options, selectedValue, defaultText) => {
      element.empty().append(`<option value="">${defaultText}</option>`);
      options.forEach((option) => {
        element.append(`<option value="${option.value}" ${selectedValue === option.value ? 'selected' : ''}>${option.name}</option>`);
      });
    };

    renderSelectOptions($('#yearFilter'), filters.years, params.year, 'Select year');
    renderSelectOptions($('#styleFilter'), filters.styles, params.style, 'Select style');
    renderSelectOptions($('#brandFilter'), filters.brands, params.brand, 'Select brand');
    renderSelectOptions($('#statusFilter'), filters.statuses, params.status, 'Select status');
    renderSelectOptions($('#transmissionFilter'), filters.transmissions, params.transmission, 'Select transmission');

    // Xử lý riêng cho price filter
    const priceFilter = $('#priceFilter');
    priceFilter.empty().append('<option value="">Select price</option>');
    filters.prices.forEach((price) => {
      const isSelected = parseFloat(params.priceMin) === price.priceMin && parseFloat(params.priceMax) === price.priceMax;

      priceFilter.append(
        `<option value="${price.priceMin}-${price.priceMax}" ${isSelected ? 'selected' : ''}>$${price.priceMin}-$${price.priceMax}</option>`
      );
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
