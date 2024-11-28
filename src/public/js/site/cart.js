

document.addEventListener('DOMContentLoaded', function(){
    let cart = null;
    async function loadData() {
        await $.ajax({
            url: '/cart/data',
            type: 'GET',
            statusCode: {
                200: function (data) {
                    cart = data;
                    console.log(data);
                },
                404: function (data) {
                    console.log(data);
                },
                500: function (data) {
                    console.log(data);
                }
            }
        });
    }
});