function handleFilterChange(pageValue = '1') {
    // Lấy giá trị từ các input và select
    const priceValue = $('select[name="price"]').val()
    const [priceMin, priceMax] = priceValue ? priceValue.split('-') : ['', '']
    const year = $('select[name="year"]').val()
    const category = $('select[name="category"]').val()
    const brand = $('select[name="brand"]').val()
    const status = $('select[name="status"]').val()
    const transmission = $('select[name="transmission"]').val()
    const limit = $('select[name="limit"]').val()
    const currentPage = pageValue
    const search = $('input[name="search"]').val()

    const url = new URL(window.location.origin + '/products')

    if (priceMin && priceMax) {
        url.searchParams.set('priceMin', priceMin)
        url.searchParams.set('priceMax', priceMax)
    }
    if (year) {
        url.searchParams.set('year', year)
    }
    if (category) {
        url.searchParams.set('category', category)
    }
    if (brand) {
        url.searchParams.set('brand', brand)
    }
    if (status) {
        url.searchParams.set('status', status)
    }
    if (transmission) {
        url.searchParams.set('transmission', transmission)
    }

    // Nếu chỉ có tìm kiếm, không đính kèm limit và page
    if (
        search &&
        !priceMin &&
        !priceMax &&
        !year &&
        !category &&
        !brand &&
        !status &&
        !transmission
    ) {
        if (search) {
            url.searchParams.set('search', search)
        }
    } else {
        if (limit) {
            url.searchParams.set('limit', limit)
        }
        if (currentPage) {
            url.searchParams.set('page', currentPage)
        }
        if (search) {
            url.searchParams.set('search', search)
        }
    }

    window.location.href = url.toString()
}

// Xử lý sự kiện thay đổi bộ lọc
document.addEventListener('DOMContentLoaded', function () {
    // Khi người dùng thay đổi bộ lọc
    $('#filterForm select, filterForm input').on('change', function (e) {
        e.preventDefault()
        const page = '1'
        handleFilterChange(page)
    })

    // Xử lý sự kiện phân trang
    $(document).on('click', '.pagination .page-link', function (e) {
        e.preventDefault()
        const page = $(this).attr('value')
        if (page) {
            handleFilterChange(page)
        }
    })

    // Xử lý sự kiện tìm kiếm
    $('input[name="search"]').on('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleFilterChange()
        }
    })

    $('#btn-search').on('click', function (e) {
        e.preventDefault()
        handleFilterChange()
    })
})

// Giữ lại các giá trị bộ lọc đã chọn khi trang được tải lại
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search)

    // Giữ lại giá trị các bộ lọc từ URL
    if (params.has('priceMin') && params.has('priceMax')) {
        $('select[name="price"]').val(
            `${params.get('priceMin')}-${params.get('priceMax')}`
        )
    }
    if (params.has('year')) {
        $('select[name="year"]').val(params.get('year'))
    }
    if (params.has('category')) {
        $('select[name="category"]').val(params.get('category'))
    }
    if (params.has('brand')) {
        $('select[name="brand"]').val(params.get('brand'))
    }
    if (params.has('status')) {
        $('select[name="status"]').val(params.get('status'))
    }
    if (params.has('transmission')) {
        $('select[name="transmission"]').val(params.get('transmission'))
    }
    if (params.has('limit')) {
        $('select[name="limit"]').val(params.get('limit'))
    }
    if (params.has('search')) {
        $('input[name="search"]').val(params.get('search'))
    }

    // Xử lý sự kiện "clear filter" để reset tất cả bộ lọc
    $('#clearQuery').on('click', function (event) {
        event.preventDefault()
        const url = new URL(window.location.origin + '/products')
        window.location.href = url.toString()
    })
})
