const MySqlQuery = require('../mysql-handler').query;
const constants = require('../../src/constants');
const express = require('express');
const tn = constants.tableNames;
const {API_DIR} = constants;
const path = require('path');
const auth = require('./auth');


module.exports = function (app) {

    app.use('/', express.static('dist'));

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
    app.get(`${API_DIR}/:table((${tn.DEVICE}|${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))`,
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
    app.get(`${API_DIR}/:table((${tn.DEVICE}|${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))/:id`,
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
};