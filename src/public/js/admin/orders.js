import { showToast, showModal, updateQueryParams, renderSelectOptions, updatePagination } from '../common.js';
import { getFilterConfigOrder } from '../config.js';
import FunctionApi from '../FunctionApi.js';
import { formatDate } from '../helpers.js';

document.addEventListener('DOMContentLoaded', function () {
  // ------------------------------------ Declare variables -----------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  let orders = null;
  let limit = urlParams.get('limit') || 10;
  let offset = parseInt(urlParams.get('offset')) || 0;
  let totalItems = null;

  function syncFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    limit = parseInt(urlParams.get('limit')) || 10;
    offset = parseInt(urlParams.get('offset')) || 0;
    const priceMin = parseFloat(urlParams.get('priceMin') || "");
    const priceMax = parseFloat(urlParams.get('priceMax') || "");
    const price = priceMin || priceMax ? `${priceMin} - ${priceMax}` : "";

    // Đồng bộ với giao diện
    $('#limit').val(limit);
    $('#searchInput').val(urlParams.get('search') || "");
    $('#statusFilter').val(urlParams.get('status') || "");
    $('#priceFilter').val(price);
    $('#sortBy').val(urlParams.get('key') || "asc");
  }

  // Hàm xử lý khi quay lại bằng nút "quay lại" trên trình duyệt
  window.addEventListener('popstate', async function () {
    syncFiltersFromURL();
    await refresh(); // Tải lại dữ liệu
  });


  // ------------------------------------ Setup Filters -----------------------------------------------
  const { statuses, prices, perPages, createdTime } = getFilterConfigOrder();

  renderSelectOptions($('#statusFilter'), statuses);
  renderSelectOptions($('#limit'), perPages);
  renderSelectOptions($('#priceFilter'), prices);
  renderSelectOptions($('#sortBy'), createdTime);

  // ------------------------------------ Event Handlers -----------------------------------------------
  function setupFilterHandlers(filterElement, paramKey) {
    $(filterElement).on('change', async function () {
      offset = 0;
      const urlParams = new URLSearchParams(window.location.search);
      limit = parseInt(urlParams.get('limit')) || 10
      updateQueryParams({ [paramKey]: $(this).val(), offset, limit });
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
      const urlParams = new URLSearchParams(window.location.search);
      limit = parseInt(urlParams.get('limit')) || 10
      offset = 0;
      updateQueryParams({ search, offset, limit });
      await refresh();
    }
  });

  $('#btn-search').on('click', async function (event) {
    event.preventDefault();
    const search = $('#searchInput').val();
    const urlParams = new URLSearchParams(window.location.search);
    limit = parseInt(urlParams.get('limit')) || 10
    offset = 0;
    updateQueryParams({ search, offset, limit });
    await refresh();
  });

  // Price filter handler
  $('#priceFilter').on('change', async function () {
    const price = $(this).val();
    const [min, max] = price ? price.split('-') : ['', ''];
    offset = 0;
    const urlParams = new URLSearchParams(window.location.search);
    limit = parseInt(urlParams.get('limit')) || 10
    updateQueryParams({ priceMin: min.trim(), priceMax: max.trim(), offset, limit });
    await refresh();
  });

  // Sort by time created handler
  $('#sortBy').on('change', async function () {
    const key = 'createdAt';
    const direction = $(this).val();
    offset = 0;
    const urlParams = new URLSearchParams(window.location.search);
    limit = parseInt(urlParams.get('limit')) || 10
    updateQueryParams({ key, direction, offset, limit });
    await refresh();
  });

  // ------------------------------------ Data Loading and Rendering -----------------------------------------------
  async function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());

    const getOrdersApi = new FunctionApi(`/api/user/orders`, {
      query: params,
    })
    const data = await getOrdersApi.call();
    if (data) {
      orders = data.orders;
      totalItems = data.total;
      renderOrders(orders);
    }
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

  function renderOrders(orders) {
    const $ordersTable = $('#ordersTable');
    $ordersTable.empty();
    if (!orders || orders.length === 0) {
      $ordersTable.append(`
        <tr>
          <td colspan="6" class="text-center">
            <h2 style="font-size: large; color: #9710e10e">No orders found!</h2>
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
      const updateOrderStatusApi = new FunctionApi(`/api/user/orders/update-status/${orderId}`, {
        method: "PATCH",
        body: {
          status: newStatus
        },
        onSuccess(data) {
          reloadRow(orderId, newStatus)
        }
      })
      updateOrderStatusApi.call();
    });
  }

  // ------------------------------------ Pagination Event Handlers -----------------------------------------------
  $('.pagination').on('click', 'a.page-link', async function (e) {
    e.preventDefault();
    const $this = $(this);

    if ($this.parent().hasClass('disabled')) return;

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

    updateQueryParams({ offset: offset });
    await refresh();
  });

  $('#limit').change(async function () {
    limit = $(this).val();
    totalPages = Math.ceil(totalItems / limit);
    offset = 0;
    updateQueryParams({ limit: limit, offset: offset });
    await refresh();
  });

  async function refresh() {
    await loadData();
    updatePagination({ offset, limit, totalItems });
  }

  // Initial load
  syncFiltersFromURL();
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
      // console.log('Order items list:', itemsHtml);
      $('#orderItemsList').html(itemsHtml || '<tr><td colspan="4" class="text-center">No valid items found</td></tr>');
    }

    // Show total
    const totalAmount = order.totalAmount || 0;
    $('#totalAmount').text(totalAmount.toLocaleString('vi-VN') + ' đ');
  });
});