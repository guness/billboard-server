const MySqlHandler = require('./mysql-handler');
const FirebaseHandler = require('./firebase-handler');
const RestApiServer = require('./rest');

MySqlHandler.start();
FirebaseHandler.listen();
RestApiServer.listen();
//TODO - Add SocketIO listener

//handler.update({'-KtIFvmhdc6SvJ6pycng/playlists': {playlist1: [{media1: {type: 'IMAGE'}}, {media3: {type: 'VIDEO'}}],playlist2: [{media3: {type: 'IMAGE'}}, {media4: {type: 'VIDEO'}}],},});