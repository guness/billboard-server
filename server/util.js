const { sortItems } = require('../src/utils/index');

const _ = require('lodash');
const FirebaseHandler = require('./firebase-handler');
const MySqlHandler = require('./mysql-handler');
const {
    tableNames: {
        DEVICE, TICKER, TICKERLIST, GROUP, MEDIA, PLAYLIST, PLAYLIST_MEDIA
    }
} = require('../src/constants');

const MySqlQuery = MySqlHandler.query;


const DeviceWithMedia = ownerId => {
    return `select
        \`${DEVICE}\`.\`id\`                AS \`deviceId\`,
        \`${DEVICE}\`.\`firebaseId\`        AS \`firebaseId\`,
        \`${GROUP}\`.\`id\`                 AS \`groupId\`,
        \`${PLAYLIST_MEDIA}\`.\`id\`         AS \`playlistMediaId\`,
        \`${PLAYLIST_MEDIA}\`.\`mediaId\`    AS \`mediaId\`,
        \`${PLAYLIST_MEDIA}\`.\`playlistId\` AS \`playlistId\`,
        \`${MEDIA}\`.\`name\`               AS \`mediaName\`,
        \`${MEDIA}\`.\`mimeType\`           AS \`mimeType\`,
        \`${MEDIA}\`.\`duration\`           AS \`mediaDuration\`,
        \`${MEDIA}\`.\`path\`               AS \`path\`,
        \`${MEDIA}\`.\`url\`                AS \`url\`,
        \`${MEDIA}\`.\`magnet\`             AS \`magnet\`,
        \`${PLAYLIST}\`.\`repeated\`        AS \`repeated\`,
        \`${PLAYLIST}\`.\`startDate\`       AS \`startDate\`,
        \`${PLAYLIST}\`.\`endDate\`         AS \`endDate\`,
        \`${PLAYLIST}\`.\`startBlock\`      AS \`startBlock\`,
        \`${PLAYLIST}\`.\`endBlock\`        AS \`endBlock\`,
        \`${PLAYLIST}\`.\`itemOrder\`       AS \`mediaOrder\`,
        \`${TICKER}\`.\`name\`              AS \`tickerName\`,
        \`${TICKER}\`.\`content\`           AS \`tickerContent\`,
        \`${TICKER}\`.\`type\`              AS \`tickerType\`,
        \`${TICKER}\`.\`tickerlistId\`      AS \`tickerlistId\`,
        \`${TICKERLIST}\`.\`itemOrder\`     AS \`tickerlistOrder\`,
        \`${TICKERLIST}\`.\`name\`          AS \`tickerlistName\`,
        \`${TICKERLIST}\`.\`startBlock\`    AS \`tickerlistStartBlock\`,
        \`${TICKERLIST}\`.\`endBlock\`      AS \`tickerlistEndBlock\`,
        \`${TICKERLIST}\`.\`endDate\`       AS \`tickerlistEndDate\`,
        \`${TICKERLIST}\`.\`startDate\`     AS \`tickerlistStartDate\`,
        \`${TICKERLIST}\`.\`repeated\`      AS \`tickerlistRepeated\`,
        \`${TICKERLIST}\`.\`fontSize\`      AS \`tickerlistFontSize\`,
        \`${TICKERLIST}\`.\`color\`         AS \`tickerlistColor\`,
        \`${TICKERLIST}\`.\`speed\`         AS \`tickerlistSpeed\`,
        \`${TICKER}\`.\`id\`                AS \`tickerId\`
    from ((((((\`${DEVICE}\`
    left join \`${GROUP}\` on ((\`${DEVICE}\`.\`groupId\` = \`${GROUP}\`.\`id\`))) left join
        \`${PLAYLIST}\` on ((\`${PLAYLIST}\`.\`groupId\` = \`${GROUP}\`.\`id\`))) left join
        \`${PLAYLIST_MEDIA}\` on ((\`${PLAYLIST_MEDIA}\`.\`playlistId\` = \`${PLAYLIST}\`.\`id\`))) left join
        \`${MEDIA}\` on ((\`${PLAYLIST_MEDIA}\`.\`mediaId\` = \`${MEDIA}\`.\`id\`))) left join
        \`${TICKERLIST}\` on ((\`${TICKERLIST}\`.\`groupId\` = \`${GROUP}\`.\`id\`))) left join
        \`${TICKER}\` on ((\`${TICKER}\`.\`tickerlistId\` = \`${TICKERLIST}\`.\`id\`)))
    WHERE \`${DEVICE}\`.\`ownerId\` = ${ownerId}
    order by    \`${DEVICE}\`.\`id\` asc, 
                \`${DEVICE}\`.\`id\` asc, 
                \`${PLAYLIST_MEDIA}\`.\`playlistId\` asc,
                \`${PLAYLIST_MEDIA}\`.\`mediaId\` asc;`
};


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
                            tickerlistStartDate: startDate,
                            tickerlistEndDate: endDate,
                            tickerlistOrder,
                            tickerlistFontSize: fontSize,
                            tickerlistColor: color,
                            tickerlistSpeed: speed
                        } = tickersByTickerlist[0];

                        const sortedTickers = sortItems(tickersByTickerlist.map(({tickerId, tickerName, tickerType, tickerContent}) => ({
                            content: tickerContent,
                            name: tickerName,
                            tickerType: tickerType,
                            id: tickerId })), tickerlistOrder);

                        let tickerlist = {
                            id: Number(subKey),
                            tickers: sortedTickers,
                            name,
                            startDate,
                            endDate,
                            fontSize,
                            color,
                            speed
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
    async updateFirebaseDevicePlaylists(ownerId) {
        let afterInsert = await MySqlQuery(DeviceWithMedia(ownerId));
        let query = this.preparePlaylists(afterInsert);
        FirebaseHandler.ref.update(query);
    }
};