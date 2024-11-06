

class SiteController {
    // [GET] /
    index(req, res) {
        res.redirect("/dashboard")
    }
}

module.exports = new SiteController();