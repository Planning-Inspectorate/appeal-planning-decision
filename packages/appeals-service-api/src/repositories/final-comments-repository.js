const { MongoRepository } = require('./mongo-repository');

class FinalCommentsRepository extends MongoRepository {
	constructor() {
		super('final-comments');
	}

	/**
	 * 
	 * @param {string} caseReference
	 * @return {Promise<any>}
	 */
	async getByCaseReference(caseReference) {
		return await this.findOneByQuery({ caseReference: caseReference });
	}
}

module.exports = { FinalCommentsRepository}