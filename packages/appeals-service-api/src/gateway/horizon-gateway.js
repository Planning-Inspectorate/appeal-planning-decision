const jp = require('jsonpath');
const config = require('../configuration/config');
const axios = require('axios');
const logger = require('../lib/logger');

class HorizonGateway {
	
	/**
	 * 
	 * @param {string} caseReference
	 * @return {Promise<Date | undefined>}
	 */
	async getFinalCommentsDueDate(caseReference) {
		const requestBody = {
			GetCase: {
				__soap_op: 'http://tempuri.org/IHorizon/GetCase',
				__xmlns: 'http://tempuri.org/',
				caseReference: caseReference
			}
		};

		let caseDetails;
		try {
			caseDetails = await axios.post(config.services.horizon.url, requestBody);
		} catch(error) {
			logger.error(`Horizon responded with status ${error.status} and body ${error.body}`);
			return undefined;
		}

		// Here be dragons! This bit is complicated because of the Horizon response shape
		// (sorry to anyone who has to work on this).
		const attributes = jp.query(caseDetails.data, '$..Metadata.Attributes[*]');

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

module.exports = { HorizonGateway }