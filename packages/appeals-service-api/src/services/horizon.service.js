const jp = require('jsonpath');

const { HorizonGateway } = require('../gateway/horizon-gateway');
const {
	getDocumentsInBase64Encoding,
	saveAppealAsSubmittedToBackOffice,
	getAppealCountry
} = require('./appeal.service');

class HorizonService {

    #horizonGateway

    constructor() {
        this.#horizonGateway = new HorizonGateway();
    }

    async createAppeal(appeal){
        const createdOrganisations = await this.#horizonGateway.createOrganisations(appeal);
        const createdContacts = await this.#horizonGateway.createContacts(appeal, createdOrganisations);

        // TODO: According to Postman, we should be able to upload documents in the
        //       "create appeal" request? We could do this to speed things up?
        const appealCounty = await getAppealCountry(appeal);
        const horizonCaseReferenceForAppeal = await this.#horizonGateway.createAppeal(appeal, createdContacts, appealCounty);

        const appealDocumentsInBase64Encoding = getDocumentsInBase64Encoding(appeal)
        await this.#horizonGateway.uploadAppealDocuments(appealDocumentsInBase64Encoding, horizonCaseReferenceForAppeal);
        
        await saveAppealAsSubmittedToBackOffice(appeal, horizonCaseReferenceForAppeal);
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

module.exports = HorizonService