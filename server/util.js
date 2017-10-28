const _ = require('lodash');
const FirebaseHandler = require('./firebase-handler');
const MySqlHandler = require('./mysql-handler');
const constants = require('../shared/constants');

const MySqlQuery = MySqlHandler.query;
const vn = constants.viewNames;


module.exports = {
    /*
    returns object like

    { '-KtIFvmhdc6SvJ6pycng/playlists': [
        {
            id: '1',
            repeated: true,
            startDate: '2017-10-01',
            endDate: '2018-01-10',
            startBlock: 0,
            endBlock: 1200,
            media: [
                {
                    name: 'media1', type: 'IMAGE', duration: 2,
                }, {
                    name: 'media2', type: 'VIDEO2', duration: 2,
                },
            ],
        },
        {
            name: 'playlist2',
            repeated: true,
            startDate: '2017-10-01',
            endDate: '2018-01-10',
            startBlock: 0,
            endBlock: 1200,
            media: [
                {
                    name: 'media1', type: 'IMAGE', duration: 2,
                }, {
                    name: 'media2', type: 'VIDEO2', duration: 2,
                },
            ],
        },
    ],}
    **/
    preparePlaylists(arr) {
        return _(arr).groupBy('firebaseId').reduce((arr, children, key) => {

                let mediaList = children.reduce((prev, {mediaId, mediaName, mimeType, url, magnet, mediaDuration}) => {
                    let media = {
                        id: mediaId,
                        name: mediaName,
                        mimeType: mimeType,
                        duration: mediaDuration,
                        url,
                        magnet,
                    };
                    return {...prev, [mediaId]: media};
                }, {});

                let playlists = _(children).groupBy('playlistId').reduce((prev, subChildren, subKey) => {
                        let media = subChildren.map(({mediaId}) => mediaId);

                        const {startDate, endDate, startBlock, endBlock, repeated} = subChildren[0];

                        let playlist = {
                            id: Number(subKey),
                            media,
                            startDate,
                            endDate,
                        };

                        if(repeated){
                            playlist = {
                                ...playlist,
                                repeated: true,
                                startBlock,
                                endBlock,
                            };
                        }

                        return {...prev, [subKey]: playlist};
                    }
                    , {});

                arr.push({
                    firebaseId: key,
                    playlists,
                    mediaList,
                });
                return arr;
            }
            , []).reduce((p, {firebaseId, playlists, mediaList}) => {
                p[firebaseId + '/playlists'] = playlists;
                p[firebaseId + '/mediaList'] = mediaList;
                return p;
            }
            , {});
    },
    async updateFirebaseDevicePlaylists(){
        let afterInsert = await MySqlQuery('SELECT * FROM ??', vn.DEVICE_WITH_MEDIA);
        let query = this.preparePlaylists(afterInsert);
        FirebaseHandler.ref.update(query);
    }
};