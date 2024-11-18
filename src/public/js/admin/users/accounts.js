import { showModal, showToast } from '../../common.js'

document.addEventListener('DOMContentLoaded', function () {
    // Xử lý thay đổi role
    $(document).on('change', '.role-select', function () {
        const userId = $(this).closest('tr').data('user-id')
        const newRole = $(this).val()
        const $select = $(this)

        $.ajax({
            url: '/admin/users/update-role',
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
            url: '/admin/users/update-status',
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
        $.get(`/admin/users/${userId}/details`, function (data) {
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
                    url: `/admin/users/${userId}`,
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

    // Khôi phục trạng thái UI từ URL params
    const searchText = urlParams.get('search') || ''
    const statusFilter = urlParams.get('status') || ''
    const roleFilter = urlParams.get('role') || ''
    const sortBy = urlParams.get('key') || ''
    const sortOrder = urlParams.get('direction') || 'asc'
    const limit = parseInt(urlParams.get('limit')) || $('#itemsPerPage').val()
    const page = parseInt(urlParams.get('offset'))

    // Set giá trị cho các input từ URL params
    $('#searchInput').val(searchText)
    $('#statusFilter').val(statusFilter)
    $('#roleFilter').val(roleFilter)
    $('#sortBy').val(sortBy)
    $('#sortOrder').val(sortOrder)
    $('#itemsPerPage').val(limit)

    // Xử lý tìm kiếm
    $('#searchInput').on('keyup', function () {
        const searchText = $(this).val().toLowerCase()

        $('#accountsTable tr').filter(function () {
            $(this).toggle(
                $(this).text().toLowerCase().indexOf(searchText) > -1
            )
        })

        updateQueryParams('search', searchText)
    })

    // Xử lý lọc theo status
    $('#statusFilter').change(function () {
        filterTable()
        updateQueryParams('status', $(this).val())
    })

    // Xử lý lọc theo role
    $('#roleFilter').change(function () {
        filterTable()
        updateQueryParams('role', $(this).val())
    })

    // Xử lý sắp xếp
    $('#sortBy, #sortOrder').change(function () {
        const sortBy = $('#sortBy').val()
        const sortOrder = $('#sortOrder').val()
        updateQueryParams('key', sortBy)
        updateQueryParams('direction', sortOrder)

        if (!sortBy) return

        const rows = $('#accountsTable tr').get()

        rows.sort(function (a, b) {
            let aValue, bValue

            switch (sortBy) {
                case 'fullName':
                    aValue = $(a).find('td:eq(1)').text()
                    bValue = $(b).find('td:eq(1)').text()
                    break
                case 'email':
                    aValue = $(a).find('td:eq(2)').text()
                    bValue = $(b).find('td:eq(2)').text()
                    break
                case 'lastLogin':
                    aValue = new Date($(a).find('td:eq(5)').text())
                    bValue = new Date($(b).find('td:eq(5)').text())
                    break
                default:
                    return 0
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        $('#accountsTable').empty().append(rows)
    })

    function filterTable() {
        const status = $('#statusFilter').val()
        const role = $('#roleFilter').val()

        $('#accountsTable tr').each(function () {
            const rowStatus = $(this).find('.status-select').val()
            const rowRole = $(this).find('.role-select').val()

            const statusMatch = !status || rowStatus === status
            const roleMatch = !role || rowRole === role

            $(this).toggle(statusMatch && roleMatch)
        })
    }

    // Xử lý phân trang
    let itemsPerPage = $('#itemsPerPage').val()
    const totalItems = users.length
    let totalPages = Math.ceil(totalItems / itemsPerPage)
    let currentPage = page || 1

    function updatePagination() {
        const $pagination = $('.pagination')
        $pagination.empty()

        // Nút First và Previous
        $pagination.append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="firstPage">&laquo;&laquo;</a>
            </li>
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="prevPage">&laquo;</a>
            </li>
        `)

        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                $pagination.append(`
                    <li class="page-item ${currentPage === i ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `)
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                $pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `)
            }
        }

        // Nút Next và Last
        $pagination.append(`
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" id="nextPage">&raquo;</a>
            </li>
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" id="lastPage">&raquo;&raquo;</a>
            </li>
        `)
    }

    function loadDataForCurrentPage() {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + +itemsPerPage
        const currentPageData = users.slice(startIndex, endIndex)

        // Clear current table data
        $('#accountsTable').empty()

        // Add new data
        currentPageData.forEach((user) => {
            $('#accountsTable').append(`
                <tr data-user-id="${user._id}">
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
                            ${
                                !user.isCurrentUser
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

        // Áp dụng các bộ lọc và sắp xếp hiện tại
        if (searchText) {
            $('#searchInput').trigger('keyup')
        }
        if (statusFilter || roleFilter) {
            filterTable()
        }
        if (sortBy) {
            $('#sortBy, #sortOrder').trigger('change')
        }
    }

    // Xử lý sự kiện click pagination
    $('.pagination').on('click', 'a.page-link', function (e) {
        e.preventDefault()
        const $this = $(this)

        if ($this.parent().hasClass('disabled')) return

        if ($this.attr('id') === 'firstPage') {
            currentPage = 1
        } else if ($this.attr('id') === 'prevPage') {
            currentPage--
        } else if ($this.attr('id') === 'nextPage') {
            currentPage++
        } else if ($this.attr('id') === 'lastPage') {
            currentPage = totalPages
        } else {
            currentPage = parseInt($this.data('page'))
        }

        updatePagination()
        loadDataForCurrentPage()
        updateQueryParams('limit', itemsPerPage)
        updateQueryParams('offset', currentPage)
    })

    // Handle items per page change
    $('#itemsPerPage').change(function () {
        itemsPerPage = parseInt($(this).val())
        totalPages = Math.ceil(totalItems / itemsPerPage)
        currentPage = 1
        updatePagination()
        loadDataForCurrentPage()
        updateQueryParams('limit', itemsPerPage)
        updateQueryParams('offset', currentPage)
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
    function init() {
        updatePagination()
        loadDataForCurrentPage()
    }
    init()
})
