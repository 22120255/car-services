import { loadCartData } from '../js/loadCartData.js';
let interval;

document.addEventListener('DOMContentLoaded', async function() {
    let QR = null;
    $.ajax({
        url: '/api/payment/createQR',
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
        console.log('Last payment:', lastPayment);
        console.log('Last payment amount:', lastPaymentAmount);
        console.log('Last payment info:', lastPaymentInfo);
        
        if (lastPaymentAmount == cartTotalPrice && lastPaymentInfo.includes(cartID)) {
            console.log('Payment successful!');
            clearInterval(interval);
            alert('Payment successful!'); 
            // Fetch api để cập nhật trạng thái thanh toán của cart 
        }
    } catch (error) {
        console.log('Server error occurred.', error);
    }
}