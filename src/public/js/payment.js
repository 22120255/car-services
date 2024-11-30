require('dotenv').config();
document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const amount = cart.total;
    let QR = `https://img.vietqr.io/image/${process.env.BANK_ID}-${process.env.ACCOUNT_NO}-compact2.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>`;
});