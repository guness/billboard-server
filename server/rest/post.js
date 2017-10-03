const moment = require('moment');

const MySqlHandler = require('../mysql-handler');

const constants = require('../constants');
const tn = constants.tableNames;
const DATE_FORMAT = constants.DATE_FORMAT;

const mysqlInsertCallback = function(res){
    return (error, result)=>{
        if (error) {
            return res.send({
                success: false,
                data: error.sqlMessage,
            });
        }

        return res.send({
            success: true,
            data: {id: result.insertId},
        });

    };
};


module.exports = function(app){
    /*POST SERVICES*/
    app.post('/' + tn.MEDIA, (req, res) => {

        let fields = {};
        /* TODO - @sinangunes */

        MySqlHandler.get().then((connection)=>{
            connection.query('INSERT INTO ?? SET ?', [tn.MEDIA, fields], mysqlInsertCallback(res));
        })
    });

    app.post('/' + tn.GROUP, (req, res) => {
        const name = req.body.name;
        if(!name){
            return res.send({success: false, data: 'Missing field: name'});
        }
        MySqlHandler.get().then((connection)=>{
            connection.query('INSERT INTO ?? SET ?', [tn.GROUP, {name: name}], mysqlInsertCallback(res));
        })
    });


    app.post('/' + tn.PLAYLIST, (req, res) => {
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

        MySqlHandler.get().then((connection)=>{
            connection.query('INSERT INTO ?? SET ?', [tn.PLAYLIST, fields], mysqlInsertCallback(res));
        });
    });

    app.post('/' + tn.PLAYLIST_MEDIA, (req, res) => {
        const playlistId = req.body.playlistId;
        const mediaId = req.body.mediaId;

        if(!playlistId){
            return res.send({success: false, data: 'Missing field: playlistId'});
        }

        if(!mediaId){
            return res.send({success: false, data: 'Missing field: mediaId'});
        }

        MySqlHandler.get().then((connection) => {
            connection.query('INSERT INTO ?? SET ?', [tn.PLAYLIST_MEDIA, {playlistId: playlistId, mediaId: mediaId}],
                mysqlInsertCallback(res));
        });

    });
};