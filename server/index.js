const express = require('express');
const moment = require('moment');
const MySqlHandler = require('./mysql-handler');
const constants = require('./constants');
const tn = constants.tableNames;
const DATE_FORMAT = constants.DATE_FORMAT;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const PORT = 3000;

MySqlHandler.start();

const mysqlResultCallback = function(res){
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

app.get('/', function (req, res) {
    res.send('Hello World!')
});

/*GET SERVICES - All in one*/
app.get(`/:table((${tn.DEVICE}|${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))`, (req, res) => {
    const table = req.params.table;
    MySqlHandler.get().then(connection => {
        // TODO - Make sure you add required parameters
        let query = connection.query(`SELECT * FROM ??`, table, (error, results) => {
            if (error) {
                return res.send({
                    success: false,
                    data: error.sqlMessage,
                })
            }
            return res.send({
                success: true,
                data: results,
            });
        });
    });
});

/*POST SERVICES*/
app.post('/' + tn.MEDIA, (req, res) => {

    let fields = {};
    /* TODO - @sinangunes */

    MySqlHandler.get().then((connection)=>{
        connection.query('INSERT INTO ?? SET ?', [tn.MEDIA, fields], mysqlResultCallback(res));
    })
});

app.post('/' + tn.GROUP, (req, res) => {
    const name = req.body.name;
    if(!name){
        return res.send({success: false, data: 'Missing field: name'});
    }
    MySqlHandler.get().then((connection)=>{
        connection.query('INSERT INTO ?? SET ?', [tn.GROUP, {name: name}], mysqlResultCallback(res));
    })
});


app.post('/' + tn.PLAYLIST, (req, res) => {
    const name = req.body.name;
    const startDate = moment(req.body.startDate, DATE_FORMAT);
    const endDate = moment(req.body.endDate, DATE_FORMAT);
    const repeated = req.body.repeated;
    const startBlock = parseInt(req.body.startBlock, 10);
    const endBlock = parseInt(req.body.endBlock, 10);

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
        connection.query('INSERT INTO ?? SET ?', [tn.PLAYLIST, fields], mysqlResultCallback(res));
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
            mysqlResultCallback(res));
    });

});


app.listen(PORT, function () {
    console.log('Example app listening on port 3000!')
});
