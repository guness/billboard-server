const DB_PREFIX = (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 'plus_';
        case 'stage':
        case 'test':
        case 'development':
        default:
            return '';
    }
})();

const EXPRESS_PORT = process.env.PORT || (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 80;
        case 'stage':
        case 'test':
            return 4000;
        case 'development':
        default:
            return 3000;
    }
})();

// Defines the host on which WEB CONTENT is served
const CLIENT_HOST = process.env.CLIENT_HOST || (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
        case 'stage':
        case 'test':
            return '';
        case 'development':
        default:
            return 'http://localhost:8000';
    }
})();

// Defines the host on which REST API is served
const HOST = process.env.HOST || (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 'http://plusboard.ch';
        case 'stage':
            return `http://stage.plusboard.ch${EXPRESS_PORT === 80 ? '' : `:${EXPRESS_PORT}`}`;
        case 'test':
        case 'development':
        default:
            return `http://localhost:${EXPRESS_PORT}`;
    }
})();

const FIREBASE_DB_URL = (function () {
    switch (process.env.NODE_ENV) {
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
