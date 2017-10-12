const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MysqlQuery = require('../mysql-handler').query;
const EncryptHandler = require('../encyrpt-handler');
const tn = require('../constants').tableNames;

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
    async function (name, password, cb) {
        try {
            const users = await findUserByName(name);
            if (users.length === 0) {
                return cb(null, false);
            }
            if (users.length > 1) {
                console.warn('WARNING: More than one user with same name exists in database');
            }

            const user = users[0];

            const match = await EncryptHandler.compare(password, user.password);
            if (match) {
                return cb(null, user)
            }
        } catch (e) {
            return cb(null, false);
        }
    }),
);

async function findUserByName(name) {
    return MysqlQuery('SELECT * FROM ?? WHERE name=?', [tn.USER, name]);
}

module.exports = function (app) {
    // Initialize Passport and restore authentication state, if any, from the session.
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

};

// route middleware to make sure a user is logged in
module.exports.isLoggedIn = (req, res, next) => {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/login');
};
