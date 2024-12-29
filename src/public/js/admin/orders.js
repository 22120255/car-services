import { showToast, showModal, updateQueryParams } from '../common.js';
import { getFilterConfigOrder } from '../config.js';

document.addEventListener('DOMContentLoaded', function () {
  // ------------------------------------ Declare variables -----------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  let orders = null;
  let limit = urlParams.get('limit') || 8;
  let offset = parseInt(urlParams.get('offset')) || 1;
  let totalPages = null;
  let totalItems = null;

  let priceMinFilter = parseFloat(urlParams.get('priceMin')) || null;
  let priceMaxFilter = parseFloat(urlParams.get('priceMax')) || null;
  let statusFilter = urlParams.get('status') || null;
  let searchText = urlParams.get('search') || '';
  let sortBy = urlParams.get('key') || '';

  // Initialize filters with URL params
  $('#searchInput').val(searchText);
  $('#limit').val(limit);
  $('#statusFilter').val(statusFilter);
  if (priceMinFilter && priceMaxFilter) $('#priceFilter').val(`${priceMinFilter}-${priceMaxFilter}`);

  // ------------------------------------ Setup Filters -----------------------------------------------
  const { statuses, prices, perPages, createdTime } = getFilterConfigOrder();

  const $statusFilter = $('#statusFilter');
  const $priceFilter = $('#priceFilter');
  const $limit = $('#limit');
  const $sortBy = $('#sortBy');

  // Render options
  const renderSelectOptions = (element, options, defaultText) => {
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
  renderSelectOptions($sortBy, createdTime, 'Sort by time created');

  // ------------------------------------ Event Handlers -----------------------------------------------
  function setupFilterHandlers(filterElement, paramKey) {
    $(filterElement).on('change', async function () {
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

  // Price filter handler
  $('#priceFilter').on('change', async function () {
    const price = $(this).val();
    const [min, max] = price ? price.split('-') : ['', ''];
    offset = 1;
    updateQueryParams({ priceMin: min, priceMax: max, offset: offset });
    await refresh();
  });

  // Sort by time created handler
  $('#sortBy').on('change', async function () {
    const key = 'createdAt';
    const direction = $(this).val();
    offset = 0;
    updateQueryParams({ key: key, direction: direction, offset: offset });
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
    try {
      const response = await $.ajax({
        url: `/api/user/orders?${apiQuery}`,
        type: 'GET'
      });

      orders = response.orders;
      totalItems = response.total;
      totalPages = Math.ceil(totalItems / limit);
      renderOrders(orders);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('error', 'Failed to load orders. Please try again.');
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  function getStatusClass(status) {
    const statusClasses = {
      'pending': 'status-pending',
      'completed': 'status-completed',
      'canceled': 'status-canceled'
    };
    return statusClasses[status.toLowerCase()] || '';
  }

  function reloadRow(orderId, newStatus) {
    const $row = $(`tr[data-order-id='${orderId}']`);
    const $statusCell = $row.find('.status-cell');
    $statusCell.find('.status-select').remove();
    $statusCell.find('.status').text(newStatus).show();
    $statusCell.find('.status').attr('class', `status ${getStatusClass(newStatus)}`);
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await $.ajax({
        url: `/api/user/orders/update-status/${orderId}`,
        type: 'PATCH',
        data: { status: newStatus }
      });
      reloadRow(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('error', 'Failed to update order status');
    }
  }

  function renderOrders(orders) {
    const $ordersTable = $('#ordersTable');
    $ordersTable.empty();
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
        const imageSrc = product?.images[0] || '/default-image.jpg';
        return product ? `<div class="product-cell"> <img
                              src='${imageSrc}'
                              alt='Toyota Camry'
                              class='car-image'
                          /> ${product.brand} ${product.model} (x${item.quantity}) </div>` : 'Unknown Product';
      }).join('<br>') || 'No products';

      $ordersTable.append(`
        <tr data-order-id="${_id}">
          <td>${userId?.fullName || 'Unknown User'}</td>
          <td>${productsList}</td>
          <td>${totalAmount?.toLocaleString('vi-VN') || 0}</td>
          <td>${formatDate(createdAt)}</td>
          <td class='status-cell'>
            <span class="status ${getStatusClass(status)}">${status}</span>
          </td>
          <td>
            <div class="btn-group">
              <button class='btn btn-custom btn-primary btn-edit-status' data-order-id="${_id}">
                <i class='fas fa-edit'></i>
              </button>
              <button type="button" title="Xem chi tiết" class="btn btn-info btn-sm view-details" data-order-id="${_id}">
                <i class="fas fa-eye"></i>
              </button>
          </td>
        </tr>
      `);
    });

    // Sử dụng event delegation 
    $('#ordersTable').off('click change').on('click', '.btn-edit-status', function () {
      const orderId = $(this).data('order-id');
      const currentStatus = $(this).closest('tr').find('.status').text();
      const $statusCell = $(`tr[data-order-id='${orderId}'] .status-cell`);

      // Only create select if it doesn't exist
      if (!$statusCell.find('.status-select').length) {
        const statusSelect = $('<select>').addClass('status-select').attr('data-order-id', orderId);
        $statusCell.find('.status').hide();
        $statusCell.append(statusSelect);
        renderSelectOptions(statusSelect, statuses, 'Select status');
        statusSelect.val(currentStatus.toLowerCase());
      }
      else {
        $statusCell.find('.status-select').remove();
        $statusCell.find('.status').show();
      }
    }).on('change', '.status-select', function () {
      const orderId = $(this).data('order-id');
      const newStatus = $(this).val();
      updateOrderStatus(orderId, newStatus);
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

    updateQueryParams({ offset: offset });
    await refresh();
  });

  $('#limit').change(async function () {
    limit = $(this).val();
    totalPages = Math.ceil(totalItems / limit);
    offset = 1;
    updateQueryParams({ limit: limit, offset: offset });
    await refresh();
  });

  async function refresh() {
    await loadData();
    updatePagination();
  }

  // Initial load
  refresh();
});

// Tách event handler ra khỏi renderOrders()
$(document).ready(function () {
  // View order details handler
  $(document).on('click', '.view-details', async function () {
    const orderId = $(this).data('order-id');
    console.debug('View details clicked for order ID:', orderId);

    // Hiển thị loading 
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();

    // Gọi API
    const response = await $.ajax({
      url: `/api/user/orders/${orderId}`,
      method: 'GET'
    });
    console.debug('Order details response:', response);

    if (!response || !response.order) {
      throw new Error('Order not found');
    }

    const order = response.order;
    console.debug('Order details:', order);
    // Render customer info
    $('#customerName').text(order.userId?.fullName || 'N/A');
    $('#customerEmail').text(order.userId?.email || 'N/A');
    $('#customerPhone').text(order.userId?.phone || 'N/A');

    // Render order info
    const shippingDetails = JSON.parse(order.shippingDetails);
    $('#shippingAddress').text(shippingDetails.address || 'N/A');
    $('#dateCreated').text(new Date(order.createdAt).toLocaleDateString('vi-VN') || 'N/A');
    $('#orderStatus').text(order.status || 'N/A');

    // Render order items
    if (!order.items || order.items.length === 0) {
      $('#orderItemsList').html('<tr><td colspan="4" class="text-center">No items found</td></tr>');
    } else {
      console.debug('Order items:', order.items);
      const itemsHtml = order.items
        .map(item => {
          const product = item.productId;
          if (!product) return null;

          return `
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <img src="${product.images?.[0] || '/default-image.jpg'}" 
                         alt="${product.brand || ''} ${product.model || ''}" 
                         class="car-image me-2" 
                         style="width: 60px; height: 45px; object-fit: cover;">
                    <span>${product.brand || ''} ${product.model || ''}</span>
                  </div>
                </td>
                <td class="text-start">${item.quantity || 0}</td>
                <td class="text-start">${(product.price || 0).toLocaleString('vi-VN')} đ</td>
                <td class="text-start">${((item.quantity || 0) * (product.price || 0)).toLocaleString('vi-VN')} đ</td>
              </tr>
            `;
        })
        .filter(Boolean)
        .join('');
      console.log('Order items list:', itemsHtml);
      $('#orderItemsList').html(itemsHtml || '<tr><td colspan="4" class="text-center">No valid items found</td></tr>');
    }

    // Show total
    const totalAmount = order.totalAmount || 0;
    $('#totalAmount').text(totalAmount.toLocaleString('vi-VN') + ' đ');


  });
});