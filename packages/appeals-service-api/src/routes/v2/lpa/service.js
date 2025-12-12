const ApiError = require('#errors/apiError');
const Repo = require('./repo');
const repo = new Repo();
const LpaMapper = require('../../../mappers/lpa-mapper');
const logger = require('#lib/logger.js');
const { chunkArray } = require('@pins/common/src/database/chunk-array');

const chunckSize = 10;
/**
 * @typedef {import('@pins/database/src/client/client').LPA} PrismaLPA
 */

/**
 * @returns {Promise<PrismaLPA[]>}
 */
exports.getAll = async () => {
	try {
		return await repo.getAll();
	} catch (error) {
		throw ApiError.lpaNotFound();
	}
};

/**
 * @param {string?} id
 * @param {string?} lpaCode
 * * @param {string?} lpa19CD
 * @returns {Promise<PrismaLPA>}
 */
exports.get = async (id, lpaCode, lpa19CD) => {
	try {
		return await repo.get(id, lpaCode, lpa19CD);
	} catch (error) {
		throw ApiError.lpaNotFound();
	}
};

/**
 * @param {any} csv
 * @returns {Promise<void>}
 */
exports.createLpaList = async (csv) => {
	const mapper = new LpaMapper();
	const lpaEntities = mapper.csvJsonToLpaEntities(csv).map((lpaEntity) => lpaEntity.toJson());
	logger.debug(lpaEntities, 'LPA entities as JSON');

	try {
		await repo.remove();
		const lpaChunks = chunkArray(lpaEntities, chunckSize);

		for (let chunk in lpaChunks) {
			await new Promise((res) => setTimeout(res, 1000));
			await repo.upsertMany(lpaChunks[chunk]);
		}
	} catch (err) {
		logger.error(err);
		throw ApiError.lpaUpsertFailure();
	}
};
