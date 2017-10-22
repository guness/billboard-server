const bcrypt = require('bcrypt-nodejs');

module.exports = {
    encrypt(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, null, null, (err, passwordHash) => {
                if (err) {
                    return reject(null)
                } else {
                    return resolve(passwordHash);
                }
            })
        });
    },
    compare(password, passwordHash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, passwordHash, (err) => {
                if (err) {
                    return reject(null)
                } else {
                    return resolve(true);
                }
            });
        });
    },
};