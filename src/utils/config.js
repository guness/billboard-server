import constants from '../constants/index';

const {HOST, API_DIR, PROXY_DIR, tableNames} = constants;
const {DEVICE, GROUP, MEDIA, USER, PLAYLIST, PLAYLIST_MEDIA, TICKER, TICKERLIST} = tableNames;

const APIV1 = HOST + API_DIR;

export default {
    imageRegex: /image/i,
    HOST: HOST,
    APIV1,
    CORS: [HOST],
    YQL: [],
    api: {
        device: `${APIV1}/${DEVICE}`,
        group: `${APIV1}/${GROUP}`,
        media: `${APIV1}/${MEDIA}`,
        playlist: `${APIV1}/${PLAYLIST}`,
        playlistMedia: `${APIV1}/${PLAYLIST_MEDIA}`,
        user: `${APIV1}/${USER}`,
        userLogin: `${APIV1}/${USER}/login`,
        userLogout: `${APIV1}/${USER}/logout`,
        proxy: `${HOST}${PROXY_DIR}`,
        ticker: `${APIV1}/${TICKER}`,
        tickerlist: `${APIV1}/${TICKERLIST}`,
    },
}