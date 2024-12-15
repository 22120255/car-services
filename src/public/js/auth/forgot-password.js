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
            url: '/api/auth/forgot-password/send-code',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email }),
            statusCode: {
                200() {
                    $('.send-code-button').text("Gửi mã").prop('disabled', false);
                    showModal({ title: "Gửi mã thành công", content: "Mã đã được gửi về email của bạn, vui lòng kiểm tra hộp thư lấy mã!" })
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
            messageEle.text("Password must be at least 8 characters, one uppercase letter, one lowercase letter. one special character and one number.");
            return;
        }
        if (password !== confirmPassword) {
            messageEle.text("Re-entered password does not match");
            return;
        }

        // Call API to reset the password
        $.ajax({
            url: '/api/auth/reset-password',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, verificationCode, password }),
            statusCode: {
                200() {
                    showModal({
                        title: "Reset Password", content: "Password changed successfully, please log in again!", callback: function () {
                            window.location.href = "/auth/login";
                        }
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