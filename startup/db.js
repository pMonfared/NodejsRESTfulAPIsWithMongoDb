const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function (config) { 
  const db = `${config.get('db')}`;
  console.log(config);
  mongoose.connect(db,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(()=> winston.info(`Connected to ${db}...`));
}