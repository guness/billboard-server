const path = require('path');
const fs = require('fs');

const MySqlHandler = require('../mysql-handler');
const util = require('../util');
const MySqlQuery = MySqlHandler.query;
const auth = require('./auth');

const constants = require('../../src/constants');
const tn = constants.tableNames;
const {API_DIR} = constants;


module.exports = function (app) {
    /*DELETE SERVICES except device*/
    app.delete(`${API_DIR}/:table((${tn.GROUP}|${tn.PLAYLIST}|${tn.TICKER}|${tn.TICKERLIST}|${tn.PLAYLIST_MEDIA}))/:id`, auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const {table, id} = req.params;

        try {
            let result = await MySqlQuery('DELETE FROM ?? WHERE id = ? AND ownerId = ?', [table, id, ownerId]);
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

    app.delete(`${API_DIR}/:table(${tn.MEDIA})/:id`, auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const {table, id} = req.params;

        try {

            let mediaArr = await MySqlQuery(`SELECT * FROM ?? WHERE id = ? AND ownerId = ?`, [tn.MEDIA, id, ownerId]);
            if (mediaArr.length === 0) {
                return res.send({
                    success: false,
                    data: 'File does not exist in database',
                });
            }

            const media = mediaArr[0];
            try {
                fs.unlinkSync(path.join(process.cwd(), '/' + media.path));
            } catch (e) {
                // Only catch if file doesn't exist
                // Throw again if it's another error such as permission error
                if (e.code !== 'ENOENT') {
                    throw e;
                }
            }

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