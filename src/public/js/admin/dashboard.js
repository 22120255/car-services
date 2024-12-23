
import FunctionApi from '../FunctionApi.js';

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
const fetchData = async (options = { refresh: false }) => {
    try {
        const getDataAnalytics = new FunctionApi(`/api/data/analytics`,
            {
                query: { refresh: options.refresh }
            });
        await getDataAnalytics.call();

        return getDataAnalytics.data;
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
        renderData(dataAnalytics);
        dataAnalytics = await fetchData();

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
}