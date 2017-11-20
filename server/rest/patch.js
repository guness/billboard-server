const moment = require('moment');

const MySqlHandler = require('../mysql-handler');
const util = require('../util');
const MySqlQuery = MySqlHandler.query;
const auth = require('./auth');

const constants = require('../../src/constants');
const tn = constants.tableNames;
const {DATETIME_FORMAT, API_DIR} = constants;

const mysqlUpdateErrorCallback = (res, error) => {
    return res.send({
        success: false,
        data: error.message || error.sqlMessage,
    });
};

const mysqlUpdateSuccessCallback = (res, result) => {
    return res.send({
        success: true,
        data: result.message,
    });
};

module.exports = function (app) {

    /*PATCH SERVICES*/
    app.patch(API_DIR + '/' + tn.DEVICE + '/:id', auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const id = req.params.id;
        const {groupId, name} = req.body;
        let fields = {};

        if ('groupId' in req.body) {
            fields.groupId = groupId;
        }

        if ('name' in req.body) {
            fields.name = name;
        }

        if ('ownerId' in req.body) {
            //Check if device does not have an owner id
            let deviceResults = await MySqlQuery('SELECT * FROM ?? WHERE id = ?', [tn.DEVICE, id]);
            if (deviceResults.length && deviceResults[0].ownerId === null) {
                fields.ownerId = ownerId;
            } else {
                return res.send({success: false, data: 'Device ownerId is already set.'});
            }
        }


        if (Object.keys(fields).length === 0){
            return res.send({success: false, data: 'Missing fields.'});
        }

        try {
            let result;
            //If the device is new (ie ownerId is not set), don't include ownerId it in query
            if ('ownerId' in fields) {
                result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ?', [tn.DEVICE, fields, id]);
            } else {
                result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ? AND (ownerId = ? OR ownerId IS NULL)', [tn.DEVICE, fields, id, ownerId]);
            }

            await util.updateFirebaseDevicePlaylists();
            mysqlUpdateSuccessCallback(res, result);

        } catch (e) {
            mysqlUpdateErrorCallback(res, e)
        }
    });

    app.patch(API_DIR + '/' + tn.GROUP + '/:id', auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const id = req.params.id;
        const name = req.body.name;

        if (!name) {
            return res.send({success: false, data: 'Missing field: name'});
        }

        try {
            let result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ? AND ownerId = ?', [tn.GROUP, {name: name}, id, ownerId]);
            await util.updateFirebaseDevicePlaylists();
            mysqlUpdateSuccessCallback(res, result);
        } catch (e) {
            mysqlUpdateErrorCallback(res, e)
        }
    });


    app.patch(API_DIR + '/' + tn.PLAYLIST + '/:id', auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const id = req.params.id;
        let startDate, endDate, startBlock, endBlock;
        let fields = {};
        //TODO - Check endDate with the existing startDate or vice versa

        if ('name' in req.body) {
            fields.name = req.body.name;
        }

        if ('groupId' in req.body) {
            fields.groupId = req.body.groupId;
        }

        if ('startDate' in req.body) {
            startDate = moment(req.body.startDate, DATETIME_FORMAT);
            if (!startDate.isValid()) {
                return res.send({success: false, data: 'Invalid field: startDate'});
            }
            fields.startDate = startDate.format(DATETIME_FORMAT);
        }

        if ('endDate' in req.body) {
            endDate = moment(req.body.endDate, DATETIME_FORMAT);
            if (!endDate.isValid()) {
                return res.send({success: false, data: 'Invalid field: endDate'});
            }

            if (startDate) {
                if (endDate.isBefore(startDate)) {
                    return res.send({success: false, data: 'endDate should be after startDate'});
                }
            }

            fields.endDate = endDate.format(DATETIME_FORMAT);
        }

        if ('repeated' in req.body) {
            fields.repeated = req.body.repeated;
        }

        if ('startBlock' in req.body) {
            startBlock = Number(req.body.startBlock);
            if (isNaN(startBlock)) {
                return res.send({success: false, data: 'Invalid field: startBlock'});
            }
            fields.startBlock = startBlock;
        }

        if ('endBlock' in req.body) {
            endBlock = Number(req.body.endBlock);
            if (isNaN(endBlock)) {
                return res.send({success: false, data: 'Invalid field: endBlock'});
            }

            if (startBlock && startBlock > endBlock) {
                return res.send({success: false, data: 'endBlock should be after startBlock'});
            }

            if (endBlock > moment.duration(1, 'day').asMinutes()) {
                return res.send({success: false, data: 'endBlock should be less than one day'});
            }

            fields.endBlock = endBlock;
        }

        try {
            let result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ? AND ownerId = ?', [tn.PLAYLIST, fields, id, ownerId]);
            await util.updateFirebaseDevicePlaylists();
            mysqlUpdateSuccessCallback(res, result);
        } catch (e) {
            mysqlUpdateErrorCallback(res, e)
        }
    });


    app.patch(API_DIR + '/' + tn.MEDIA + '/:id', auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const id = req.params.id;

        let fields = {};
        //TODO - Check endDate with the existing startDate or vice versa

        if ('name' in req.body) {
            fields.name = req.body.name;
        }

        if ('duration' in req.body) {
            fields.duration = req.body.duration;
        }

        try {
            let result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ? AND ownerId = ?', [tn.MEDIA, fields, id, ownerId]);
            await util.updateFirebaseDevicePlaylists();
            mysqlUpdateSuccessCallback(res, result);
        } catch (e) {
            mysqlUpdateErrorCallback(res, e)
        }
    });


    app.patch(API_DIR + '/' + tn.PLAYLIST_MEDIA + '/:id', auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const id = req.params.id;
        let fields = {};

        if ('playlistId' in req.body) {
            fields.playlistId = req.body.playlistId;
        }

        if ('mediaId' in req.body) {
            fields.mediaId = req.body.mediaId;
        }

        try {
            let result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ? AND ownerId = ?', [tn.PLAYLIST_MEDIA, fields, id, ownerId]);
            await util.updateFirebaseDevicePlaylists();
            mysqlUpdateSuccessCallback(res, result);
        } catch (e) {
            mysqlUpdateErrorCallback(res, e)
        }
    });
};