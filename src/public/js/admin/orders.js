import { showToast, showModal, updateQueryParams } from '../common.js';
import { getFilterConfigOrder } from '../config.js';

document.addEventListener('DOMContentLoaded', function () {
  // ------------------------------------ Declare variables -----------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  console.debug('URL Parameters:', urlParams.toString());
  let orders = null;
  let limit = urlParams.get('limit') || 8;
  let offset = parseInt(urlParams.get('offset')) || 1;
  let totalPages = null;
  let totalItems = null;

  let priceMinFilter = parseFloat(urlParams.get('priceMin')) || null;
  let priceMaxFilter = parseFloat(urlParams.get('priceMax')) || null;
  let statusFilter = urlParams.get('status') || null;
  let searchText = urlParams.get('search') || '';

  // Initialize filters with URL params
  $('#searchInput').val(searchText);
  $('#limit').val(limit);
  $('#statusFilter').val(statusFilter);
  if (priceMinFilter && priceMaxFilter) $('#priceFilter').val(`${priceMinFilter}-${priceMaxFilter}`);

  // ------------------------------------ Setup Filters -----------------------------------------------
  const { statuses, prices, perPages } = getFilterConfigOrder();

  const $statusFilter = $('#statusFilter');
  const $priceFilter = $('#priceFilter');
  const $limit = $('#limit');

  // Render options
  const renderSelectOptions = (element, options, defaultText) => {
    console.debug(`Rendering options for ${defaultText}`);
    if (defaultText !== 'Items per page') {
      element.empty().append(`<option value="">${defaultText}</option>`);
    }
    options.forEach((option) => {
      if (defaultText === 'Select price') {
        element.append(`<option value="${option.priceMin}-${option.priceMax}">$${option.priceMin}-$${option.priceMax}</option>`);
      } else {
        element.append(`<option value="${option.value}">${option.name}${defaultText === 'Items per page' ? ' /page' : ''}</option>`);
      }
    });
  };

  renderSelectOptions($statusFilter, statuses, 'Select status');
  renderSelectOptions($limit, perPages, 'Items per page');
  renderSelectOptions($priceFilter, prices, 'Select price');

  // ------------------------------------ Event Handlers -----------------------------------------------
  function setupFilterHandlers(filterElement, paramKey) {
    $(filterElement).on('change', async function () {
      console.debug(`Filter changed: ${paramKey} = ${$(this).val()}`);
      offset = 1;
      updateQueryParams({ [paramKey]: $(this).val(), offset: offset });
      await refresh();
    });
  }

  // Set up filter handlers
  setupFilterHandlers('#statusFilter', 'status');
  setupFilterHandlers('#limit', 'limit');

  // Search handler
  $('#searchInput').on('keyup', async function (event) {
    if (event.key === 'Enter') {
      const search = $(this).val();
      console.debug('Search input:', search);
      offset = 1;
      updateQueryParams({ search: search, offset: offset });
      await refresh();
    }
  });

  $('#btn-search').on('click', async function (event) {
    event.preventDefault();
    const search = $('#searchInput').val();
    console.debug('Search button clicked:', search);
    offset = 1;
    updateQueryParams({ search: search, offset: offset });
    await refresh();
  });

  // Price filter handler
  $('#priceFilter').on('change', async function () {
    const price = $(this).val();
    const [min, max] = price ? price.split('-') : ['', ''];
    console.debug('Price filter changed:', { min, max });
    offset = 1;
    updateQueryParams({ priceMin: min, priceMax: max, offset: offset });
    await refresh();
  });

  // ------------------------------------ Pagination -----------------------------------------------
  function updatePagination() {
    const $pagination = $('.pagination');
    $pagination.empty();

    const visibleRange = 1;
    const firstPage = 1;
    const lastPage = totalPages;

    $pagination.append(`
      <li class="page-item ${offset === firstPage ? 'disabled' : ''}">
        <a class="page-link" href="#" id="prevPage">&laquo;</a>
      </li>
    `);

    for (let i = firstPage; i <= lastPage; i++) {
      if (
        i === firstPage ||
        i === lastPage ||
        (i >= offset - visibleRange && i <= offset + visibleRange)
      ) {
        $pagination.append(`
          <li class="page-item ${offset === i ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `);
      } else if (
        (i === offset - visibleRange - 1 && i > firstPage) ||
        (i === offset + visibleRange + 1 && i < lastPage)
      ) {
        $pagination.append(`
          <li class="page-item disabled">
            <span class="page-link">...</span>
          </li>
        `);
      }
    }

    $pagination.append(`
      <li class="page-item ${offset === lastPage ? 'disabled' : ''}">
        <a class="page-link" href="#" id="nextPage">&raquo;</a>
      </li>
    `);
  }

  // ------------------------------------ Data Loading and Rendering -----------------------------------------------
  async function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    const apiQuery = $.param(params);
    console.debug('Loading data with query:', apiQuery);
    try {
      const response = await $.ajax({
        url: `/api/user/orders?${apiQuery}`,
        type: 'GET'
      });
      
      orders = response.orders;
      totalItems = response.total;
      totalPages = Math.ceil(totalItems / limit);
      console.debug('Data loaded:', { orders, totalItems, totalPages });
      renderOrders(orders);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('error', 'Failed to load orders. Please try again.');
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getStatusClass(status) {
    const statusClasses = {
      'pending': 'status-pending',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status.toLowerCase()] || '';
  }

  function renderOrders(orders) {
    const $ordersTable = $('#ordersTable');
    $ordersTable.empty();
    console.debug('Rendering orders:', orders);
    if (!orders || orders.length === 0) {
      $ordersTable.append(`
        <tr>
          <td colspan="6" class="text-center">
            <h2 style="font-size: large; color: #978e8e">No orders found!</h2>
          </td>
        </tr>
      `);
      return;
    }

    orders.forEach((order) => {
      const {
        _id,
        userId,
        items,
        totalAmount,
        status,
        createdAt
      } = order;

      const productsList = items?.map(item => {
        const product = item.productId;
        return product ? `${product.brand} ${product.model} (x${item.quantity})` : 'Unknown Product';
      }).join(', ') || 'No products';
      
      $ordersTable.append(`
        <tr data-order-id="${_id}">
          <td>${_id}</td>
          <td>${userId?.fullName || 'Unknown User'}</td>
          <td>${productsList}</td>
          <td>${totalAmount?.toLocaleString('vi-VN') || 0}</td>
          <td>${formatDate(createdAt)}</td>
          <td><span class="status ${getStatusClass(status)}">${status}</span></td>
        </tr>
      `);
      console.debug('Order rendered:', order);
    });
  }

  // ------------------------------------ Pagination Event Handlers -----------------------------------------------
  $('.pagination').on('click', 'a.page-link', async function (e) {
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

    console.debug('Pagination clicked:', { offset });
    updateQueryParams({ offset: offset });
    await refresh();
  });

  $('#limit').change(async function () {
    limit = $(this).val();
    totalPages = Math.ceil(totalItems / limit);
    offset = 1;
    console.debug('Limit changed:', { limit, offset });
    updateQueryParams({ limit: limit, offset: offset });
    await refresh();
  });

  async function refresh() {
    console.debug('Refreshing data...');
    await loadData();
    updatePagination();
  }

  // Initial load
  refresh();
});