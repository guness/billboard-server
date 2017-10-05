module.exports = {
    tableNames: {
        DEVICE: 'device',
        GROUP: 'group',
        MEDIA: 'media',
        PLAYLIST: 'playlist',
        PLAYLIST_MEDIA: 'playlistMedia',
    },
    viewNames: {
        DEVICE_WITH_MEDIA: 'deviceWithMedia',
    },
    firebaseFields: {
        DEVICES: 'devices',
    },
    FIREBASE_DB_URL: 'https://guness-billboard.firebaseio.com',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DATE_FORMAT: 'YYYY-MM-DD',
    EXPRESS_PORT: 3000,
    CLIENT_HOST: 'http://localhost:8000',
    UPLOADS_FOLDER: "uploads/",
    DEFAULT_DURATION: 10000, //in millis
    API_DIR: '/apiv1',
};