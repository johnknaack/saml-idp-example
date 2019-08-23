const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const idpRoutes = require('./routes/idp');

const PORT = 7001;

const app = new express();

// Configure Paths and View Engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure Parsers and Sessions
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'super secret',
    resave: false,
    saveUninitialized: true,
}));

// Configure Authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure Flash Messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.app_name = 'Client Name';
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Configure Routes
app.use('/', indexRoutes);
app.use('/users', authRoutes);
app.use('/idp', idpRoutes);

// Start Express Server
app.listen(PORT, error => {
    if (error) {
        console.error(error);
    } else {
        console.log(`🌍 Listening on port ${PORT}`);
    }
});
