const jp = require('jsonpath');
const { GenericContainer, Wait } = require('testcontainers/');
const crypto = require('crypto');
// const logger = require('../../../logger');

/**
 * This class is intended to act as a mocking interface for all external APIs that the
 * Appeals API relies upon in order to deliver its functionality.
 *
 * We did try to use the npm server (https://www.npmjs.com/package/mockserver) and client
 * (https://www.npmjs.com/package/mockserver-client) for this however, when the tests run
 * on the Azure build pipeline, `localhost` can not be resolved, so the tests fail.
 */
module.exports = class MockedExternalApis {
	baseUrl;
	container;

	notify = 'notifyMock';
	notifyEndpoint = `/${this.notify}/v2/notifications/email`; // Note that this is the full URL, known only to the Notify client which is provided by the Government
	notifyUrl;

	documentsApi = 'documentsMock';
	documentsApiEndpoint = `/${this.documentsApi}/api/v1`;
	documentsApiUrl;
	documentInvolvementValues = ['Appellant', 'LPA', ''];

	///////////////////
	///// GENERAL /////
	///////////////////

	static async setup() {
		// support multiple instances with a random suffix
		const instance = crypto.randomBytes(8).toString('hex');
		const startedContainer = await new GenericContainer('mockserver/mockserver:5.15.0')
			.withName(`mockserver-for-appeals-api-test-${instance}`)
			.withExposedPorts(1080)
			.withWaitStrategy(Wait.forLogMessage(/.*started on port: 1080.*/))
			.start();

		return new MockedExternalApis(startedContainer);
	}

	constructor(container) {
		this.baseUrl = `http://${container.getHost()}:${container.getMappedPort(1080)}`;
		this.container = container;
		this.notifyUrl = `${this.baseUrl}/${this.notify}`;
		this.documentsApiUrl = `${this.baseUrl}/${this.documentsApi}`;
	}

	getBaseUrl() {
		return `http://${this.baseUrl}`;
	}

	async clearAllMockedResponsesAndRecordedInteractions() {
		await this.putJson(`${this.baseUrl}/mockserver/reset`);
	}

	/**
	 * @param {string} url
	 * @param {object|undefined} data
	 * @returns {Promise<Response>}
	 */
	async putJson(url, data = undefined) {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data === undefined ? undefined : JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(`Request to ${url} failed with status ${response.status}`);
		}

		return response;
	}

	async checkInteractions(_, expectedNotifyInteractions) {
		const actualNotifyInteractions = await this.getRecordedRequestsForNotify();

		if (expectedNotifyInteractions !== undefined) {
			this.verifyInteractions(expectedNotifyInteractions, actualNotifyInteractions);
		}
	}

	async teardown() {
		await this.container.stop();
	}

	verifyInteractions(expectedInteractions, actualInteractions) {
		expect(actualInteractions.length).toEqual(expectedInteractions.length);

		for (let i in expectedInteractions) {
			const expectedInteraction = expectedInteractions[i];
			const actualInteraction = actualInteractions[i];
			const actualInteractionBody = this.getJsonFromRecordedRequest(actualInteraction);
			const allKeysFromActualInteractionBody = this.getAllKeysFromJson(actualInteractionBody);

			// logger.debug(allKeysFromActualInteractionBody, 'Keys from actual interaction');

			expect(allKeysFromActualInteractionBody.length).toEqual(
				expectedInteraction.getNumberOfKeysExpectedInJson()
			);

			expectedInteraction
				.getJsonPathStringsToExpectedValues()
				.forEach((expectation, jsonPathExpression) => {
					const jsonKeyValue = jp.query(actualInteractionBody, jsonPathExpression.get())[0];

					// logger.debug(
					// 	`Check if '${jsonKeyValue}' obtained via JSON path '${jsonPathExpression.get()}' matches what's expected: '${expectation}'`
					// );

					if (expectation instanceof RegExp) {
						expect(jsonKeyValue).toMatch(expectation);
					} else {
						expect(jsonKeyValue).toEqual(expectation);
					}
				});
		}
	}

	async getResponsesForEndpoint(endpoint) {
		const data = {
			path: endpoint,
			method: 'POST'
		};
		const result = await this.putJson(`${this.baseUrl}/mockserver/retrieve`, data);
		return await result.json();
	}

	getJsonFromRecordedRequest(request) {
		return request.body.json;
	}

	getAllKeysFromJson = (json, keys = []) => {
		if (json == null) {
			return keys;
		}
		for (const key of Object.keys(json)) {
			if (/^\d+$/.test(key) == false) {
				keys.push(key);
			}

			// TODO: confirm this is working as expected (suspect not based on loose equality check, checking against 'object' type, and possibility of infinite recursion)
			if (typeof json[key] == 'object') {
				this.getAllKeysFromJson(json[key], keys);
			}
		}
		return keys;
	};

	//////////////////
	///// NOTIFY /////
	//////////////////

	getNotifyUrl() {
		return this.notifyUrl;
	}

	async mockNotifyResponse(body, statusCode) {
		const data = {
			httpRequest: {
				method: 'POST',
				path: this.notifyEndpoint
			},
			httpResponse: {
				statusCode: statusCode,
				body: body
			},
			times: {
				remainingTimes: 1,
				unlimited: false
			},
			timeToLive: {
				unlimited: true
			}
		};
		await this.putJson(`${this.baseUrl}/mockserver/expectation`, data);
	}

	async getRecordedRequestsForNotify() {
		return await this.getResponsesForEndpoint(this.notifyEndpoint);
	}

	/////////////////////////
	///// DOCUMENTS API /////
	/////////////////////////

	getDocumentsAPIUrl() {
		return this.documentsApiUrl;
	}

	async mockDocumentsApiResponse(statusCode, appealId, document, addDocumentGroupTypeToBody) {
		const body = {
			application_id: appealId,
			name: document.name,
			filename: document.fileName,
			upload_date: new Date(),
			mime_type: 'application/pdf',
			location: `mock_location`,
			size: 8334,
			id: document.id,
			document_type: 'documentType',
			involvement:
				this.documentInvolvementValues[(this.documentInvolvementValues.length * Math.random()) | 0],
			dataSize: 667,
			data: 'eW91IG93ZSBtZSBtb25leQ==',
			document_group_type: 'documentGroupType'
		};

		//TODO: remove addDocumentGroupTypeToBody param when 5031 feature flag is removed
		let data = {
			httpRequest: {
				method: 'GET',
				path: `${this.documentsApiEndpoint}/${appealId}/${document.id}/file`,
				queryStringParameters: [{ name: 'base64', values: ['true'] }]
			},
			httpResponse: {
				statusCode: statusCode,
				body: body
			}
			// times: {
			// 	remainingTimes: 1,
			// 	unlimited: false
			// },
			// timeToLive: {
			// 	unlimited: true
			// }
		};

		if (addDocumentGroupTypeToBody === false) {
			delete data.httpResponse.body.document_group_type;
		}

		await this.putJson(`${this.baseUrl}/mockserver/expectation`, data);
	}
};
