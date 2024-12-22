
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
        const getDataAnalytics = new FunctionApi(`/api/user/data/analytics`,
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
