const mysql = require('mysql');
const mysqlAuth = (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return require('../auth/mysql.production.json');
        case 'stage':
        case 'test':
        case 'development':
        default:
            return require('../auth/mysql.json');
    }
})();

const connection = mysql.createConnection(mysqlAuth);

let connectionPromise;

const MysqlHandler = {
    start() {
        if (connection.state === 'authenticated') {
            return;
        }
        return new Promise((resolve, reject) => {
            connection.connect(function (err) {
                if (err) {
                    console.log('MySQL server connection error!');
                    return reject(err);
                }
                console.log('MySQL server connection successful!');
                return resolve(connection);
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
        const promise = new Promise((resolve, reject) => {
            connection.query(...arguments, function (error, result) {
                if (error) {
                    return reject(error);
                }

                return resolve(result);
            });
        });
        //If connection died, reconnect and query
        if (connection.state === 'disconnected') {
            return MysqlHandler.start().then(_ => promise);
        }
        return promise;
    },
    get() {
        return connectionPromise;
    },
};

module.exports = MysqlHandler;