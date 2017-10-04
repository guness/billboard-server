const APIV1 = 'http://localhost:3000';

export default {
    APIV1,
    CORS: ['http://localhost:3000'],
    YQL: [],
    api: {
        device: `${APIV1}/device`,
        group: `${APIV1}/group`,
        media: `${APIV1}/media`,
        playlist: `${APIV1}/playlist`,
        playlistMedia: `${APIV1}/playlistMedia`,
    },

}