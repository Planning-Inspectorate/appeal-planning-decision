const { HorizonGateway } = require('../gateway/horizon-gateway');
const { getContactDetails, getAppealDocumentInBase64Encoding } = require('./appeal.service');
const LpaService = require('./lpa.service');
const BackOfficeSubmissionEntity = require('../models/entities/back-office-submission-entity');
const logger = require('../lib/logger.js');

class HorizonService {
	#horizonGateway;
	#lpaService;

	constructor() {
		this.#horizonGateway = new HorizonGateway();
		this.#lpaService = new LpaService();
	}

	/**
	 *
	 * @param {*} appeal
	 * @param {BackOfficeAppealSubmissionAggregate} backOfficeSubmission The current back office submission state of the appeal.
	 * @returns {BackOfficeAppealSubmissionAggregate} The new back office submission state of the appeal.
	 */
	async submitAppeal(appeal, backOfficeSubmission) {
		const submissionStateJson = backOfficeSubmission.toJSON();
		const appealContactDetails = getContactDetails(appeal);
		logger.debug(submissionStateJson, 'Submission state before processing');

		// If we have pending organisations, try to process them.
		const organisationsPendingSubmission = backOfficeSubmission.getOrganisationsPendingSubmission();
		if (organisationsPendingSubmission.length > 0) {
			const organisationSubmissions = await this.#submitOrganisationDetailsToHorizon(
				organisationsPendingSubmission,
				appealContactDetails
			);

			for (const organisationType in organisationSubmissions) {
				submissionStateJson.organisations[organisationType] =
					organisationSubmissions[organisationType];
			}
		}
		logger.debug(submissionStateJson, 'Submission state after processing organisations');

		// If we have pending contacts, try to process them.
		const contactsPendingSubmission = backOfficeSubmission.getContactsPendingSubmission();
		if (contactsPendingSubmission.length > 0) {
			const contactSubmissions = await this.#submitContactDetailsToHorizon(
				contactsPendingSubmission,
				submissionStateJson.organisations,
				appealContactDetails
			);

