// These functions also used by Node.js,
// Don't use ES6 export/imports

const lodash = require('lodash');

const queryURL = (name) => {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURI(r[2]);
    return null
};

const queryArray = (array, key, keyAlias = 'key') => {
    if (!(array instanceof Array)) {
        return null
    }
    const item = array.filter(d => d[keyAlias] === key);
    if (item.length) {
        return item[0]
    }
    return null
};

const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
    let data = lodash.cloneDeep(array);
    let result = [];
    let hash = {};
    data.forEach((item, index) => {
        hash[data[index][id]] = data[index]
    });

    data.forEach((item) => {
        let hashVP = hash[item[pid]];
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(item)
        } else {
            result.push(item)
        }
    });
    return result
};

const toTitleCase = (str) => {
    if (!str) {
        return str;
    }
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

const sortMedia = (mediaList, mediaOrderStr) => {
    let mediaOrder = [];
    try {
        mediaOrder = JSON.parse(mediaOrderStr) || [];
    } catch (e) {
        // probably empty string
    }

    const mediaListObj = mediaList.reduce((prev, media) => ({ ...prev, [media.id]: media }), {});

    const sortedMediaList = [];
    mediaOrder.forEach(mediaId => {
        const item = mediaListObj[mediaId];
        if (typeof item !== 'undefined') {
            sortedMediaList.push(item);
            delete mediaListObj[mediaId];
        }
    });

    //in case some media ids are not in the mediaOrder array
    const remaining = Object.values(mediaListObj);
    return [...sortedMediaList, ...remaining];
};

module.exports = {
    queryURL,
    toTitleCase,
    queryArray,
    arrayToTree,
    sortMedia,
};