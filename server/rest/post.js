const moment = require('moment');
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');

const MySqlHandler = require('../mysql-handler');
const {ExifTool} = require('exiftool-vendored');
const exifTool = new ExifTool();
const util = require('../util');
const MySqlQuery = MySqlHandler.query;
const auth = require('./auth');

const constants = require('../../src/constants');
const tn = constants.tableNames;
const {DATETIME_FORMAT, API_DIR} = constants;

const upload = multer({
    dest: constants.UPLOADS_FOLDER,
    limits: {
        files: 1,
    },
});

const {allowedImageFormats, allowedVideoFormats} = constants;

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


    app.post(`${API_DIR}/${tn.USER}/login`, auth.isNotLoggedIn, (req, res) => {
        passport.authenticate('local', function (err, user) {
            if (req.xhr) {
                if (err) {
                    return res.json({success: false, data: err.message});
                }
                if (!user) {
                    return res.json({success: false, data: "Invalid Login"});
                }
                req.login(user, {}, function (err) {
                    if (err) {
                        return res.json({success: err});
                    }
                    return res.json({
                        success: true,
                        data: {
                            id: req.user.id,
                        },
                    });
                });
            } else {
                if (err) {
                    return res.redirect('/login');
                }
                if (!user) {
                    return res.redirect('/login');
                }
                req.login(user, {}, function (err) {
                    if (err) {
                        return res.redirect('/login');
                    }
                    return res.redirect('/');
                });
            }
        })(req, res);
    });

    app.post(API_DIR + '/' + tn.MEDIA, auth.isLoggedIn, upload.any(), async (req, res) => {
        const ownerId = req.user.currentOwner.id;

        if (!req.files) {
            return res.send({success: false, data: 'No files were uploaded.'});
        }
        let file = req.files[0];
        if (!file) {
            return res.send({success: false, data: 'No files were uploaded.'});
        }

        const splittedMimetype = file.mimetype.split('/');
        const [fileType, extension] = splittedMimetype;
        let duration = constants.DEFAULT_DURATION;

        let tags;
        try {
            tags = await exifTool.read(file.path);
        } catch (e) {
            console.error(e.message || 'No files were uploaded: could not probe file');
            fs.unlinkSync(file.path);
            return res.send({success: false, data: 'Media is not allowed.'});
        }

        let mimeType = tags.MIMEType;

        if (!tags.MIMEType) {
            mimeType = file.mimetype
        }

        if (tags.MIMEType !== file.mimetype) {
            console.warn('exif mimeType(' + tags.MIMEType + ') and browser mimeType(' + file.mimetype + ') does not match for file: ' + file.path)
        }

        if (fileType === 'image') {
            if (allowedImageFormats.indexOf(extension) === -1) {
                fs.unlinkSync(file.path);
                return res.send({
                    success: false,
                    data: `Unknown image type. Please select one of ${allowedImageFormats.join(', ')}.`
                });
            }
        } else if (fileType === 'video') {

            if (allowedVideoFormats.indexOf(extension) === -1) {
                fs.unlinkSync(file.path);
                return res.send({
                    success: false,
                    data: `Unknown video type. Please select one of ${allowedVideoFormats.join(', ')}.`
                });
            }

            let momentDuration;
            let durationRegex = /([0-9.]+)\ss+/; //e.g. '10.5 s'

            if (durationRegex.test(tags.Duration)) {
                momentDuration = moment.duration(Number(durationRegex.exec(tags.Duration)[1]), 'seconds')
            } else {
                momentDuration = moment.duration(tags.Duration);
            }
            duration = momentDuration.asMilliseconds()

        } else {
            fs.unlinkSync(file.path);
            return res.send({success: false, data: 'Unknown media type. Please select video or image.'});
        }

        let fields = {
            name: file.originalname,
            path: file.path,
            url: req.protocol + '://' + req.get('host') + '/' + tn.MEDIA + "/" + file.filename,
            mimeType,
            duration,
            ownerId,
        };

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.MEDIA, fields]);
            mysqlInsertSuccessCallback(res, result);
        } catch (e) {
            fs.unlinkSync(file.path);
            mysqlInsertFailCallback(res, e)
        }
    });

    app.post(API_DIR + '/' + tn.GROUP, auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const name = req.body.name;
        if (!name) {
            return res.send({success: false, data: 'Missing field: name'});
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.GROUP, {name: name, ownerId}]);
            await util.updateFirebaseDevicePlaylists(ownerId);
            mysqlInsertSuccessCallback(res, result);

        } catch (e) {
            mysqlInsertFailCallback(res, e)
        }
    });

    app.post(API_DIR + '/' + tn.TICKER, auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const {name, content, type, tickerlistId} = req.body;

        let fields = {
            name, content, type, tickerlistId,
            ownerId,
        };

        if (!name) {
            return res.send({success: false, data: 'Missing field: name'});
        }

        if (!content) {
            return res.send({success: false, data: 'Missing field: content'});
        }

        if (!type) {
            return res.send({success: false, data: 'Missing field: type'});
        }

        if (!tickerlistId) {
            return res.send({success: false, data: 'Missing field: tickerlistId'});
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.TICKER, fields]);
            await util.updateFirebaseDevicePlaylists(ownerId);
            mysqlInsertSuccessCallback(res, result);

        } catch (e) {
            mysqlInsertFailCallback(res, e)
        }
    });


    app.post(`${API_DIR}/:table((${tn.TICKERLIST}|${tn.PLAYLIST}))`, auth.isLoggedIn, async (req, res) => {
        const table = req.params.table;
        const ownerId = req.user.currentOwner.id;

        const {
            name,
            groupId,
            repeated,
            fontSize,
            color,
            speed,
            startDate: startDateStr,
            endDate: endDateStr,
            startBlock: startBlockStr,
            endBlock: endBlockStr
        } = req.body;

        const startDate = moment(startDateStr, DATETIME_FORMAT);
        const endDate = moment(endDateStr, DATETIME_FORMAT);
        const startBlock = Number(startBlockStr);
        const endBlock = Number(endBlockStr);

        let fields = {
            name: name,
            groupId: groupId,
            startDate: startDate.format(DATETIME_FORMAT),
            endDate: endDate.format(DATETIME_FORMAT),
            ownerId,
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

        if (table === tn.TICKERLIST) {
            if (isNaN(fontSize)) {
                return res.send({success: false, data: 'Invalid field: fontSize'});
            }
            if (isNaN(speed)) {
                return res.send({success: false, data: 'Invalid field: speed'});
            }
            if (isNaN(parseInt(color, 16))) {
                return res.send({success: false, data: 'Invalid field: color'});
            }

            Object.assign(fields, {
                fontSize,
                speed,
                color
            });
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [table, fields]);
            await util.updateFirebaseDevicePlaylists(ownerId);
            mysqlInsertSuccessCallback(res, result);

        } catch (e) {
            mysqlInsertFailCallback(res, e)
        }

    });

    app.post(API_DIR + '/' + tn.PLAYLIST_MEDIA, auth.isLoggedIn, async (req, res) => {
        const ownerId = req.user.currentOwner.id;
        const playlistId = req.body.playlistId;
        const mediaId = req.body.mediaId;
        const fields = {
            playlistId: playlistId,
            mediaId: mediaId,
            ownerId,
        };

        if (!playlistId) {
            return res.send({success: false, data: 'Missing field: playlistId'});
        }

        if (!mediaId) {
            return res.send({success: false, data: 'Missing field: mediaId'});
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.PLAYLIST_MEDIA, fields]);
            await util.updateFirebaseDevicePlaylists(ownerId);
            mysqlInsertSuccessCallback(res, result);
        } catch (e) {
            mysqlInsertFailCallback(res, e)
        }

    });
};