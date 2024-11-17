document.addEventListener('DOMContentLoaded', function () {
    // Xử lý thay đổi role
    $('.role-select').change(function () {
        const userId = $(this).closest('tr').data('user-id');
        const newRole = $(this).val();

        $.ajax({
            url: '/admin/users/update-role',
            method: 'PATCH',
            data: { userId, role: newRole },
            success: function (response) {
                if (response.success) {
                    showToast('Success', 'Cập nhật vai trò thành công');
                }
            },
            error: function () {
                showToast('Error', 'Không thể cập nhật vai trò');
                // Reset về giá trị cũ
                $(this).prop('selectedIndex', 0);
            }
        });
    });

    // Xử lý thay đổi status
    $('.status-select').change(function () {
        const userId = $(this).closest('tr').data('user-id');
        const newStatus = $(this).val();

        $.ajax({
            url: '/admin/users/update-status',
            method: 'PATCH',
            data: { userId, status: newStatus },
            success: function (response) {
                if (response.success) {
                    showToast('Success', 'Cập nhật trạng thái thành công');
                }
            },
            error: function () {
                showToast('Error', 'Không thể cập nhật trạng thái');
                $(this).prop('selectedIndex', 0);
            }
        });
    });

    // Xử lý xem chi tiết
    $('.view-details').click(function () {
        const userId = $(this).closest('tr').data('user-id');

        $.get(`/admin/users/${userId}/details`, function (data) {
            $('#userDetailsModal .modal-body').html(data);
        });
    });

    // Xử lý xóa user
    $('.delete-user').click(function () {
        const userId = $(this).closest('tr').data('user-id');

        if (confirm('Bạn có chắc muốn xóa tài khoản này?')) {
            $.ajax({
                url: `/admin/users/${userId}`,
                method: 'DELETE',
                success: function (response) {
                    if (response.success) {
                        $(`tr[data-user-id="${userId}"]`).remove();
                        showToast('Success', 'Xóa tài khoản thành công');
                    }
                },
                error: function () {
                    showToast('Error', 'Không thể xóa tài khoản');
                }
            });
        }
    });

    // Xử lý tìm kiếm
    $('#searchInput').on('keyup', function () {
        const searchText = $(this).val().toLowerCase();

        $('#accountsTable tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchText) > -1);
        });
    });

    // Xử lý lọc theo status
    $('#statusFilter').change(function () {
        const status = $(this).val();
        filterTable();
    });

    // Xử lý lọc theo role
    $('#roleFilter').change(function () {
        const role = $(this).val();
        filterTable();
    });

    function filterTable() {
        const status = $('#statusFilter').val();
        const role = $('#roleFilter').val();

        $('#accountsTable tr').each(function () {
            const rowStatus = $(this).find('.status-select').val();
            const rowRole = $(this).find('.role-select').val();

            const statusMatch = !status || rowStatus === status;
            const roleMatch = !role || rowRole === role;

            $(this).toggle(statusMatch && roleMatch);
        });
    }
});
