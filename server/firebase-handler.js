const admin = require("firebase-admin");
const moment = require('moment');

const MySqlHandler = require('./mysql-handler');
const MySqlQuery = MySqlHandler.query;
const constants = require('./constants');
const serviceAccount = (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return require('../auth/plusboard-ch-firebase-adminsdk-i2tuf-abae981e1b.json');
        case 'development':
        default:
            return require("../auth/guness-billboard-firebase-adminsdk-1x3sw-f2efe34eb7.json");
    }
})();

const tn = constants.tableNames;
const fbf = constants.firebaseFields;
const DATETIME_FORMAT = constants.DATETIME_FORMAT;

function insertDevice(snapshot) {
    const s = snapshot.val();
    const device = {
        firebaseId: snapshot.key,
        appVersion: s.appVersion,
        device: s.device,
        lastOnline: s.lastOnline,
        osVersion: s.osVersion,
        status: s.status,
    };

    MySqlQuery('INSERT INTO ?? SET ?', [tn.DEVICE, device]).then(result => {
        console.log(`DEVICE with id ${result.insertId} ADDED!`);
    }).catch(error => {
        throw error
    });
}

function updateDevice(snapshot) {
    const s = snapshot.val();
    const device = {
        updatedAt: moment().format(DATETIME_FORMAT),
        firebaseId: snapshot.key,
        appVersion: s.appVersion,
        device: s.device,
        lastOnline: s.lastOnline,
        osVersion: s.osVersion,
        status: s.status,
    };

    MySqlQuery('UPDATE ?? SET ? WHERE firebaseId = ?', [tn.DEVICE, device, snapshot.key]).then(() => {
        console.log(`DEVICE with id ${snapshot.key} UPDATED!`);
    }).catch(error => {
        throw error
    });
}

function deleteDevice(snapshot) {
    MySqlQuery('DELETE FROM ?? WHERE firebaseId=?', [tn.DEVICE, snapshot.key]).then(() => {
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
