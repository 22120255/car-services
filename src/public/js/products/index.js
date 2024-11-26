document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search)

    let products = null
    let limit = urlParams.get('limit') || $('#limit').val()
    let offset = parseInt(urlParams.get('offset')) || 1
    let totalPages = null
    let totalItems = null
    let filters = null

    let priceMinFilter = parseFloat(urlParams.get('priceMin')) || null
    let priceMaxFilter = parseFloat(urlParams.get('priceMax')) || null
    let categoryFilter = parseInt(urlParams.get('category')) || null
    let brandFilter = parseInt(urlParams.get('brand')) || null
    let statusFilter = parseInt(urlParams.get('status')) || null
    let transmissionFilter = parseInt(urlParams.get('transmission')) || null
    let searchText = urlParams.get('search') || ''
    let yearFilter = parseInt(urlParams.get('year')) || null

    $('#searchInput').val(searchText)
    $('#limit').val(limit)
    $('#statusFilter').val(statusFilter)
    $('#brandFilter').val(brandFilter)
    $('#categoryFilter').val(categoryFilter)
    $('#transmissionFilter').val(transmissionFilter)
    $('#yearFilter').val(yearFilter)
    $('#price').val(`${priceMinFilter}-${priceMaxFilter}`)

    function setupFilterHandlers(filterElement, paramKey) {
        $(filterElement).on('change', async function () {
            updateQueryParams({ [paramKey]: $(this).val() })
            await refresh()
        })
    }

    // Gọi hàm cho các bộ lọc
    setupFilterHandlers('#statusFilter', 'status')
    setupFilterHandlers('#brandFilter', 'brand')
    setupFilterHandlers('#categoryFilter', 'category')
    setupFilterHandlers('#transmissionFilter', 'transmission')
    setupFilterHandlers('#yearFilter', 'year')

    $('#searchInput').on('keydown', async function (event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            updateQueryParams('search')
        }
    })

    $('#price').on('change', async function () {
        const price = $(this).val()
        const [min, max] = price ? price.split('-') : ['', '']
        updateQueryParams({ priceMin: min, priceMax: max })
        refresh()
    })

    function updatePagination() {
        const $pagination = $('.pagination')
        $pagination.empty()
        // Các nút điều hướng "First" và "Prev"
        $pagination.append(`
            <li class="page-item ${offset === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="firstPage">&laquo;&laquo;</a>
            </li>
            <li class="page-item ${offset === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="prevPage">&laquo;</a>
            </li>
        `)

        // Hiển thị các trang, bao gồm trang đầu, trang cuối và các trang trung gian
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= offset && i <= offset + 2) // Hiển thị trang gần với offset
            ) {
                $pagination.append(`
                    <li class="page-item ${offset === i ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `)
            } else if (i === offset - 1 || i === offset + 1) {
                // Thêm dấu "..."
                $pagination.append(`
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `)
            }
        }

        // Các nút điều hướng "Next" và "Last"
        $pagination.append(`
            <li class="page-item ${offset === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" id="nextPage">&raquo;</a>
            </li>
            <li class="page-item ${offset === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" id="lastPage">&raquo;&raquo;</a>
            </li>
        `)
    }

    // LoadData
    async function loadData() {
        console.log('Hàm loadData đã được gọi')

        const urlParams = new URLSearchParams(window.location.search)
        const params = Object.fromEntries(urlParams.entries())
        const apiQuery = $.param(params)
        await $.ajax({
            url: `/products?${apiQuery}`,
            type: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest', // Thêm header Ajax
            },
            statusCode: {
                200(resp) {
                    console.log('Dữ liệu trả về từ API:', resp) // Kiểm tra xem dữ liệu có trả về không
                    products = resp.products
                    totalItems = resp.total
                    totalPages = Math.ceil(totalItems / limit)
                    filters = resp.filters
                },
                500(resp) {
                    console.error('Lỗi khi tải dữ liệu:', resp)
                },
            },
        })

        console.log('Sản phẩm:', products)
        console.log('Filters:', filters)

        if (filters) {
            renderFilters(filters, params)
        }
        renderProducts(products)
    }
    function renderProducts(products) {
        console.log(1)
        $('#product-list').empty()

        if (!products || products.length === 0) {
            $('#product-list').append(`<div class='col-lg-12'>
                    <div class='find-nothing text-center' >
                            <h2 style = "font-size: large; color: #978e8e">Find nothing!</h2>
                    </div>
                </div>`)
            return
        }

        products.forEach((product) => {
            const { _id, images, status, brand, price, year } = product
            const imageSrc = images?.image1 || '/default-image.jpg' // Sử dụng ảnh mặc định nếu không có ảnh
            $('#product-list').append(`
                <div class='col-lg-3 col-md-4 col-sm-6'>
                <div class='card-product__container'>
                    <div class='card-product__header'>
                        <a href='/products/${_id}'>
                            <img src='${imageSrc}' alt='car' />
                            ${status === 'new' ? `<div class='new-arrival-badge'>New Arrival</div>` : ''}
                        </a>
                    </div>
                    <div class='card-product__body'>
                        <div class='product-header'>
                            <a href='/products/${_id}' class='card-product__brand'>${brand || 'Unknown'}</a>
                            <h3 class='card-product__price'>$${price || '0.00'}</h3>
                        </div>
                        <div class='star-rating'>
                            <span class='star'>★</span>
                            <span class='star'>★</span>
                            <span class='star'>★</span>
                            <span class='star'>★</span>
                            <span class='star star-empty'>★</span>
                            <span class='rating-text'>(4.0)</span>
                        </div>
                    </div>
                    <div class='card-product__footer'>
                        <p>
                            <span class='car-spec-label'>Model: </span>
                            <span class='car-spec-value'>${year || 'N/A'}</span>
                        </p>
                        <a href='/products/${_id}' class='view-details-btn'>View Details</a>
                    </div>
                </div>
                </div>
            `)
        })
    }

    // render filters
    function renderFilters(filters, params) {
        // Xử lý từng loại filter
        const renderSelectOptions = (
            element,
            options,
            selectedValue,
            defaultText
        ) => {
            element.empty().append(`<option value="">${defaultText}</option>`)
            options.forEach((option) => {
                element.append(
                    `<option value="${option.value}" ${
                        selectedValue === option.value ? 'selected' : ''
                    }>${option.name}</option>`
                )
            })
        }

        renderSelectOptions(
            $('#yearFilter'),
            filters.years,
            params.year,
            'Select year'
        )
        renderSelectOptions(
            $('#categoryFilter'),
            filters.categories,
            params.category,
            'Select style'
        )
        renderSelectOptions(
            $('#brandFilter'),
            filters.brands,
            params.brand,
            'Select brand'
        )
        renderSelectOptions(
            $('#statusFilter'),
            filters.statuses,
            params.status,
            'Select status'
        )
        renderSelectOptions(
            $('#transmissionFilter'),
            filters.transmissions,
            params.transmission,
            'Select transmission'
        )

        // Xử lý riêng cho price filter
        const priceFilter = $('#priceFilter')
        priceFilter.empty().append('<option value="">Select price</option>')
        filters.prices.forEach((price) => {
            const isSelected =
                params.price &&
                parseInt(params.price.split('-')[0]) === price.priceMin &&
                parseInt(params.price.split('-')[1]) === price.priceMax

            priceFilter.append(
                `<option value="${price.priceMin}-${price.priceMax}" ${
                    isSelected ? 'selected' : ''
                }>$${price.priceMin}-$${price.priceMax}</option>`
            )
        })
    }

    // Xử lý sự kiện click pagination
    $('.pagination').on('click', 'a.page-link', async function (e) {
        e.preventDefault()
        const $this = $(this)

        // Kiểm tra nếu nút bị disable thì không thực hiện gì
        if ($this.parent().hasClass('disabled')) return

        // Cập nhật giá trị của offset dựa trên nút bấm
        switch ($this.attr('id')) {
            case 'firstPage':
                offset = 1 // Trang đầu tiên
                break
            case 'prevPage':
                if (offset > 1) offset-- // Tránh giá trị < 1
                break
            case 'nextPage':
                if (offset < totalPages) offset++ // Tránh giá trị > totalPages
                break
            case 'lastPage':
                offset = totalPages // Trang cuối cùng
                break
            default:
                offset = parseInt($this.data('page')) // Điều hướng theo trang cụ thể
        }

        // Cập nhật query params và tải lại dữ liệu
        updateQueryParams({ offset: offset })
        await refresh()
    })

    // Handle items per page change
    $('#limit').change(async function () {
        limit = $(this).val()
        totalPages = Math.ceil(totalItems / limit)

        // updatePagination();
        updateQueryParams({ limit: limit })
        await refresh()
    })

    // updateQuery
    function updateQueryParams(paramsToUpdate) {
        const params = new URLSearchParams(window.location.search)
        Object.entries(paramsToUpdate).forEach(([key, value]) => {
            if (value == null || value === '') {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        window.history.pushState(
            {},
            '',
            `${window.location.pathname}?${params.toString()}`
        )
    }

    async function refresh() {
        await loadData()
        updatePagination()
    }

    window.addEventListener('popstate', async function (e) {
        // Gọi lại hàm loadData() khi người dùng quay lại
        await refresh()
    })

    refresh()
})
