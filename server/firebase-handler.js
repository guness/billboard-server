const admin = require("firebase-admin");
const MySqlHandler = require('./mysql-handler');
const moment = require('moment');

const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const TABLE_DEVICE = 'device';

//Start Connection
MySqlHandler.start();

const serviceAccount = require("../auth/guness-billboard-firebase-adminsdk-1x3sw-f2efe34eb7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guness-billboard.firebaseio.com"
});

const db = admin.database();
const ref = db.ref("devices");


function insertDevice(connection, snapshot){
    let device = Object.assign({firebaseId: snapshot.key}, snapshot.val());
    connection.query(`INSERT INTO ${TABLE_DEVICE} SET ?`, device, function (error, results) {
        if (error) {
            throw error
        }
        console.log(`DEVICE with id ${results.insertId} ADDED!`);
    });
}

function updateDevice(connection, snapshot){
    let device = Object.assign({updatedAt: moment().format(DATETIME_FORMAT)}, snapshot.val());
    let query = connection.query(`UPDATE ${TABLE_DEVICE} SET ? WHERE firebaseId = ?`, [device, snapshot.key], function (error) {
        if (error) {
            throw error
        }

        console.log(`DEVICE with id ${snapshot.key} UPDATED!`);
    });

    console.log(query.sql);
}

function deleteDevice(connection, snapshot) {
    connection.query(`DELETE FROM ${TABLE_DEVICE} WHERE firebaseId=?`, [snapshot.key], function (error) {
        if (error) throw error;
        console.log(`DEVICE with id ${snapshot.key} REMOVED!`);
    });
}

// Attach an asynchronous callback to read the data at our posts reference
ref.on("child_added", function(snapshot) {

    MySqlHandler.get().then(connection => {
        connection.query(`SELECT * FROM ${TABLE_DEVICE} WHERE firebaseId=?`, snapshot.key, function (error, results) {
            if (error) throw error;
            if (results.length === 0) {
                insertDevice(connection, snapshot);
            }
        });
    });
}, function (errorObject) {
    throw errorObject;
});


ref.on("child_changed", function(snapshot) {
    MySqlHandler.get().then(connection => {
        updateDevice(connection, snapshot);
    });
}, function (errorObject) {
    throw errorObject;
});

ref.on("child_removed", function(snapshot) {
    let device = Object.assign({firebaseId: snapshot.key}, snapshot.val());

    MySqlHandler.get().then(connection => {
        deleteDevice(connection, snapshot);
    });
}, function (errorObject) {
    throw errorObject;
});
