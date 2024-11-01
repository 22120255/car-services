require('dotenv').config();
const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");
const route = require('./routes');
const cors = require('cors');  
const { engine } = require('express-handlebars');
const db = require('./config/db');  

// Connect to DB
db.connectDB();

// Body parser
app.use(cors());
app.use(express.json());

// Static file
app.use(express.static(path.join(__dirname, "public")));

// HTTP logger
app.use(morgan("dev"));

// Template engine
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main",
        partialsDir: [
            path.join(__dirname, "resources/views/partials/main"),
        ]
    }),
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Route init
route(app);


// Listen to port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})