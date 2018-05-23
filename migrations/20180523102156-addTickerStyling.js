'use strict';
const tableNames = require('../src/constants').tableNames;

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = async function (db) {
    await db.addColumn(tableNames.TICKERLIST, 'fontSize', {type: 'smallint', defaultValue: 24});
    await db.addColumn(tableNames.TICKERLIST, 'color', {type: 'varchar', length: 10, defaultValue: '000000'});
    await db.addColumn(tableNames.TICKERLIST, 'speed', {type: 'smallint', defaultValue: 30});
};

exports.down = async function (db) {
    await db.removeColumn(tableNames.TICKERLIST, 'fontSize');
    await db.removeColumn(tableNames.TICKERLIST, 'color');
    await db.removeColumn(tableNames.TICKERLIST, 'speed');
};

exports._meta = {
    "version": 1
};
