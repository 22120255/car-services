import { showModal } from '../common.js';
import { isStrongPassword, isEmailValid } from '../helpers.js'

// Handle event when user click on register button
document.addEventListener('DOMContentLoaded', function () {
    let debounceTimeout;
    $('#email').on('input', function () {
        const email = $(this).val();
        if (email) {
            if (!isEmailValid(email)) {
                $('#email-availability-message').text("Invalid email").css("color", "red");
                $('#login-btn').prop('disabled', true);
                return;
            }

            try {
                // Only call API when user stop typing after 500ms
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(async function () {
                    try {
                        const resp = await $.ajax({
                            url: '/api/auth/check-email',
                            type: 'GET',
                            data: { email },
                            dataType: 'json'
                        });

                        if (resp.isAvailable) {
                            $('#email-availability-message').text("Email available").css("color", "green");
                        } else {
                            $('#email-availability-message').text("Email already in use").css("color", "red");
                        }
                        $('#login-btn').prop('disabled', !resp.isAvailable);

                    } catch (error) {
                        $('#email-availability-message').text("There was an error checking email.");
                    }
                }, 500);

            } catch (error) {
                $('#email-availability-message').text("There was an error checking email.");
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
            messageEle.text("Please fill in all information");
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

        try {
            $("#icon-loading").removeClass("d-none");
            await $.ajax({
                url: '/api/auth/register/email/store',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password, fullName }),
                dataType: 'json',
                statusCode: {
                    200() {
                        showModal("Registration successful", "Your account has been created successfully, please check your inbox to activate your account!",
                            function () {
                                window.location.href = "/auth/login";
                            }
                        )
                    },
                    400(resp) {
                        console.log(resp.responseJSON);
                        messageEle.text("Registration failed, please try again.");
                    }
                }
            });
        } catch (error) {
            if (error.status === 400) return;

            const result = error.responseJSON || {};
            console.error(error);
            alert(result.error || "Registration failed, please try again.");
        } finally {
            $("#icon-loading").addClass("d-none");
        }
    });
})
