import { isEmailValid } from '../helpers.js';

// Handle event when user click on register button
document.addEventListener('DOMContentLoaded', function () {
    $('#email').on('input', function () {
        const email = $(this).val();
        if (email) {
            if (!isEmailValid(email)) {
                $('#email-availability-message').text("Email không hợp lệ").css("color", "red");
                return;
            } else {
                $('#email-availability-message').text('');
            }
            $('#login-btn').prop('disabled', !isEmailValid(email));
        }
    })

    $('#login-form').on('submit', async function (event) {
        const email = $('#email').val();
        const password = $('#password').val();
        const messageEle = $('#message-error');

        messageEle.text('');

        if (!email || !password) {
            event.preventDefault();
            messageEle.text("Vui lòng điền đầy đủ thông tin");
            return;
        }
    });
})

