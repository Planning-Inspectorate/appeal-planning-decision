const jp = require('jsonpath');

const { HorizonGateway } = require('../gateway/horizon-gateway');
const { getContactDetails, getAppealDocumentInBase64Encoding } = require('./appeal.service');
const LpaService = require('./lpa.service');
const BackOfficeSubmissionEntity = require('../models/entities/back-office-submission-entity');
const logger = require('../lib/logger')

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
	 * @param {BackOfficeAppealSubmissionAggregate} The current back office submission state of the appeal.
	 * @returns {BackOfficeAppealSubmissionAggregate} The new back office submission state of the appeal.
	 */
	async submitAppeal(appeal, backOfficeSubmission) {

		let organisationBackOfficeIds = [];
		let contactBackOfficeIds = [];
		
		const organisationsPendingSubmission = backOfficeSubmission.getOrganisationsPendingSubmission();
		const contactsPendingSubmission = backOfficeSubmission.getContactsPendingSubmission();
		
		if (organisationsPendingSubmission || contactsPendingSubmission){
			const appealContactDetails = getContactDetails(appeal);
			organisationBackOfficeIds = await this.#horizonGateway.createOrganisations(appealContactDetails);
			contactBackOfficeIds = await this.#horizonGateway.createContacts(appealContactDetails, organisationBackOfficeIds);
		}
		
		const appealBackOfficeSubmissionResult = await this.#submitAppealToHorizonAndGetSubmissionEntity(backOfficeSubmission, appeal, contactBackOfficeIds);

		let documentBackOfficeSubmissionResults = [];
		let appealBackOfficeId = appealBackOfficeSubmissionResult.getBackOfficeId();
		if (appealBackOfficeId) {
			documentBackOfficeSubmissionResults = await this.#submitDocumentsToHorizon(backOfficeSubmission, appeal, appealBackOfficeId);
		}

		return backOfficeSubmission.update(
			appealBackOfficeSubmissionResult,
			documentBackOfficeSubmissionResults
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
	 * @param {BackOfficeSubmissionAggregate} backOfficeSubmission 
	 * @param {*} appeal 
	 * @param {string[]} contactBackOfficeIds 
	 * @returns {BackOfficeSubmissionEntity} 
	 */
	async #submitAppealToHorizonAndGetSubmissionEntity(backOfficeSubmission, appeal, contactBackOfficeIds) {
		let appealBackOfficeId = backOfficeSubmission.getAppealId();
		
		if (backOfficeSubmission.isAppealDataPendingSubmission()) {
			const lpaEntity = await this.#lpaService.getLpaById(appeal.lpaCode);
			const horizonResponseValue = await this.#horizonGateway.createAppeal(
				appeal,
				contactBackOfficeIds,
				lpaEntity
			);

			if (horizonResponseValue.isNotAnError()) {
				appealBackOfficeId = horizonResponseValue.getValue();
			}
		}

		return new BackOfficeSubmissionEntity(backOfficeSubmission.getAppealId(), appealBackOfficeId)
	}

	async #submitDocumentsToHorizon(backOfficeSubmission, appeal, appealBackOfficeId){
		let result = []

		const documentsPendingSubmission = backOfficeSubmission.getDocumentsPendingSubmission();
		for(const documentPendingSubmission of documentsPendingSubmission) {
			const appealDocumentInBase64Encoding = await getAppealDocumentInBase64Encoding(appeal, documentPendingSubmission.getId());
			const horizonResponseValue = await this.#horizonGateway.uploadAppealDocument(
				appealDocumentInBase64Encoding,
				appealBackOfficeId
			);

			let documentBackOfficeId = null;
			if (horizonResponseValue.isNotAnError()) {
				documentBackOfficeId = horizonResponseValue.getValue();
			}

			result.push(new BackOfficeSubmissionEntity(documentPendingSubmission.getId(), documentBackOfficeId));
		}

		result.forEach(x => console.log(x.toJSON()))
		return result;
	}
}

module.exports = HorizonService;
