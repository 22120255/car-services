async function loadCartData() {
    let cart = null;
    await $.ajax({
        url: '/api/cart/data',
        type: 'GET',
        statusCode: {
            200: function (data) {
                cart = data;
                console.log('Cart loaded:', cart);
            },
            404: function () {
                console.log('Cart data not found.');
            },
            500: function () {
                console.log('Server error occurred.');
            }
        }
    });
    return cart;
}

export { loadCartData };