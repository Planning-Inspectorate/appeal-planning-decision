const config = require('../configuration/config');
const axios = require('axios');
const logger = require('../lib/logger');
const { HorizonMapper } = require('../mappers/horizon-mapper');
const ApiError = require('../errors/apiError');

class HorizonGateway {
	#horizonMapper;

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
	async createOrganisations(appeal) {
		logger.debug('Creating organisations in Horizon');
		const createOrganisationUrl = `${config.services.horizon.url}/contacts`;
		const createOrganisationRequestJson =
			this.#horizonMapper.appealToCreateOrganisationRequests(appeal);

		const result = {};
		for (const key in createOrganisationRequestJson) {
			const request = createOrganisationRequestJson[key].value;
			const createOrganisationResponse = await this.#makeRequestAndHandleAnyErrors(createOrganisationUrl, request, 'create organisation')
			result[key] = createOrganisationResponse.data.Envelope.Body.AddContactResponse.AddContactResult.value;
			logger.debug(result, `Create organisations result`);
		}

		return result;
	}

	async createContacts(appeal, contacts) {
		logger.debug(`Creating contacts in Horizon`);
		const createContactUrl = `${config.services.horizon.url}/contacts`;
		const createContactRequestJson = this.#horizonMapper.createContactRequests(appeal, contacts);

		const result = [];
		for (const key in createContactRequestJson) {
			const request = createContactRequestJson[key].requestBody;
			const createContactResponse = await this.#makeRequestAndHandleAnyErrors(createContactUrl, request, 'create contact');
			const personId =
				createContactResponse.data.Envelope.Body.AddContactResponse.AddContactResult.value;

			//TODO: this result structure should occur in the create Appeal mapper, we should just return the personId for this method. 
			result.push({
				key: 'Case Involvement:Case Involvement',
				value: [
					{
						key: 'Case Involvement:Case Involvement:ContactID',
						value: personId
					},
					{
						key: 'Case Involvement:Case Involvement:Contact Details',
						value: createContactRequestJson[key].name
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
						value: createContactRequestJson[key].type
					}
				]
			});
		}

		logger.debug(result, `Create contacts result`);
		return result;
	}

	/**
	 *
	 * @param {*} appeal
	 * @param {*} contacts
	 * @param {*} appealCountry
	 * @returns {string} The appeal's case reference (horizon ID) after successful submission to Horizon
	 */
	async createAppeal(appeal, contacts, appealCountry) {
		logger.debug('Creating appeal in Horizon');
		const appealCreationRequest = this.#horizonMapper.appealToHorizonCreateAppealRequest(
			appeal,
			contacts,
			appealCountry
		);

		const createAppealResponse = await this.#makeRequestAndHandleAnyErrors(`${config.services.horizon.url}/horizon`, appealCreationRequest, 'create appeal');

		// case IDs are in format APP/W4705/D/21/3218521 - we need last 7 digits or numbers after final slash (always the same)
		const horizonFullCaseId =
			createAppealResponse.data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult?.value;

		if (!horizonFullCaseId) {
			logger.debug(horizonFullCaseId, 'Horizon ID malformed');
			throw new Error(`Horizon ID malformed ${horizonFullCaseId}`);
		}

		const caseReference = horizonFullCaseId.split('/').slice(-1).pop();

		logger.debug(caseReference, `Horizon ID parsed`);

		return caseReference;
	}

	async uploadAppealDocuments(documents, appealCaseReference) {
		const url = `${config.services.horizon.url}/horizon`;
		for (const document of documents) {
			const addDocumentRequest = this.#horizonMapper.toCreateDocumentRequest(document, appealCaseReference)
			
			// `maxBodyLength` specified as an option since Horizon doesn't support multipart uploads
			const { data } = await this.#makeRequestAndHandleAnyErrors(url, addDocumentRequest, 'add document', { maxBodyLength: Infinity });
			logger.debug(data, 'Upload document response');
		};

		logger.debug('Document upload to Horizon complete')
		return;
	}

	//TODO: this should return an as-of-yet non-existent `HorizonAppealDto` instance.
	async getAppeal(caseReference) {
		const url = `${config.services.horizon.url}/horizon`

		if (caseReference == false) {
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

		try {
			logger.debug(requestBody, `Sending get case request to Horizon via URL ${url} with body`);
			const horizonAppeal = await axios.post(url, requestBody)
			logger.debug(horizonAppeal.data, `Horizon get case response`);
			return horizonAppeal.data;
		} catch(error) {
			logger.error(error, `Horizon get case request responded with the following error`);
		};

		return {};
	}

	async #makeRequestAndHandleAnyErrors(url, body, descriptionOfRequest, options = null){
		logger.debug(body ,`Sending ${descriptionOfRequest} request to Horizon via '${url}' with body`);

		try {
			return await axios.post(url, body, options)
		} catch (error) {
			if (error.response) {
				logger.error(error.response.data, `Horizon returned a ${error.response.status} status code when attempting to ${descriptionOfRequest}. Response is below`)
				throw new ApiError(504, 'Error when contacting Horizon');
			}
		}
	}
}

module.exports = { HorizonGateway };
