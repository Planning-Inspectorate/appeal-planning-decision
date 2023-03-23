// This class uses rhea since it enables us to use AMQP protocol version 1.0 which Azure Service Bus uses.
// Azure Service Bus doesn't support AMQP protocols less than 1.0, see https://github.com/Azure/azure-service-bus/issues/288
// ¯\_(ツ)_/¯
const container = require('rhea');

const { isFeatureActive } = require('../../src/configuration/featureFlag');
const config = require('../configuration/config');
const logger = require('../lib/logger');
const { saveAppealAsSubmittedToBackOffice } = require('../services/appeal.service');
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
		if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) {
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
		} else {
			// TODO: this needs testing when it comes back into use!! In these tests, messages need to be known as
			//       having arrived in a message queue before assertions can be made against the queue's state, but
			//       this is already set up to be tested (see the `afterEach` method in
			//       `__tests__/developer/developer.test.js`).
			logger.debug('Using message queue integration');
			const appealAfterSubmissionToBackOffice = await saveAppealAsSubmittedToBackOffice(
				appealToProcess
			);
			this.#sendAppealToBackOfficeMessageQueue(appealAfterSubmissionToBackOffice);
		}
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
	 * @deprecated DEPRECATED UNTIL WE BETTER UNDERSTAND AMQP 1.0, AZURE SERVICE BUS, AND AZURE FUNCTIONS.
	 * @param {string} message
	 * @return {Promise<void>}
	 */
	#sendAppealToBackOfficeMessageQueue(message) {
		// We don't do this set up in the constructor because, if we do, the message queue to connect
		// to may not be available, and the app blows up due to timeout exceptions thrown by rhea.
		// Note that we only want one sender, hence this block of code!
		if (this.#sender == null) {
			this.#sender = container
				.connect(config.messageQueue.horizonHASPublisher.connection)
				.open_sender(config.messageQueue.horizonHASPublisher.queue);
		}

		this.#sender.send({
			body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
			content_type: 'application/json'
		});
		logger.debug(`Message sent to the queue`);

		container.on('error', (err) => {
			logger.error({ err }, 'There was a problem with the queue');
		});

		container.on('disconnected', (context) => {
			context.connection.close();
		});
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
