// From https://github.com/Mostafatalaat770/node-oidc-provider-prisma-adapter - MIT
import createPrismaClient from './prisma-client.js';

const prisma = createPrismaClient();

/**
 * @typedef {import("oidc-provider").AdapterPayload} AdapterPayload
 */

const types = [
	'Session',
	'AccessToken',
	'AuthorizationCode',
	'RefreshToken',
	'DeviceCode',
	'ClientCredentials',
	'Client',
	'InitialAccessToken',
	'RegistrationAccessToken',
	'Interaction',
	'ReplayDetection',
	'PushedAuthorizationRequest',
	'Grant',
	'BackchannelAuthenticationRequest'
].reduce((map, name, i) => ({ ...map, [name]: i + 1 }), {});

/**
 * @param { import("@prisma/client").Oidc } doc
 */
const prepare = (doc) => {
	const isPayloadJson = doc.payload && typeof doc.payload === 'string';

	const payload = isPayloadJson ? JSON.parse(doc.payload) : {};

	return {
		payload: payload,
		...(doc.consumedAt ? { consumed: true } : undefined)
	};
};

/**
 * @param {number} [expiresIn]
 * @returns {Date | null}
 */
const expiresAt = (expiresIn) => (expiresIn ? new Date(Date.now() + expiresIn * 1000) : null);

/**
 * @type {import("oidc-provider").Adapter}
 */
export default class PrismaAdapter {
	/** @type {number} */
	type;

	/**
	 * @param {string} name
	 */
	constructor(name) {
		this.type = types[name];
	}

	/**
	 * @param {string} id
	 * @param {AdapterPayload} payload
	 * @param {number} [expiresIn]
	 * @returns {Promise<void>}
	 */
	async upsert(id, payload, expiresIn) {
		const data = {
			type: this.type,
			payload: JSON.stringify(payload),
			grantId: payload.grantId,
			userCode: payload.userCode,
			uid: payload.uid,
			expiresAt: expiresAt(expiresIn)
		};

		try {
			await prisma.oidc.upsert({
				where: {
					id_type: {
						id,
						type: this.type
					}
				},
				update: {
					...data
				},
				create: {
					id,
					...data
				}
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	/**
	 * @param {string} id
	 * @returns {Promise<AdapterPayload | undefined>}
	 */
	async find(id) {
		const doc = await prisma.oidc.findUnique({
			where: {
				id_type: {
					id,
					type: this.type
				}
			}
		});

		if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
			return undefined;
		}

		return prepare(doc);
	}

	/**
	 * @param {string} userCode
	 * @returns {Promise<AdapterPayload | undefined>}
	 */
	async findByUserCode(userCode) {
		const doc = await prisma.oidc.findFirst({
			where: {
				userCode
			}
		});

		if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
			return undefined;
		}

		return prepare(doc);
	}

	/**
	 * @param {string} uid
	 * @returns {Promise<AdapterPayload | undefined> }
	 */
	async findByUid(uid) {
		const doc = await prisma.oidc.findUnique({
			where: {
				uid
			}
		});

		if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
			return undefined;
		}

		return prepare(doc);
	}

	/**
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async consume(id) {
		await prisma.oidc.update({
			where: {
				id_type: {
					id,
					type: this.type
				}
			},
			data: {
				consumedAt: new Date()
			}
		});
	}

	/**
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async destroy(id) {
		await prisma.oidc.delete({
			where: {
				id_type: {
					id,
					type: this.type
				}
			}
		});
	}

	/**
	 * @param {string} grantId
	 * @returns {Promise<void>}
	 */
	async revokeByGrantId(grantId) {
		await prisma.oidc.deleteMany({
			where: {
				grantId
			}
		});
	}
}
