var mysql = require('mysql');

//TODO - Change the following in case you connect to remote server
const mysqlAuth = require('../auth/mysql.local.json');
const connection = mysql.createConnection(mysqlAuth);

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

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

    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });

    connection.end();
});

module.exports = connection;