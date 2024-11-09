require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const session = require("express-session");
const flash = require('connect-flash');

const route = require('./routes');
const db = require('./config/db');
const passport = require('./config/passport');
const { navigateUser } = require("./middleware/authMiddleware");
const refreshSession = require("./middleware/refreshSession");


const app = express();
const store = db.createSessionStore(session);
// Session
app.use(
    session({
        store,
        name: "car-servers",
        secret: "car.services",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 10000 * 60 * 60 },
    })
);

// Connect to DB
db.connectDB();
// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Ghi đè phương thức HTTP
app.use(methodOverride('_method'));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Flash
app.use(flash());
// Static file
app.use(express.static(path.join(__dirname, "public")));
app.use('/css', express.static('public/css'));
// HTTP logger
app.use(morgan('dev'));

// Custom middleware
app.use(navigateUser);
app.use(refreshSession);

// Register the eq helper

// Template engine
app.engine(
    'hbs',
    engine({
        extname: ".hbs",
        defaultLayout: "main",
        partialsDir: [
            path.join(__dirname, "views/partials/main"),
            path.join(__dirname, "views/partials/auth"),
            path.join(__dirname, "views/partials"),
        ],
        helpers: require("./utils/handlebars"),
    }),
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use('/css', express.static('public/css'));

// Route init
route(app);

// Listen to port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});
