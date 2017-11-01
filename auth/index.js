/* Specific to Server */
/* DO NOT SHARE WITH CLIENT */
const SERVICE_ACCOUNT = (function () {
    switch (process.env.NODE_CONF) {
        case 'production':
            return require('../auth/plusboard-ch-firebase-adminsdk-i2tuf-abae981e1b.json');
        case 'stage':
        case 'test':
        case 'development':
        default:
            return require("../auth/guness-billboard-firebase-adminsdk-1x3sw-f2efe34eb7.json");
    }
})();

const MYSQL_CONFIG = (function () {
    switch (process.env.NODE_CONF) {
        case 'production':
            return require('../auth/mysql.production.json');
        case 'stage':
        case 'test':
        case 'development':
        default:
            return require('../auth/mysql.json');
    }
})();

module.exports = {
    SERVICE_ACCOUNT,
    MYSQL_CONFIG,
};
