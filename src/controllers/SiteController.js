

class SiteController {
    // [GET] /
    index(req, res) {
        res.render("site/home");
    }

    // [GET] /about
    about(req, res) {
        res.render("site/about");
    }

    // [GET] /contact
    contact(req, res) {
        res.render("site/contact");
    }
    
    product(req, res) { 
        res.render("site/product");
    }
}

module.exports = new SiteController();