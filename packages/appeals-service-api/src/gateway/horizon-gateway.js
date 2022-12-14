
const config = require('../configuration/config');
const axios = require('axios');
const logger = require('../lib/logger');
const { HorizonMapper } = require('../mappers/horizon-mapper');

class HorizonGateway {

	#horizonMapper

	constructor() {
		this.#horizonMapper = new HorizonMapper();
    }

	/**
	 * 
	 * @param {*} appeal 
	 * @returns {any} Structure is:
     * { 
     *  appellant: '<appellant-organisation-id-in-horizon>',
     *  agent: '<agent-organisation-id-in-horizon> // optional: only if the appeal references an agent.
     * }
	 */
	async createOrganisations(appeal){
		logger.debug('Creating organisations in Horizon')
		const createOrganisationUrl = `${config.services.horizon.url}/contacts`
		const createOrganisationRequestJson = this.#horizonMapper.appealToCreateOrganisationRequests(appeal)
		logger.debug(`Create organisation request: ${JSON.stringify(createOrganisationRequestJson)}`)
		
		const result = {};
		for (const key in createOrganisationRequestJson) {
			const request = createOrganisationRequestJson[key].value;
			logger.debug(`Sending following create organisation request to '${createOrganisationUrl}': ${JSON.stringify(request)}`)
			const createOrganisationResponse = await axios.post(createOrganisationUrl, request);
			result[key] = createOrganisationResponse.data.Envelope.Body.AddContactResponse.AddContactResult.value
		}

		logger.debug(`Create organisation result: ${JSON.stringify(result)}`)
		return result;
	}

	async createContacts(appeal, organisations){
		logger.debug(`Creating contacts in Horizon`)
		const createContactUrl = `${config.services.horizon.url}/contacts`

		return this.#horizonMapper
			.createContactRequests(appeal, organisations)
			.map(async createContactRequest => {
				const createContactRequestBody = createContactRequest.requestBody;
				logger.debug(`Sending the following create contact request to '${createContactUrl}': ${JSON.stringify(createContactRequestBody)}`)
				const createContactRequestResponse = await axios.post(createContactUrl, createContactRequestBody);
				const personId = createContactRequestResponse.data.Envelope.Body.AddContactResponse.AddContactResult.value
				
				return {
					/* Add user contact details */
					key: 'Case Involvement:Case Involvement',
					value: [
						{
							key: 'Case Involvement:Case Involvement:ContactID',
							value: personId
						},
						{
							key: 'Case Involvement:Case Involvement:Contact Details',
							value: createContactRequest.name
						},
						{
							key: 'Case Involvement:Case Involvement:Involvement Start Date',
							value: new Date()
						},
						{
							key: 'Case Involvement:Case Involvement:Communication Preference',
							value: 'e-mail'
						},
						{
							key: 'Case Involvement:Case Involvement:Type Of Involvement',
							value: createContactRequest.type
						}
					]
				}
			})
		;
	}

	/**
	 * 
	 * @param {*} appeal 
	 * @param {*} contacts 
	 * @param {*} lpa
	 * @returns {string} The appeal's case reference (horizon ID) after successful submission to Horizon
	 */
	async createAppeal(appeal, contacts, lpaCountry) {
		logger.debug('Creating appeal in Horizon')
		const appealCreationRequest = this.#horizonMapper.appealToHorizonCreateAppealRequest(appeal, contacts, lpaCountry);
		logger.debug(`Create appeal request: ${JSON.stringify(appealCreationRequest)}`)
	
		const createAppealResponse = await axios.post(`${config.services.horizon.url}/horizon`, appealCreationRequest);

		// case IDs are in format APP/W4705/D/21/3218521 - we need last 7 digits or numbers after final slash (always the same)
		const horizonFullCaseId = createAppealResponse.data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult?.value;
	
		if (!horizonFullCaseId) {
			logger.debug('Horizon ID malformed');
			throw new Error('Horizon ID malformed');
		}
	
		const caseReference = horizonFullCaseId.split('/').slice(-1).pop();
	
		logger.debug(`Horizon ID parsed: ${caseReference}`);

		return caseReference;
	}
	
	async uploadAppealDocuments(documents, appealCaseReference){
		logger.debug(`Uploading following documents to appeal with case reference ${appealCaseReference}: ${JSON.stringify(documents)}`)
		documents.forEach(async document => {
			logger.debug(`Uploading document: ${JSON.stringify(document)}`)
			const response = await axios.post(
				`${config.services.horizon.url}/horizon`, 
				this.#horizonMapper.toCreateDocumentRequest(document, appealCaseReference), 
				{
					/* Needs to be infinity as Horizon doesn't support multipart uploads */
					maxBodyLength: Infinity
				}
			);

			logger.debug(`Upload document response: ${JSON.stringify(response)}`)
		});
	}

	//TODO: this should return an as-of-yet non-existent `HorizonAppealDto` instance.
	async getAppeal(caseReference){

		logger.debug(`Getting case with reference '${caseReference}' from Horizon`)
		
		if(caseReference == false) {
			logger.debug(`No case reference specified for Horizon case retrieval`);
			return undefined;
		}

		const requestBody = {
			GetCase: {
				__soap_op: 'http://tempuri.org/IHorizon/GetCase',
				__xmlns: 'http://tempuri.org/',
				caseReference: caseReference
			}
		};

		logger.debug(`Horizon request: ${JSON.stringify(requestBody)}`);
		
		const horizonAppeal = await axios
			.post(config.services.horizon.url, requestBody)
			.catch(function (error) {
				logger.error(`Horizon responded with error ${JSON.stringify(error)}`);
			})

		if (horizonAppeal) {
			logger.debug(`Case found in Horizon: ${JSON.stringify(horizonAppeal.data)}`)
			return horizonAppeal.data;
		}

		return {};
	}
}

module.exports = { HorizonGateway }