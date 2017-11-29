const ffmpeg = require('fluent-ffmpeg');

module.exports = {
    probe(filePath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, function (err, metadata) {
                if (err) {
                    console.log('Could not probe the file on path: ' + filePath);
                    return reject(err);
                }
                return resolve(metadata);
            });
        });
    }
};