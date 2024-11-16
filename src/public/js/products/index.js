const filterForm = $('#filterForm')
const filterInputs = $('#filterForm select, filterForm input')
const clearQuery = $('#clearQuery')
const pageLink = $('.pagination .page-link')
const btnSearch = $('#btn-search')
const inputSearch = $('input[name="search"]')
const searchInform = $('#search-inform')

function handleFilterChange(pageValue = '1') {
    const priceValue = $('select[name="price"]').val()
    const [priceMin, priceMax] = priceValue ? priceValue.split('-') : ['', '']
    const year = $('select[name="year"]').val()
    const category = $('select[name="category"]').val()
    const brand = $('select[name="brand"]').val()
    const status = $('select[name="status"]').val()
    const transmission = $('select[name="transmission"]').val()
    const perPage = $('select[name="perPage"]').val()
    const currentPage = pageValue
    const search = $('input[name="search"]').val()

    localStorage.setItem('priceMin', priceMin)
    localStorage.setItem('priceMax', priceMax)
    localStorage.setItem('year', year)
    localStorage.setItem('category', category)
    localStorage.setItem('brand', brand)
    localStorage.setItem('status', status)
    localStorage.setItem('transmission', transmission)
    localStorage.setItem('perPage', perPage)
    localStorage.setItem('search', search)

    const url = new URL(window.location.origin + '/products')
    if (priceMin && priceMax) {
        url.searchParams.append('priceMin', priceMin)
        url.searchParams.append('priceMax', priceMax)
    }
    if (year) {
        url.searchParams.append('year', year)
    }
    if (category) {
        url.searchParams.append('category', category)
    }
    if (brand) {
        url.searchParams.append('brand', brand)
    }
    if (status) {
        url.searchParams.append('status', status)
    }
    if (transmission) {
        url.searchParams.append('transmission', transmission)
    }
    if (perPage) {
        url.searchParams.append('perPage', perPage)
    }
    if (currentPage) {
        url.searchParams.append('page', currentPage)
    }
    if (search) {
        url.searchParams.append('search', search)
    }

    window.location.href = url.toString()
}

// Xử lí các sự kiện

filterInputs.on('change', function (e) {
    e.preventDefault()
    const page = '1'
    handleFilterChange(page)
})

$(document).on('click', '.pagination .page-link', function (e) {
    e.preventDefault()
    const page = $(this).attr('value')
    if (page) {
        handleFilterChange(page)
    }
})

inputSearch.on('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault()
    }
})

btnSearch.on('click', function (e) {
    e.preventDefault()
    handleFilterChange()
})

$(document).ready(function () {
    const priceMin = localStorage.getItem('priceMin')
    const priceMax = localStorage.getItem('priceMax')
    const year = localStorage.getItem('year')
    const category = localStorage.getItem('category')
    const brand = localStorage.getItem('brand')
    const status = localStorage.getItem('status')
    const transmission = localStorage.getItem('transmission')
    const perPage = localStorage.getItem('perPage')
    const search = localStorage.getItem('search')

    if (priceMin && priceMax) {
        $('select[name="price"]').val(`${priceMin}-${priceMax}`)
    }
    if (year) {
        $('select[name="year"]').val(year)
    }
    if (category) {
        $('select[name="category"]').val(category)
    }
    if (brand) {
        $('select[name="brand"]').val(brand)
    }
    if (status) {
        $('select[name="status"]').val(status)
    }
    if (transmission) {
        $('select[name="transmission"]').val(transmission)
    }
    if (search) {
        $('input[name="search"]').val(search)
    }
})

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
