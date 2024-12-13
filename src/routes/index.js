const siteRouter = require('./ui/site');
const productRouter = require('./ui/product');
const authRouter = require('./ui/auth');
const dashboardRouter = require('./ui/dashboard');
const cartRouter = require('./ui/cart');
const userRouter = require('./ui/user');
const adminRouter = require('./ui/admin');
const paymentRouter = require('./ui/payment');

const userApiRouter = require('./api/user');
const authApiRouter = require('./api/auth');
const cartApiRouter = require('./api/cart');
const productApiRouter = require('./api/product');
const paymentApiRouter = require('./api/payment');

function route(app) {
  // API
  app.use('/api/user', userApiRouter);
  app.use('/api/auth', authApiRouter);
  app.use('/api/cart', cartApiRouter);
  app.use('/api/products', productApiRouter);
  app.use('/api/payment', paymentApiRouter);

  // UI
  app.use('/products', productRouter);
  app.use('/auth', authRouter);
  app.use('/dashboard', dashboardRouter);
  app.use('/cart', cartRouter);
  app.use('/user', userRouter);
  app.use('/admin', adminRouter);
  app.use('/payment', paymentRouter);
  app.use('/', siteRouter);
}

module.exports = route;
