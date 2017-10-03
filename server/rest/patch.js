const moment = require('moment');

const MySqlHandler = require('../mysql-handler');

const constants = require('../constants');
const tn = constants.tableNames;
const DATE_FORMAT = constants.DATE_FORMAT;

const mysqlUpdateCallback = (res) => {
    return (error, result)=>{
        if (error) {
            return res.send({
                success: false,
                data: error.sqlMessage,
            });
        }

        return res.send({
            success: true,
            data: result.message,
        });

    };
};

module.exports = function (app) {

    /*PATCH SERVICES*/
    app.patch('/' + tn.DEVICE + '/:id', (req, res) => {
        const id = req.params.id;
        const groupId = req.body.groupId;

        if (!groupId) {
            return res.send({success: false, data: 'Missing field: groupId'});
        }

        MySqlHandler.get().then((connection) => {
            connection.query('UPDATE ?? SET ? WHERE id = ?', [tn.DEVICE, {groupId: groupId}, id],
                mysqlUpdateCallback(res));
        });
    });

    app.patch('/' + tn.GROUP + '/:id', (req, res) => {
        const id = req.params.id;
        const name = req.body.name;

        if (!name) {
            return res.send({success: false, data: 'Missing field: name'});
        }

        MySqlHandler.get().then((connection) => {
            connection.query('UPDATE ?? SET ? WHERE id = ?', [tn.GROUP, {name: name}, id],
                mysqlUpdateCallback(res));
        });
    });


    app.patch('/' + tn.PLAYLIST + '/:id', (req, res) => {
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
            startDate = moment(req.body.startDate, DATE_FORMAT);
            if (!startDate.isValid()) {
                return res.send({success: false, data: 'Invalid field: startDate'});
            }
            fields.startDate = startDate.format(DATE_FORMAT);
        }

        if ('endDate' in req.body) {
            endDate = moment(req.body.endDate, DATE_FORMAT);
            if (!endDate.isValid()) {
                return res.send({success: false, data: 'Invalid field: endDate'});
            }

            if (startDate) {
                if (endDate.isBefore(startDate)) {
                    return res.send({success: false, data: 'endDate should be after startDate'});
                }
            }

            fields.endDate = endDate.format(DATE_FORMAT);
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


        MySqlHandler.get().then((connection) => {
            connection.query('UPDATE ?? SET ? WHERE id = ?', [tn.PLAYLIST, fields, id],
                mysqlUpdateCallback(res));
        });
    });


    app.patch('/' + tn.MEDIA + '/:id', (req, res) => {
        const id = req.params.id;
        const name = req.body.name;

        if (!name) {
            return res.send({success: false, data: 'Missing field: name'});
        }

        MySqlHandler.get().then((connection) => {
            connection.query('UPDATE ?? SET ? WHERE id = ?', [tn.MEDIA, {name: name}, id],
                mysqlUpdateCallback(res));
        });
    });


    app.patch('/' + tn.PLAYLIST_MEDIA + '/:id', (req, res) => {
        const id = req.params.id;
        let fields = {};

        if ('playlistId' in req.body) {
            fields.playlistId = req.body.playlistId;
        }

        if ('mediaId' in req.body) {
            fields.mediaId = req.body.mediaId;
        }

        MySqlHandler.get().then((connection) => {
            connection.query('UPDATE ?? SET ? WHERE id = ?', [tn.PLAYLIST_MEDIA, fields, id],
                mysqlUpdateCallback(res));
        });
    });
};