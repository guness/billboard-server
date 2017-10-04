const mysql = require('mysql');

//TODO - Change the following in case you connect to remote server
const mysqlAuth = require('../auth/mysql.json');
const connection = mysql.createConnection(mysqlAuth);

let connectionPromise;

module.exports = {
    start() {
        if (connection.state === 'authenticated') {
            return;
        }
        return new Promise((resolve, reject) => {
            connection.connect(function (err) {
                if (err) {
                    reject(err);
                }
                console.log('MySQL server connection successful!');
                resolve(connection);
            });
        });
    },
    end() {
        if (connection.state === 'authenticated') {
            connection.end();
        }
    },
    connection: connection,
    query() {
        return new Promise((resolve, reject) => {
            connection.query(...arguments, function (error, result) {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        })
    },
    get () {
        return connectionPromise;
    },
};