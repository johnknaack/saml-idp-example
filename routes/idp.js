const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const samlp = require('samlp');

const router = new Router();

const profileMapper = (user) => ({
    getClaims: () => ({
        email: user.email,
    }),
    getNameIdentifier: () => ({
        nameIdentifier: 'example', // TODO Magic String
        nameIdentifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:unspecified', // TODO Magic String
    }),
});

const getPostURL = (assertionConsumerServiceURL) => (wtrealm, wreply, req_, callback) => {
    callback(null, assertionConsumerServiceURL);
};

const parseSamlRequest = (req, res) => {
    samlp.parseRequest(req, (error, data) => {
        const authOptions = {
            issuer: 'example', // TODO Magic String
            cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'cert.pem')), // TODO Magic String
            key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'key.pem')), // TODO Magic String
            profileMapper,
            getPostURL: getPostURL(data.assertionConsumerServiceURL),
        };
        samlp.auth(authOptions)(req, res);
    });
};

// Single Sign-On Endpoints
router.use('/sso', (req, res, next) => {
    if (req.user && req.user.email) {
        next();
    } else {
        res.redirect('/users/login');
    }
});
router.use('/sso', parseSamlRequest);
router.post('/sso', parseSamlRequest);

module.exports = router;
