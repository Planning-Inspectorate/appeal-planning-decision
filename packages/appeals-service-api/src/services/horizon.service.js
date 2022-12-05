const jp = require('jsonpath');
const { HorizonGateway } = require('../gateway/horizon-gateway');

class HorizonService {

    #horizonGateway

    constructor(){
        this.#horizonGateway = new HorizonGateway();
    }

    async getAppeal(caseReference){
        return await this.#horizonGateway.getAppeal(caseReference);
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

module.exports = { HorizonService }