const config = require('../configuration/config');
const axios = require('axios');
const logger = require('../lib/logger');
const { HorizonMapper } = require('../mappers/horizon-mapper');
const ApiError = require('../errors/apiError');
const HorizonResponseValue = require('../value-objects/horizon/horizon-response.value');

class HorizonGateway {
	#horizonMapper;

	constructor() {
		this.#horizonMapper = new HorizonMapper();
	}

	/**
	 *
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @returns {any} Structure is:
	 * {
	 *  originalApplicant: '<original-applicant-organisation-id-in-horizon>',
	 *  agent: '<agent-organisation-id-in-horizon>' // optional: only if the appeal references an agent.
	 * }
	 */
	async createOrganisations(appealContactDetails) {
		logger.debug(appealContactDetails, 'Creating the following organisations in Horizon');
		const createOrganisationUrl = `${config.services.horizon.url}/contacts`;
		const createOrganisationRequestJson =
			this.#horizonMapper.appealToCreateOrganisationRequests(appealContactDetails);
		logger.debug(createOrganisationRequestJson, 'Create organisation requests to send to Horizon');

		const result = {};
		for (const key in createOrganisationRequestJson) {
			const request = createOrganisationRequestJson[key];
			if (request) {
				const createOrganisationResponse = await this.#makeRequestAndHandleAnyErrors(
					createOrganisationUrl,
					request,
					'create organisation'
				);
				result[key] =
					createOrganisationResponse.data.Envelope.Body.AddContactResponse.AddContactResult.value;

				logger.debug(result, `Create organisations result`);
			}
		}

		return result;
	}

	/**
	 *
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @param {any} contactOrganisationHorizonIDs Structure is:
	 * {
	 *  originalApplicant: '<original-applicant-organisation-id-in-horizon>',
	 *  agent: '<agent-organisation-id-in-horizon> // optional: only if the appeal references an agent.
	 * }
	 * @returns {any} Structure is:
	 * [{
	 *  name: '<original-applicant-organisation-id-in-horizon>',
	 *  type: '<agent-organisation-id-in-horizon> // optional: only if the appeal references an agent.
	 *  horizonContactId
	 * }]
	 */
	async createContacts(appealContactDetails, contactOrganisationHorizonIDs) {
		logger.debug(`Creating contacts in Horizon`);
		const createContactUrl = `${config.services.horizon.url}/contacts`;
		const createContactRequestJson = this.#horizonMapper.createContactRequests(
			appealContactDetails,
			contactOrganisationHorizonIDs
		);

		const results = [];
		for (const key in createContactRequestJson) {
			const request = createContactRequestJson[key].requestBody;
			const createContactResponse = await this.#makeRequestAndHandleAnyErrors(
				createContactUrl,
				request,
				'create contact'
			);
			const personId =
				createContactResponse.data.Envelope.Body.AddContactResponse.AddContactResult.value;

			const result = {
				name: createContactRequestJson[key].name,
				type: createContactRequestJson[key].type,
				horizonContactId: personId
			};
			results.push(result);
		}

		logger.debug(results, `Create contacts result`);
		return results;
	}

	/**
	 *
	 * @param {*} appeal
	 * @param {*} contacts
	 * @param {*} lpaEntity
	 * @returns {HorizonResponseValue} If Horizon responds successfully, calling `getValue()` will return
	 * the case reference for the appeal in Horizon.
	 */
	async createAppeal(appeal, contacts, lpaEntity) {
		logger.debug('Creating appeal in Horizon');

		const appealCreationRequest = this.#horizonMapper.appealToHorizonCreateAppealRequest(
			appeal,
			contacts,
			lpaEntity
		);

		const responseJson = await this.#makeRequestAndHandleAnyErrors(
			`${config.services.horizon.url}/horizon`,
			appealCreationRequest,
			'create appeal'
		);

		if (responseJson.data.Envelope.Body?.Fault) {
			return new HorizonResponseValue(responseJson.data.Envelope.Body.Fault.faultstring.value, true);
		} else {
			return new HorizonResponseValue(
				this.#getCaseReferenceFromCreateAppealResponse(responseJson), 
				false
			)
		}
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} appealCaseReference 
	 * @returns {Promise<HorizonResponseValue>} 
	 */
	async uploadAppealDocument(document, appealCaseReference) {
		const url = `${config.services.horizon.url}/horizon`;
		const addDocumentRequest = this.#horizonMapper.toCreateDocumentRequest(
			document,
			appealCaseReference
		);

		// `maxBodyLength` specified as an option since Horizon doesn't support multipart uploads
		const responseJson = await this.#makeRequestAndHandleAnyErrors(
			url,
			addDocumentRequest,
			'add document',
			{ maxBodyLength: Infinity }
		);

		if (responseJson.data.Envelope.Body?.Fault) {
			return new HorizonResponseValue(responseJson.data.Envelope.Body.Fault.faultstring.value, true);
		} else {
			return new HorizonResponseValue(
				responseJson.data.Envelope.Body.AddDocumentsResponse.AddDocumentsResult.HorizonAPIDocument.NodeId.value, 
				false
			)
		}
	}

	//TODO: this should return an as-of-yet non-existent `HorizonAppealDto` instance.
	async getAppeal(caseReference) {
		const url = `${config.services.horizon.url}/horizon`;

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
			const horizonAppeal = await axios.post(url, requestBody);
			logger.debug(horizonAppeal.data, `Horizon get case response`);
			return horizonAppeal.data;
		} catch (error) {
			logger.error(error, `Horizon get case request responded with the following error`);
		}

		return {};
	}

	async #makeRequestAndHandleAnyErrors(url, body, descriptionOfRequest, options = null) {
		logger.debug(body, `Sending ${descriptionOfRequest} request to Horizon via '${url}' with body`);

		try {
			const response = await axios.post(url, body, options);
			logger.debug(
				response,
				`Response from axios for ${descriptionOfRequest} request to Horizon via '${url}'`
			);
			return response;
		} catch (error) {
			if (error.response) {
				logger.error(
					error.response.data,
					`Horizon returned a ${error.response.status} status code when attempting to ${descriptionOfRequest}. Response is below`
				);

				return error.response;
			}
		}
	}

	#getCaseReferenceFromCreateAppealResponse(createAppealResponse) {
		// case IDs are in format APP/W4705/D/21/3218521 - we need last 7 digits or numbers after final slash (always the same)
		const horizonFullCaseId =
			createAppealResponse.data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult?.value;

		if (!horizonFullCaseId) {
			logger.debug(horizonFullCaseId, 'Horizon ID malformed');
			throw new ApiError(502, `Horizon ID malformed ${horizonFullCaseId}`);
		}

		const caseReference = horizonFullCaseId.split('/').slice(-1).pop();
		logger.debug(caseReference, "Horizon ID parsed");
		return caseReference;
	}
}

module.exports = { HorizonGateway };
