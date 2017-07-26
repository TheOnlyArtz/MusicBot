const moment = require('moment');

class winstonLogger {
	constructor() {
		this.winston = require('winston');
		this.transport = new (this.winston.transports.Console)({
			level: 'debug',
			colorize: true,
			timestamp: true,
			timestamp() {
				return moment(new Date()).format('h:mm:ss a');
			}
		});
		this.logger = new (this.winston.Logger)({
			transports: [this.transport]
		});
	}
  }

module.exports = winstonLogger;
