const MySqlQuery = require('../mysql-handler').query;
const constants = require('../constants');
const tn = constants.tableNames;


module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send('Hello World!')
    });

    /*GET SERVICES - All in one*/
    app.get(`/:table((${tn.DEVICE}|${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))`, (req, res) => {
        const table = req.params.table;
        // TODO - Make sure you add required parameters
        MySqlQuery(`SELECT * FROM ??`, table).then(results => {
            return res.send({
                success: true,
                data: results,
            });
        }).catch(error => {
            return res.send({
                success: false,
                data: error.sqlMessage,
            })

        });
    });
};