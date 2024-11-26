import { showToast } from '../common.js';

document.addEventListener('DOMContentLoaded', () => {
    // Các nút chỉnh sửa thông tin cá nhân
    $(".btn-edit-profile").on('click', function () {
        $('.edit-profile-form').show();
        $('.profile-info').hide();
    });

    $('#cancel-edit').on('click', function () {
        $('.edit-profile-form').hide();
        $('.profile-info').show();
    });
    // Handle save changes button edit profile
    $('#edit-profile-form').on('submit', async function (event) {
        event.preventDefault();

        const formData = $(this).serializeArray();
        const data = {
            id: user.id
        };
        $.each(formData, function (value, field) {
            data[field.name] = field.value;
        });

        try {
            await $.ajax({
                url: '/api/users',
                type: 'PATCH',
                contentType: 'application/json',
                data: JSON.stringify(data),
                statusCode: {
                    200(updatedUser) {
                        $('.profile-name').text(updatedUser.fullName);
                        $('.profile-email').text(updatedUser.email);
                        $('#phone-user').text(updatedUser.metadata.phone);
                        $('#address-user').text(updatedUser.metadata.address);
                        $('.edit-profile-form').hide();
                        $('.profile-info').show();
                        showToast('Success', 'Profile updated successfully');
                    }
                }
            });
        } catch (error) {
            console.log(error)
            showToast('Error', 'Failed to update profile');
        }
    });

    $(".btn-change-password").on('click', function () {
        showToast("Error", "This feature is not available yet.");
    });

    $(".btn-account-settings").on('click', function () {
        showToast("Error", "This feature is not available yet.");
    });

    // Nút trong mục "Car Management"
    $(".action-btn").on('click', function () {
        const action = $(this).text().trim();
        showToast("Warning", `The ${action} feature is under development.`);
    });

    // Nút xem chi tiết xe trong mục "My Cars"
    $(".car-item .btn-primary").on('click', function () {
        showToast("Info", "Car details are currently unavailable.");
    });

    // Thông báo khi người dùng nhấn vào các nút trong mục "Quick Actions" hoặc "Admin Dashboard"
    $(".admin-dashboard .stat-card").on('click', function () {
        showToast("Warning", "Admin dashboard feature is in progress.");
    });
});
// Display button when click on avatar
document.addEventListener("DOMContentLoaded", function () {
    const $tooltipButton = $('#avatar-btn');

    const tooltip = new bootstrap.Tooltip($tooltipButton[0], {
        trigger: 'manual'
    });

    $tooltipButton.on('click', function (e) {
        if ($(e.target).is('img')) {
            tooltip.show();
        }
    });

    $(document).on('click', '#change-avatar-btn', function () {
        $('#avatar-input').click();
    });

    $('#avatar-input').on('change', async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Error', 'Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('Error', 'Image size should not exceed 5MB');
            return;
        }

        const tooltip = bootstrap.Tooltip.getInstance($('#avatar-btn')[0]);
        if (tooltip) {
            tooltip.hide();
        }
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('userId', user.id)

        $.ajax({
            url: '/api/users/avatar/store',
            type: 'PATCH',
            data: formData,
            processData: false,
            contentType: false,
            statusCode: {
                200(data) {
                    $('.profile-avatar').attr('src', data.avatarUrl);
                    showToast('Success', 'Avatar updated successfully');
                },
                500(error) {
                    showToast('Error', 'Failed to update avatar');
                }
            },
        });
    });

    $tooltipButton.on('shown.bs.tooltip', function () {
        $('.tooltip .btn-primary').on('click', function () {
            showToast("Info", "Avatar change feature is not available yet");
            tooltip.hide();
        });
    });
})