const path = require('path');
require('dotenv').config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
  ),
})
const cron = require('node-cron');
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const { engine } = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')

const route = require('./routes')
const db = require('./config/db')
const passport = require('./config/passport')
const { navigateUser } = require('./middleware/authMiddleware')
const { catch404, catch500 } = require('./middleware/catchError')
const refreshSession = require('./middleware/refreshSession')
const { getDataReport } = require('./config/analytics');
const { errorLog, clearFileLogs, infoLog } = require('./utils/customLog');
const limiter = require('./middleware/limiterMiddleware');

const app = express()
const store = db.createSessionStore(session)

// Session
app.use(
  session({
    store,
    name: 'car-servers',
    secret: 'car.services',
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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static('public/css'));
// HTTP logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Custom middleware
app.use(navigateUser);
app.use(refreshSession);
app.use('/api/', limiter)

// Google Analytics - crawl data every 0h
cron.schedule('0 0 * * *', async () => {
  try {
    await getDataReport();
    infoLog("app.js", "crawl data", "Crawl data successfully");
  } catch (error) {
    errorLog("app.js", "crawl data", error);
  }
});

// Template engine
app.engine(
  'hbs',
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: [path.join(__dirname, 'views/partials/main'), path.join(__dirname, 'views/partials/admin'), path.join(__dirname, 'views/partials')],
    helpers: require('./utils/handlebars'),
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static('public/css'));

// Route init
route(app);

app.use(catch404);
app.use(catch500);

// Clear file log
clearFileLogs('error');
clearFileLogs('info');

// Listen to port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
