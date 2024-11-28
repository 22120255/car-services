document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search)

    let limit = parseInt(urlParams.get('limit')) || $('#limit').val()
    let offset = parseInt(urlParams.get('offset')) || 1
    let totalPages = null
    let totalItems = null

    let priceMinFilter = parseFloat(urlParams.get('priceMin')) || null
    let priceMaxFilter = parseFloat(urlParams.get('priceMax')) || null
    let categoryFilter = parseInt(urlParams.get('category')) || null
    let brandFilter = parseInt(urlParams.get('brand')) || null
    let statusFilter = parseInt(urlParams.get('status')) || null
    let transmissionFilter = parseInt(urlParams.get('transmission')) || null
    let searchText = parseInt(urlParams.get('search')) || null
    let yearFilter = parseInt(urlParams.get('year')) || null

    $('#searchInput').val(searchText)
    $('#limit').val(limit)
    $('#statusFilter').val(statusFilter)
    $('#brandFilter').val(brandFilter)
    $('#categoryFilter').val(categoryFilter)
    $('#transmissionFilter').val(transmissionFilter)
    $('#yearFilter').val(yearFilter)
    $('#price').val(`${params.get('priceMin')}-${params.get('priceMax')}`)

    $('#searchInput').on('keydown', async function (event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            updateQueryParams('search')
        }
    })

    $('#statusFilter').on('change', async function () {
        updateQueryParams('status', $(this).val())
        refresh()
    })

    $('#brandFilter').on('change', async function () {
        updateQueryParams('brand', $(this).val())
        refresh()
    })

    $('#categoryFilter').on('change', async function () {
        updateQueryParams('categoryFilter', $(this).val())
        refresh()
    })

    $('#transmissionFilter').on('change', async function () {
        updateQueryParams('transmissionFilter', $(this).val())
        refresh()
    })

    $('#yearFilter').on('change', async function () {
        updateQueryParams('yearFilter', $(this).val())
        refresh()
    })

    $('#price').on('change', async function () {
        const price = $(this).val()
        const [min, max] = price ? price.split('-') : ['', '']
        updateQueryParams('priceMin', min, 'priceMax', max)
        refresh()
    })

    function updatePagination() {
        const $pagination = $('.pagination')
        $pagination.empty()
    }
    // LoadData
    async function LoadData() {
        const urlParams = new URLSearchParams(window.location.search)
        const params = Object.fromEntries(urlParams.entries())
        const apiQuery = $.param(params)

        await $.ajax({
            url: `/products?${apiQuery}`,
            type: 'GET',
            statusCode: {
                200(resp) {
                    products = resp.products
                    totalItems = resp.total
                    totalPages = Math.ceil(totalItems / limit)
                },
                500(resp) {
                    console.log(resp.responeseJSON)
                },
            },
        })
        $('#product-list').empty()

        if (!products || products.length == 0) {
            $('#product-list').append(
                `<h2 id="search-inform">Không tìm thấy sản phẩm</h2>`
            )
            return
        }

        // Add data
        products.forEach((product) => {
            $('#product-list').append(`
                <div class='card-product__container'>
                    <div class='card-product__header'>
                        <a href='/products/${product._id}'>
                            <img src='${product.images.image1}' alt='car' />
                            {{#if (eq status 'new')}}<div class='new-arrival-badge'>New Arrival</div>
                            {{else}}
                            {{/if}}
                        </a>
                    </div>
                    <div class='card-product__body'>
                        <div class='product-header'>
                            <a href='/products/${product._id}' class='card-product__brand'>
                            ${product.brand}
                            </a>
                            <h3 class='card-product__price'>${product.price}}</h3>
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
                            <span class='car-spec-value'>${product.year}</span>
                        </p>
                        <a href='/products/${product._id}' class='view-details-btn'>View Details</a>
                    </div>
                </div>`)
        })
    }

    // Xử lý sự kiện click pagination
    $('.pagination').on('click', 'a.page-link', async function (e) {
        e.preventDefault()
        const $this = $(this)

        if ($this.parent().hasClass('disabled')) return

        if ($this.attr('id') === 'firstPage') {
            offset = 0
        } else if ($this.attr('id') === 'prevPage') {
            offset--
        } else if ($this.attr('id') === 'nextPage') {
            offset++
        } else if ($this.attr('id') === 'lastPage') {
            offset = totalPages - 1
        } else {
            offset = parseInt($this.data('page'))
        }

        updateQueryParams('offset', offset)
        await refresh()
    })

    // Handle items per page change
    $('#limit').change(async function () {
        limit = parseInt($(this).val())
        totalPages = totalItems / limit

        // updatePagination();
        updateQueryParams('limit', limit)
        await refresh()
    })

    function updateQueryParams(key, value, key1 = null, value1 = null) {
        const params = new URLSearchParams(window.location.search)
        if (!value) {
            params.delete(key)
        } else {
            params.set(key, value)
            if (key1 && value1) {
                params.set(key1, value1)
            }
        }

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
    refresh()
})
