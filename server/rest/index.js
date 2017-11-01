const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');

const {CLIENT_HOST, HOSTNAME, EXPRESS_PORT} = require('../../src/constants');
const {HOST_IP} = require('../../auth');

const options = {
    key: fs.readFileSync('./auth/cert/private.pem'),
    cert: fs.readFileSync('./auth/cert/public.pem')
};

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

app.use(function (req, res, next) {
    console.log(`REQUESTED: ${req.protocol}://${req.get('host')}${req.originalUrl}\t\t\tFROM: ${req.headers.referer}`);
    next();
});

module.exports = {
    listen: function () {

        require('./auth')(app);
        require('./get')(app);
        require('./post')(app);
        require('./patch')(app);
        require('./delete')(app);

        return new Promise((resolve) => {
            let httpServer = https.createServer(options, app)
                .listen({port: EXPRESS_PORT, host: HOST_IP}, function () {
                    console.log(`Rest server started listening on ${HOSTNAME} with ${HOST_IP}:${EXPRESS_PORT}!`);
                    resolve(httpServer);
                });
        });
    },
};