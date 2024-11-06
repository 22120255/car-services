require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const route = require('./routes');
const methodOverride = require('method-override') ;
const { engine } = require('express-handlebars');
const db = require('./config/db');

// Connect to DB
db.connectDB();

// Body parser
app.use(express.json());

// Ghi đè phương thức HTTP
app.use(methodOverride('_method')); 

// Static file
app.use(express.static(path.join(__dirname, "public")));
app.use('/css', express.static('public/css'));
// HTTP logger
app.use(morgan('dev'));

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
           helpers: {
            eq: function (a, b) {
              return a === b;
            },
          },
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
