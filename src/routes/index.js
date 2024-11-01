
const siteRouter = require("./site");

function route(app) {
    // app.use("/product", productRouter);
    // app.use("/auth", authRouter);
    // app.use("/dashboard", dashboardRouter);
    app.use("/", siteRouter);
}
module.exports = route;
