const clearQuery = $('#clearQuery')
clearQuery.on('click', function (event) {
    event.preventDefault()
    localStorage.removeItem('year')
    localStorage.removeItem('category')
    localStorage.removeItem('brand')
    localStorage.removeItem('status')
    localStorage.removeItem('transmission')
    localStorage.removeItem('priceMin')
    localStorage.removeItem('priceMax')
    localStorage.removeItem('perPage')
    localStorage.removeItem('search')
    window.location.href = '/products'
})
