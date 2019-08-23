const { Router } = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = new Router();

// Simple Authentication Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    done(null, { email }, req.flash('success_message', 'Logged In'));
}));
passport.serializeUser((user, done) => {
    done(null, user.email);
});
passport.deserializeUser((email, done) => {
    done(null, { email });
});

// Render simple login page
router.get('/login', (req, res) => {
    res.render('pages/login');
});
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true,
}), (req, res) => {
    req.flash('success-message', 'Logged In');
    res.redirect('/');
});

// Simple logout page
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_message', 'Logged Out');
    res.redirect('/');
});

module.exports = router;
