const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MysqlQuery = require('../mysql-handler').query;
const EncryptHandler = require('../encyrpt-handler');
const tn = require('../../src/constants').tableNames;
const pn = require('../../src/constants').procedureNames;

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

            const {password, ...userWithoutPassword} = user;
            const match = await EncryptHandler.compare(password, password);
            if (match) {
                return cb(null, userWithoutPassword);
            }
        } catch (e) {
            return cb(null, false);
        }
    }),
);

function findUserByName(name) {
    return MysqlQuery('SELECT * FROM ?? WHERE name=?', [tn.USER, name]);
}

function findOwnersById(userId) {
    return MysqlQuery(`CALL ??(?)`, [pn.OWNERS_BY_USER, userId]);
}

module.exports = function (app) {
    // Initialize Passport and restore authentication state, if any, from the session.
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(async function (user, done) {
        const [owners, OkPacket] = await findOwnersById(user.id);
        //TODO - We might need a better solution to this, but that will work for now. Selects first owner as default
        const currentOwner = owners[0];
        const userWithOwners = {...user, owners, currentOwner};
        done(null, userWithOwners);
    });

    passport.deserializeUser(async function (user, done) {
        done(null, user);
    });

};

// route middleware to make sure a user is logged in
module.exports.isLoggedIn = (req, res, next) => {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    if (req.xhr) {
        return res.send({
            success: false,
            data: 'User login required.',
        });
    }

    // if they aren't redirect them to the home page
    res.redirect('/login');
};

module.exports.isNotLoggedIn = (req, res, next) => {

    // if user is authenticated in the session, carry on
    if (!req.isAuthenticated()) {
        return next();
    }

    if (req.xhr) {
        return res.send({
            success: false,
            data: 'User is already logged in.',
        });
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
};
