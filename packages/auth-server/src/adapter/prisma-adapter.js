// From https://github.com/Mostafatalaat770/node-oidc-provider-prisma-adapter - MIT
import createPrismaClient from './prisma-client.js';
import logger from '../lib/logger.js';

const prisma = createPrismaClient();

/**
 * @typedef {import("oidc-provider").AdapterPayload} AdapterPayload
 */

/** @type { Object.<string, number> } */
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
		if (!Object.prototype.hasOwnProperty.call(types, name)) throw new Error('unknown oidc type');

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
			logger.error({ err }, 'failed to upsert oidc record');
			throw err;
		}
	}

	/**
	 * @param {string} id
	 * @returns {Promise<AdapterPayload | undefined>}
	 */
	async find(id) {
		return this.#get(() =>
			prisma.oidc.findUnique({
				where: {
					id_type: {
						id,
						type: this.type
					}
				}
			})
		);
	}

	/**
	 * @param {string} userCode
	 * @returns {Promise<AdapterPayload | undefined>}
	 */
	async findByUserCode(userCode) {
		return this.#get(() =>
			prisma.oidc.findFirst({
				where: {
					userCode
				}
			})
		);
	}

	/**
	 * @param {string} uid
	 * @returns {Promise<AdapterPayload | undefined> }
	 */
	async findByUid(uid) {
		return this.#get(() =>
			prisma.oidc.findFirst({
				where: {
					uid: uid
				}
			})
		);
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

	/**
	 * Validates and transforms Oidc result
	 * @param { () => (Promise<import('@pins/database/src/client').Oidc|null>) } query
	 * @returns {Promise<AdapterPayload|undefined>}
	 */
	async #get(query) {
		const doc = await query();

		if (!this.#isValidOidc(doc)) {
			return undefined;
		}

		return this.#convertPayloadJson(doc);
	}

	/**
	 * @param { import('@pins/database/src/client').Oidc|null } doc
	 * @returns {boolean}
	 */
	#isValidOidc(doc) {
		if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
			return false;
		}

		return true;
	}

	/**
	 * Parse json field from db before returning it
	 * @param { import('@pins/database/src/client').Oidc } doc
	 * @returns {AdapterPayload}
	 */
	#convertPayloadJson(doc) {
		const isPayloadJson = doc.payload && typeof doc.payload === 'string';
		const payload = isPayloadJson ? JSON.parse(doc.payload) : {};

		return {
			...payload,
			...(doc.consumedAt ? { consumed: true } : undefined)
		};
	}
}
