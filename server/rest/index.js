const express = require('express');
const bodyParser = require('body-parser');

const constants = require('../constants');
const PORT = constants.EXPRESS_PORT;

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8000");
    res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports = {
    listen: function () {


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