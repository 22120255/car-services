import FunctionApi from '../FunctionApi.js';
import { showToast } from '../common.js';

// View order details handler
$(document).on('click', '.view-details', async function () {
    try {
      const orderId = $(this).data('order-id');
      if (!orderId) {
        console.error('No order ID found');
        return;
      }
      
      console.debug('View details clicked for order ID:', orderId);
  
      // Show modal first
      const modalElement = document.getElementById('orderDetailsModal');
      if (!modalElement) return;
      
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
  
      // Clear previous data and show loading
      clearModalData();
      setModalLoadingState(true);
  
      // Use FunctionApi instead of direct $.ajax
      const getOrderDetailsApi = new FunctionApi(`/api/user/orders/${orderId}`, {
        method: 'GET',
        onSuccess: (response) => {
          if (!response?.order) {
            throw new Error('Order not found');
          }
          renderOrderDetails(response.order);
        },
        onError: (error) => {
          console.error('Error fetching order details:', error);
          showToast('error', 'Failed to load order details');
          modal.hide();
        }
      });
  
      await getOrderDetailsApi.call();
  
    } catch (error) {
      console.error('Error in view details handler:', error);
      showToast('error', 'Failed to load order details');
    } finally {
      setModalLoadingState(false);
    }
  });
  
  function clearModalData() {
    $('#customerName, #customerEmail, #customerPhone, #shippingAddress, #dateCreated, #orderStatus, #orderItemsList, #totalAmount').empty();
  }
  
  function setModalLoadingState(isLoading) {
    const modalBody = $('.modal-body');
    if (isLoading) {
      modalBody.addClass('loading').append('<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');
    } else {
      modalBody.removeClass('loading').find('.spinner-border').remove();
    }
  }
  
  function renderOrderDetails(order) {
    try {
      // Render customer info
      $('#customerName').text(order.userId?.fullName || 'N/A');
      $('#customerEmail').text(order.userId?.email || 'N/A');
      $('#customerPhone').text(order.userId?.phone || 'N/A');
  
      // Render order info
      const shippingDetails = typeof order.shippingDetails === 'string' 
        ? JSON.parse(order.shippingDetails) 
        : order.shippingDetails || {};
      
      $('#shippingAddress').text(shippingDetails.address || 'N/A');
      $('#dateCreated').text(new Date(order.createdAt).toLocaleDateString('vi-VN'));
      $('#orderStatus').text(order.status || 'N/A');
  
      // Render order items
      renderOrderItems(order.items);
  
      // Show total
      const totalAmount = order.totalAmount || 0;
      $('#totalAmount').text(totalAmount.toLocaleString('vi-VN') + ' đ');
      
    } catch (error) {
      console.error('Error rendering order details:', error);
      showToast('error', 'Error displaying order details');
    }
  }
  
  function renderOrderItems(items) {
    try {
      if (!Array.isArray(items) || items.length === 0) {
        $('#orderItemsList').html('<tr><td colspan="4" class="text-center">No items found</td></tr>');
        return;
      }
  
      const itemsHtml = items
        .map((item) => {
          const product = item.productId;
          if (!product) return null;
  
          const quantity = parseInt(item.quantity) || 0;
          const price = parseFloat(product.price) || 0;
          const amount = quantity * price;
  
          return `
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <img src="${product.images?.[0] || '/images/placeholder.png'}" 
                       alt="${product.brand || ''} ${product.model || ''}" 
                       class="car-image me-2" 
                       style="width: 60px; height: 45px; object-fit: cover;"
                       onerror="this.src='/images/placeholder.png'">
                  <span>${product.brand || ''} ${product.model || ''}</span>
                </div>
              </td>
              <td class="text-start">${quantity}</td>
              <td class="text-start">${price.toLocaleString('vi-VN')} đ</td>
              <td class="text-start">${amount.toLocaleString('vi-VN')} đ</td>
            </tr>
          `;
        })
        .filter(Boolean)
        .join('');
  
      $('#orderItemsList').html(itemsHtml || '<tr><td colspan="4" class="text-center">No valid items found</td></tr>');
    } catch (error) {
      console.error('Error rendering order items:', error);
      $('#orderItemsList').html('<tr><td colspan="4" class="text-center">Error loading items</td></tr>');
    }
  }