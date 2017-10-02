var mysql = require('mysql');

//TODO - Change the following in case you connect to remote server
const mysqlAuth = require('../auth/mysql.json');
const connection = mysql.createConnection(mysqlAuth);

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