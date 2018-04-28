const { sortItems } = require('../src/utils/index');

const _ = require('lodash');
const FirebaseHandler = require('./firebase-handler');
const MySqlHandler = require('./mysql-handler');
const constants = require('../src/constants');

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

                let mediaList = children.reduce((prev, { mediaId, mediaName, mimeType, url, magnet, mediaDuration }) => {
                    let media = {
                        id: mediaId,
                        name: mediaName,
                        mimeType: mimeType,
                        duration: mediaDuration,
                        url,
                        magnet,
                    };
                    const mediaObject = mediaId ? { ["m:" + mediaId]: media } : {};
                    return { ...prev, ...mediaObject };
                }, {});

                let playlists = _(children).groupBy('playlistId').reduce((prev, mediasByPlaylist, subKey) => {

                        const { startDate, endDate, startBlock, endBlock, repeated, mediaOrder } = mediasByPlaylist[0];
                        const sortedMedias = sortItems(mediasByPlaylist.map(media => ({ ...media, id: media.mediaId })), mediaOrder)
                            .map(({ id }) => id);

                        let playlist = {
                            id: Number(subKey),
                            media: sortedMedias,
                            mediaOrder,
                            startDate,
                            endDate,
                        };

                        if (repeated) {
                            playlist = {
                                ...playlist,
                                repeated: true,
                                startBlock,
                                endBlock,
                            };
                        }

                        const playlistObject = !isNaN(Number(subKey)) ? { ["p:" + subKey]: playlist } : {};

                        return { ...prev, ...playlistObject };
                    }
                    , {});

                let tickerlists = _(children).groupBy('tickerlistId').reduce((prev, tickersByTickerlist, subKey) => {

                        const {
                            tickerlistName: name,
                            tickerlistStartBlock: startBlock,
                            tickerlistEndBlock: endBlock,
                            tickerlistRepeated: repeated,
                            tickerlistOrder } = tickersByTickerlist[0];

                        const sortedTickers = sortItems(tickersByTickerlist.map(({tickerId, tickerName, tickerType, tickerContent}) => ({
                            content: tickerContent,
                            name: tickerName,
                            tickerType: tickerType,
                            id: tickerId })), tickerlistOrder);

                        let tickerlist = {
                            id: Number(subKey),
                            tickers: sortedTickers,
                            name,
                            startBlock,
                            endBlock,
                            repeated,
                        };

                        if (repeated) {
                            tickerlist = {
                                ...tickerlist,
                                repeated: true,
                                startBlock,
                                endBlock,
                            };
                        }

                        const tickerlistObject = !isNaN(Number(subKey)) ? { ["t:" + subKey]: tickerlist } : {};

                        return { ...prev, ...tickerlistObject };
                    }
                    , {});

                arr.push({
                    firebaseId: key,
                    playlists,
                    tickerlists,
                    mediaList,
                });
                return arr;
            }
            , []).reduce((p, { firebaseId, playlists, mediaList, tickerlists }) => {
                p[firebaseId + '/playlists'] = playlists;
                p[firebaseId + '/mediaList'] = mediaList;
                p[firebaseId + '/tickerlists'] = tickerlists;
                return p;
            }
            , {});
    },
    async updateFirebaseDevicePlaylists() {
        let afterInsert = await MySqlQuery('SELECT * FROM ??', vn.DEVICE_WITH_MEDIA);
        let query = this.preparePlaylists(afterInsert);
        FirebaseHandler.ref.update(query);
    }
};