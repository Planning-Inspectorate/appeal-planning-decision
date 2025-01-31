/**
 * server
 */

import http from 'http';
import { getApp } from './app.js';

/**
 * @param {{config: import('./configuration/config.js').default, logger: import('pino').Logger}} dependencies
 */
const server = ({ config, logger }) => {
	const server = http.createServer(getApp({ config, logger }));

	server.listen(config.server.port, () => {
		logger.info({ config }, 'Listening');
	});
};

export default server;
