const _ = require('lodash');
const FirebaseHandler = require('./firebase-handler');
const MySqlHandler = require('./mysql-handler');
const constants = require('./constants');

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

                let playlists = _(children).groupBy('playlistId').reduce((subArr, subChildren, subKey) => {
                        let media = subChildren.map(({mediaId, mediaName, mimeType, path, url, magnet, mediaDuration}) => ({
                            id: mediaId,
                            name: mediaName,
                            mimeType: mimeType,
                            duration: mediaDuration,
                            path,
                            url,
                            magnet,
                        }));

                        const {startDate, endDate, startBlock, endBlock, repeated} = subChildren[0];

                        let playlist = {
                            id: subKey,
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

                        subArr.push(playlist);
                        return subArr;
                    }
                    , []);

                arr.push({
                    firebaseId: key,
                    playlists,
                });
                return arr;
            }
            , []).reduce((p, {firebaseId, playlists}) => {
                p[firebaseId + '/playlists'] = playlists;
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