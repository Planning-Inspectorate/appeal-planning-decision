const http = require('http');
const url = require('url');

/**
 * @type {Object.<string, function>}
 */
const routes = {
	/**
	 * @param {http.IncomingMessage} req
	 * @param {http.ServerResponse} res
	 */
	'/': (req, res) => {
		console.log(`handled: ${req.method}: ${req.url}`);
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('Home');
	}
};

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const server = http.createServer((req, res) => {
	try {
		if (typeof req.url !== 'string') {
			throw new Error('bad url');
		}

		const parsedUrl = url.parse(req.url, true);

		console.log(parsedUrl.pathname);

		if (parsedUrl.pathname && routes[parsedUrl.pathname]) {
			return routes[parsedUrl.pathname](req, res);
		}

		console.log(`catch all: ${req.method}: ${req.url}`);
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('Test');
	} catch (err) {
		console.error(err, `error for: ${req.method}: ${req.url}`);
		res.writeHead(500, { 'Content-Type': 'text/plain' });
		res.end('Internal Server Error');
	}
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
	console.log(`listening on port: ${PORT}`);
});
