const DashboardService = require('../services/DashboardService')

class DashboardController {
    // [GET] /home
    index = async (req, res, next) => {
        // Tạm thời chỉ chọn ra 3 sản phẩm bất kì, sau này tích hợp số liệu sau đó mới chọn ra sản phẩm bán chạy nhất
        try {
            const { mostProducts, newProducts } =
                await DashboardService.getMostAndNewBoughtProducts({
                    status: 'new',
                })
            res.render('dashboard/home', {
                mostProducts,
                newProducts,
                title: 'Home'
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    // [GET] /about
    about(req, res) {
        res.render('dashboard/about', {
            title: 'Introduce'
        })
    }

    // [GET] /contact
    contact(req, res) {
        res.render('dashboard/contact', {
            title: 'Contact'
        })
    }
}

module.exports = new DashboardController()
