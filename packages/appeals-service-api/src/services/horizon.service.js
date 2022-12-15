const jp = require('jsonpath');

const { HorizonGateway } = require('../gateway/horizon-gateway');
const {
	getDocumentsInBase64Encoding,
	getAppealCountry
} = require('./appeal.service');
const logger = require('../lib/logger');

class HorizonService {
	#horizonGateway;

	constructor() {
		this.#horizonGateway = new HorizonGateway();
	}

	async createAppeal(appeal) {
		const createdOrganisations = await this.#horizonGateway.createOrganisations(appeal);
		const createdContacts = await this.#horizonGateway.createContacts(appeal, createdOrganisations);

		// TODO: We could upload documents in the "create appeal" request. However, 
		//       the response from Horizon isn't great if one of the many docs fails. 
		//       It doesn't say which document fails, just that the appeal failed.
		const appealCountry = await getAppealCountry(appeal);
		const horizonCaseReference = await this.#horizonGateway.createAppeal(appeal, createdContacts, appealCountry);

		const appealDocumentsInBase64Encoding = await getDocumentsInBase64Encoding(appeal);
		await this.#horizonGateway.uploadAppealDocuments(appealDocumentsInBase64Encoding, horizonCaseReference);

		logger.debug(`Appeal creation in Horizon complete, returning case reference: ${horizonCaseReference}`)
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
