

class SiteController {
    // [GET] /
    index(req, res) {
        res.render('site/home', { title: 'Trang chủ' });
    }
}

module.exports = new SiteController();