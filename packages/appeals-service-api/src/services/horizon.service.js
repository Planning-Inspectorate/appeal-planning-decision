const jp = require('jsonpath');

const { HorizonGateway } = require('../gateway/horizon-gateway');
const { getContactDetails, getAppealDocumentInBase64Encoding } = require('./appeal.service');
const LpaService = require('./lpa.service');
const BackOfficeSubmissionEntity = require('../models/entities/back-office-submission-entity');
const logger = require('../lib/logger');

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
		logger.debug(submissionStateJson, "Submission state before processing")
		
		// If we have pending organisations, try to process them.
		const organisationsPendingSubmission = backOfficeSubmission.getOrganisationsPendingSubmission();
		if (organisationsPendingSubmission.length > 0) {
			const organisationSubmissions = await this.#submitOrganisationDetailsToHorizon(organisationsPendingSubmission, appealContactDetails);
			
			for (const organisationType in organisationSubmissions) {
				submissionStateJson.organisations[organisationType] = organisationSubmissions[organisationType];
			}
		}
		logger.debug(submissionStateJson, "Submission state after processing organisations")
		
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
		logger.debug(submissionStateJson, "Submission state after processing contacts")
		
		// If the core appeal data is pending, and all contacts have been uploaded, try to process it.
		if (
			backOfficeSubmission.isAppealDataPendingSubmission() &&
			(
				contactsPendingSubmission.length == 0 ||
				Object.keys(submissionStateJson.contacts).every(contactType => submissionStateJson.contacts[contactType].getBackOfficeId())
			)
		) {
			const appealSubmission = await this.#submitAppealToHorizon(backOfficeSubmission, appeal, submissionStateJson.contacts, appealContactDetails);
			submissionStateJson.appeal = appealSubmission;
		}
		logger.debug(submissionStateJson, "Submission state after processing core appeal data")

		// If we have pending documents, and the core appeal data has been submitted, try to process them.
		const documentsPendingSubmission = backOfficeSubmission.getDocumentsPendingSubmission();
		if (documentsPendingSubmission.length > 0 && submissionStateJson.appeal) {
			const documentSubmissions = await this.#submitDocumentsToHorizon(documentsPendingSubmission, appeal, submissionStateJson.appeal.getBackOfficeId());
			for (const documentSubmission of documentSubmissions) {
				submissionStateJson.documents[documentSubmission.getId()] = documentSubmission
			}
		}
		logger.debug(submissionStateJson, "Submission state after processing documents")

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

	/**
	 * 
	 * @param {BackOfficeAppealSubmissionEntity[]} organisationsPendingSubmission 
	 * @param {AppealContactsValueObject}
	 * @returns {Promise<any>} JSON, structure is {
	 * 	agent: BackOfficeAppealSubmissionEntity, 
	 * 	appellant: BackOfficeAppealSubmissionEntity
	 * }
	 */
	async #submitOrganisationDetailsToHorizon(organisationsPendingSubmission, appealContactDetails){
		
		const result = {}

		for (const organisationPendingSubmission of organisationsPendingSubmission) {
			const contactType = organisationPendingSubmission.getId(); // This will be "agent" or "appellant" (see back office mapper)
			result[contactType] = organisationPendingSubmission // If Horizon doesn't play nice, then the result for this contact type will be whatever the submission state was prior
			
			let contactToCreate = appealContactDetails.getAppellant(); // Assume that we're processing an appellant
			if (contactType === "agent") {
				result.agent = null; 
				contactToCreate = appealContactDetails.getAgent();
			} else {
				result.appellant = null;
			}
			
			const horizonResponse = await this.#horizonGateway.createOrganisation(contactToCreate);
			if (horizonResponse.isNotAnError()) {
				logger.debug(horizonResponse.getValue(), `Horizon response after attempting to create ${contactType} organisation`);
				result[contactType] = new BackOfficeSubmissionEntity(contactType, horizonResponse.getValue());
			}
		}

		logger.debug(result, "Result of submitting organisation details to Horizon");
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
	 * @returns {any} JSON, structure is {
	 * 	agent: BackOfficeSubmissionEntity, 
	 * 	appellant: BackOfficeSubmissionEntity
	 * }
	 */
	async #submitContactDetailsToHorizon(contactsPendingSubmission, organisationBackOfficeSubmissionEntities, appealContactDetails){
		
		const result = { } // If an agent is defined, we'll add it in further down :) There'll always be an appellant though!

		for (const contactPendingSubmission of contactsPendingSubmission) {
			const contactType = contactPendingSubmission.getId(); // This will be "agent" or "appellant" (see back office mapper)

			let contactToCreate = appealContactDetails.getAppellant(); // Assume that we're processing an appellant
			if (contactType === "agent") {
				result.agent = contactPendingSubmission;  // If Horizon doesn't play nice, then the result for this contact type will be whatever the submission state was prior
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
			if(organisationBackOfficeSubmissionEntities[contactType]){
				organisationBackOfficeId = organisationBackOfficeSubmissionEntities[contactType].getBackOfficeId()
			}
			
			if (
				contactType in organisationBackOfficeSubmissionEntities == false ||
				(contactType in organisationBackOfficeSubmissionEntities && organisationBackOfficeId)
			) {
				const horizonResponse = await this.#horizonGateway.createContact(contactToCreate, organisationBackOfficeId);
				if (horizonResponse.isNotAnError()) {
					logger.debug(horizonResponse.getValue(), `Horizon response after attempting to create ${contactType} contact`);
					result[contactType] = new BackOfficeSubmissionEntity(contactType, horizonResponse.getValue());	
				}
			}
		}
		
		logger.debug(result, "Result of submitting contact details to Horizon");
		return result;
	}

	/**
	 * 
	 * @param {BackOfficeSubmissionAggregate} backOfficeSubmission 
	 * @param {*} appeal 
	 * @param {any} contactSubmissions JSON, structure should be {
	 * 	agent: BackOfficeAppealSubmissionEntity, 
	 * 	appellant: BackOfficeAppealSubmissionEntity
	 * } 
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @returns {BackOfficeSubmissionEntity} 
	 */
	async #submitAppealToHorizon(backOfficeSubmission, appeal, contactSubmissions, appealContactDetails) {
		let appealBackOfficeId = backOfficeSubmission.getAppealId();
		
		const lpaEntity = await this.#lpaService.getLpaById(appeal.lpaCode);
		const horizonResponseValue = await this.#horizonGateway.createAppeal(
			appeal,
			contactSubmissions,
			lpaEntity,
			appealContactDetails
		);

		if (horizonResponseValue.isNotAnError()) {
			appealBackOfficeId = horizonResponseValue.getValue();
		}

		const result = new BackOfficeSubmissionEntity(backOfficeSubmission.getAppealId(), appealBackOfficeId);
		logger.debug(result, "Result of submitting core appeal data to Horizon");
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
	async #submitDocumentsToHorizon(documentsPendingSubmission, appeal, appealBackOfficeId){
		let result = []

		if (appealBackOfficeId == null) {
			return result;
		}

		for(const documentPendingSubmission of documentsPendingSubmission) {
			let documentBackOfficeId = documentPendingSubmission.getBackOfficeId(); // If Horizon doesn't play nice, then the result for this document will be whatever the submission state was prior
			
			const appealDocumentInBase64Encoding = await getAppealDocumentInBase64Encoding(appeal, documentPendingSubmission.getId());
			const horizonResponseValue = await this.#horizonGateway.uploadAppealDocument(
				appealDocumentInBase64Encoding,
				appealBackOfficeId
			);

			if (horizonResponseValue.isNotAnError()) {
				documentBackOfficeId = horizonResponseValue.getValue();
			}

			result.push(new BackOfficeSubmissionEntity(documentPendingSubmission.getId(), documentBackOfficeId));
		}

		logger.debug(result, "Result of submitting documents to Horizon");
		return result;
	}
}

module.exports = HorizonService;
