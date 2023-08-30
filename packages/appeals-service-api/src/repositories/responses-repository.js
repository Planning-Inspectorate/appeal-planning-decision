const flattenObjectToDotNotation = require('../lib/flattenObjectToDotNotation');
const { MongoRepository } = require('./mongo-repository');

class ResponsesRepository extends MongoRepository {
	constructor() {
		super('responses');
	}

	async patchResponses(formId, referenceId, answers) {
		let result;

		const filter = { uniqueId: `${formId}:${referenceId}` };

		let dateNow = new Date();

		let updatedAnswers = {
			...answers,
			updateDate: dateNow
		};

		let flattenedAnswers = flattenObjectToDotNotation(updatedAnswers);

		result = await this.updateOne(filter, {
			$set: flattenedAnswers,
			$setOnInsert: { formId: formId, referenceId: referenceId, startDate: dateNow }
		});

		//todo: at some point we want startDate to reflect when a user actually begins a journey
		//rather than, as implemented here, a createdAt date - as the response might be created
		//before the user actually starts working on it

		return result;
	}
}

module.exports = ResponsesRepository;
