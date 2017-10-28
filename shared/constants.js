const DB_PREFIX = (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 'plus_';
        case 'development':
        default:
            return '';
    }
})();

const EXPRESS_PORT = (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 80;
        case 'development':
        default:
            return 3000;
    }
})();

// Defines the host on which WEB CONTENT is served
const CLIENT_HOST = (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return "http://plusboard.ch";
        case 'development':
        default:
            return "http://localhost:8000";
    }
})();

// Defines the host on which REST API is served
const HOST = (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return `http://plusboard.ch${EXPRESS_PORT === 80 ? '' : `:${EXPRESS_PORT}`}`;
        case 'development':
        default:
            return `http://localhost:${EXPRESS_PORT}`;
    }
})();
console.log(CLIENT_HOST);

module.exports = {
    DB_PREFIX,
    EXPRESS_PORT,
    CLIENT_HOST,
    HOST,
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
    firebaseFields: {
        DEVICES: 'devices',
    },
    FIREBASE_DB_URL: 'https://plusboard-ch.firebaseio.com',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DATE_FORMAT: 'YYYY-MM-DD',
    UPLOADS_FOLDER: "uploads/",
    DEFAULT_DURATION: 10000, //in millis
    API_DIR: '/apiv1',
};