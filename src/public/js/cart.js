document.addEventListener('DOMContentLoaded', function(){
    let cart = null;
    async function loadData() {
        await $.ajax({
            url: '/api/cart/data',
            type: 'GET',
            statusCode: {
                200: function (data) {
                    cart = data;
                    console.log(data);
                },
                404: function (data) {
                    console.log(1);
                    console.log(data);
                },
                500: function (data) {
                    console.log(data);       
                }
            }
        });
        renderCartTable(cart);
    }

    function renderCartTable(cart) {
        let items = cart.items;
        let tableContent = '';
        let totalPrice = 0;
        if (items.length > 0) {
            tableContent += `<thead>
                  <tr>
                    <!-- Set columns width -->
                    <th class="text-center py-3 px-4" style="min-width: 400px;">Product Name &amp; Details</th>
                    <th class="text-right py-3 px-4" style="width: 100px;">Price</th>
                    <th class="text-center py-3 px-4" style="width: 120px;">Quantity</th>
                    <th class="text-right py-3 px-4" style="width: 100px;">Total</th>
                    <th class="text-center align-middle py-3 px-0" style="width: 40px;"><a href="#" class="shop-tooltip float-none text-light" title="" data-original-title="Clear cart"><i class="ino ion-md-trash"></i></a></th>
                  </tr>
                </thead>`;
        }
        $('#cart-table').empty(); // Clear the table content before appending new content
        items.forEach(item => {
            tableContent += `
                <tr>
                <td class="p-4">
                    <div class="media align-items-center">
                    
                        <div class="media-body">
                            <a href="#" class="d-block text-dark">${item.name}</a>
                        </div>
                    </div>
                </td>
                <td class="text-right font-weight-semibold align-middle p-4">$${item.price.toFixed(2)}</td>
                <td class="align-middle p-4"><input type="text" class="form-control text-center" value="${item.quantity}"></td>
                <td class="text-right font-weight-semibold align-middle p-4">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="text-center align-middle px-0">
                    <a href="#" class="shop-tooltip close float-none text-danger remove-item" data-id="${item.productId}" title="Remove">×</a>
                </td>
            </tr>
            `;
            totalPrice += item.price * item.quantity;
        });
        $('#total-price').html(`<b>$${totalPrice.toFixed(2)}`);
        $('#cart-table').append(tableContent);
    }
    loadData();
});