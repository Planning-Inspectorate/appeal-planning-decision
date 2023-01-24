const jp = require('jsonpath');

const { HorizonGateway } = require('../gateway/horizon-gateway');
const { getContactDetails, getDocumentsInBase64Encoding } = require('./appeal.service');
const logger = require('../lib/logger');
const LpaService = require('./lpa.service');

class HorizonService {
	#horizonGateway;
	#lpaService;

	constructor() {
		this.#horizonGateway = new HorizonGateway();
		this.#lpaService = new LpaService();
	}

	async submitAppeal(appeal) {
		const appealContactDetails = getContactDetails(appeal);
		const contactOrganisationHorizonIDs = await this.#horizonGateway.createOrganisations(appealContactDetails);
		const createdContacts = await this.#horizonGateway.createContacts(appealContactDetails, contactOrganisationHorizonIDs);
		const lpaEntity = await this.#lpaService.getLpaById(appeal.lpaCode);

		const horizonCaseReference = await this.#horizonGateway.createAppeal(
			appeal,
			createdContacts,
			lpaEntity
		);

		const appealDocumentsInBase64Encoding = await getDocumentsInBase64Encoding(appeal);
		for(const appealDocumentInBase64Encoding of appealDocumentsInBase64Encoding) {
			await this.#horizonGateway.uploadAppealDocument(
				appealDocumentInBase64Encoding,
				horizonCaseReference
			);
		}

		logger.debug(
			`Appeal creation in Horizon complete, returning case reference: ${horizonCaseReference}`
		);
		return horizonCaseReference;
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

module.exports = HorizonService;
