import { isEmailValid } from '../helpers.js'

// Handle event when user click on register button
document.addEventListener('DOMContentLoaded', function () {
    $('#email').on('input', function () {
        const email = $(this).val()
        if (email) {
            if (!isEmailValid(email)) {
                $('#email-availability-message')
                    .text('Email không hợp lệ')
                    .css('color', 'red')
                return
            } else {
                $('#email-availability-message').text('')
            }
            $('#login-btn').prop('disabled', !isEmailValid(email))
        }
    })

    $('#login-form').on('submit', async function (event) {
        event.preventDefault()

        const email = $('#email').val()
        const password = $('#password').val()
        const messageEle = $('#message-error')

        messageEle.text('')

        if (!email || !password) {
            event.preventDefault()
            messageEle.text('Vui lòng điền đầy đủ thông tin')
            return
        }
        try {
            $("#icon-loading").removeClass("d-none");
            await $.ajax({
                url: '/api/auth/login/email/verify',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password }),
                dataType: 'json',
                statusCode: {
                    400(resp) {
                        console.log(resp.responseJSON);
                        messageEle.text(resp.responseJSON.message);
                        return;
                    },
                    401(resp) {
                        console.log(resp.responseJSON);
                        messageEle.text(resp.responseJSON.message);
                        return;
                    },
                    200(resp) {
                        if (resp.redirect) {
                            window.location.href = resp.redirect
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
        } finally {
            $("#icon-loading").addClass("d-none");
        }
    })
})
