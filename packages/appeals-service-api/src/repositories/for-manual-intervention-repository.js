const { MongoRepository } = require('./mongo-repository');
const logger = require('../lib/logger.js');
const mongodb = require('../db/db');

class ForManualInterventionRepository extends MongoRepository {
	constructor() {
		super('for-manual-intervention');
	}
	/**
	 *
	 * @param {BackOfficeAppealSubmissionAggregate} appealSubmission
	 * @returns
	 */
	async createAppealForManualIntervention(appealSubmission) {
		//Convert appealSubmission to MongoJSON
		let appealToSubmit = this.#fromBackOfficeAppealSubmissionToMongoJson(appealSubmission);
		logger.debug(`Submitting appeal to 'for-manual-intervention' database: ${appealToSubmit}`);
		return await mongodb.get().collection(this.collectionName).insertOne(appealToSubmit);
	}

	async getAppealsForManualIntervention() {
		return await super.getAllDocumentsFromCollection();
	}

	async getAppealForManualInterventionById(id) {
		return await super.findOneByQuery({ 'appeal.id': id });
	}

	async deleteAppealsForManualInterventionById(ids) {
		return await super.deleteMany(ids);
	}
	/**
	 *
	 * @param {BackOfficeAppealSubmissionAggregate} appealSubmission
	 * @returns
	 */
	#fromBackOfficeAppealSubmissionToMongoJson(appealSubmission) {
		// NOTE: this is not included as a function in the AppealSubmissionAggregate
		//       since it has the Mongo-specific _id field, and we don't want to
		//       couple the concept of an AppealSubmissionAggregate to a database engine.
		//       Instead, to improve cohesion, anything Mongo related should be in this
		//       class, or its super class
		return {
			_id: appealSubmission.getId(),
			organisations: appealSubmission.getOrganisations().map((organisationSubmissionEntity) => {
				return {
					type: organisationSubmissionEntity.getId(),
					horizon_id: organisationSubmissionEntity.getBackOfficeId(),
					failures: organisationSubmissionEntity.getFailures().map((failure) => {
						return { reason: failure.reason, datetime: failure.datetime };
					})
				};
			}),
			contacts: appealSubmission.getContacts().map((contactSubmissionEntity) => {
				return {
					type: contactSubmissionEntity.getId(),
					horizon_id: contactSubmissionEntity.getBackOfficeId(),
					failures: contactSubmissionEntity.getFailures().map((failure) => {
						return { reason: failure.reason, datetime: failure.datetime };
					})
				};
			}),
			appeal: {
				id: appealSubmission.getAppealId(),
				horizon_id: appealSubmission.getAppealBackOfficeId(),
				failures: appealSubmission.getAppealFailures().map((failure) => {
					return { reason: failure.reason, datetime: failure.datetime };
				})
			},
			documents: appealSubmission.getDocuments().map((documentSubmissionEntity) => {
				return {
					id: documentSubmissionEntity.getId(),
					horizon_id: documentSubmissionEntity.getBackOfficeId(),
					failures: documentSubmissionEntity.getFailures().map((failure) => {
						return { reason: failure.reason, datetime: failure.datetime };
					})
				};
			})
		};
	}
}
module.exports = { ForManualInterventionRepository };
