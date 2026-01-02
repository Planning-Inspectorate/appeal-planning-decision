const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client/client').Event} Event
 */
class AppealEventRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get event for given appeal
	 *
	 * @param {string} caseReference
	 * @param {object} [options]
	 * @param {string} [options.type]
	 * @param {boolean} [options.includePast]
	 * @returns {Promise<Array<Event>>}
	 */
	getEventsByAppealRef(caseReference, options) {
		/** @type {import('@pins/database/src/client/client').Prisma.EventWhereInput} */
		const where = {
			caseReference: caseReference,
			published: true
		};

		if (!options?.includePast) {
			where.endDate = {
				gt: new Date()
			};
		}

		if (options?.type) {
			where.type = options.type;
		}

		return this.dbClient.event.findMany({
			where: where
		});
	}
}

module.exports = { AppealEventRepository };
