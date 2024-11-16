import { showModal } from '../common.js';
import { isStrongPassword, isEmailValid } from '../helpers.js'

// Handle event when user click on register button
document.addEventListener('DOMContentLoaded', function () {
    let debounceTimeout;
    $('#email').on('input', function () {
        const email = $(this).val();
        if (email) {
            if (!isEmailValid(email)) {
                $('#email-availability-message').text("Email không hợp lệ").css("color", "red");
                $('#login-btn').prop('disabled', true);
                return;
            }

            try {
                // Only call API when user stop typing after 500ms
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(async function () {
                    try {
                        const resp = await $.ajax({
                            url: '/auth/check-email',
                            type: 'GET',
                            data: { email },
                            dataType: 'json'
                        });

                        if (resp.isAvailable) {
                            $('#email-availability-message').text("Email khả dụng").css("color", "green");
                        } else {
                            $('#email-availability-message').text("Email đã được sử dụng").css("color", "red");
                        }
                        $('#login-btn').prop('disabled', !resp.isAvailable);

                    } catch (error) {
                        $('#email-availability-message').text("Có lỗi khi kiểm tra email");
                    }
                }, 500);

            } catch (error) {
                $('#email-availability-message').text("Có lỗi khi kiểm tra email");
            }
        }
    });

    $('.login-btn').on('click', async function () {
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const confirmPassword = $('#confirm-password').val().trim();
        const fullName = $('#fullName').val().trim();
        const messageEle = $('#message-error');

        messageEle.text('');

        if (!email || !password || !confirmPassword || !fullName) {
            messageEle.text("Vui lòng điền đầy đủ thông tin");
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

        try {
            $("#icon-loading").removeClass("d-none");
            await $.ajax({
                url: '/auth/register/email/store',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password, fullName }),
                dataType: 'json',
                statusCode: {
                    200() {
                        showModal("Đăng ký thành công", "Tài khoản của bạn đã được tạo thành công, vui lòng kiểm tra hộp thư để kích hoạt tài khoản!",
                            function () {
                                window.location.href = "/dashboard";
                            }
                        )
                    },
                    400(resp) {
                        console.log(resp.responseJSON);
                        messageEle.text("Đăng ký không thành công, vui lòng thử lại.");
                    }
                }
            });
        } catch (error) {
            if (error.status === 400) return;

            const result = error.responseJSON || {};
            console.error(error);
            alert(result.error || "Đăng ký không thành công, vui lòng thử lại.");
        } finally {
            $("#icon-loading").addClass("d-none");
        }
    });
})
