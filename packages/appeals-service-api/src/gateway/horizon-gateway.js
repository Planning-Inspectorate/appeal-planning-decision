const config = require('../configuration/config');
const axios = require('axios');
const logger = require('../lib/logger');
const { HorizonMapper } = require('../mappers/horizon-mapper');
const HorizonResponseValue = require('../value-objects/horizon/horizon-response.value');

class HorizonGateway {
	#horizonMapper;

	constructor() {
		this.#horizonMapper = new HorizonMapper();
	}

	/**
	 *
	 * @param {AppealContactValueObject} appealContactDetail
	 * @returns {Promise<HorizonResponseValue>} If an error has occurred, `getValue()` will return the error message
	 * provided by Horizon. If no error occurred, `getValue()` will return the ID for the organisation in Horizon.
	 */
	async createOrganisation(appealContact) {
		logger.debug(appealContact.toJSON(), 'Creating the following organisation in Horizon');

		const response = await this.#makeRequestAndHandleAnyErrors(
			'contacts',
			this.#horizonMapper.appealContactToCreateOrganisationRequest(appealContact),
			'create organisation'
		);

		if (response.isNotAnError()) {
			return new HorizonResponseValue(
				response.getValue().AddContactResponse.AddContactResult.value, 
				false
			);
		}
		
		return response;
	}

	/**
	 * 
	 * @param {AppealContactValueObject} appealContactDetail
	 * @param {string} organisationHorizonId 
	 * @returns {Promise<HorizonResponseValue>} If an error has occurred, `getValue()` will return the error message
	 * provided by Horizon. If no error occurred, `getValue()` will return the ID for the contact in Horizon.
	 */
	async createContact(appealContactDetail, organisationHorizonId) {
		logger.debug(`Creating contact in Horizon`);

		const response = await this.#makeRequestAndHandleAnyErrors(
			'contacts',
			this.#horizonMapper.createContactRequest(appealContactDetail, organisationHorizonId),
			'create contact'
		);

		if (response.isNotAnError()) {
			return new HorizonResponseValue(
				response.getValue().AddContactResponse.AddContactResult.value, 
				false
			);
		}

		return response;
	}

	/**
	 *
	 * @param {any} appeal
	 * @param {any} contactSubmissions JSON, structure should be {
	 * 	agent: BackOfficeAppealSubmissionEntity, 
	 * 	appellant: BackOfficeAppealSubmissionEntity
	 * } 
	 * @param {LpaEntity} lpaEntity
	 * @param {AppealContactsValueObject} appealContactDetails
	 * @returns {Promise<HorizonResponseValue>} If an error has occurred, `getValue()` will return the error message
	 * provided by Horizon. If no error occurred, `getValue()` will return the ID for the appeal in Horizon.
	 */
	async createAppeal(appeal, contactSubmissions, lpaEntity, appealContactDetails) {
		logger.debug('Creating appeal in Horizon');

		const appealCreationRequest = this.#horizonMapper.appealToHorizonCreateAppealRequest(
			appeal,
			contactSubmissions,
			lpaEntity,
			appealContactDetails
		);

		const response = await this.#makeRequestAndHandleAnyErrors(
			`horizon`,
			appealCreationRequest,
			'create appeal'
		);

		if (response.isNotAnError()) {
			return new HorizonResponseValue(
				// case IDs are in format APP/W4705/D/21/3218521 - we need the characters after the final slash
				response.getValue().CreateCaseResponse.CreateCaseResult.value.split('/').slice(-1).pop(),
				false
			);
		}
		
		return response;
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} appealCaseReference 
	 * @returns {Promise<HorizonResponseValue>} If an error has occurred, `getValue()` will return the error message
	 * provided by Horizon. If no error occurred, `getValue()` will return the ID for the document in Horizon.
	 */
	async uploadAppealDocument(document, appealCaseReference) {
		const endpoint = `horizon`;
		const addDocumentRequest = this.#horizonMapper.toCreateDocumentRequest(
			document,
			appealCaseReference
		);

		// `maxBodyLength` specified as an option since Horizon doesn't support multipart uploads
		const response = await this.#makeRequestAndHandleAnyErrors(
			endpoint,
			addDocumentRequest,
			'add document',
			{ maxBodyLength: Infinity }
		);

		if (response.isNotAnError()) {
			return new HorizonResponseValue(
				response.getValue().AddDocumentsResponse.AddDocumentsResult.HorizonAPIDocument.NodeId.value, 
				false
			);
		}
		
		return response;
	}

	//TODO: this should return an as-of-yet non-existent `HorizonAppealDto` instance.
	async getAppeal(caseReference) {
		const url = `/horizon`;

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

	/////////////////////////////
	///// PRIVATE FUNCTIONS /////
	/////////////////////////////

	/**
	 * 
	 * @param {string} endpoint The endpoint following the Horizon base URL to target 
	 * @param {any} body The request body to send 
	 * @param {string} descriptionOfRequest What the request is intending to do (used for debugging)
	 * @param {any} options Any Axios options you want to pass (see https://axios-http.com/docs/req_config). Defaults
	 * to null.
	 * @returns {Promise<HorizonResponseValue>} If an error has occurred, `getValue()` will return the error message
	 * provided by Horizon. If no error occurred, `getValue()` will return the JSON response returned by
	 * Horizon after digging down to `Envelope.Body` since this JSON path is common to all responses.
	 */
	async #makeRequestAndHandleAnyErrors(endpoint, body, descriptionOfRequest, options = null) {
		const url = `${config.services.horizon.url}/${endpoint}`;
		logger.debug(body, `Sending ${descriptionOfRequest} request to ${url} with body`);

		try {
			const responseJson = await axios.post(url, body, options);
			return new HorizonResponseValue(responseJson.data.Envelope.Body, false);
		} catch (error) {
			if (error.response) {
				logger.error(
					error.response.data,
					`Horizon returned a ${error.response.status} status code when attempting to ${descriptionOfRequest}. Response is below`
				);

				return new HorizonResponseValue(error.response.data.Envelope.Body.Fault.faultstring.value, true);
			}
		}
	}
}

module.exports = { HorizonGateway };
