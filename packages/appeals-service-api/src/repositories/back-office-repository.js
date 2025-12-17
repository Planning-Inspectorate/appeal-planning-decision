const logger = require('../lib/logger.js');
const BackOfficeMapper = require('../mappers/back-office.mapper');
const { MongoRepository } = require('./mongo-repository');
const ApiError = require('../errors/apiError');
class BackOfficeRepository extends MongoRepository {
	#mapper;
	#sender = null;

	constructor() {
		super('to-submit-to-back-office');
		this.#mapper = new BackOfficeMapper();
	}

	/**
	 *
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @param {string} appealId
	 * @param {string[]} documentIds
	 * @throws {ApiError} if the direct Horizon integration feature flag is on, and the appeal to
	 * be saved has already been saved for back-office submission.
	 * @returns {Promise<void>}
	 */
	async saveAppealForSubmission(appealContactDetails, appealToProcess, documentIds) {
		logger.debug('Queuing the appeal for submission via direct Horizon integration');
		const appealWithIdAlreadyLoaded = await super.findOneByQuery({
			'appeal.id': appealToProcess.id
		});

		if (appealWithIdAlreadyLoaded) {
			logger.debug(
				`Appeal with ID ${appealToProcess.id} has already been submitted for back-office processing`
			);
			throw ApiError.appealAlreadySubmitted();
		}

		const appealToSaveForSubmission = this.#mapper.appealToAppealToBeSubmittedJson(
			appealContactDetails,
			appealToProcess.id,
			documentIds
		);

		return await super.create(appealToSaveForSubmission);
	}

	/**
	 *
	 * @returns {Promise<BackOfficeAppealSubmissionAggregate[]>}
	 */
	async getAppealsForSubmission() {
		const docs = await super.getAllDocumentsFromCollection();

		// We did try using .map() on the result of the call above however, JS
		// doesn't handle the "this" context nicely, and the `#mapper# is not found.
		// So we did it like this instead!
		const result = [];
		for (const doc of docs) {
			result.push(this.#mapper.fromJsonToBackOfficeAppealSubmission(doc));
		}

		return result;
	}

	/**
	 *
	 * @param {BackOfficeAppealSubmissionAggregate[]} appealSubmissionsToUpdate
	 */
	async updateAppealSubmissions(appealSubmissionsToUpdate) {
		const appealSubmissionsAsMongoDocuments = [];
		for (const appealSubmission of appealSubmissionsToUpdate) {
			appealSubmissionsAsMongoDocuments.push(
				this.#fromBackOfficeAppealSubmissionToMongoJson(appealSubmission)
			);
		}

		logger.debug(appealSubmissionsAsMongoDocuments, 'Updates to commit to the database');

		const updateOneOperations = appealSubmissionsAsMongoDocuments.map((appealSubmission) => {
			return {
				id: appealSubmission._id,
				updateSet: {
					organisations: appealSubmission.organisations,
					contacts: appealSubmission.contacts,
					appeal: appealSubmission.appeal,
					documents: appealSubmission.documents
				}
			};
		});

		return await super.upsertManyById(updateOneOperations);
	}

	/**
	 *
	 * @param {string[]} ids
	 * @returns
	 */
	async deleteAppealSubmissions(ids) {
		return await super.deleteMany(ids);
	}

	async deleteAppealSubmission(id) {
		return await super.remove(id);
	}

	async findOneById(id) {
		return await super.findOneByQuery({ 'appeal.id': id });
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
					failures: organisationSubmissionEntity.getFailures()
				};
			}),
			contacts: appealSubmission.getContacts().map((contactSubmissionEntity) => {
				return {
					type: contactSubmissionEntity.getId(),
					horizon_id: contactSubmissionEntity.getBackOfficeId(),
					failures: contactSubmissionEntity.getFailures()
				};
			}),
			appeal: {
				id: appealSubmission.getAppealId(),
				horizon_id: appealSubmission.getAppealBackOfficeId(),
				failures: appealSubmission.getAppealFailures()
			},
			documents: appealSubmission.getDocuments().map((documentSubmissionEntity) => {
				return {
					id: documentSubmissionEntity.getId(),
					horizon_id: documentSubmissionEntity.getBackOfficeId(),
					failures: documentSubmissionEntity.getFailures()
				};
			})
		};
	}
}

module.exports = { BackOfficeRepository };
