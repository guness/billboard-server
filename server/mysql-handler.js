const mysql = require('mysql');

//TODO - Change the following in case you connect to remote server
const mysqlAuth = require('../auth/mysql.json');
const connection = mysql.createConnection(mysqlAuth);

/*connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log(connection);

    console.log('connected as id ' + connection.threadId);

    connection.query("SELECT * FROM `users`", function(error, results){
        if(error) throw error;
        console.log(results);
    });

    connection.query('UPDATE users SET name = ? WHERE id = ?', ['user_' + Math.round(50 * Math.random()), 1],
        function (error, results, fields) {
        if (error) throw error;
        console.info('UPDATE SUCCESS')
    });

    connection.end();
});*/

let connectionPromise;

module.exports = {
    start(){
        if(connection.state === 'authenticated'){
            return;
        }
        connectionPromise = new Promise((resolve, reject)=>{
            connection.connect(function(err){
                if (err) {
                    reject(err);
                }
                resolve(connection);
            });
        });
    },
    end(){
        if(connection.state === 'authenticated'){
            connection.end();
        }
    },
    get(){
       return connectionPromise;
    }
};