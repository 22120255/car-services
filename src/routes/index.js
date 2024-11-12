const siteRouter = require('./site')
const productRouter = require('./product')
const authRouter = require('./auth')
const dashboardRouter = require('./dashboard')
const adminRouter = require('./admin')

function route(app) {
    app.use('/products', productRouter)
    app.use('/auth', authRouter)
    app.use('/dashboard', dashboardRouter)
    app.use('/admin', adminRouter)
    app.use('/', siteRouter)
}
module.exports = route
