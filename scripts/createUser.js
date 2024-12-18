//Usage: node __createUser username password
const MySqlHandler = require('../server/mysql-handler');
const EncryptHandler = require('../server/encyrpt-handler');
const tn = require('../src/constants').tableNames;

async function run() {
    const name = process.argv[2];
    const password = process.argv[3];
    if (!name || !password) {
        return console.log('Check username and password');
    }
    await MySqlHandler.start();
    const hashedPassword = await EncryptHandler.encrypt(password);
    let response = await MySqlHandler.query('INSERT INTO ?? SET ?', [tn.USER, {name, password: hashedPassword}]);
    console.log(response);
    MySqlHandler.connection.end();
}

run().catch(error => console.error);