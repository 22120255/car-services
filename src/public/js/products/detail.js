// function changeTab(event, tabId) {
//     event.preventDefault();

import { showToast } from "../common"

//     // Xóa lớp 'active' khỏi tất cả các tab và nội dung tab
//     $('.nav-link').removeClass('active').attr('aria-selected', 'false');
//     $('.tab-pane').removeClass('show active');
//     $(`#${tabId}-tab`).addClass('active').attr('aria-selected', 'true');
//     $(`#${tabId}`).addClass('show active');
// }
document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe sự kiện click vào tab
    $('.add-to-cart').on('click', function (event) {
        event.preventDefault()
        const quantity = 1
        console.log($(this))
        $.ajax({
            url: '/api/cart/add/' + $(this).data('id'),
            type: 'POST',
            data: { quantity },
            success: function (response) {
                console.log(response)
                showToast('success', 'Product added to cart successfully')
            },
            error: function (error) {
                console.log(error)
                showToast('error', 'Error adding product to cart')
            },
        })
    })
})
