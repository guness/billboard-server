const moment = require('moment');

const MySqlHandler = require('../mysql-handler');
const util = require('../util');
const MySqlQuery = MySqlHandler.query;

const constants = require('../constants');
const tn = constants.tableNames;
const DATE_FORMAT = constants.DATE_FORMAT;

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

module.exports = function(app){
    /*POST SERVICES*/
    app.post('/' + tn.MEDIA, async (req, res) => {

        let fields = {};
        /* TODO - @sinangunes */

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.MEDIA, fields]);
            await util.updateFirebaseDevicePlaylists();
            mysqlInsertSuccessCallback(res, result);
        }catch (e){
            mysqlInsertFailCallback(res, e)
        }
    });

    app.post('/' + tn.GROUP, async (req, res) => {
        const name = req.body.name;
        if(!name){
            return res.send({success: false, data: 'Missing field: name'});
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.GROUP, {name: name}]);
            await util.updateFirebaseDevicePlaylists();
            mysqlInsertSuccessCallback(res, result);

        }catch (e){
            mysqlInsertFailCallback(res, e)
        }
    });


    app.post('/' + tn.PLAYLIST, async (req, res) => {
        const name = req.body.name;
        const startDate = moment(req.body.startDate, DATE_FORMAT);
        const endDate = moment(req.body.endDate, DATE_FORMAT);
        const repeated = req.body.repeated;
        const startBlock = Number(req.body.startBlock);
        const endBlock = Number(req.body.endBlock);

        let fields = {
            name: name,
            startDate: startDate.format(DATE_FORMAT),
            endDate: endDate.format(DATE_FORMAT),
        };

        if(!name){
            return res.send({success: false, data: 'Missing field: name'});
        }

        if(!startDate.isValid()){
            return res.send({success: false, data: 'Invalid field: startDate'});
        }

        if(!endDate.isValid()){
            return res.send({success: false, data: 'Invalid field: endDate'});
        }

        if(endDate.isBefore(startDate)){
            return res.send({success: false, data: 'endDate should be after startDate'});
        }

        if (repeated) {
            if(isNaN(startBlock)){
                return res.send({success: false, data: 'Invalid field: startBlock'});
            }
            if(isNaN(endBlock)){
                return res.send({success: false, data: 'Invalid field: endBlock'});
            }
            if(startBlock > endBlock){
                return res.send({success: false, data: 'endBlock should be after startBlock'});
            }

            if(endBlock > moment.duration(1, 'day').asMinutes()){
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

        }catch (e){
            mysqlInsertFailCallback(res, e)
        }

    });

    app.post('/' + tn.PLAYLIST_MEDIA, async (req, res) => {
        const playlistId = req.body.playlistId;
        const mediaId = req.body.mediaId;
        const fields = {
            playlistId: playlistId,
            mediaId: mediaId
        };

        if(!playlistId){
            return res.send({success: false, data: 'Missing field: playlistId'});
        }

        if(!mediaId){
            return res.send({success: false, data: 'Missing field: mediaId'});
        }

        try {
            let result = await MySqlQuery('INSERT INTO ?? SET ?', [tn.PLAYLIST_MEDIA, fields]);
            await util.updateFirebaseDevicePlaylists();
            mysqlInsertSuccessCallback(res, result);
        }catch (e){
            mysqlInsertFailCallback(res, e)
        }

    });
};