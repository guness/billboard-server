const HOST = (function () {
    switch (process.env.NODE_ENV) {
        case 'production':
            return "http://plusboard.ch";
        case 'development':
            return "http://localhost:3000";
        default:
            return "";
    }
})();
const APIV1 = HOST + '/apiv1';

export default {
    imageRegex: /image/i,
    HOST,
    APIV1,
    CORS: [HOST],
    YQL: [],
    api: {
        device: `${APIV1}/device`,
        group: `${APIV1}/group`,
        media: `${APIV1}/media`,
        playlist: `${APIV1}/playlist`,
        playlistMedia: `${APIV1}/playlistMedia`,
        user: `${APIV1}/user`,
        userLogin: `${APIV1}/user/login`,
        userLogout: `${APIV1}/user/logout`,
    },

}