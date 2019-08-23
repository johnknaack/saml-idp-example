const { Router } = require('express');

const router = new Router();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/users/login');
    }
};

// Home Page
router.get('/', (req, res) => {
    res.render('pages/index');
});

// Admin Page
router.get('/admin', isLoggedIn, (req, res) => {
    res.render('pages/admin');
});

module.exports = router;
