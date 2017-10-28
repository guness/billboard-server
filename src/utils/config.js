import constants from '../../shared/constants';
const {HOST, API_DIR, tableNames} = constants;
const {DEVICE, GROUP, MEDIA, USER, PLAYLIST, PLAYLIST_MEDIA} = tableNames;

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
    },
}