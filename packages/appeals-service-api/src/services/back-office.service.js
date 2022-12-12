const { isFeatureActive } = require('../configuration/featureFlag');
const jp = require('jsonpath');
const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');
const {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant
} = require('../lib/notify');
const { BackOfficeRepository } = require('../repositories/back-office-repository');
const { HorizonGateway } = require('../gateway/horizon-gateway');
const {
	getAppeal,
	getDocumentsInBase64Encoding,
	saveAppealAsSubmittedToBackOffice
} = require('./appeal.service');
const { getLpaById } = require('../services/lpa.service');

class BackOfficeService {
	#horizonGateway;
	#backOfficeRepository;

	constructor() {
		this.#horizonGateway = new HorizonGateway();
		this.#backOfficeRepository = new BackOfficeRepository();
	}

	/**
	 * Will submit the appeal with `id` specified to the Back Office system, iff
	 *
	 * 1. The appeal with the ID specified exists in the database
	 * 2. The appeal does not have a non-blank Horizon ID
	 * 3. The appeal does not already exist in Horizon
	 *
	 * @param {string} id
	 */
	async submitAppeal(id) {
		logger.debug(`Attempting to submit appeal with ID ${id} to the back office`);

		let savedAppeal = await getAppeal(id);
		logger.debug(`Appeal found in repository: ${JSON.stringify(savedAppeal)}`);
		if (savedAppeal === null) {
			throw ApiError.appealNotFound(id);
		}

		if (savedAppeal.horizonId == undefined || savedAppeal.horizonId == false) {
			let updatedAppeal;
			if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) {
				console.log('Using direct Horizon integration');
				const createdOrganisations = await this.#horizonGateway.createOrganisations(savedAppeal);
				const createdContacts = await this.#horizonGateway.createContacts(
					savedAppeal,
					createdOrganisations
				);
				const horizonCaseReferenceForAppeal = await this.#horizonGateway.createAppeal(
					savedAppeal,
					createdContacts,
					await getLpaById(savedAppeal.lpaCode)
				);
				await this.#horizonGateway.uploadAppealDocumentsToAppealInHorizon(
					id,
					getDocumentsInBase64Encoding(savedAppeal)
				);
				updatedAppeal = await saveAppealAsSubmittedToBackOffice(
					savedAppeal,
					horizonCaseReferenceForAppeal
				);
			} else {
				console.log('Using message queue integration');
				updatedAppeal = await saveAppealAsSubmittedToBackOffice(savedAppeal);
				this.#backOfficeRepository.create(updatedAppeal);
			}

			await sendSubmissionConfirmationEmailToAppellant(updatedAppeal);
			await sendSubmissionReceivedEmailToLpa(updatedAppeal);
			return updatedAppeal;
		}

		logger.debug('Appeal has already been submitted to the back-office');
		throw ApiError.appealAlreadySubmitted();
	}

	/**
	 *
	 * @param {string} caseReference
	 * @return {Promise<Date | undefined>}
	 */
	async getFinalCommentsDueDate(caseReference) {
		const horizonAppeal = await this.#horizonGateway.getAppeal(caseReference);

		// Here be dragons! This bit is complicated because of the Horizon appeal data structure
		// (sorry to anyone who has to work on this).
		const attributes = jp.query(horizonAppeal, '$..Metadata.Attributes[*]');

		if (attributes.length === 0) {
			return undefined;
		}

		// Here we're simplifying the returned data structure so that the JSON Path expression
		// is easier to read. Essentially it changes this structure:
		//
		// {
		//   Name: { value: ""},
		//   Value: { value: "" }
		// }
		//
		// into
		//
		// {
		//   Name: "",
		//   Value: ""
		// }
		const attributesModified = attributes.map((attribute) => {
			return { Name: attribute.Name.value, Value: attribute.Value.value };
		});

		const finalCommentsDueDate = jp.query(
			attributesModified,
			'$..[?(@.Name == "Case Document Dates:Final Comments Due Date")].Value'
		);

		if (finalCommentsDueDate == false) {
			return undefined;
		}

		return new Date(Date.parse(finalCommentsDueDate));
	}
}

module.exports = BackOfficeService;
