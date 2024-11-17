import { showModal, showToast } from '../../common.js';

document.addEventListener('DOMContentLoaded', function () {
    // Xử lý thay đổi role
    $('.role-select').change(function () {
        const userId = $(this).closest('tr').data('user-id');
        const newRole = $(this).val();
        const $select = $(this);

        $.ajax({
            url: '/admin/users/update-role',
            method: 'PATCH',
            data: { userId, role: newRole },
            statusCode: {
                200: function (response) {
                    showToast('Success', response.message);
                },
                403: function (response) {
                    showToast('Error', response.error);
                },
                500: function (response) {
                    showToast('Error', response.error);
                    // Reset về giá trị cũ
                    $select.val($select.find('option:selected').val());
                }
            },
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
            statusCode: {
                200: function (response) {
                    showToast('Success', response.message);
                },
                403: function (response) {
                    showToast('Error', response.error);
                },
                500: function (response) {
                    showToast('Error', response.error);
                    $(this).prop('selectedIndex', 0);
                }
            },
        });
    });

    // Xử lý xem chi tiết
    // $('.view-details').click(function () {
    //     const userId = $(this).closest('tr').data('user-id');

    //     $.get(`/admin/users/${userId}/details`, function (data) {
    //         $('#userDetailsModal .modal-body').html(data);
    //     });
    // });

    // Xử lý xóa user
    $('.delete-user').click(function () {
        const userId = $(this).closest('tr').data('user-id');

        showModal("Xoá tài khoản", "Bạn có chắc chắn muốn xóa tài khoản này không?", function () {
            $.ajax({
                url: `/admin/users/${userId}`,
                method: 'DELETE',
                statusCode: {
                    200: function (response) {
                        showToast('Success', response.message);
                        $(`tr[data-user-id=${userId}]`).remove();
                    },
                    403: function (response) {
                        showToast('Error', response.error);
                    },
                    500: function (response) {
                        showToast('Error', response.error);
                    }
                }
            });
        });
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
