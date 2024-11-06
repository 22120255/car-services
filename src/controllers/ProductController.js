class ProductController {
    index(req, res) {
        res.render("products/index");
    }

    detail(req, res) {
        res.render("products/detail");
    }
}

module.exports = new ProductController();