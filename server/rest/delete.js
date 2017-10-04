const MySqlHandler = require('../mysql-handler');
const util = require('../util');
const MySqlQuery = MySqlHandler.query;

const constants = require('../constants');
const tn = constants.tableNames;


module.exports = function (app) {
    /*DELETE SERVICES except device*/
    app.delete(`/:table((${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))/:id`, async (req, res) => {
        const table = req.params.table;
        const id = req.params.id;

        try {
            let result = await MySqlQuery('DELETE FROM ?? WHERE id = ?', [table, id]);
            await util.updateFirebaseDevicePlaylists();
            return res.send({
                success: true,
                data: {affectedRows: result.affectedRows},
            });

        } catch (e) {
            return res.send({
                success: false,
                data: e.sqlMessage,
            })
        }
    });
};