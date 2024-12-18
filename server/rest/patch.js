const moment = require('moment');

const MySqlHandler = require('../mysql-handler');
const FirebaseHandler = require('../firebase-handler');
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
        const {groupId, name } = req.body;
        let fields = {};

        if (typeof groupId !== 'undefined') {
            fields.groupId = groupId;
        }

        if (typeof name !== 'undefined') {
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
                const firebaseIdResult = await MySqlQuery('SELECT firebaseId from ?? WHERE id = ?', [tn.DEVICE, id]);
                const {firebaseId} = firebaseIdResult[0];
                FirebaseHandler.ref.update({
                    [`${firebaseId}/isActive`]: true,
                });
            } else {
                result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ? AND (ownerId = ? OR ownerId IS NULL)', [tn.DEVICE, fields, id, ownerId]);
            }

            await util.updateFirebaseDevicePlaylists(ownerId);
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
            await util.updateFirebaseDevicePlaylists(ownerId);
            mysqlUpdateSuccessCallback(res, result);
        } catch (e) {
            mysqlUpdateErrorCallback(res, e)
        }
    });

    app.patch(API_DIR + '/' + tn.TICKER + '/:id', auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const id = req.params.id;
        const {name, content, type, tickerlistId} = req.body;
        let fields = {};

        if (typeof name !== 'undefined') {
            fields.name = name;
        }

        if (typeof content !== 'undefined') {
            fields.content = content;
        }

        if (typeof type !== 'undefined') {
            fields.type = type;
        }

        if (typeof tickerlistId !== 'undefined') {
            fields.tickerlistId = tickerlistId;
        }

        if (Object.values(fields).length === 0) {
            return res.send({ success: false, data: 'Nothing to update. Please check your paramaters.' });
        }

        try {
            let result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ? AND ownerId = ?', [tn.TICKER, fields, id, ownerId]);
            await util.updateFirebaseDevicePlaylists(ownerId);
            mysqlUpdateSuccessCallback(res, result);
        } catch (e) {
            mysqlUpdateErrorCallback(res, e)
        }
    });


    app.patch(`${API_DIR}/:table((${tn.PLAYLIST}|${tn.TICKERLIST}))/:id`, auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const { id, table} = req.params;
        let startDateMom, endDateMom, startBlock, endBlock;
        let fields = {};
        const {
            name,
            groupId,
            itemOrder,
            repeated,
            fontSize,
            color,
            speed,
        } = req.body;
        //TODO - Check endDate with the existing startDate or vice versa

        if (typeof name !== 'undefined') {
            fields.name = name;
        }

        if (typeof groupId !== 'undefined') {
            fields.groupId = groupId;
        }

        if (typeof itemOrder !== 'undefined') {
            fields.itemOrder = itemOrder;
        }

        if ('startDate' in req.body) {
            startDateMom = moment(req.body.startDate, DATETIME_FORMAT);
            if (!startDateMom.isValid()) {
                return res.send({success: false, data: 'Invalid field: startDate'});
            }
            fields.startDate = startDateMom.format(DATETIME_FORMAT);
        }

        if ('endDate' in req.body) {
            endDateMom = moment(req.body.endDate, DATETIME_FORMAT);
            if (!endDateMom.isValid()) {
                return res.send({success: false, data: 'Invalid field: endDate'});
            }

            if (startDateMom) {
                if (endDateMom.isBefore(startDateMom)) {
                    return res.send({success: false, data: 'endDate should be after startDate'});
                }
            }

            fields.endDate = endDateMom.format(DATETIME_FORMAT);
        }

        if ('repeated' in req.body) {
            fields.repeated = repeated;
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

        if (table === tn.TICKERLIST) {
            if (typeof fontSize !== 'undefined') {
                fields.fontSize = fontSize;
            }
            if (typeof speed !== 'undefined') {
                fields.speed = speed;
            }
            if (typeof color !== 'undefined') {
                fields.color = color;
            }
        }

        if (Object.values(fields).length === 0) {
            return res.send({ success: false, data: 'Nothing to update. Please check your parameters.' });
        }

        try {
            let result = await MySqlQuery('UPDATE ?? SET ? WHERE id = ? AND ownerId = ?', [table, fields, id, ownerId]);
            await util.updateFirebaseDevicePlaylists(ownerId);
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
            await util.updateFirebaseDevicePlaylists(ownerId);
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
            await util.updateFirebaseDevicePlaylists(ownerId);
            mysqlUpdateSuccessCallback(res, result);
        } catch (e) {
            mysqlUpdateErrorCallback(res, e)
        }
    });
};