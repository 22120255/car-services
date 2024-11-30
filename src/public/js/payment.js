document.addEventListener('DOMContentLoaded', function() {
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
    $('#qr-code').attr('src', QR);
    async function checkPayment() {
        try {
            const response = await fetch('/api/payment/checkPayment');
        }
        catch {

        }
    }
});