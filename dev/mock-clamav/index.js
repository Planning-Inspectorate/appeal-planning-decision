const net = require('net');

/**
 * @param {net.Socket} socket
 */
const server = net.createServer((socket) => {
	socket.on('data', (data) => {
		try {
			const command = data.toString().trim();

			if (!command) {
				return;
			}
			// console.log(command);

			switch (command) {
				case 'PING':
					console.log(command);
					socket.write('PONG');
					break;
				case 'nVERSION':
					console.log(command);
					socket.write('mock clam av');
					socket.end();
					break;
				default: {
					console.log('checking file');
					socket.write(`: OK`);
				}
			}
		} catch (err) {
			console.log(err);
			socket.end();
		}
	});

	socket.on('error', (err) => {
		console.log(err, 'error');
		socket.end();
	});

	socket.on('end', () => {
		console.log('client disconnected');
		socket.end();
	});
});

const PORT = process.env.PORT || 3310;
server.listen(PORT, () => {
	console.log(`listening on port: ${PORT}`);
});
