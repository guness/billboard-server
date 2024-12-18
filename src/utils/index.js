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

const sortItems = (itemList, itemOrderStr) => {
    let itemOrder = [];
    try {
        itemOrder = JSON.parse(itemOrderStr) || [];
    } catch (e) {
        // probably empty string
    }

    const itemListObj = itemList.reduce((prev, item) => ({ ...prev, [item.id]: item }), {});

    const sortedMediaList = [];
    itemOrder.forEach(itemId => {
        const item = itemListObj[itemId];
        if (typeof item !== 'undefined') {
            sortedMediaList.push(item);
            delete itemListObj[itemId];
        }
    });

    //in case some item ids are not in the itemOrder array
    const remaining = Object.values(itemListObj);
    return [...sortedMediaList, ...remaining];
};

module.exports = {
    queryURL,
    toTitleCase,
    queryArray,
    arrayToTree,
    sortItems,
};