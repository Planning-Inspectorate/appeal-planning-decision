const ApiError = require('#errors/apiError');
const Repo = require('./repo');
const repo = new Repo();
const LpaMapper = require('../../../mappers/lpa-mapper');
const logger = require('#lib/logger');

/**
 * @typedef {import('@prisma/client').LPA} PrismaLPA
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
		throw ApiError.lpaUpsertFailure();
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
		const lpaChunks = chunkArray(lpaEntities, 10);

		for (let chunk in lpaChunks) {
			await new Promise((res) => setTimeout(res, 1000));
			await repo.upsertMany(lpaChunks[chunk]);
		}
	} catch (err) {
		logger.error(err);
		throw ApiError.lpaUpsertFailure();
	}
};

/**
 * @param {any} myArray
 * @param {number} chunk_size
 * @returns {Promise<any>}
 */
const chunkArray = (myArray, chunk_size) => {
	let index = 0;
	const arrayLength = myArray.length;
	const tempArray = [];

	for (index = 0; index < arrayLength; index += chunk_size) {
		const myChunk = myArray.slice(index, index + chunk_size);
		tempArray.push(myChunk);
	}

	return tempArray;
};
