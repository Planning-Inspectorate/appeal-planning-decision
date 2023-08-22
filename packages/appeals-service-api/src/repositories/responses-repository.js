const { MongoRepository } = require('./mongo-repository');

class ResponsesRepository extends MongoRepository {
	constructor() {
		super('responses');
	}

	async patchResponses(id, answers) {
		let result;

		const filter = { uniqueId: id };

		result = await this.updateOne(filter, answers);

		return result;
	}
}

module.exports = ResponsesRepository;
