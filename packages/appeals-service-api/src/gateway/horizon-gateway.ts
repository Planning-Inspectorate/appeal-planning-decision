const jp = require('jsonpath');
const config = require('../configuration/config');
const axios = require('axios');
const fetch = require('node-fetch');
export class HorizonGateway {
	async getFinalCommentsDueDate(caseReference: string): Promise<Date | undefined> {
		const requestBody = {
			GetCase: {
				__soap_op: 'http://tempuri.org/IHorizon/GetCase',
				__xmlns: 'http://tempuri.org/',
				caseReference: caseReference
			}
		};

		const caseDetails = await axios.post(config.services.horizon.url, requestBody);

		// Here be dragons! This bit is complicated because of the Horizon response shape
		// (sorry to anyone who has to work on this).
		const attributes = jp.query(caseDetails.data, '$..Metadata.Attributes[*]');
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
