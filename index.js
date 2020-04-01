

const config = require('config');
const express = require('express');
const winston = require('winston');
require('express-async-errors');

const app = express();
require('./startup/prod')(app);
require('./startup/logging')(config);
require('./startup/routes')(app);
require('./startup/db')(config);
require('./startup/config')(config);
require('./startup/validation')();


const port = process.env.PORT || 3000;
const server = app.listen(port,()=>{ winston.info(`Listening on port ${port}...`); });

module.exports = server;