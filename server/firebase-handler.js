const admin = require("firebase-admin");
const moment = require('moment');

const MySqlHandler = require('./mysql-handler');
const MySqlQuery = MySqlHandler.query;
const constants = require('./constants');
const serviceAccount = require("../auth/guness-billboard-firebase-adminsdk-1x3sw-f2efe34eb7.json");

const tn = constants.tableNames;
const fbf = constants.firebaseFields;
const DATETIME_FORMAT = constants.DATETIME_FORMAT;

function insertDevice(snapshot) {
    let device = Object.assign({firebaseId: snapshot.key}, snapshot.val());
    //don't add playlists field to db
    delete device.playlists;
    delete device.downloadStatus;
    delete device.mediaList;

    MySqlQuery('INSERT INTO ?? SET ?', [tn.DEVICE, device]).then(results => {
        console.log(`DEVICE with id ${results.insertId} ADDED!`);
    }).catch(error => {
        throw error
    });
}

function updateDevice(snapshot) {
    let device = Object.assign({updatedAt: moment().format(DATETIME_FORMAT)}, snapshot.val());
    //don't add playlists field to db
    delete device.playlists;
    MySqlQuery('UPDATE ?? SET ? WHERE firebaseId = ?', [tn.DEVICE, device, snapshot.key]).then(results => {
        console.log(`DEVICE with id ${snapshot.key} UPDATED!`);
    }).catch(error => {
        throw error
    });
}

function deleteDevice(snapshot) {
    MySqlQuery('DELETE FROM ?? WHERE firebaseId=?', [tn.DEVICE, snapshot.key]).then(results => {
        console.log(`DEVICE with id ${snapshot.key} REMOVED!`);
    }).catch(error => {
        throw error
    });
}

module.exports = {
    listen: function () {

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: constants.FIREBASE_DB_URL,
        });

        const db = admin.database();
        const ref = db.ref(fbf.DEVICES);


        // Attach an asynchronous callback to read the data at our posts reference
        ref.on("child_added", function (snapshot) {

            MySqlQuery('SELECT * FROM ?? WHERE firebaseId=?', [tn.DEVICE, snapshot.key]).then(results => {
                if (results.length === 0) {
                    insertDevice(snapshot);
                }
            }).catch(error => {
                throw error
            });
        }, function (errorObject) {
            throw errorObject;
        });


        ref.on("child_changed", updateDevice, errorObject => {
            throw errorObject;
        });

        ref.on("child_removed", deleteDevice, errorObject => {
            throw errorObject;
        });

        console.log('Firebase admin started listening!');
        this.ref = ref;
        return ref;
    },
    ref: null,
};
