const ffmpeg = require('fluent-ffmpeg');
const {ExifTool} = require("exiftool-vendored");
const exiftool = new ExifTool();

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
    },
    exif(filePath) {
        return new Promise((resolve, reject) => {
            exiftool.read(filePath)
                .then(tags => {
                    return resolve(tags);
                })
                .catch(err => {
                    console.log('Could not probe the file on path: ' + filePath);
                    return reject(err);
                });
        });
    }
};