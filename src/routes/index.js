const siteRouter = require('./site')
const productRouter = require('./product')
const authRouter = require('./auth')
const dashboardRouter = require('./dashboard')
const cartRouter = require('./cart')
const adminRouter = require('./admin')

const userApiRouter = require('./api/user')

function route(app) {
    // API
    app.use('/api/user', userApiRouter)

    // UI
    app.use('/products', productRouter)
    app.use('/auth', authRouter)
    app.use('/dashboard', dashboardRouter)
    app.use('/cart', cartRouter)
    app.use('/admin', adminRouter)
    app.use('/', siteRouter)
}

module.exports = route
