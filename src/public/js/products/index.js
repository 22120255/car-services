import { getFilterConfigProduct } from '../config.js';
import { renderSelectOptions, updatePagination, updateQueryParams, updateURL } from '../common.js';
import FunctionApi from '../FunctionApi.js';

// Load filter
document.addEventListener('DOMContentLoaded', function () {
  const { years, styles, brands, transmissions, statuses, prices } = getFilterConfigProduct();
  const perPages = [
    { value: 8, label: '8 / page' },
    { value: 12, label: '12 / page' },
    { value: 16, label: '16 / page' },
  ]

  // Render options
  renderSelectOptions($('#yearFilter'), years);
  renderSelectOptions($('#styleFilter'), styles);
  renderSelectOptions($('#brandFilter'), brands);
  renderSelectOptions($('#transmissionFilter'), transmissions);
  renderSelectOptions($('#statusFilter'), statuses);
  renderSelectOptions($('#limit'), perPages);
  renderSelectOptions($('#priceFilter'), prices);

  const urlParams = new URLSearchParams(window.location.search);

  let products = null;
  let limit = urlParams.get('limit') || 8;
  if (!perPages.some(({ value }, index) => value === limit)) {
    limit = 8
    updateURL({ key: "limit", value: limit })
  }
  let offset = parseInt(urlParams.get('offset')) || 0;
  let totalItems = null;

  // TODO: Chưa xử lí trường hợp chỉ nhập một giá trị min trên url
  function syncFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    limit = parseInt(urlParams.get('limit')) || 8;
    offset = parseInt(urlParams.get('offset')) || 0;
    const priceMin = parseFloat(urlParams.get('priceMin') || '');
    const priceMax = parseFloat(urlParams.get('priceMax') || '');
    const price = priceMin || priceMax ? `${priceMin} - ${priceMax}` : '';

    // Đồng bộ với giao diện
    $('#limit').val(limit);
    $('#searchInput').val(urlParams.get('search') || '');
    $('#statusFilter').val(urlParams.get('status') || '');
    $('#brandFilter').val(urlParams.get('brand') || '');
    $('#styleFilter').val(urlParams.get('style') || '');
    $('#transmissionFilter').val(urlParams.get('transmission') || '');
    $('#yearFilter').val(parseInt(urlParams.get('year')) || '');
    $('#priceFilter').val(price);
    $('#sortByYear').val(urlParams.get('sortByYear') || '');
    $('#sortByPrice').val(urlParams.get('sortByPrice') || '');
  }

  // Hàm xử lý khi quay lại bằng nút "quay lại" trên trình duyệt
  window.addEventListener('popstate', async function () {
    syncFiltersFromURL();
    await refresh(); // Tải lại dữ liệu
  });

  function setupFilterHandlers(filterElement, paramKey) {
    $(filterElement).on('change', async function () {
      const urlParams = new URLSearchParams(window.location.search);
      offset = 0;
      limit = parseInt(urlParams.get('limit')) || 8;
      updateQueryParams({ [paramKey]: $(this).val(), offset, limit });
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
  setupFilterHandlers('#sortByYear', 'sortByYear');
  setupFilterHandlers('#sortByPrice', 'sortByPrice');

  $('#searchInput').on('keyup', async function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const urlParams = new URLSearchParams(window.location.search);
      const search = $('#searchInput').val().trim();
      offset = 0;
      updateQueryParams({ search, offset, limit });
      await refresh();
    }
  });

  $('#btn-search').on('click', async function (event) {
    const urlParams = new URLSearchParams(window.location.search);
    event.preventDefault();
    const search = $('#searchInput').val();
    offset = 0;
    updateQueryParams({ search, offset, limit });
    await refresh();
  });

  $('#priceFilter').on('change', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const price = $(this).val();
    const [priceMin, priceMax] = price ? price.split('-') : ['', ''];
    offset = 0;
    updateQueryParams({ priceMin: priceMin.trim(), priceMax: priceMax.trim(), offset });
    refresh();
  });


  // LoadData
  async function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());

    const getProductsApi = new FunctionApi(`/api/products`, {
      query: params,
    });
    const data = await getProductsApi.call();
    if (data) {
      products = data.products;
      totalItems = data.total;
    }

    renderProducts(products);
  }

  // render products
  function renderProducts(products) {
    $('#product-list').empty();

    if (!products || products.length === 0) {
      $('#product-list').append(`<div class='col-lg-12'>
                    <div class='find-nothing d-flex align-items-center justify-content-center' >
                            <h2 style = "font-size: large; color: #978e8e">Find nothing!</h2>
                    </div>
                </div>`);
      return;
    }

    products.forEach((product) => {
      const { _id, images, status, brand, price, year, averageRating = 0 } = product;
      const imageSrc = images[0] || 'https://dummyimage.com/300x200/cccccc/ffffff&text=No+Image'; // Sử dụng ảnh mặc định nếu không có ảnh

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
        starsHtml = `<span class='no-rating'>No reviews yet.</span>`;
      }

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

  // Xử lý sự kiện click pagination
  $('.pagination').on('click', 'a.page-link', async function (e) {
    e.preventDefault();
    const $this = $(this);

    // Kiểm tra nếu nút bị disable thì không thực hiện gì
    if ($this.parent().hasClass('disabled')) return;

    // Cập nhật giá trị của offset dựa trên nút bấm
    switch ($this.attr('id')) {
      case 'prevPage':
        if (offset > 0) offset -= limit;
        break;
      case 'nextPage':
        if (offset < totalItems) offset += limit;
        break;
      default:
        offset = (parseInt($this.data('page')) - 1) * limit;
    }

    // Cập nhật query params và tải lại dữ liệu
    updateQueryParams({ offset, limit });
    await refresh();
  });

  // Handle items per page change
  $('#limit').change(async function () {
    limit = $(this).val();
    offset = 0;
    updateQueryParams({ limit, offset });
    await refresh();
  });

  async function refresh() {
    await loadData();
    updatePagination({ limit, offset, totalItems });
  }

  syncFiltersFromURL();
  refresh();
});
