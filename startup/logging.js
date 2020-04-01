const winston = require('winston');
// require('winston-mongodb');

module.exports = function (config) {
    process.on('unhandledRejection', (ex) => { 
        throw ex;
    })
    
    winston.add(new winston.transports.File({ 
        filename: 'logfile.log',
        format: winston.format.combine(
            // label({ label: 'right meow!' }),
            winston.format.timestamp(),
            winston.format.prettyPrint()
          ),
        tailable: true,
        handleExceptions: true
        }));

    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            // label({ label: 'right meow!' }),
            winston.format.timestamp(),
            winston.format.prettyPrint(),
            winston.format.colorize({
                all: true
            })
          ),
    }));

    // winston.add(new winston.transports.MongoDB({
    //      level: 'info',
    //      db: `${config.get('db.instance')}${config.get('db.name')}`
    //     }));
}