
const HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
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
    },

}