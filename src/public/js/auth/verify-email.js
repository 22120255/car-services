import { showModal } from "../common.js";

document.addEventListener('DOMContentLoaded', function () {
    const email = $('#email').text();

    $('#resend-code').on('click', async function () {
        $(this).text("Sending...").prop('disabled', true);
        await $.ajax({
            url: '/api/auth/resend-activation-link',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email }),
            statusCode: {
                200() {
                    $('#resend-code').text("Resend verification email").prop('disabled', false);
                    showModal({ 
                        title: "Code sent successfully", 
                        content: "The code has been resent to your email, please check your inbox to get the code!",
                    })
                },
                400(resp) {
                    $('#resend-code').text("Resend verification email").prop('disabled', false);
                    showModal({ title: "Error", content: resp.responseJSON.error })
                },
                404(resp) {
                    $('#resend-code').text("Resend verification email").prop('disabled', false);
                    showModal({ title: "Error", content: resp.responseJSON.error })
                },
            }
        });
    })
})