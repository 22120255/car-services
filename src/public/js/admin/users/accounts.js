import { showModal, showToast } from '../../common.js'

document.addEventListener('DOMContentLoaded', function () {
    // Xử lý thay đổi role
    $(document).on('change', '.role-select', function () {
        const userId = $(this).closest('tr').data('user-id')
        const newRole = $(this).val()
        const $select = $(this)

        $.ajax({
            url: '/api/users/update-role',
            method: 'PATCH',
            data: { userId, role: newRole },
            statusCode: {
                200(resp) {
                    showToast('Success', resp.message)
                },
                403(resp) {
                    showToast('Error', resp.responseJSON.error)
                    console.log('$select', $select)
                    $select.prop('selectedIndex', 1)
                },
                500(resp) {
                    showToast('Error', resp.responseJSON.error)
                    $select.prop('selectedIndex', 1)
                },
            },
        })
    })

    // Xử lý thay đổi status
    $(document).on('change', '.status-select', function () {
        const userId = $(this).closest('tr').data('user-id')
        const newStatus = $(this).val()
        const $select = $(this)

        $.ajax({
            url: '/api/users/update-status',
            method: 'PATCH',
            data: { userId, status: newStatus },
            statusCode: {
                200(resp) {
                    showToast('Success', resp.message)
                },
                403(resp) {
                    showToast('Error', resp.responseJSON.error)
                    $select.prop('selectedIndex', 0)
                },
                500(resp) {
                    showToast('Error', resp.responseJSON.error)
                    $select.prop('selectedIndex', 0)
                },
            },
        })
    })

    // Xử lý xem chi tiết
    $(document).on('click', '.view-details', function () {
        console.log('click')
        const userId = $(this).closest('tr').data('user-id')
        console.log('userId ', userId)
        $.get(`/api/users/${userId}/details`, function (data) {
            $('#userDetailsModal .modal-body').html(data)
        })
    })

    // Xử lý xóa user
    $(document).on('click', '.delete-user', function () {
        const userId = $(this).closest('tr').data('user-id')

        showModal(
            'Xoá tài khoản',
            'Bạn có chắc chắn muốn xóa tài khoản này không?',
            function () {
                $.ajax({
                    url: `/api/users/${userId}`,
                    method: 'DELETE',
                    statusCode: {
                        200(resp) {
                            showToast('Success', resp.message)
                            $(`tr[data-user-id=${userId}]`).remove()
                        },
                        403(resp) {
                            showToast('Error', resp.responseJSON.error)
                        },
                        500(resp) {
                            showToast('Error', resp.responseJSON.error)
                        },
                    },
                })
            }
        )
    })
})
document.addEventListener('DOMContentLoaded', function () {
    // Đọc các tham số từ URL khi trang được load
    const urlParams = new URLSearchParams(window.location.search)

    let users = null
    let totalItems = null
    let limit = parseInt(urlParams.get('limit')) || $('#itemsPerPage').val() // Số item mỗi trang
    let offset = parseInt(urlParams.get('offset')) || 0 // Số trang hiện tại
    let totalPages = null

    // Khôi phục trạng thái UI từ URL params
    const searchText = urlParams.get('search') || ''
    const statusFilter = urlParams.get('status') || ''
    const roleFilter = urlParams.get('role') || ''
    const sortBy = urlParams.get('key') || ''
    const sortOrder = urlParams.get('direction') || 'asc'

    // Set giá trị cho các input từ URL params
    $('#search-input').val(searchText)
    $('#statusFilter').val(statusFilter)
    $('#roleFilter').val(roleFilter)
    $('#sortBy').val(sortBy)
    $('#sortOrder').val(sortOrder)
    $('#itemsPerPage').val(limit)

    // Xử lý tìm kiếm
    $('#search-input').on('keydown', async function (event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            updateQueryParams('search', $(this).val().trim())
            refresh()
        }
    })
    $('.search-btn').on('click', async function () {
        updateQueryParams('search', $('#search-input').val().trim())
        refresh()
    })
    // Xử lý lọc theo status
    $('#statusFilter').change(async function () {
        updateQueryParams('status', $(this).val())
        refresh()
    })

    // Xử lý lọc theo role
    $('#roleFilter').change(async function () {
        updateQueryParams('role', $(this).val())
        refresh()
    })

    // Xử lý sắp xếp
    $('#sortBy, #sortOrder').change(async function () {
        const sortBy = $('#sortBy').val()
        const sortOrder = $('#sortOrder').val()
        updateQueryParams('key', sortBy)
        updateQueryParams('direction', sortOrder)
        await loadData()
    })

    function updatePagination() {
        const $pagination = $('.pagination')
        $pagination.empty()

        // Nút First và Previous
        $pagination.append(`
            <li class="page-item ${offset === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="firstPage">&laquo;&laquo;</a>
            </li>
            <li class="page-item ${offset === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="prevPage">&laquo;</a>
            </li>
        `)

        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= offset && i <= offset + 2)
            ) {
                $pagination.append(`
                    <li class="page-item ${offset === i - 1 ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i - 1}">${i}</a>
                    </li>
                `)
            } else if (i === offset - 1 || i === offset + 3) {
                $pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `)
            }
        }

        // Nút Next và Last
        $pagination.append(`
            <li class="page-item ${offset === totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="nextPage">&raquo;</a>
            </li>
            <li class="page-item ${offset === totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="lastPage">&raquo;&raquo;</a>
            </li>
        `)
    }

    //call API by Ajax and update UI
    async function loadData() {
        const urlParams = new URLSearchParams(window.location.search)
        const params = Object.fromEntries(urlParams.entries())
        const apiQuery = $.param(params)
        await $.ajax({
            url: `/api/users?${apiQuery}`,
            type: 'GET',
            statusCode: {
                200(resp) {
                    users = resp.data
                    totalItems = resp.total
                    totalPages = Math.ceil(totalItems / limit)
                },
                500(resp) {
                    console.log(resp.responseJSON)
                },
            },
        })

        // Clear current table data
        $('#accountsTable').empty()

        if (!users || users.length == 0) {
            const columnCount = $('.table thead th').length
            $('#accountsTable').append(
                `<tr><td class="text-center" colspan="${columnCount}">Không có dữ liệu</td></tr>`
            )
            return
        }

        // Add new data
        users.forEach((user) => {
            $('#accountsTable').append(`
                <tr data-user-id="${user.id}">
                    <td>
                        <img src="${user.avatar}" alt="Avatar" class="user-avatar">
                    </td>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>
                        <select class="role-select form-select" ${user.isCurrentUser ? 'disabled' : ''}>
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            <option value="sadmin" ${user.role === 'sadmin' ? 'selected' : ''}>Super Admin</option>
                        </select>
                    </td>
                    <td>
                        <select class="status-select form-select" ${user.isCurrentUser ? 'disabled' : ''}>
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
                            <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Chưa kích hoạt</option>
                            <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Đã khóa</option>
                        </select>
                    </td>
                    <td>${new Date(user.lastLogin).toLocaleString()}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" title="Xem chi tiết" class="btn btn-info btn-sm view-details" data-bs-toggle="modal" data-bs-target="#userDetailsModal">
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
            `)
        })
    }

    // Xử lý sự kiện click pagination
    $('.pagination').on('click', 'a.page-link', async function (e) {
        e.preventDefault()
        const $this = $(this)

        if ($this.parent().hasClass('disabled')) return

        if ($this.attr('id') === 'firstPage') {
            offset = 0
        } else if ($this.attr('id') === 'prevPage') {
            offset--
        } else if ($this.attr('id') === 'nextPage') {
            offset++
        } else if ($this.attr('id') === 'lastPage') {
            offset = totalPages - 1
        } else {
            offset = parseInt($this.data('page'))
        }

        updateQueryParams('offset', offset)
        await refresh()
    })

    // Handle items per page change
    $('#itemsPerPage').change(async function () {
        limit = parseInt($(this).val())
        totalPages = totalItems / limit

        // updatePagination();
        updateQueryParams('limit', limit)
        await refresh()
    })

    function updateQueryParams(key, value) {
        const params = new URLSearchParams(window.location.search)

        if (!value) {
            params.delete(key)
        } else {
            params.set(key, value)
        }

        window.history.pushState(
            {},
            '',
            `${window.location.pathname}?${params.toString()}`
        )
    }

    // Khởi tạo pagination và load data
    async function refresh() {
        await loadData()
        updatePagination()
    }
    refresh()
})
