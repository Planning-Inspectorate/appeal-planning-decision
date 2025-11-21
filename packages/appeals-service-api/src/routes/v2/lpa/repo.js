const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client');
const ApiError = require('#errors/apiError');

/**
 * @typedef {import('@planning-inspectorate/data-model/src/schemas').AppealDocument} DataModelDocument
 * @typedef {import('@pins/database/src/client').LPA} PrismaLPA
 */

/**
 * @param {any} lpaDataModel
 * @returns {PrismaLPA}
 */
const mapDataModelToEntity = ({
	_id,
	objectId,
	lpa19CD,
	lpaCode,
	name,
	email,
	domain,
	inTrial
}) => ({
	objectId: objectId,
	lpa19CD: lpa19CD,
	lpaCode: lpaCode,
	name: name,
	email: email,
	domain: domain,
	inTrial: inTrial
});

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @returns {Promise<PrismaLPA[]>}
	 */
	async getAll() {
		return await this.dbClient.lPA.findMany({});
	}

	/**
	 * @param {string?} id
	 * @param {string?} lpaCode
	 * @param {string?} lpa19CD
	 * @returns {Promise<PrismaLPA>}
	 */
	async get(id, lpaCode, lpa19CD) {
		const whereClause = {};
		if (id) whereClause.id = id;
		if (lpaCode) whereClause.lpaCode = lpaCode;
		if (lpa19CD) whereClause.lpa19CD = lpa19CD;

		return await this.dbClient.lPA.findFirstOrThrow({
			where: whereClause
		});
	}

	async remove() {
		await this.dbClient.lPA.deleteMany();
	}

	/**
	 * @param {any[]} data
	 */
	async upsertMany(data) {
		const mappedData = data.map((record) => {
			return mapDataModelToEntity(record);
		});
		try {
			await this.dbClient.lPA.createMany({
				data: mappedData
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientValidationError) {
				throw ApiError.badRequest(e.message);
			}
			throw e;
		}
	}
};
