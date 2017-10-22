const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');

const constants = require('../constants');
const PORT = constants.EXPRESS_PORT;
const CLIENT_HOST = constants.CLIENT_HOST;

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(cookieParser());
app.use(expressSession({secret: 'billboard server', resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

//Allow CORS for different domain
app.use(cors({
    origin: CLIENT_HOST,
    credentials: true
}));

module.exports = {
    listen: function () {

        require('./auth')(app);
        require('./get')(app);
        require('./post')(app);
        require('./patch')(app);
        require('./delete')(app);

        return new Promise((resolve) => {
            let httpServer = app.listen(PORT, function () {
                console.log('Rest server started listening!');
                resolve(httpServer);
            });
        });
    },
};