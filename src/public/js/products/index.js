const btnSearch = document.querySelector('.model-search-btn')
btnSearch.addEventListener('click', function (event) {
    event.preventDefault() // Ngăn chặn hành động gửi form mặc định

    var priceMin = document.querySelector('input[name="price_min"]').value
    var priceMax = document.querySelector('input[name="price_max"]').value

    localStorage.setItem('priceMin', priceMin)
    localStorage.setItem('priceMax', priceMax)

    if (
        isNaN(priceMin) ||
        isNaN(priceMax) ||
        parseFloat(priceMin) > parseFloat(priceMax)
    ) {
        document.getElementById('price-error').innerHTML =
            'Hãy nhập khoảng phù hợp'
    } else {
        document.getElementById('price-error').innerHTML = ''
        document.getElementById('filterForm').submit()
        console.log('Form submitted')
    }
})

window.onload = function () {
    const priceMin = localStorage.getItem('priceMin')
    const priceMax = localStorage.getItem('priceMax')

    if (priceMin) {
        document.querySelector('input[name="price_min"]').value = priceMin
    }
    if (priceMax) {
        document.querySelector('input[name="price_max"]').value = priceMax
    }
}
