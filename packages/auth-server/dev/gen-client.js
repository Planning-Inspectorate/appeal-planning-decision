import crypto from 'crypto';

/**
 * @returns a client id + secret for local dev use
 */
async function generate() {
	return {
		client_id: crypto.randomUUID(),
		client_secret: crypto.randomBytes(32).toString('base64')
	};
}

generate()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err);
	});
