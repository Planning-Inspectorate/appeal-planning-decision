const config = require('../configuration/config');
const axios = require('axios');
const logger = require('../lib/logger');
const { HorizonMapper } = require('../mappers/horizon-mapper');
const HorizonResponseValue = require('../value-objects/horizon/horizon-response.value');
const { msToDurationString } = require('#lib/duration');

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
				response.getValue().CreateCaseResponse.CreateCaseResult.value,
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

	async getAppeal(caseReference) {
		const endpoint = `horizon`;
		const url = `${config.services.horizon.url}/${endpoint}`;

		logger.info(`Creating request body for case reference ${caseReference}`);
		const requestBody = this.#horizonMapper.getAppealFromHorizon(caseReference);
		logger.info(`Request body created for case reference ${caseReference}:`);
		logger.info('----------------');
		logger.info(requestBody);
		logger.info('----------------');
		// The data that comes back from Horizon has duplicate keys. While JSON allows this (though discourages it)
		// javascript objects do not allow it. If a duplicate key is found, it replaces the data of the existing key
		// as a result we need to dedup the keys by giving them unique key names
		// The code below adds the option transformResponse to axios that tels axios
		// to give us the raw unparsed data back (because it parses JSON by default)
		// we then rename the duplicate AttributeValue keys by numbering them
		// then parse the data to json
		logger.info(`Making axios request for case reference ${caseReference}`);
		let appealData = await axios
			.post(url, requestBody, { transformResponse: (r) => r })
			.then((response) => {
				logger.info(`Axios response for case reference ${caseReference}`);
				logger.info('----------------');
				logger.info(response);
				logger.info('----------------');
				let unparsedResponse = response.data;
				let i = 0;
				let parseComplete = false;

				while (!parseComplete) {
					if (unparsedResponse.includes('"AttributeValue":')) {
						unparsedResponse = unparsedResponse.replace(
							'"AttributeValue":',
							`"AttributeValue${i}":`
						);
						i++;
					} else {
						parseComplete = true;
					}
				}
				let parsedResponse = JSON.parse(unparsedResponse);
				return parsedResponse.Envelope.Body.GetCaseResponse.GetCaseResult;
			})
			.catch((error) => {
				logger.info('Error in Axious request');
				logger.info(error);
				logger.error(error);
				return false;
			});

		logger.info(`Axios request complete for case reference ${caseReference}`);

		return appealData;
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
	async #makeRequestAndHandleAnyErrors(endpoint, body, descriptionOfRequest, options = {}) {
		const url = `${config.services.horizon.url}/${endpoint}`;
		logger.debug(body, `Sending ${descriptionOfRequest} request to ${url} with body`);

		// set request timeout in milliseconds
		options.timeout = config.services.horizon.timeout;

		try {
			const requestStart = Date.now();
			const responseJson = await axios.post(url, body, options);
			if (config.services.horizon.logRequestTime) {
				const requestTime = Date.now() - requestStart;
				logger.info({ endpoint }, `Horizon request took ${msToDurationString(requestTime)}`);
			}
			return new HorizonResponseValue(responseJson.data.Envelope.Body, false);
		} catch (error) {
			if (error.response) {
				logger.error(
					error.response.data,
					`Horizon returned a ${error.response?.status} status code when attempting to ${descriptionOfRequest}. Response is below`
				);

				return new HorizonResponseValue(
					error.response?.data?.Envelope?.Body?.Fault?.faultstring?.value,
					true
				);
			}

			let errMsg = `Call to Horizon returned an undefined error when attempting to ${descriptionOfRequest}.`;
			logger.error(error, errMsg);

			if (error.message) {
				return new HorizonResponseValue(error.message, true);
			} else {
				return new HorizonResponseValue(errMsg, true);
			}
		}
	}
}

module.exports = { HorizonGateway };
