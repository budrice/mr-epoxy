const express = require('express');
const router = express.Router();
const db_routes  = require('./database/database.routes.js');
const em_routes  = require('./emailer/emailer.routes.js');

router.use('/database', db_routes);
router.use('/emailer', em_routes);

module.exports = router;
