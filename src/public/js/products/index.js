// Lắng nghe sự thay đổi trên tất cả các phần tử trong form (select, input)
const filterForm = document.getElementById('filterForm')
const filterInputs = document.querySelectorAll(
    '#filterForm select, #filterForm input'
)
const clearQuery = document.getElementById('clearQuery')

// Hàm xử lý khi có sự thay đổi giá trị trong form
function handleFilterChange() {
    const priceValue = document.querySelector('select[name="price"]').value
    const [priceMin, priceMax] = priceValue ? priceValue.split('-') : ['', '']
    const year = document.querySelector('select[name="year"]').value
    const category = document.querySelector('select[name="category"]').value
    const brand = document.querySelector('select[name="brand"]').value
    const status = document.querySelector('select[name="status"]').value
    const transmission = document.querySelector(
        'select[name="transmission"]'
    ).value
    const perPage = document.querySelector('select[name="perPage"]').value

    // Lưu giá trị của các trường vào LocalStorage
    localStorage.setItem('priceMin', priceMin)
    localStorage.setItem('priceMax', priceMax)
    localStorage.setItem('year', year)
    localStorage.setItem('category', category)
    localStorage.setItem('brand', brand)
    localStorage.setItem('status', status)
    localStorage.setItem('transmission', transmission)
    localStorage.setItem('perPage', perPage)

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

    // Chuyển hướng đến URL đã tối giản
    window.location.href = url.toString()
}

// Lắng nghe sự kiện 'change' cho tất cả các phần tử trong form (select và input)
filterInputs.forEach((input) =>
    input.addEventListener('change', handleFilterChange)
)

// Khi tải trang, tự động điền các giá trị từ LocalStorage vào form (nếu có)
window.onload = function () {
    const priceMin = localStorage.getItem('priceMin')
    const priceMax = localStorage.getItem('priceMax')
    const year = localStorage.getItem('year')
    const category = localStorage.getItem('category')
    const brand = localStorage.getItem('brand')
    const status = localStorage.getItem('status')
    const transmission = localStorage.getItem('transmission')
    const perPage = localStorage.getItem('perPage')

    // Điền lại giá trị vào các trường input
    if (priceMin && priceMax) {
        document.querySelector('select[name="price"]').value =
            `${priceMin}-${priceMax}`
    }
    if (year) {
        document.querySelector('select[name="year"]').value = year
    }
    if (category) {
        document.querySelector('select[name="category"]').value = category
    }
    if (brand) {
        document.querySelector('select[name="brand"]').value = brand
    }
    if (status) {
        document.querySelector('select[name="status"]').value = status
    }
    if (transmission) {
        document.querySelector('select[name="transmission"]').value =
            transmission
    }
    if (perPage) {
        document.querySelector('select[name="perPage"]').value = perPage
    }
}

clearQuery.addEventListener('click', function (event) {
    event.preventDefault()
    // Xóa dữ liệu bộ lọc trong localStorage
    localStorage.removeItem('year')
    localStorage.removeItem('category')
    localStorage.removeItem('brand')
    localStorage.removeItem('status')
    localStorage.removeItem('transmission')
    localStorage.removeItem('priceMin')
    localStorage.removeItem('priceMax')
    localStorage.removeItem('perPage')
    // Điều hướng đến trang sản phẩm mà không có query parameters
    window.location.href = '/products'
})
