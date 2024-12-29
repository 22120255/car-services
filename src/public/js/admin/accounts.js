import { renderSelectOptions, showModal, showToast, updatePagination, updateQueryParams } from '../common.js';
import { getFilterConfigAdminAccounts } from '../config.js';
import FunctionApi from '../FunctionApi.js';

document.addEventListener('DOMContentLoaded', function () {
  const { status, role, sortBy, direction, offset } = getFilterConfigAdminAccounts();

  renderSelectOptions($('#statusFilter'), status);
  renderSelectOptions($('#roleFilter'), role);
  renderSelectOptions($('#sortBy'), sortBy);
  renderSelectOptions($('#sortOrder'), direction);
  renderSelectOptions($('#itemsPerPage'), offset);
})

document.addEventListener('DOMContentLoaded', function () {
  // Xử lý thay đổi role
  $(document).on('change', '.role-select', function () {
    const userId = $(this).closest('tr').data('user-id');
    const newRole = $(this).val();
    const $select = $(this);

    const updateRoleApi = new FunctionApi('/api/user/update-role', {
      method: "PATCH",
      body: {
        userId, role: newRole
      },
      onSuccess(data) {
        showToast('Success', data.message);
      },
      onError(err) {
        $select.prop('selectedIndex', 1);
      }
    })
    updateRoleApi.call();
  });

  // Xử lý thay đổi status
  $(document).on('change', '.status-select', function () {
    const userId = $(this).closest('tr').data('user-id');
    const newStatus = $(this).val();
    const $select = $(this);

    const updateStatusApi = new FunctionApi("/api/user/update-role", {
      method: "PATCH",
      body: { userId, status: newStatus },
      onSuccess(data) {
        showToast('Success', data.message);
      },
      onError(err) {
        $select.prop('selectedIndex', 0);
      }
    })
    updateStatusApi.call();
  });

  // Xử lý xem chi tiết
  $(document).on('click', '.view-details', function () {
    const userId = $(this).closest('tr').data('user-id');

    $.get(`/user/${userId}`, function (data) {
      $('#userDetailsModal .modal-body').html(data);
    });
  });

  // Xử lý xóa user
  $(document).on('click', '.delete-user', function () {
    const userId = $(this).closest('tr').data('user-id');
    const deleteUserApi = new FunctionApi(`/api/user/${userId}`, {
      method: 'DELETE',
      onSuccess(data) {
        $(`tr[data-user-id=${userId}]`).remove();
        showToast('Success', data.message);
      }
    })

    showModal({
      title: 'Xoá tài khoản',
      content: 'Bạn có chắc chắn muốn xóa tài khoản này không?',
      btnSubmit: "Delete",
      callback: () => deleteUserApi.call()
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  // Đọc các tham số từ URL khi trang được load
  const urlParams = new URLSearchParams(window.location.search);

  let users = null;
  let totalItems = null;
  let limit = parseInt(urlParams.get('limit')) || $('#itemsPerPage').val(); // Số item mỗi trang
  let offset = parseInt(urlParams.get('offset')) || 0; // Số trang hiện tại
  let totalPages = null;

  // Set giá trị cho các input từ URL params
  $('#search-input').val(urlParams.get('search') || '');
  $('#statusFilter').val(urlParams.get('status') || '');
  $('#roleFilter').val(urlParams.get('role') || '');
  $('#sortBy').val(urlParams.get('key') || '');
  $('#sortOrder').val(urlParams.get('direction') || 'asc');
  $('#itemsPerPage').val(limit);

  // Xử lý tìm kiếm
  $('#search-input').on('keydown', async function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const search = $(this).val().trim()
      offset = 0;
      limit = parseInt(urlParams.get('limit')) || 10;
      updateQueryParams({ search, limit, offset });
      refresh();
    }
  });
  $('.search-btn').on('click', async function () {
    const search = $('#search-input').val().trim();
    offset = 0;
    limit = parseInt(urlParams.get('limit')) || 10;
    updateQueryParams({ search, limit, offset });
    refresh();
  });
  // Xử lý lọc theo status
  $('#statusFilter').change(async function () {
    const status = $(this).val();
    offset = 0;
    limit = parseInt(urlParams.get('limit')) || 10;
    updateQueryParams({ status, limit, offset });
    refresh();
  });

  // Xử lý lọc theo role
  $('#roleFilter').change(async function () {
    const role = $(this).val();
    offset = 0;
    limit = parseInt(urlParams.get('limit')) || 10;
    updateQueryParams({ role, limit, offset });
    refresh();
  });

  // Xử lý sắp xếp
  $('#sortBy, #sortOrder').change(async function () {
    const sortBy = $('#sortBy').val();
    const sortOrder = $('#sortOrder').val();
    offset = 0;
    limit = parseInt(urlParams.get('limit')) || 10;
    updateQueryParams({ key: sortBy, direction: sortOrder, limit, offset });
    await loadData();
  });

  //call API by Ajax and update UI
  async function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());

    const getAccountsApi = new FunctionApi('/api/user', {
      query: params
    })

    const data = await getAccountsApi.call();

    if (data) {
      users = data.data;
      totalItems = data.total;
    }

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
                                <button type="button" title="Xóa" class="btn btn-danger btn-sm delete-user">
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

  // Xử lý sự kiện click pagination
  $('.pagination').on('click', 'a.page-link', async function (e) {
    e.preventDefault();
    const $this = $(this);

    if ($this.parent().hasClass('disabled')) return;

    if ($this.attr('id') === 'firstPage') {
      offset = 0;
    } else if ($this.attr('id') === 'prevPage') {
      offset -= limit;
    } else if ($this.attr('id') === 'nextPage') {
      offset += limit;
    } else if ($this.attr('id') === 'lastPage') {
      offset = (totalPages - 1) * limit;
    } else {
      offset = (parseInt($this.data('page')) - 1) * limit;
    }

    updateQueryParams({ offset });
    await refresh();
  });

  // Handle items per page change
  $('#itemsPerPage').change(async function () {
    limit = parseInt($(this).val());

    updateQueryParams({ limit });
    await refresh();
  });

  // Khởi tạo pagination và load data
  async function refresh() {
    await loadData();
    updatePagination({ limit, offset, totalItems });
  }
  refresh();
});