import { loadCartData, showModal } from '../common.js';

let interval;

const createQr = async () => {
  let QR = null;
  $('.modal-body #icon-loading').removeClass('d-none');

  $.ajax({
    url: '/api/cart/payment/createQR',
    type: 'GET',
    statusCode: {
      200: function (data) {
        QR = data.QR;
        console.log('Received QR:', data.QR);
        $('#qr-code').attr('src', QR);
        $('.modal-body img').removeClass('d-none');
      },
      500: function () {
        console.log('Server error occurred.');
      },
    },
  }).always(function () {
    $('.modal-body #icon-loading').addClass('d-none');
  });

  let cart = await loadCartData();
  const cartTotalPrice = cart.total;

  $('.modal-body #total-price').text(cartTotalPrice);

  interval = setInterval(() => {
    checkPayment(cart._id, cartTotalPrice);
  }, 5000);
};

async function checkPayment(cartID, cartTotalPrice) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxRgM7qKypI3COTSR_DIYKwvMl551J7LO2SOrSarlR_iM2q4pfGPsfq_v5TYt2EH3QC/exec');
    const data = await response.json();
    const lastPayment = data.data[data.data.length - 1];
    const lastPaymentAmount = lastPayment['Giá trị'];
    const lastPaymentInfo = lastPayment['Mô tả'];

    if (lastPaymentAmount == cartTotalPrice && lastPaymentInfo.includes(cartID)) {
      clearInterval(interval);
      const response = await fetch(`/api/cart/update/status/${cartID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPaid: true,
        }),
      });
      if (response.status === 200) {
        console.log('Payment successful!');
        showModal({
          title: 'Successful', content: 'Your transaction is successful. Thank you for buying our products', callback() {
            window.location.href = '/';
          }
        });
      }
    }
  } catch (error) {
    console.log('Server error occurred.', error);
  }
}

export { createQr };
