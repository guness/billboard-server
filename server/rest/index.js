const express = require('express');
const bodyParser = require('body-parser');

const constants = require('../constants');
const PORT = constants.EXPRESS_PORT;

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

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