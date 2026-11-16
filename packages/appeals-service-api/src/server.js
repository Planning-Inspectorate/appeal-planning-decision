/**
 * server
 */

const http = require('http');
const config = require('./configuration/config');
const logger = require('./lib/logger');
const app = require('./app');

module.exports = () => {
	const server = http.createServer(app);

	server.listen(config.server.port, () => {
		logger.info({ config }, 'Listening');
	});
};
