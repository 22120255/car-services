import { showModal } from '../common.js';
import { isEmailValid, isStrongPassword } from '../helpers.js';

document.addEventListener('DOMContentLoaded', function () {
    // Step 1: Send verification code to email
    $('.send-code-button').on("click", function () {
        const email = $('#email').val().trim();

        if (!isEmailValid(email)) {
            $('#email-availability-message').text("Email không hợp lệ");
            return;
        }

        $(this).text("Đang gửi...").prop('disabled', true);
        $.ajax({
            url: '/auth/forgot-password/send-code',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email }),
            statusCode: {
                200() {
                    $('.send-code-button').text("Gửi mã").prop('disabled', false);
                    showModal("Gửi mã thành công", "Mã đã được gửi về email của bạn, vui lòng kiểm tra hộp thư lấy mã!")
                    $('#email-availability-message').text('');
                },
                404(resp) {
                    $('.send-code-button').text("Gửi mã").prop('disabled', false);
                    $('#email-availability-message').text(resp.responseJSON.error);
                },
            }
        });
    });

    // Step 2: Reset password
    $('#reset-password-btn').on("click", function (event) {
        const email = $('#email').val().trim();
        const verificationCode = $('#verification-code').val().trim();
        const password = $('#password').val().trim();
        const confirmPassword = $('#confirm-password').val().trim();
        const messageEle = $('#message-error');

        // Validate inputs
        if (!verificationCode || !password || !confirmPassword || !email) {
            messageEle.text("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        if (!isEmailValid(email)) {
            $('#email-availability-message').text("Email không hợp lệ");
            return;
        }
        if (!isStrongPassword(password)) {
            messageEle.text("Mật khẩu phải có ít nhất 8 ký tự, một chữ in hoa, một chữ in thường. một kí tự đặc biệt và một số");
            return;
        }
        if (password !== confirmPassword) {
            messageEle.text("Mật khẩu nhập lại không khớp");
            return;
        }

        // Call API to reset the password
        $.ajax({
            url: '/auth/reset-password',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, verificationCode, password }),
            statusCode: {
                200() {
                    showModal("Đặt lại mật khẩu", "Mật khẩu đã thay đổi thành công, vui lòng đăng nhập lại!", function () {
                        window.location.href = "/auth/login";
                    })
                },
                400(resp) {
                    console.log(resp.responseJSON);
                    messageEle.text(resp.responseJSON.error);
                }
            }
        });
    });
});