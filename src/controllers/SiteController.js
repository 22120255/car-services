const User = require("../models/User")
class SiteController {
    // [GET] /
    index(req, res) {
        res.redirect("/dashboard")
    }

    // [GET] /profile/:id
    async profile(req, res) {
        const user = await User.findById(req.params.id)
        res.render("site/profile", {
            user
        })
    }
}

module.exports = new SiteController()