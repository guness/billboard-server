const DB_PREFIX = (function () {
    switch (process.env.NODE_CONF) {
        case 'production':
            return 'plus_';
        case 'stage':
        case 'test':
        case 'development':
        default:
            return '';
    }
})();

const EXPRESS_PORT = (function () {
    switch (process.env.NODE_CONF) {
        case 'production':
        case 'stage':
        case 'test':
            return 80;
        case 'development':
        default:
            return 3000;
    }
})();

// Defines the host on which WEB CONTENT is served
const CLIENT_HOST = (function () {
    switch (process.env.NODE_CONF) {
        case 'production':
        case 'stage':
        case 'test':
            return '';
        case 'development':
        default:
            return 'http://localhost:8000';
    }
})();

const PROTOCOL = EXPRESS_PORT === 443 ? 'https' : 'http';

const HOSTNAME = (function () {
    switch (process.env.NODE_CONF) {
        case 'production':
            return 'plusboard.ch';
        case 'stage':
            return 'stage.plusboard.ch';
        case 'test':
        case 'development':
        default:
            return `localhost`;
    }
})();

const URL_PORT = EXPRESS_PORT === 80 ? '' : `:${EXPRESS_PORT}`;
// Defines the host on which REST API is served
const HOST = `${PROTOCOL}://${HOSTNAME}${URL_PORT}`

const FIREBASE_DB_URL = (function () {
    switch (process.env.NODE_CONF) {
        case 'production':
            return 'https://plusboard-ch.firebaseio.com';
        case 'stage':
        case 'test':
        case 'development':
        default:
            return 'https://guness-billboard.firebaseio.com';
    }
})();



module.exports = {
    DB_PREFIX,
    EXPRESS_PORT,
    CLIENT_HOST,
    HOST,
    HOSTNAME,
    FIREBASE_DB_URL,
    tableNames: {
        USER: `${DB_PREFIX}user`,
        OWNER: `${DB_PREFIX}owner`,
        USER_OWNER: `${DB_PREFIX}userOwner`,
        DEVICE: `${DB_PREFIX}device`,
        GROUP: `${DB_PREFIX}group`,
        MEDIA: `${DB_PREFIX}media`,
        PLAYLIST: `${DB_PREFIX}playlist`,
        PLAYLIST_MEDIA: `${DB_PREFIX}playlistMedia`,
    },
    viewNames: {
        DEVICE_WITH_MEDIA: `${DB_PREFIX}deviceWithMedia`,
    },
    procedureNames: {
        OWNERS_BY_USER: `${DB_PREFIX}OwnersByUser`,
    },
    firebaseFields: {
        DEVICES: 'devices',
    },
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DATE_FORMAT: 'YYYY-MM-DD',
    UPLOADS_FOLDER: "uploads/",
    DEFAULT_DURATION: 10000, //in millis
    API_DIR: '/apiv1',
};
