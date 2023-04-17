const { FinalCommentsMapper } = require('../mappers/final-comments-mapper');
// eslint-disable-next-line no-unused-vars
const { FinalCommentsAggregate } = require('../models/aggregates/final-comments-aggregate');
const { MongoRepository } = require('./mongo-repository');

class FinalCommentsRepository extends MongoRepository {
	#finalCommentsMapper = new FinalCommentsMapper();

	constructor() {
		super('final-comments');
	}

	/**
	 *
	 * @param {string} caseReference
	 * @return {Promise<FinalCommentsAggregate | null>}
	 */
	async getByCaseReference(caseReference) {
		const finalCommentFoundJson = await this.findOneByQuery({ caseReference: caseReference });
		if (finalCommentFoundJson) {
			return this.#finalCommentsMapper.fromJson(finalCommentFoundJson);
		}
	}

	async getAllFinalCommentsByCaseReference(horizonId) {
		const finalCommentsFound = await this.getAllDocumentsThatMatchQuery({
			'finalComment.horizonId': horizonId
		});
		if (finalCommentsFound) {
			return finalCommentsFound;
		} else {
			return false;
		}
	}
}

module.exports = { FinalCommentsRepository };
