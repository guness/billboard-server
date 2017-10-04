const socketIo = require('socket.io')
const MySqlHandler = require('./mysql-handler');
const FirebaseHandler = require('./firebase-handler');
const RestApiServer = require('./rest');

async function run() {
    await MySqlHandler.start();
    FirebaseHandler.listen();
    let httpServer = await RestApiServer.listen();
    let io = socketIo.listen(httpServer);

    io.sockets.on('connection', function (socket){});
}

run().catch(error => console.error);