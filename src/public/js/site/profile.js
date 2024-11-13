import { showToast } from '../common.js';

document.addEventListener('DOMContentLoaded', () => {
    // Các nút chỉnh sửa thông tin cá nhân
    $(".btn-edit-profile").on('click', function () {
        showToast("Error", "This feature is not available yet.");
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

    $(".quick-actions .action-btn").on('click', function () {
        showToast("Warning", "Quick actions are not enabled yet.");
    });
});
