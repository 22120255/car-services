import { loadCartData, showModal } from '../common.js';
let interval;

document.addEventListener('DOMContentLoaded', async function () {
    let QR = null;
    $.ajax({
        url: '/api/cart/payment/createQR',
        type: 'GET',
        statusCode: {
            200: function (data) {
                QR = data.QR;
                console.log('QR created:', QR);
                $('#qr-code').attr('src', QR);
            },
            500: function () {
                console.log('Server error occurred.');
            }
        }
    })
    const url = window.location.pathname;
    const cartID = url.split('/')[2];
    let cart = await loadCartData();
    const cartTotalPrice = cart.total;
    $('#total-price').text(cartTotalPrice);

    interval = setInterval(() => {
        checkPayment(cartID, cartTotalPrice);
    }, 5000);

});

async function checkPayment(cartID, cartTotalPrice) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxRgM7qKypI3COTSR_DIYKwvMl551J7LO2SOrSarlR_iM2q4pfGPsfq_v5TYt2EH3QC/exec');
        const data = await response.json();
        const lastPayment = data.data[data.data.length - 1];
        const lastPaymentAmount = lastPayment['Giá trị'];
        const lastPaymentInfo = lastPayment['Mô tả'];
        // console.log('Last payment:', lastPayment);
        // console.log('Last payment amount:', lastPaymentAmount);
        // console.log('Last payment info:', lastPaymentInfo);

        if (lastPaymentAmount == cartTotalPrice && lastPaymentInfo.includes(cartID)) {
            clearInterval(interval);
            const response = await fetch(`/api/cart/update/status/${cartID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isPaid: true
                })
            });
            if (response.status === 200) {
                console.log('Payment successful!');
                showModal('Successful', 'Your transaction is successful. Thank you for buying our products', function () {
                    window.location.href = '/';
                });
            }
        }
    } catch (error) {
        console.log('Server error occurred.', error);
    }
}