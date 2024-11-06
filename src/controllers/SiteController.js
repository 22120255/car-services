class SiteController {
    // [GET] /
    index(req, res) {
        res.send('Home Page')
    }
}

module.exports = new SiteController()
