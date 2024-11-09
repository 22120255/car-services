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

    $('.login-btn').on('click', async function () {
        const email = $('#email').val();
        const password = $('#password').val();
        const messageEle = $('#message-error');

        messageEle.text('');

        if (!email || !password) {
            messageEle.text("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            $("#icon-loading").removeClass("d-none");
            await $.ajax({
                url: '/auth/login/email/verify',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password }),
                dataType: 'json',
                statusCode: {
                    200() {
                        // Should redirect to the page you were on before logging in (I will do this later)
                        window.location.href = "/dashboard";
                    },
                    401(resp) {
                        messageEle.text(resp.responseJSON.error || "Email hoặc mật khẩu không chính xác");
                    },
                    403(resp) {
                        messageEle.text(resp.responseJSON.error || "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt tài khoản");
                    }
                }
            });
        } catch (error) {
            if (error.status === 401 || error.status === 403) return;

            const result = error.responseJSON || {};
            console.log(result.error);
            messageEle.text(result.error || "Có lỗi xảy ra, vui lòng thử lại sau");
        } finally {
            $("#icon-loading").addClass("d-none");
        }
    });
})

