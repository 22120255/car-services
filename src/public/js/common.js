// js for all pages

import FunctionApi from './FunctionApi.js'

function showToast(type, message) {
  const toastContainer = $('#toast-container');

  const toastElement = $(`<div class="toast toast-notify toast-${type.toLowerCase()}" role="alert" aria-live="assertive" aria-atomic="true"></div>`);
  const toastContent = `
        <div class="toast-header">
            <strong id="toast-title" class="me-auto">${type}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
  toastElement.html(toastContent);
  toastContainer.append(toastElement);

  setTimeout(() => {
    toastElement.addClass('show');
  }, 10);

  setTimeout(() => {
    toastElement.removeClass('show');
    setTimeout(() => {
      toastElement.remove();
    }, 500);
  }, 3000);
}
/* 
- callback will be done when modal hidden
- default callback will return true or undefined -> close modal
- if callback return false -> modal will not close
- onShowCallback will be done when modal shown
*/
function showModal({ title, content, btnSubmit = 'OK', callback = () => true, onShowCallback = () => { } }) {
  const modal = $('#notify-modal');

  modal.find('.modal-title').text(title);
  modal.find('.modal-body').html(content);
  modal.find('.btn-submit').text(btnSubmit);

  // Override method click of btn submit
  modal
    .find('.btn-submit')
    .off('click')
    .on('click', async () => {
      if ((await callback()) !== false) modal.modal('hide');
    });

  modal.off('shown.bs.modal').on('shown.bs.modal', () => {
    onShowCallback();
  });

  modal.modal('show').css('background-color', 'rgba(0, 0, 0, 0.4)');
}

async function loadCartData() {
  const getCardDataApi = new FunctionApi('/api/cart/data', {
    hideToast: true,
  });
  const data = await getCardDataApi.call();

  return data;
}

// Update query params in URL when filter change
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

const renderSelectOptions = (element, options) => {
  options.forEach((option) => {
    element.append(`<option value="${option.value}">${option.label}</option>`);
  });
};

const updateURL = ({ key, value }) => {
  let url = new URL(window.location.href);
  let params = url.searchParams
  params.set(key, value);
  url.search = params.toString();
  window.history.replaceState(null, '', url.toString());
}

function updatePagination({ selector = '.pagination', offset, limit, totalItems }) {
  const $pagination = $(selector);
  $pagination.empty();

  // check offset valid 
  if (limit % 4 == 0)
    offset = Math.round(offset / 8) * 8
  else
    offset = Math.round(offset / 10) * 10
  updateURL({ key: "offset", value: offset })

  const currentPage = offset / limit + 1;
  const visibleRange = 1;
  const firstPage = 1;
  const lastPage = Math.ceil(totalItems / limit);

  $pagination.append(`
      <li class="page-item ${currentPage === firstPage ? 'disabled' : ''}">
        <a class="page-link" href="#" id="prevPage">&laquo;</a>
      </li>
    `);

  for (let i = firstPage; i <= lastPage; i++) {
    if (
      i === firstPage ||
      i === lastPage ||
      (i >= currentPage - visibleRange && i <= currentPage + visibleRange)
    ) {
      $pagination.append(`
          <li class="page-item ${currentPage === i ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `);
    } else if (
      (i === currentPage - visibleRange - 1 && i > firstPage) ||
      (i === currentPage + visibleRange + 1 && i < lastPage)
    ) {
      $pagination.append(`
          <li class="page-item disabled">
            <span class="page-link">...</span>
          </li>
        `);
    }
  }

  $pagination.append(`
      <li class="page-item ${currentPage === lastPage ? 'disabled' : ''}">
        <a class="page-link" href="#" id="nextPage">&raquo;</a>
      </li>
    `);
}

export {
  showToast,
  showModal,
  loadCartData,
  updateQueryParams,
  renderSelectOptions,
  updatePagination,
  updateURL
};
