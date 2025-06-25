import * as jose from 'jose';

/**
 * @returns a JWK for token signing
 */
async function generate() {
	// supported values: https://github.com/panva/node-oidc-provider/blob/270af1da83dda4c49edb4aaab48908f737d73379/lib/consts/jwa.js#L1
	// 'RS256', 'RS384', 'RS512',
	// 'PS256', 'PS384', 'PS512',
	// 'ES256', 'ES256K', 'ES384', 'ES512',
	// 'EdDSA'
	const keyPair = await jose.generateKeyPair('specify an algorithm', { extractable: true });
	const privateJwk = await jose.exportJWK(keyPair.privateKey);
	return JSON.stringify(privateJwk);
}

generate()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err);
	});
