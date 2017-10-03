const admin = require("firebase-admin");
const moment = require('moment');

const MySqlHandler = require('./mysql-handler');
const constants = require('./constants');
const serviceAccount = require("../auth/guness-billboard-firebase-adminsdk-1x3sw-f2efe34eb7.json");

const DB_DEVICE = constants.tableNames.DEVICE;
const FB_DEVICES = constants.firebaseFields.DEVICES;
const DATETIME_FORMAT = constants.DATETIME_FORMAT;

function insertDevice(connection, snapshot) {
    let device = Object.assign({firebaseId: snapshot.key}, snapshot.val());
    //don't add playlists field to db
    delete device.playlists;
    connection.query(`INSERT INTO ${DB_DEVICE} SET ?`, device, function (error, results) {
        if (error) {
            throw error;
        }
        console.log(`DEVICE with id ${results.insertId} ADDED!`);
    });
}

function updateDevice(connection, snapshot) {
    let device = Object.assign({updatedAt: moment().format(DATETIME_FORMAT)}, snapshot.val());
    //don't add playlists field to db
    delete device.playlists;
    let query = connection.query(`UPDATE ${DB_DEVICE} SET ? WHERE firebaseId = ?`, [device, snapshot.key], function (error) {
        if (error) {
            throw error;
        }

        console.log(`DEVICE with id ${snapshot.key} UPDATED!`);
    });

    console.log(query.sql);
}

function deleteDevice(connection, snapshot) {
    connection.query(`DELETE FROM ${DB_DEVICE} WHERE firebaseId=?`, [snapshot.key], function (error) {
        if (error) {
            throw error;
        }
        console.log(`DEVICE with id ${snapshot.key} REMOVED!`);
    });
}

module.exports = {
    listen: function () {

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: constants.FIREBASE_DB_URL,
        });

        const db = admin.database();
        const ref = db.ref(FB_DEVICES);


        // Attach an asynchronous callback to read the data at our posts reference
        ref.on("child_added", function (snapshot) {

            MySqlHandler.get().then(connection => {
                connection.query(`SELECT * FROM ${DB_DEVICE} WHERE firebaseId=?`, snapshot.key, function (error, results) {
                    if (error) {
                        throw error;
                    }
                    if (results.length === 0) {
                        insertDevice(connection, snapshot);
                    }
                });
            });
        }, function (errorObject) {
            throw errorObject;
        });


        ref.on("child_changed", function (snapshot) {
            MySqlHandler.get().then(connection => {
                updateDevice(connection, snapshot);
            });
        }, function (errorObject) {
            throw errorObject;
        });

        ref.on("child_removed", function (snapshot) {
            MySqlHandler.get().then(connection => {
                deleteDevice(connection, snapshot);
            });
        }, function (errorObject) {
            throw errorObject;
        });

        console.log('Firebase admin started listening!');
        return ref;
    },
};
