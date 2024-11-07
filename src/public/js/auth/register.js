

function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}
async function checkEmailAvailability(email) {
    return $.ajax({
        url: '/auth/check-email',
        type: 'GET',
        data: { email },
        dataType: 'json'
    });
}
document.addEventListener('DOMContentLoaded', function () {
    $("#show-password").on('click', function () {
        const passwordInput = $('#password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).children().toggleClass('fa-eye-slash').toggleClass('fa-eye');
    });
    $("#show-re-password").on('click', function () {
        const passwordInput = $('#re-password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).children().toggleClass('fa-eye-slash').toggleClass('fa-eye');
    });
})
// Handle event when user click on register button
document.addEventListener('DOMContentLoaded', function () {
    $('#email').on('input', function () {
        const email = $(this).val();
        if (email) {
            checkEmailAvailability(email).done(function (result) {
                if (result.isAvailable) {
                    $('#email-availability-message').text("Email khả dụng").css("color", "green");
                } else {
                    $('#email-availability-message').text("Email đã được sử dụng").css("color", "red");
                }
            }).fail(function () {
                $('#email-availability-message').text("Có lỗi khi kiểm tra email");
            });
        }
    });

    $('.login-btn').on('click', async function () {
        const email = $('#email').val();
        const password = $('#password').val();
        const rePassword = $('#re-password').val();
        const fullName = $('#fullName').val();
        const messageEle = $('#message-error');

        messageEle.text('');

        if (!email || !password || !rePassword || !fullName) {
            messageEle.text("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (!isStrongPassword(password)) {
            messageEle.text("Mật khẩu phải có ít nhất 8 ký tự, một chữ in hoa, một chữ in thường. một kí tự đặc biệt và một số");
            return;
        }

        if (password !== rePassword) {
            messageEle.text("Mật khẩu nhập lại không khớp");
            return;
        }

        try {
            const result = await checkEmailAvailability(email);
            if (!result.isAvailable) {
                messageEle.text("Email này đã được sử dụng. Vui lòng chọn email khác");
                return;
            }

            const response = await $.ajax({
                url: '/auth/register/email/store',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password, fullName }),
                dataType: 'json'
            });

            $('#successModal').modal('show').css("background-color", "rgba(0, 0, 0, 0.4)");

            $('#successModal').on('hidden.bs.modal', function () {
                window.location.href = "/dashboard";
            });
        } catch (error) {
            const result = error.responseJSON || {};
            console.error(error);
            // alert(result.error || "Đăng ký không thành công, vui lòng thử lại.");

        }
    });
})

// // Handle event when user click on register button with Google
// document.addEventListener("DOMContentLoaded", function () {
//     $(".btn-register-google").on("click", async function () {
//         try {
//             const user = await signInWithGoogle();

//             const response = await $.ajax({
//                 url: "/auth/register/google/store",
//                 type: "POST",
//                 contentType: "application/json",
//                 data: JSON.stringify({
//                     uid: user.uid,
//                     email: user.email,
//                     fullName: user.displayName,
//                     avatar: user.photoURL,
//                 }),
//             });

//             window.location.href = "/dashboard"
//             console.log(response)
//         } catch (error) {
//             console.log(error);
//         }
//     });
// });

// // Handle event when user click on register button with Facebook
// document.addEventListener("DOMContentLoaded", function () {
//     $(".btn-register-facebook").on("click", async function () {
//         try {
//             const user = await signInWithFacebook();
//             console.log("user ", user)
//             const response = await $.ajax({
//                 url: "/auth/register/facebook/store",
//                 type: "POST",
//                 contentType: "application/json",
//                 data: JSON.stringify({
//                     uid: user.uid,
//                     email: user.email,
//                     fullName: user.displayName,
//                     avatar: user.photoURL,
//                 }),
//             });

//             alert("Đăng ký thành công!");
//             console.log(response)
//         } catch (error) {
//             console.log(error);
//         }
//     });
// });