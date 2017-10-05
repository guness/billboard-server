const path = require('path');
const fs = require('fs');

const MySqlHandler = require('../mysql-handler');
const util = require('../util');
const MySqlQuery = MySqlHandler.query;

const constants = require('../constants');
const tn = constants.tableNames;
const {API_DIR} = constants;


module.exports = function (app) {
    /*DELETE SERVICES except device*/
    app.delete(`${API_DIR}/:table((${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))/:id`, async (req, res) => {
        const {table, id} = req.params;

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

    app.delete(`${API_DIR}/:table(${tn.MEDIA})/:id`, async(req, res) => {
        const {table, id} = req.params;

        try {

            let mediaArr = await MySqlQuery(`SELECT * FROM ?? WHERE id = ?`, [tn.MEDIA, id]);
            if(mediaArr.length === 0){
                return res.send({
                    success: false,
                    data: 'File does not exist in database',
                });
            }

            const media = mediaArr[0];
            fs.unlinkSync(path.join(process.cwd(), '/' + media.path));

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
            });
        }


    });
};