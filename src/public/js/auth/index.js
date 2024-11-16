//logic chung cho cả login và register sẽ được viét ở đây 
import { showToast } from "../common.js";
import { signInWithFacebook, signInWithGoogle } from "./firebase/index.js";

document.addEventListener('DOMContentLoaded', function () {
    $("#show-password").on('click', function () {
        const passwordInput = $('#password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).children().toggleClass('fa-eye-slash').toggleClass('fa-eye');
    });
    $("#show-confirm-password").on('click', function () {
        const passwordInput = $('#confirm-password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).children().toggleClass('fa-eye-slash').toggleClass('fa-eye');
    });
})
// Handle event when user click on register button with Google
document.addEventListener("DOMContentLoaded", function () {
    $(".btn-register-google").on("click", async function () {
        try {
            const user = await signInWithGoogle();

            await $.ajax({
                url: "/auth/register/google/store",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    fullName: user.displayName,
                    avatar: user.photoURL,
                }),
                statusCode: {
                    200(message) {
                        console.log(message);
                        window.location.href = "/dashboard"
                    },
                    500(message) {
                        showToast("Error", "Đăng nhập không thành công, vui lòng thử lại sau!")
                    }
                }
            });
        } catch (error) {
            if (error.statusCode === 500) return;
            console.log(error)
            showToast("Error", "Đăng nhập không thành công, vui lòng thử lại sau!")
        }
    });
});

// Handle event when user click on register button with Facebook
document.addEventListener("DOMContentLoaded", function () {
    $(".btn-register-facebook").on("click", async function () {
        try {
            const user = await signInWithFacebook();
            await $.ajax({
                url: "/auth/register/facebook/store",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    fullName: user.displayName,
                    avatar: user.photoURL,
                }),
                statusCode: {
                    200(message) {
                        console.log(message);
                        window.location.href = "/dashboard"
                    },
                    500(message) {
                        showToast("Error", "Đăng nhập không thành công, vui lòng thử lại sau!")
                    }
                }
            });
        } catch (error) {
            if (error.statusCode === 500) return;
            console.log(error)
            showToast("Error", "Đăng nhập không thành công, vui lòng thử lại sau!")
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    if (document.referrer && !document.referrer.includes('/auth/')) {
        sessionStorage.setItem('previousPage', document.referrer);
    }

    $('#btn-back').on('click', function (e) {
        e.preventDefault();
        const previousPage = sessionStorage.getItem('previousPage');

        if (previousPage && !previousPage.includes('/auth/')) {
            window.location.href = previousPage;
        } else {
            window.location.href = '/dashboard';
        }
    });
}); 