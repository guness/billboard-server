const MySqlHandler = require('../mysql-handler');
const constants = require('../constants');
const tn = constants.tableNames;


module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send('Hello World!')
    });

    /*GET SERVICES - All in one*/
    app.get(`/:table((${tn.DEVICE}|${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))`, (req, res) => {
        const table = req.params.table;
        MySqlHandler.get().then(connection => {
            // TODO - Make sure you add required parameters
            connection.query(`SELECT * FROM ??`, table, (error, results) => {
                if (error) {
                    return res.send({
                        success: false,
                        data: error.sqlMessage,
                    })
                }
                return res.send({
                    success: true,
                    data: results,
                });
            });
        });
    });
};