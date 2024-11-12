class AdminController {
    accounts(req, res) {
        res.render('admin/accounts', {
            layout: 'admin',
        });
    }
}

module.exports = new AdminController();