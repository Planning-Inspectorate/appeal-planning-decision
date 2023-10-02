const { MongoRepository } = require('./mongo-repository');

class ListedBuildingRepository extends MongoRepository {
	constructor() {
		super('listedBuilding');
	}

	async getListedBuilding(reference) {
		return await this.findOneByQuery({
			reference
		});
	}

	async updateListedBuildings(listedBuildings) {
		const updateOperations = listedBuildings.map((listedbuilding) => {
			return {
				reference: listedbuilding.reference,
				updateSet: listedbuilding
			};
		});

		return await super.upsertManyByProp('reference', updateOperations);
	}
}

module.exports = ListedBuildingRepository;
