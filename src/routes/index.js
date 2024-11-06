const siteRouter = require("./site");
const productRouter = require("./product");
const authRouter = require("./auth");
const dashboardRouter = require("./dashboard");

function route(app) {
    app.use("/product", productRouter);
    app.use("/auth", authRouter);
    app.use("/dashboard", dashboardRouter);
    app.use("/", siteRouter);
}
module.exports = route;
