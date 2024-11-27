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
        event.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();
        const messageEle = $('#message-error');

        messageEle.text('');

        if (!email || !password) {
            event.preventDefault();
            messageEle.text("Vui lòng điền đầy đủ thông tin");
            return;
        }
        try {
<<<<<<< HEAD
            await $.ajax({
                url: '/auth/login/email/verify',
=======
            $("#icon-loading").removeClass("d-none");
            await $.ajax({
                url: '/api/auth/login/email/verify',
>>>>>>> 2d70c205cb39e31b5deb5e19f7c39d6534d6a278
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password }),
                dataType: 'json',
                statusCode: {
<<<<<<< HEAD
                    400: function (resp) {
=======
                    400(resp) {
>>>>>>> 2d70c205cb39e31b5deb5e19f7c39d6534d6a278
                        console.log(resp.responseJSON);
                        messageEle.text(resp.responseJSON.message);
                        return;
                    },
<<<<<<< HEAD
                    401: function (resp) {
=======
                    401(resp) {
>>>>>>> 2d70c205cb39e31b5deb5e19f7c39d6534d6a278
                        console.log(resp.responseJSON);
                        messageEle.text(resp.responseJSON.message);
                        return;
                    },
<<<<<<< HEAD
                    200: function () {
                        window.location.href = "/dashboard";
=======
                    200(resp) {
                        if (resp.redirect) {
                            window.location.href = resp.redirect;
                        }
>>>>>>> 2d70c205cb39e31b5deb5e19f7c39d6534d6a278
                    }
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
<<<<<<< HEAD
=======
        } finally {
            $("#icon-loading").addClass("d-none");
>>>>>>> 2d70c205cb39e31b5deb5e19f7c39d6534d6a278
        }
    });
})

