const admin = require("firebase-admin");
const MySqlHandler = require('./mysql-handler');

//Start Connection
MySqlHandler.start();

const serviceAccount = require("../auth/guness-billboard-firebase-adminsdk-1x3sw-f2efe34eb7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guness-billboard.firebaseio.com"
});

const db = admin.database();
const ref = db.ref("devices");

// Attach an asynchronous callback to read the data at our posts reference
ref.on("child_added", function(snapshot) {

    let device = Object.assign({firebaseId: snapshot.key}, snapshot.val());

    MySqlHandler.get().then(connection => {
        connection.query("SELECT * FROM `devices` WHERE firebaseId=?", snapshot.key, function (error, results) {
            if (error) throw error;
            if (results.length === 0) {
                connection.query('INSERT INTO devices SET ?', device, function (error, results) {
                    if (error) {
                        throw error
                    }
                    console.log(`DEVICE with id ${results.insertId} ADDED!`);
                });
            }
        });
    });

    console.log(device);

}, function (errorObject) {
    throw errorObject;
});


ref.on("child_removed", function(snapshot) {
    let device = Object.assign({firebaseId: snapshot.key}, snapshot.val());

    MySqlHandler.get().then(connection => {
        connection.query("DELETE FROM `devices` WHERE firebaseId=?", [snapshot.key], function (error) {
            if (error) throw error;
            console.log(`DEVICE with id ${snapshot.key} REMOVED!`);
        });
    });

    console.log(device);
}, function (errorObject) {
    throw errorObject;
});
