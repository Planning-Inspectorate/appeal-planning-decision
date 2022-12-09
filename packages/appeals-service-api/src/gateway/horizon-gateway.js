
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
		const result = {};
		const createOrganisationRequestJson = this.#horizonMapper.appealToCreateOrganisationRequests(appeal)

		const createAppellantOrganisationResponse = await axios.post(`${config.horizon.url}/contacts`, createOrganisationRequestJson.appellant.value);
		result.appellant = createAppellantOrganisationResponse.data?.Envelope?.Body?.AddContactResponse?.AddContactResult?.value

		if (Object.hasOwn(createOrganisationRequestJson, 'agent')){
			const createAgentOrganisationResponse = await axios.post(`${config.horizon.url}/contacts`, createOrganisationRequestJson.agent.value);
			result.agent = createAgentOrganisationResponse.data?.Envelope?.Body?.AddContactResponse?.AddContactResult?.value
		}

		return result;
	}

	async createContacts(appeal, organisations){
		return this.#horizonMapper
			.createContactRequests(appeal, organisations)
			.map(async createContactRequest => {
				const createContactRequestResponse = await axios.post(`${config.horizon.url}/contacts`, createContactRequest.requestBody);
				return {
					/* Add user contact details */
					key: 'Case Involvement:Case Involvement',
					value: [
						{
							key: 'Case Involvement:Case Involvement:ContactID',
							value: createContactRequestResponse.data?.Envelope?.Body?.AddContactResponse?.AddContactResult?.value
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
	 * @returns {string} The appeal's case reference (horizon ID) after successful submission to Horizon
	 */
	async createAppeal(appeal, contacts) {
		const appealCreationRequest = await this.#horizonMapper.appealToHorizonCreateAppealRequest(appeal, contacts);
	
		const { data } = await axios.post('/horizon', appealCreationRequest, {
			baseURL: config.horizon.url
		});
	
		logger.debug(`Horizon response: ${data}`);

		// case IDs are in format APP/W4705/D/21/3218521 - we need last 7 digits or numbers after final slash (always the same)
		const horizonFullCaseId = data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult?.value;
	
		if (!horizonFullCaseId) {
			logger.debug('Horizon ID malformed');
			throw new Error('Horizon ID malformed');
		}
	
		const caseReference = horizonFullCaseId.split('/').slice(-1).pop();
	
		logger.debug(`Horizon ID parsed: ${caseReference}`);

		return caseReference;
	}
	
	async uploadAppealDocumentsToAppealInHorizon(appealId, documents, appealCaseReference){
		documents.forEach(async document => {
			await axios.post(
				'/horizon', 
				this.#horizonMapper.toCreateDocumentRequest(document, appealCaseReference), 
				{
					baseURL: config.horizon.url,
					/* Needs to be infinity as Horizon doesn't support multipart uploads */
					maxBodyLength: Infinity
				}
			);
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