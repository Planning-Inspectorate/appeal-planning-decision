const config = require('../configuration/config');
const axios = require('axios');
const logger = require('../lib/logger');
const { HorizonMapper } = require('../mappers/horizon-mapper');

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
			logger.debug(request,`Horizon create organisation request to send to '${createOrganisationUrl}'`);
			const createOrganisationResponse = await axios.post(createOrganisationUrl, request);
			result[key] =
				createOrganisationResponse.data.Envelope.Body.AddContactResponse.AddContactResult.value;
		}

		logger.debug(result, `Create organisations result`);
		return result;
	}

	async createContacts(appeal, contacts) {
		logger.debug(`Creating contacts in Horizon`);
		const createContactUrl = `${config.services.horizon.url}/contacts`;
		const createContactRequestJson = this.#horizonMapper.createContactRequests(appeal, contacts);

		const result = [];
		for (const key in createContactRequestJson) {
			const request = createContactRequestJson[key].requestBody;
			logger.debug(request, `Horizon create contact request to send to '${createContactUrl}'`);
			const createContactResponse = await axios.post(createContactUrl, request);
			const personId =
				createContactResponse.data.Envelope.Body.AddContactResponse.AddContactResult.value;

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

		logger.debug(`Create contacts result: ${JSON.stringify(result)}`);
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

		const createAppealResponse = await axios.post(
			`${config.services.horizon.url}/horizon`,
			appealCreationRequest
		);

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
		for (const document of documents) {
			logger.debug(document, `Uploading document`);
			const { data } = await axios.post(
				`${config.services.horizon.url}/horizon`,
				this.#horizonMapper.toCreateDocumentRequest(document, appealCaseReference),
				{
					/* Needs to be infinity as Horizon doesn't support multipart uploads */
					maxBodyLength: Infinity
				}
			);

			logger.debug(data, 'Upload document response');
		};

		logger.debug('Document upload to Horizon complete')
		return;
	}

	//TODO: this should return an as-of-yet non-existent `HorizonAppealDto` instance.
	async getAppeal(caseReference) {
		logger.debug(`Getting case with reference '${caseReference}' from Horizon`);

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

		logger.debug(`Horizon request: ${JSON.stringify(requestBody)}`);

		const horizonAppeal = await axios
			.post(config.services.horizon.url, requestBody)
			.catch(function (error) {
				logger.error(`Horizon responded with error ${JSON.stringify(error)}`);
			});

		if (horizonAppeal) {
			logger.debug(`Case found in Horizon: ${JSON.stringify(horizonAppeal.data)}`);
			return horizonAppeal.data;
		}

		return {};
	}
}

module.exports = { HorizonGateway };
