const MySqlQuery = require('../mysql-handler').query;
const constants = require('../constants');
const express = require('express');
const tn = constants.tableNames;
const {API_DIR} = constants;
const path = require('path');
const auth = require('./auth');


module.exports = function (app) {

    app.use('/', express.static('dist'));

    app.get(`${API_DIR}/${tn.USER}`, auth.isLoggedIn, async (req, res) => {
        const {id, name} = req.user;
        res.send({
            success: true,
            data: {user: {id, name}},
        });
    });

    app.get(`${API_DIR}/${tn.USER}/logout`, auth.isLoggedIn, async (req, res) => {
        req.logout();
        res.send({
            success: true,
            data: 'User successfully logged out',
        });
    });

    app.get(`/${tn.MEDIA}/:id`, auth.isLoggedIn, async (req, res) => {
        //remove leading slash
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        try {
            let mediaArr = await MySqlQuery(`SELECT * FROM ?? WHERE url = ?`, [tn.MEDIA, fullUrl]);
            if (mediaArr.length === 0) {
                res.status(404).send("File not found! File does not exist in database");
            }
            const media = mediaArr[0];

            res.sendFile(path.join(process.cwd(), '/' + media.path), {
                headers: {
                    'Content-Type': media.mimeType,
                },
            });

        } catch (e) {
            /*TODO - Make sure you handle all errors such as mysql result fail, file not found or file not permitted */
            res.status(404).send("File not found!");
        }
    });

    /*GET SERVICES - All in one*/
    app.get(`${API_DIR}/:table((${tn.DEVICE}|${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))`,
        auth.isLoggedIn,
        (req, res) => {
            const table = req.params.table;
            // TODO - Make sure you add required parameters
            MySqlQuery(`SELECT * FROM ??`, table).then(results => {
                return res.send({
                    success: true,
                    data: results,
                });
            }).catch(error => {
                return res.send({
                    success: false,
                    data: error.sqlMessage,
                })

            });
        });

    /*GET SERVICES for a single item - All in one*/
    app.get(`${API_DIR}/:table((${tn.DEVICE}|${tn.MEDIA}|${tn.GROUP}|${tn.PLAYLIST}|${tn.PLAYLIST_MEDIA}))/:id`,
        auth.isLoggedIn,
        (req, res) => {
            const {table, id} = req.params;
            MySqlQuery(`SELECT * FROM ?? WHERE id = ?`, [table, id]).then(results => {
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