const path = require('path');
const express = require('express');
const request = require('request');

const MySqlQuery = require('../mysql-handler').query;
const constants = require('../../src/constants');
const tn = constants.tableNames;
const {API_DIR, PROXY_DIR} = constants;

const auth = require('./auth');


module.exports = function (app) {

    app.use('/', express.static('dist'));

    app.get(`${PROXY_DIR}/:url`, auth.isLoggedIn, async (req, res) => {

        request({
            url: decodeURIComponent(req.params.url)
        }, (err, response) => {
            return res.send({
                success: err ? false : response.statusCode === 200 && response.body !== '',
            });

        })
    });

    app.get(`${API_DIR}/${tn.USER}`, auth.isLoggedIn, async (req, res) => {
        const {id, name, owners} = req.user;
        return res.send({
            success: true,
            data: {user: {id, name, owners}},
        });
    });

    app.get(`${API_DIR}/${tn.USER}/logout`, auth.isLoggedIn, async (req, res) => {
        req.logout();
        return res.send({
            success: true,
            data: 'User successfully logged out',
        });
    });

    // Media requests should not require authorization because devices use same url too
    app.get(`/${tn.MEDIA}/:id`, async (req, res) => {
        //remove leading slash
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        try {
            let mediaArr = await MySqlQuery(`SELECT * FROM ?? WHERE url = ?`, [tn.MEDIA, fullUrl]);
            if (mediaArr.length === 0) {
                return res.status(404).send("File not found! File does not exist in database");
            }
            const media = mediaArr[0];

            return res.sendFile(path.join(process.cwd(), '/' + media.path), {
                headers: {
                    'Content-Type': media.mimeType,
                },
            });

        } catch (e) {
            /*TODO - Make sure you handle all errors such as mysql result fail, file not found or file not permitted */
            return res.status(404).send("File not found!");
        }
    });



    /*GET SERVICES - All in one*/
    app.get(`${API_DIR}/:table((${tn.DEVICE}|${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.TICKER}|${tn.TICKERLIST}|${tn.PLAYLIST_MEDIA}))`,
        auth.isLoggedIn,
        (req, res) => {
            const ownerId = req.user.currentOwner.id;
            const table = req.params.table;
            // TODO - Make sure you add required parameters
            MySqlQuery(`SELECT * FROM ?? WHERE ownerId = ?`, [table, ownerId]).then(results => {
                return res.send({
                    success: true,
                    data: results,
                });
            }).catch(error => {
                return res.send({
                    success: false,
                    data: error.sqlMessage,
                });

            });
        });

    /*GET SERVICES for a single item - All in one*/
    app.get(`${API_DIR}/:table((${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))/:id`,
        auth.isLoggedIn,
        (req, res) => {
            const ownerId = req.user.currentOwner.id;
            const {table, id} = req.params;
            MySqlQuery(`SELECT * FROM ?? WHERE id = ? AND ownerId = ?`, [table, id, ownerId]).then(results => {
                return res.send({
                    success: true,
                    data: results[0],
                });
            }).catch(error => {
                return res.send({
                    success: false,
                    data: error.sqlMessage,
                })

            });
        });


    app.get(`${API_DIR}/${tn.DEVICE}/:id`,
        auth.isLoggedIn,
        (req, res) => {
            const {id} = req.params;
            const first4 = id.substr(0, 4);
            const last2 = id.substr(-2);
            const ownerId = req.user.currentOwner.id;

            MySqlQuery("SELECT * FROM ?? WHERE firebaseId LIKE ? AND firebaseId LIKE ? AND ( ownerId = ? OR ownerId IS NULL )", [tn.DEVICE, `${first4}%`, `%${last2}`, ownerId]).then(results => {
                if (results.length > 1) {
                    return res.send({
                        success: false,
                        data: "Multiple matching devices with similar hash.",
                    })
                } else if (results.length === 0) {
                    return res.send({
                        success: false,
                        data: "Device with this hash does not exist.",
                    })
                }

                return res.send({
                    success: true,
                    data: results[0],
                });
            }).catch(error => {
                return res.send({
                    success: false,
                    data: error.sqlMessage,
                })

            });
        });
};