import { renderSelectOptions, showToast, updateQueryParams } from '../common.js';
import { getFilterConfigAdminDashboard } from '../config.js';
import FunctionApi from '../FunctionApi.js';
import { formatNumber, isValidDate } from '../helpers.js';

// Biểu đồ doanh thu
let revenueChart = null;

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

document.addEventListener("DOMContentLoaded", async () => {
    let dataAnalytics = null;
    // Call fetchData function to get data when page loaded
    const urlParams = new URLSearchParams(window.location.search);

    $("#refresh-btn").on("click", async () => {
        renderData(null);
        dataAnalytics = await fetchData({
            refresh: true,
            time: urlParams.get('time'),
            interval: urlParams.get('interval'),
        });
        renderData(dataAnalytics);
    })

    renderTimeFilterButtons();
    // Set default date to today
    $('#custom-date').val(new Date().toISOString().slice(0, 10));

    // Đính filter lên URL
    $('.time-filter .btn-group .btn').on('click', async function () {
        $('.time-filter .btn-group .btn').removeClass('active');
        $(this).addClass('active');
        dataAnalytics = await fetchData({
            time: urlParams.get('time'),
            interval: parseInt($(this).data('months')),
        });
        renderData(dataAnalytics);
        updateQueryParams({
            interval: parseInt($(this).data('months'))
        })
    });

    // Handle date input changes
    $('#custom-date').on('change', async function () {
        dataAnalytics = await fetchData({
            time: $(this).val(),
            interval: urlParams.get('interval'),
        });
        renderData(dataAnalytics);
        updateQueryParams({
            time: $(this).val()
        })
    });

    // Update filter khi URL thay đổi
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

    // fetch data
    dataAnalytics = await fetchData({
        time: urlParams.get('time'),
        interval: urlParams.get('interval'),
    });

    renderData(dataAnalytics);
})

//Render data 
const fetchData = async (query = {}) => {
    if (query.time) {
        query.time = new Date(query.time).toISOString();
    }
    const getDataAnalyticsApi = new FunctionApi(`/api/data/analytics`, {
        query
    });
    await getDataAnalyticsApi.call();

    return getDataAnalyticsApi.data.data;
}

const renderData = (data) => {
    // Render skeleton
    $('.views').children('.skeleton-text').toggleClass('hidden', !!data);
    $('.purchased').children('.skeleton-text').toggleClass('hidden', !!data);
    $('#last-update-time').children('.skeleton-text').toggleClass('hidden', !!data);
    $('.views').children('.value').text("");
    $('.purchased').children('.value').text("");
    $('#last-update-time').children('.value').text("");
    renderRevenueChart([]);
    if (!data) return;

    const { views, createdAtStr, purchased } = data;

    $('.views').children('.value').text(formatNumber(views, 0));
    $('.purchased').children('.value').text(formatNumber(purchased, 0));
    $('#last-update-time').children('.value').text(createdAtStr);

    // Render top products 
    renderTopProducts(".top-view-products", data.topProductsView);
    renderTopProducts(".top-purchased-products", data.topProductsPurchased);
    // Render revenue chart
    renderRevenueChart(data.dailyRevenue);
}

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

const renderRevenueChart = (data) => {
    $(".actual-revenue").children('.skeleton-text').toggleClass('hidden', !!data && data.length > 0);
    $(".revenue-target").children('.skeleton-text').toggleClass('hidden', !!data && data.length > 0);
    $(".goal").children('.skeleton-text').toggleClass('hidden', !!data && data.length > 0);
    $(".actual-revenue").children('.value').text('');
    $(".revenue-target").children('.value').text('');
    $(".goal").children('.value').text('');
    if (!data) return;
    if (revenueChart) {
        revenueChart.destroy(); // Hủy biểu đồ cũ nếu tồn tại
    }

    const time = data.map(item => item._id);
    const seriesData = data.map(item => item.totalRevenue);

    var options = {
        series: [{
            name: 'Revenue',
            data: seriesData
        }],
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            categories: time,
            title: {
                text: 'Date'
            },
            labels: {
                rotate: 0,
                formatter: function (val) {
                    const index = time.indexOf(val);

                    return (index === 0 || index === Math.floor(time.length / 2) || index === time.length - 1)
                        ? val
                        : "";
                }
            }
        },
        yaxis: {
            title: {
                text: 'Revenue ($)'
            },
            labels: {
                formatter: function (val) {
                    return `$ ${val.toLocaleString()}`;
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return `$ ${val.toLocaleString()}`
                }
            }
        },
        markers: {
            size: 4
        }
    };

    revenueChart = new ApexCharts(document.querySelector("#revenue-chart"), options);
    revenueChart.render();

    // Render total revenue
    if (data.length === 0) return;
    const totalRevenue = seriesData.reduce((acc, cur) => acc + cur, 0);
    $(".actual-revenue").children('.value').text(`$ ${formatNumber(totalRevenue)}`);
    $(".revenue-target").children('.value').text(`$ ${formatNumber(getNearestBase(totalRevenue), 0)}`);
    $(".goal").children('.value').text(`${formatNumber(totalRevenue * 100 / getNearestBase(totalRevenue), 0)} %`);
}

const getNearestBase = (number) => {
    const base = Math.pow(10, Math.floor(Math.log10(number)));
    const result = Math.floor(number / base) * base;
    return result;
};