			for (const contactType in contactSubmissions) {
				submissionStateJson.contacts[contactType] = contactSubmissions[contactType];
			}
		}
		logger.debug(submissionStateJson, 'Submission state after processing contacts');

		// If the core appeal data is pending, and all contacts have been uploaded, try to process it.
		const appealDataPendingSubmission = backOfficeSubmission.getAppeal();
		if (backOfficeSubmission.isAppealDataPendingSubmission()) {
			const appealSubmission = await this.#submitAppealToHorizon(
				backOfficeSubmission,
				appeal,
				submissionStateJson,
				appealContactDetails,
				appealDataPendingSubmission
			);
			submissionStateJson.appeal = appealSubmission;
		}
		logger.debug(submissionStateJson, 'Submission state after processing core appeal data');

		// If we have pending documents, and the core appeal data has been submitted, try to process them.
		const documentsPendingSubmission = backOfficeSubmission.getDocumentsPendingSubmission();
		if (documentsPendingSubmission.length > 0 && submissionStateJson.appeal) {
			const documentSubmissions = await this.#submitDocumentsToHorizon(
				documentsPendingSubmission,
				appeal,
				submissionStateJson.appeal.getBackOfficeId(true)
			);
			for (const documentSubmission of documentSubmissions) {
				submissionStateJson.documents[documentSubmission.getId()] = documentSubmission;
			}
		}
		logger.debug(submissionStateJson, 'Submission state after processing documents');

		return backOfficeSubmission.update(
			submissionStateJson.organisations,
			submissionStateJson.contacts,
			submissionStateJson.appeal,
			submissionStateJson.documents
		);
	}

	/**
	 *
	 * @param {string} caseReference
	 * @return {Promise<Object> | undefined>}
	 */
	async getAppealDataFromHorizon(caseReference) {
		logger.info('Fetching Appeal from Horizon');
		const horizonAppeal = await this.#horizonGateway.getAppeal(caseReference);

		return horizonAppeal;
	}

	/**
	 *
	 * @param {BackOfficeAppealSubmissionEntity[]} organisationsPendingSubmission
	 * @param {AppealContactsValueObject}
	 * @returns {Promise<any>} JSON, structure is {
	 * 	agent: BackOfficeAppealSubmissionEntity,
	 * 	appellant: BackOfficeAppealSubmissionEntity
	 * }
	 */
	async #submitOrganisationDetailsToHorizon(organisationsPendingSubmission, appealContactDetails) {
		const result = {};

		for (const organisationPendingSubmission of organisationsPendingSubmission) {
			const contactType = organisationPendingSubmission.getId(); // This will be "agent" or "appellant" (see back office mapper)
			result[contactType] = organisationPendingSubmission; // If Horizon doesn't play nice, then the result for this contact type will be whatever the submission state was prior

			let contactToCreate = appealContactDetails.getAppellant(); // Assume that we're processing an appellant
			if (contactType === 'agent') {
				result.agent = null;
				contactToCreate = appealContactDetails.getAgent();
			} else {
				result.appellant = null;
			}

			const horizonResponse = await this.#horizonGateway.createOrganisation(contactToCreate);
			if (horizonResponse.isNotAnError()) {
				logger.debug(
					horizonResponse.getValue(),
					`Horizon response after attempting to create ${contactType} organisation`
				);
				result[contactType] = new BackOfficeSubmissionEntity(
					contactType,
					horizonResponse.getValue(),
					[]
				);
			} else {
				const datetimeNow = new Date();
				let updatedFailures = organisationPendingSubmission.getFailures();
				updatedFailures.push({ reason: horizonResponse.getValue(), datetime: datetimeNow });
				result[contactType] = new BackOfficeSubmissionEntity(contactType, null, updatedFailures);
			}
		}

		logger.debug(result, 'Result of submitting organisation details to Horizon');
		return result;
	}

	/**
	 *
	 * @param {BackOfficeAppealSubmissionEntity[]} contactsPendingSubmission
	 * @param {any} organisationBackOfficeSubmissionEntities JSON, structure should be {
	 * 	agent: BackOfficeSubmissionEntity,
	 * 	appellant: BackOfficeSubmissionEntity
	 * }
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @returns {Promise<any>} JSON, structure is {
	 * 	agent: BackOfficeSubmissionEntity,
	 * 	appellant: BackOfficeSubmissionEntity
	 * }
	 */
	async #submitContactDetailsToHorizon(
		contactsPendingSubmission,
		organisationBackOfficeSubmissionEntities,
		appealContactDetails
	) {
		const result = {}; // If an agent is defined, we'll add it in further down :) There'll always be an appellant though!

		for (const contactPendingSubmission of contactsPendingSubmission) {
			const contactType = contactPendingSubmission.getId(); // This will be "agent" or "appellant" (see back office mapper)

			let contactToCreate = appealContactDetails.getAppellant(); // Assume that we're processing an appellant
			if (contactType === 'agent') {
				result.agent = contactPendingSubmission; // If Horizon doesn't play nice, then the result for this contact type will be whatever the submission state was prior
				contactToCreate = appealContactDetails.getAgent();
			} else {
				result.appellant = contactPendingSubmission; // If Horizon doesn't play nice, then the result for this contact type will be whatever the submission state was prior
			}

			// At this point, we also need to check for organisations. There may not be any,
			// since organisations are optional when filling out an appeal. If that's the
			// case, go ahead and process the pending contacts.
			//
			// Otherwise, if there are organisations, then we need to associate the contacts
			// with their relevant organisations. This is done based on the contact/organisation
			// type i.e are we processing an agent's contact details, or an appellant's?
			// In this case, we should submit a create contact request if-and-only-if the
			// relevant organisation for that contact has a back office ID. Otherwise, we
			// won't be able to link the organisation and the contact together.
			let organisationBackOfficeId = null;
			if (organisationBackOfficeSubmissionEntities[contactType]) {
				organisationBackOfficeId =
					organisationBackOfficeSubmissionEntities[contactType].getBackOfficeId();
			}

			if (
				contactType in organisationBackOfficeSubmissionEntities == false ||
				(contactType in organisationBackOfficeSubmissionEntities && organisationBackOfficeId)
			) {
				const horizonResponse = await this.#horizonGateway.createContact(
					contactToCreate,
					organisationBackOfficeId
				);
				if (horizonResponse.isNotAnError()) {
					logger.debug(
						horizonResponse.getValue(),
						`Horizon response after attempting to create ${contactType} contact`
					);
					result[contactType] = new BackOfficeSubmissionEntity(
						contactType,
						horizonResponse.getValue(),
						[]
					);
				} else {
					const datetimeNow = new Date();
					let updatedFailures = contactPendingSubmission.getFailures();
					updatedFailures.push({ reason: horizonResponse.getValue(), datetime: datetimeNow });
					result[contactType] = new BackOfficeSubmissionEntity(contactType, null, updatedFailures);
				}
			}
		}

		logger.debug(result, 'Result of submitting contact details to Horizon');
		return result;
	}

	/**
	 *
	 * @param {BackOfficeSubmissionAggregate} backOfficeSubmission
	 * @param {*} appeal
	 * @param {any} submissionStateJson
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @param {BackOfficeSubmissionEntity} appealDataPendingSubmission
	 * @returns {Promise<BackOfficeSubmissionEntity>}
	 */
	async #submitAppealToHorizon(
		backOfficeSubmission,
		appeal,
		submissionStateJson,
		appealContactDetails,
		appealDataPendingSubmission
	) {
		const contactsPendingSubmission = backOfficeSubmission.getContactsPendingSubmission();
		let appealBackOfficeId = backOfficeSubmission.getAppealBackOfficeId();
		const submissionStateOfContacts = submissionStateJson.contacts;
		let updatedFailures = appealDataPendingSubmission.getFailures();
		// If there are no contacts pending submission OR, there were but now they all have back office IDs, try to submit the core appeal data
		if (
			contactsPendingSubmission.length == 0 ||
			Object.keys(submissionStateOfContacts).every((contactType) =>
				submissionStateOfContacts[contactType].getBackOfficeId()
			)
		) {
			const lpaEntity = await this.#lpaService.getLpaById(appeal.lpaCode);
			const horizonResponseValue = await this.#horizonGateway.createAppeal(
				appeal,
				submissionStateOfContacts,
				lpaEntity,
				appealContactDetails
			);

			if (horizonResponseValue.isNotAnError()) {
				appealBackOfficeId = horizonResponseValue.getValue();
			} else {
				const datetimeNow = new Date();
				let updatedFailures = appealDataPendingSubmission.getFailures();
				updatedFailures.push({ reason: horizonResponseValue.getValue(), datetime: datetimeNow });
			}
		}

		const result = new BackOfficeSubmissionEntity(
			backOfficeSubmission.getAppealId(),
			appealBackOfficeId,
			updatedFailures
		);
		logger.debug(result, 'Result of submitting core appeal data to Horizon');
		return result;
	}

	/**
	 *
	 * @param {BackOfficeSubmissionEntity[]} documentsPendingSubmission
	 * @param {any} appeal
	 * @param {string} appealBackOfficeId
	 * @returns {Promise<any>} JSON, structure is:
	 * {
	 *   <document_1_id>: <horizon_id>,
	 *   <document_2_id>: <horizon_id>,
	 * 	 ...
	 * }
	 */
	async #submitDocumentsToHorizon(documentsPendingSubmission, appeal, appealBackOfficeId) {
		let result = [];

		if (appealBackOfficeId == null) {
			return result;
		}

		for (const documentPendingSubmission of documentsPendingSubmission) {
			let documentBackOfficeId = documentPendingSubmission.getBackOfficeId(); // If Horizon doesn't play nice, then the result for this document will be whatever the submission state was prior
			let updatedFailures = documentPendingSubmission.getFailures();
			const appealDocumentInBase64Encoding = await getAppealDocumentInBase64Encoding(
				appeal,
				documentPendingSubmission.getId()
			);
			const horizonResponseValue = await this.#horizonGateway.uploadAppealDocument(
				appealDocumentInBase64Encoding,
				appealBackOfficeId
			);

			if (horizonResponseValue.isNotAnError()) {
				documentBackOfficeId = horizonResponseValue.getValue();
				result.push(
					new BackOfficeSubmissionEntity(
						documentPendingSubmission.getId(),
						documentBackOfficeId,
						[]
					)
				);
			} else {
				const datetimeNow = new Date();
				updatedFailures.push({ reason: horizonResponseValue.getValue(), datetime: datetimeNow });
				result.push(
					new BackOfficeSubmissionEntity(
						documentPendingSubmission.getId(),
						documentBackOfficeId,
						updatedFailures
					)
				);
			}
		}
		logger.debug(result, 'Result of submitting documents to Horizon');
		return result;
	}
	async findValueFromMetadata(metaData, name) {
		// eslint-disable-next-line no-unused-vars
		for (const [key, att] of Object.entries(metaData)) {
			if (att.Name.value.includes(name)) return att.Value.value;
		}
		return undefined;
	}
}

module.exports = HorizonService;
