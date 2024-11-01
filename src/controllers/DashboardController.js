class DashboardController {
    // [GET] /
    index(req, res) {
        res.render("dashboard/home");
    }

    // [GET] /about
    aboutUs(req, res) {
        res.render("dashboard/about");
    }

    // [GET] /contact
    contact(req, res) {
        res.render("dashboard/contact");
    }
}

module.exports = new DashboardController();