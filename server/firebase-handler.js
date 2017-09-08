const admin = require("firebase-admin");

const serviceAccount = require("../auth/guness-billboard-firebase-adminsdk-1x3sw-f2efe34eb7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guness-billboard.firebaseio.com"
});

// Get a database reference to our blog
var db = admin.database();
var ref = db.ref("server/saving-data/fireblog");

var usersRef = ref.child("users");
usersRef.set({
    alanisawesome: {
        date_of_birth: "June 23, 1912",
        full_name: "Alan Turing"
    },
    gracehop: {
        date_of_birth: "December 9, 1906",
        full_name: "Grace Hopper"
    }
});
