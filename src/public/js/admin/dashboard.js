import { renderSelectOptions, showToast, updateQueryParams } from '../common.js';
import { getFilterConfigAdminDashboard } from '../config.js';
import FunctionApi from '../FunctionApi.js';
import { isValidDate } from '../helpers.js';

document.addEventListener("DOMContentLoaded", function () {
    var options = {
        series: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 5,
                borderRadiusApplication: 'end'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
        yaxis: {
            title: {
                text: '$ (thousands)'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " thousands"
                }
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#revenue-chart"), options);
    chart.render();
})

document.addEventListener("DOMContentLoaded", function () {
    var options = {
        series: [44, 55, 13, 43, 22],
        chart: {
            width: 375,
            type: 'pie',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        legend: {
            position: 'bottom'
        },
        // responsive: [{
        //     breakpoint: 480,
        //     options: {
        //         chart: {
        //             width: 200
        //         },
        //         legend: {
        //             position: 'bottom'
        //         }
        //     }
        // }]
    };

    var chart = new ApexCharts(document.querySelector("#segments-chart"), options);
    chart.render();
})

//Render data 
const fetchData = async (query = {}) => {
    try {
        if (query.time) {
            query.time = new Date(query.time).toISOString();
        }
        const getDataAnalyticsApi = new FunctionApi(`/api/data/analytics`, {
            query
        });
        await getDataAnalyticsApi.call();

        return getDataAnalyticsApi.data.data;
    } catch (error) {
        throw error;
    }
}

const renderData = (data) => {
    $('.views').children('.skeleton-text').toggleClass('hidden', !!data);
    $('#last-update-time').children('.skeleton-text').toggleClass('hidden', !!data);
    if (!data) return;

    const { views, createdAtStr } = data;

    $('.views').children('.value').text(views);
    $('#last-update-time').children('.value').text(createdAtStr);

    // Render top products 
    renderTopProducts(".top-view-products", data.topProductsView);
    renderTopProducts(".top-purchased-products", data.topProductsPurchased);
}

document.addEventListener("DOMContentLoaded", async () => {
    let dataAnalytics = null;
    // Call fetchData function to get data when page loaded

    try {
        const urlParams = new URLSearchParams(window.location.search);
        dataAnalytics = await fetchData({
            time: urlParams.get('time'),
            interval: urlParams.get('interval'),
        });
        renderData(dataAnalytics);
    }
    catch (error) {
        console.log(error);
    }

    $("#refresh-btn").on("click", async () => {
        try {
            dataAnalytics = await fetchData({ refresh: true });
            renderData(dataAnalytics);
        }
        catch (error) {
            console.log(error);
        }
    })
})

function renderTopProducts(selector, topProducts) {
    var $container = $(selector);
    $container.empty();  // Xóa nội dung cũ (nếu có)

    if (topProducts.length > 0) {
        $.each(topProducts, function (index, product) {
            var productHTML = `
                <a href="/products/${product._id}" class="product-item">
                    <div class="d-flex align-items-center gap-3 rounded hover-bg">
                        <div class="product-rank">${index + 1}</div>
                        <div class="product-image">
                            <img src="${product.images[0]}" alt="${product.model}" />
                        </div>
                        <div class="product-info flex-grow-1">
                            <h6 class="product-title mb-1">${product.brand} ${product.model}</h6>
                            <div class="product-meta text-muted small">
                                <span>${product.year}</span>
                                <span class="mx-1">•</span>
                                <span>${product.mileage} km</span>
                                <span class="mx-1">•</span>
                                <span class="text-capitalize">${product.fuelType}</span>
                            </div>
                        </div>
                        <div class="product-price text-end">
                            <div class="fw-bold">${product.price}</div>
                            <div class="small text-success">
                                <i class="fa-solid fa-eye me-1"></i>
                                ${product.views}
                            </div>
                        </div>
                    </div>
                </a>
            `;
            $container.append(productHTML);
        });
    } else {
        $container.append('<span style="text-align: center;">No products</span>');
    }
}

const renderTimeFilterButtons = () => {
    const config = getFilterConfigAdminDashboard();
    const $btnGroup = $('.btn-group[role="group"]');
    $btnGroup.empty();

    config.time.forEach(item => {
        const $button = $(`
            <button type="button" class="btn btn-outline-secondary btn-sm" data-months="${item.value}">
                ${item.label}
            </button>
        `);
        $btnGroup.append($button);
    });

    $btnGroup.find('button').first().addClass('active');
};
document.addEventListener('DOMContentLoaded', function () {
    renderTimeFilterButtons();
    // Set default date to today
    $('#custom-date').val(new Date().toISOString().slice(0, 10));

    // Đính filter lên URL
    $('.time-filter .btn-group .btn').on('click', function () {
        $('.time-filter .btn-group .btn').removeClass('active');
        $(this).addClass('active');

        updateQueryParams({
            interval: parseInt($(this).data('months'))
        })
    });

    // Handle date input changes
    $('#custom-date').on('change', function () {
        updateQueryParams({
            interval: $(this).val()
        })
    });

    // Update filter khi URL thay đổi
    const urlParams = new URLSearchParams(window.location.search);
    const interval = urlParams.get('interval');
    const timeFilter = urlParams.get('time');

    const { time } = getFilterConfigAdminDashboard();

    if (time.some(item => item.value == interval)) {
        $('.time-filter .btn-group .btn').removeClass('active');
        $(`.time-filter .btn-group .btn[data-months="${interval}"]`).addClass('active');
    } else {
        $('.time-filter .btn-group .btn').removeClass('active');
        $(`.time-filter .btn-group .btn`).first().addClass('active');
        urlParams.set('interval', '1');
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
        if (interval != null)
            showToast("Error", "Invalid params");
    }

    if (timeFilter && isValidDate(timeFilter)) {
        $('#custom-date').val(timeFilter);
    } else {
        const today = new Date().toISOString().split('T')[0];
        $('#custom-date').val(today);
        urlParams.set('time', today);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
        if (timeFilter != null) {
            showToast("Error", "Invalid time param");
        }
    }
});