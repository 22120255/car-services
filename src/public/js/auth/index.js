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
                url: "/api/auth/register/google/store",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    fullName: user.displayName,
                    avatar: user.photoURL,
                }),
                statusCode: {
                    500(message) {
                        console.log("Error when login with Google: ", message);
                        showToast("Error", "Login failed, please try again later!")
                    },
                    200(resp) {
                        console.log("resp:", resp)
                        window.location.href = resp.redirect;
                    }
                }
            });
        } catch (error) {
            if (error.statusCode === 500) return;

            if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
                showToast("Error", "You have cancelled login!");
                return;
            }
            console.log(error)
            showToast("Error", "Login failed, please try again later!")
        }
    });
});

// Handle event when user click on register button with Facebook
document.addEventListener("DOMContentLoaded", function () {
    $(".btn-register-facebook").on("click", async function () {
        try {
            const user = await signInWithFacebook();
            await $.ajax({
                url: "/api/auth/register/facebook/store",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    fullName: user.displayName,
                    avatar: user.photoURL,
                }),
                statusCode: {
                    500(message) {
                        console.log("Error when login with Facebook: ", message);
                        showToast("Error", "Login failed, please try again later!")
                    },
                    200(resp) {
                        window.location.href = resp.redirect;
                    }
                }
            });
        } catch (error) {
            if (error.statusCode === 500) return;
            if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
                showToast("Error", "You have cancelled login!");
                return;
            }
            console.log(error)
            showToast("Error", "Login failed, please try again later!")
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    $('.btn-back').on('click', function (e) {
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = `/${urlParams.get("returnTo")}` || '/dashboard';
        console.log("rt", returnTo)
        window.location.href = returnTo;
    });
}); 