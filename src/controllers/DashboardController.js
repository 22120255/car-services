const DashboardService = require('../services/DashboardService')

class DashboardController {
    // [GET] /home
    index = async (req, res, next) => {
        // Tạm thời chỉ chọn ra 3 sản phẩm bất kì, sau này tích hợp số liệu sau đó mới chọn ra sản phẩm bán chạy nhất
        try {
            const mostBoughtProducts =
                await DashboardService.getMostBoughtProducts({})
            console.log(mostBoughtProducts)
            res.render('dashboard/home', {
                products: mostBoughtProducts,
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    // [GET] /about
    about(req, res) {
        res.render('dashboard/about')
    }

    // [GET] /contact
    contact(req, res) {
        res.render('dashboard/contact')
    }
}

module.exports = new DashboardController()
