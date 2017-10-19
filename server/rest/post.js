const moment = require('moment');

const MySqlHandler = require('../mysql-handler');
const util = require('../util');
const MySqlQuery = MySqlHandler.query;
const multer = require('multer');
const fs = require('fs');

const constants = require('../constants');
const tn = constants.tableNames;
const {DATE_FORMAT, API_DIR} = constants;

const upload = multer({
    dest: constants.UPLOADS_FOLDER,
    limits: {
        files: 1
    }
});

const mysqlInsertFailCallback = (res, error) => {
    return res.send({
        success: false,
        data: error.message || error.sqlMessage,
    });
};

const mysqlInsertSuccessCallback = (res, result) => {
    return res.send({
        success: true,
        data: {id: result.insertId},
    });
};

module.exports = function (app) {
    /*POST SERVICES*/
    app.post(API_DIR + '/' + tn.MEDIA, upload.any(), async (req, res) => {
        if (!req.files) {
            return res.send({success: false, data: 'No files were uploaded.'});
        }
        let file = req.files[0];
        if (!file) {
            return res.send({success: false, data: 'No files were uploaded.'});
        }

        let fields = {
            name: file.originalname,
            path: file.path,
            url: req.protocol + '://' + req.get('host') + '/' + tn.MEDIA + "/" + file.filename,
            mimeType: file.mimetype,
            duration: constants.DEFAULT_DURATION
        };

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.MEDIA, fields]);
            mysqlInsertSuccessCallback(res, result);
        } catch (e) {
            fs.unlinkSync(file.path);
            mysqlInsertFailCallback(res, e)
        }
    });

    app.post(API_DIR + '/' + tn.GROUP, async (req, res) => {
        const name = req.body.name;
        if (!name) {
            return res.send({success: false, data: 'Missing field: name'});
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.GROUP, {name: name}]);
            await util.updateFirebaseDevicePlaylists();
            mysqlInsertSuccessCallback(res, result);

        } catch (e) {
            mysqlInsertFailCallback(res, e)
        }
    });


    app.post(API_DIR + '/' + tn.PLAYLIST, async (req, res) => {
        const name = req.body.name;
        const groupId = req.body.groupId;
        const startDate = moment(req.body.startDate, DATE_FORMAT);
        const endDate = moment(req.body.endDate, DATE_FORMAT);
        const repeated = req.body.repeated;
        const startBlock = Number(req.body.startBlock);
        const endBlock = Number(req.body.endBlock);

        let fields = {
            name: name,
            groupId: groupId,
            startDate: startDate.format(DATE_FORMAT),
            endDate: endDate.format(DATE_FORMAT),
        };

        if (!name) {
            return res.send({success: false, data: 'Missing field: name'});
        }

        if (!startDate.isValid()) {
            return res.send({success: false, data: 'Invalid field: startDate'});
        }

        if (!endDate.isValid()) {
            return res.send({success: false, data: 'Invalid field: endDate'});
        }

        if (endDate.isBefore(startDate)) {
            return res.send({success: false, data: 'endDate should be after startDate'});
        }

        if (repeated) {
            if (isNaN(startBlock)) {
                return res.send({success: false, data: 'Invalid field: startBlock'});
            }
            if (isNaN(endBlock)) {
                return res.send({success: false, data: 'Invalid field: endBlock'});
            }
            if (startBlock > endBlock) {
                return res.send({success: false, data: 'endBlock should be after startBlock'});
            }

            if (endBlock > moment.duration(1, 'day').asMinutes()) {
                return res.send({success: false, data: 'endBlock should be less than one day'});
            }

            Object.assign(fields, {
                repeated: true,
                startBlock: startBlock,
                endBlock: endBlock,
            });
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.PLAYLIST, fields]);
            await util.updateFirebaseDevicePlaylists();
            mysqlInsertSuccessCallback(res, result);

        } catch (e) {
            mysqlInsertFailCallback(res, e)
        }

    });

    app.post(API_DIR + '/' + tn.PLAYLIST_MEDIA, async (req, res) => {
        const playlistId = req.body.playlistId;
        const mediaId = req.body.mediaId;
        const fields = {
            playlistId: playlistId,
            mediaId: mediaId
        };

        if (!playlistId) {
            return res.send({success: false, data: 'Missing field: playlistId'});
        }

        if (!mediaId) {
            return res.send({success: false, data: 'Missing field: mediaId'});
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.PLAYLIST_MEDIA, fields]);
            await util.updateFirebaseDevicePlaylists();
            mysqlInsertSuccessCallback(res, result);
        } catch (e) {
            mysqlInsertFailCallback(res, e)
        }

    });
};