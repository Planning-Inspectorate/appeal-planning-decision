const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client/client');
const ApiError = require('#errors/apiError');

/**
 * @typedef {import('@pins/database/src/client/client').ListedBuilding} ListedBuilding
 * @typedef {import('@pins/database/src/client/client').Prisma.ListedBuildingCreateInput} ListedBuildingCreateInput
 * @typedef {{updated: Set<string>, created: Set<string>}} ListedBuildingUpsertManyResponse
 */

class ListedBuildingRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * upsert an array of ListedBuilding
	 * @param {Array<ListedBuildingCreateInput>} listedBuildings
	 * @returns {Promise<ListedBuildingUpsertManyResponse>}
	 */
	async upsertMany(listedBuildings) {
		try {
			const existingBuildings = await this.dbClient.listedBuilding.findMany({
				where: {
					reference: {
						in: listedBuildings.map((lb) => lb.reference)
					}
				},
				select: {
					reference: true
				}
			});

			const existingRefs = new Set(existingBuildings.map((lb) => lb.reference));

			/**
			 * @type {{toCreate: Array<ListedBuildingCreateInput>, updating: Array<Promise<ListedBuilding>> }}
			 */
			const accumulator = { toCreate: [], updating: [] };
			const { toCreate, updating } = listedBuildings.reduce((acc, lb) => {
				const mappedData = {
					reference: lb.reference,
					name: lb.name,
					listedBuildingGrade: lb.listedBuildingGrade
				};
				if (existingRefs.has(lb.reference)) {
					const update = this.dbClient.listedBuilding.update({
						where: {
							reference: lb.reference
						},
						data: mappedData
					});
					acc.updating.push(update);
				} else {
					acc.toCreate.push(mappedData);
				}
				return acc;
			}, accumulator);
			await Promise.all(updating);

			await this.dbClient.listedBuilding.createMany({
				data: toCreate
			});

			return {
				updated: existingRefs,
				created: new Set(toCreate.map((lb) => lb.reference))
			};
		} catch (e) {
			if (e instanceof Prisma.PrismaClientValidationError) {
				throw ApiError.badRequest(e.message);
			}
			throw e;
		}
	}

	/**
	 * @param {string} reference
	 * @returns {Promise<ListedBuilding|null>}
	 */
	async get(reference) {
		return this.dbClient.listedBuilding.findUnique({
			where: {
				reference
			}
		});
	}
}

module.exports = { ListedBuildingRepository };
