import { renderSelectOptions, showModal, showToast } from '../common.js';
import { getFilterConfigAdminAccounts } from '../config.js';

document.addEventListener('DOMContentLoaded', function () {
  const { status, role, sortBy, direction, offset } = getFilterConfigAdminAccounts();

  renderSelectOptions($('#statusFilter'), status);
  renderSelectOptions($('#roleFilter'), role);
  renderSelectOptions($('#sortBy'), sortBy);
  renderSelectOptions($('#sortOrder'), direction);
  renderSelectOptions($('#itemsPerPage'), offset);
})

document.addEventListener('DOMContentLoaded', function () {
  // Handle role change
  $(document).on('change', '.role-select', function () {
    const userId = $(this).closest('tr').data('user-id');
    const newRole = $(this).val();
    const $select = $(this);

    $.ajax({
      url: '/api/user/update-role',
      method: 'PATCH',
      data: { userId, role: newRole },
      statusCode: {
        200(resp) {
          showToast('Success', resp.message);
        },
        403(resp) {
          showToast('Error', resp.responseJSON.error);
          console.log('$select', $select);
          $select.prop('selectedIndex', 1);
        },
        500(resp) {
          showToast('Error', resp.responseJSON.error);
          $select.prop('selectedIndex', 1);
        },
      },
    });
  });

  // Handle status change
  $(document).on('change', '.status-select', function () {
    const userId = $(this).closest('tr').data('user-id');
    const newStatus = $(this).val();
    const $select = $(this);

    $.ajax({
      url: '/api/user/update-status',
      method: 'PATCH',
      data: { userId, status: newStatus },
      statusCode: {
        200(resp) {
          showToast('Success', resp.message);
        },
        403(resp) {
          showToast('Error', resp.responseJSON.error);
          $select.prop('selectedIndex', 0);
        },
        500(resp) {
          showToast('Error', resp.responseJSON.error);
          $select.prop('selectedIndex', 0);
        },
      },
    });
  });

  // Handle view details
  $(document).on('click', '.view-details', function () {
    const userId = $(this).closest('tr').data('user-id');

    $.get(`/user/${userId}`, function (data) {
      $('#userDetailsModal .modal-body').html(data);
    });
  });

  // Handle delete user
  $(document).on('click', '.delete-user', function () {
    const userId = $(this).closest('tr').data('user-id');

    showModal({
      title: 'Delete Account', content: 'Are you sure you want to delete this account?', btnSubmit: "Delete", callback: () => {
        $.ajax({
          url: `/api/user/${userId}`,
          method: 'DELETE',
          statusCode: {
            200(resp) {
              $(`tr[data-user-id=${userId}]`).remove();
              showToast('Success', resp.message);
            },
            403(resp) {
              showToast('Error', resp.responseJSON.error);
            },
            500(resp) {
              showToast('Error', resp.responseJSON.error);
            },
          },
        });
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  // Read parameters from URL when the page loads
  const urlParams = new URLSearchParams(window.location.search);

  let users = null;
  let totalItems = null;
  let limit = parseInt(urlParams.get('limit')) || $('#itemsPerPage').val(); // Items per page
  let offset = parseInt(urlParams.get('offset')) || 0; // Current page
  let totalPages = null;

  // Restore UI state from URL params
  const searchText = urlParams.get('search') || '';
  const statusFilter = urlParams.get('status') || '';
  const roleFilter = urlParams.get('role') || '';
  const sortBy = urlParams.get('key') || '';
  const sortOrder = urlParams.get('direction') || 'asc';

  // Set values for inputs from URL params
  $('#search-input').val(searchText);
  $('#statusFilter').val(statusFilter);
  $('#roleFilter').val(roleFilter);
  $('#sortBy').val(sortBy);
  $('#sortOrder').val(sortOrder);
  $('#itemsPerPage').val(limit);

  // Handle search
  $('#search-input').on('keydown', async function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      updateQueryParams('search', $(this).val().trim());
      refresh();
    }
  });
  $('.search-btn').on('click', async function () {
    updateQueryParams('search', $('#search-input').val().trim());
    refresh();
  });
  // Handle filter by status
  $('#statusFilter').change(async function () {
    updateQueryParams('status', $(this).val());
    refresh();
  });

  // Handle filter by role
  $('#roleFilter').change(async function () {
    updateQueryParams('role', $(this).val());
    refresh();
  });

  // Handle sorting
  $('#sortBy, #sortOrder').change(async function () {
    const sortBy = $('#sortBy').val();
    const sortOrder = $('#sortOrder').val();
    updateQueryParams('key', sortBy);
    updateQueryParams('direction', sortOrder);
    await loadData();
  });

  function updatePagination() {
    const $pagination = $('.pagination');
    $pagination.empty();

    // First and Previous buttons
    $pagination.append(`
            <li class="page-item ${offset === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="firstPage">&laquo;&laquo;</a>
            </li>
            <li class="page-item ${offset === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="prevPage">&laquo;</a>
            </li>
        `);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= offset && i <= offset + 2)) {
        $pagination.append(`
                    <li class="page-item ${offset === i - 1 ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i - 1}">${i}</a>
                    </li>
                `);
      } else if (i === offset - 1 || i === offset + 3) {
        $pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `);
      }
    }

    // Next and Last buttons
    $pagination.append(`
            <li class="page-item ${offset === totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="nextPage">&raquo;</a>
            </li>
            <li class="page-item ${offset === totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="lastPage">&raquo;&raquo;</a>
            </li>
        `);
  }

  // Call API by Ajax and update UI
  async function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    const apiQuery = $.param(params);
    await $.ajax({
      url: `/api/user?${apiQuery}`,
      type: 'GET',
      statusCode: {
        200(resp) {
          users = resp.data;
          totalItems = resp.total;
          totalPages = Math.ceil(totalItems / limit);
        },
        500(resp) {
          console.log(resp.responseJSON);
        },
      },
    });

    // Clear current table data
    $('#accountsTable').empty();

    if (!users || users.length == 0) {
      const columnCount = $('.table thead th').length;
      $('#accountsTable').append(`<tr><td class="text-center" colspan="${columnCount}">No data</td></tr>`);
      return;
    }

    // Add new data
    users.forEach((user) => {
      $('#accountsTable').append(`
                <tr data-user-id="${user._id}">
                    <td>
                        <img src="${user.avatar}" alt="Avatar" class="user-avatar">
                    </td>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>
                        <select class="role-select form-select" ${user.isCurrentUser ? 'disabled' : ''}>
                            <option value="user" ${user.role.name === 'user' ? 'selected' : ''}>User</option>
                            <option value="admin" ${user.role.name === 'admin' ? 'selected' : ''}>Admin</option>
                            <option value="sadmin" ${user.role.name === 'sadmin' ? 'selected' : ''}>Super Admin</option>
                        </select>
                    </td>
                    <td>
                        <select class="status-select form-select" ${user.isCurrentUser ? 'disabled' : ''}>
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                        </select>
                    </td>
                    <td>${new Date(user.lastLogin).toLocaleString()}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" title="View detail" class="btn btn-info btn-sm view-details" data-bs-toggle="modal" data-bs-target="#userDetailsModal">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${!user.isCurrentUser
          ? `
                                <button type="button" title="Delete" class="btn btn-danger btn-sm delete-user">
                                    <i class="fas fa-trash"></i>
                                </button>
                            `
          : ''
        }
                        </div>
                    </td>
                </tr>
            `);
    });
  }

  // Handle pagination click event
  $('.pagination').on('click', 'a.page-link', async function (e) {
    e.preventDefault();
    const $this = $(this);

    if ($this.parent().hasClass('disabled')) return;

    if ($this.attr('id') === 'firstPage') {
      offset = 0;
    } else if ($this.attr('id') === 'prevPage') {
      offset--;
    } else if ($this.attr('id') === 'nextPage') {
      offset++;
    } else if ($this.attr('id') === 'lastPage') {
      offset = totalPages - 1;
    } else {
      offset = parseInt($this.data('page'));
    }

    updateQueryParams('offset', offset);
    await refresh();
  });

  // Handle items per page change
  $('#itemsPerPage').change(async function () {
    limit = parseInt($(this).val());
    totalPages = totalItems / limit;

    // updatePagination();
    updateQueryParams('limit', limit);
    await refresh();
  });

  function updateQueryParams(key, value) {
    const params = new URLSearchParams(window.location.search);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  // Initialize pagination and load data
  async function refresh() {
    await loadData();
    updatePagination();
  }
  refresh();
});