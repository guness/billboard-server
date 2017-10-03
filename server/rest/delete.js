const MySqlHandler = require('../mysql-handler');

const constants = require('../constants');
const tn = constants.tableNames;

module.exports = function(app){
    /*DELETE SERVICES except device*/
    app.delete(`/:table((${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))/:id`, (req, res) => {
        const table = req.params.table;
        const id = req.params.id;

        MySqlHandler.get().then(connection => {
            connection.query('DELETE FROM ?? WHERE id = ?', [table, id], (error, result) => {
                if (error) {
                    return res.send({
                        success: false,
                        data: error.sqlMessage,
                    })
                }
                return res.send({
                    success: true,
                    data: {affectedRows: result.affectedRows},
                });
            });
        });
    });
};