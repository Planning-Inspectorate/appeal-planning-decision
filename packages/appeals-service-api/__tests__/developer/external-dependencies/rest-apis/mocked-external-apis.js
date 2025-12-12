const jp = require('jsonpath');
const { GenericContainer, Wait } = require('testcontainers/');
const axios = require('axios');
const crypto = require('crypto');
// const logger = require('../../../logger.js');

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

	horizon = 'horizonMock';
	horizonEndpoint = `/${this.horizon}`;
	horizonUrl;

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
		const startedContainer = await new GenericContainer('mockserver/mockserver')
			.withName(`mockserver-for-appeals-api-test-${instance}`)
			.withExposedPorts(1080)
			.withWaitStrategy(Wait.forLogMessage(/.*started on port: 1080.*/))
			.start();

		return new MockedExternalApis(startedContainer);
	}

	constructor(container) {
		this.baseUrl = `http://${container.getHost()}:${container.getMappedPort(1080)}`;
		this.container = container;
		this.horizonUrl = `${this.baseUrl}/${this.horizon}`;
		this.notifyUrl = `${this.baseUrl}/${this.notify}`;
		this.documentsApiUrl = `${this.baseUrl}/${this.documentsApi}`;
	}

	getBaseUrl() {
		return `http://${this.baseUrl}`;
	}

	async clearAllMockedResponsesAndRecordedInteractions() {
		await axios.put(`${this.baseUrl}/mockserver/reset`);
	}

	async checkInteractions(expectedHorizonInteractions, expectedNotifyInteractions) {
		const actualHorizonInteractions = await this.getRecordedRequestsForHorizon();
		const actualNotifyInteractions = await this.getRecordedRequestsForNotify();

		if (expectedHorizonInteractions !== undefined) {
			this.verifyInteractions(expectedHorizonInteractions, actualHorizonInteractions);
		}
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
		const result = await axios.put(`${this.baseUrl}/mockserver/retrieve`, data);
		return result.data;
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

	///////////////////
	///// HORIZON /////
	///////////////////

	getHorizonUrl() {
		return this.horizonUrl;
	}

	async mockHorizonCreateContactResponse(
		statusCode,
		stringToBeReturned = 'Mocked bad create contact response'
	) {
		let body = {
			Envelope: {
				Body: {
					AddContactResponse: {
						AddContactResult: {
							value: stringToBeReturned
						}
					}
				}
			}
		};

		if (statusCode >= 500) {
			body = {
				Envelope: {
					Body: {
						Fault: {
							faultcode: {
								value: 'a:InternalServiceFault'
							},
							faultstring: {
								value: stringToBeReturned
							},
							detail: {
								ExceptionDetail: {
									HelpLink: {},
									InnerException: {},
									Message: {
										value: stringToBeReturned
									},
									StackTrace: {
										value:
											'   at Contacts.API.Contacts.AddContact(HorizonAPIContact contact)\r\n   at SyncInvokeAddContact(Object , Object[] , Object[] )\r\n   at System.ServiceModel.Dispatcher.SyncMethodInvoker.Invoke(Object instance, Object[] inputs, Object[]& outputs)\r\n   at System.ServiceModel.Dispatcher.DispatchOperationRuntime.InvokeBegin(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage5(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage11(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.MessageRpc.Process(Boolean isOperationContextSet)'
									},
									Type: {
										value: 'System.Exception'
									}
								}
							}
						}
					}
				}
			};
		}

		const data = {
			httpRequest: {
				method: 'POST',
				path: `${this.horizonEndpoint}/contacts`
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

		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);
	}

	async mockHorizonCreateAppealResponse(
		statusCode,
		stringToBeReturned = 'Mocked bad create appeal response'
	) {
		let body = {
			Envelope: {
				Body: {
					CreateCaseResponse: {
						CreateCaseResult: {
							value: stringToBeReturned
						}
					}
				}
			}
		};

		if (statusCode >= 500) {
			body = {
				Envelope: {
					Body: {
						Fault: {
							faultcode: {
								value: 'a:InternalServiceFault'
							},
							faultstring: {
								value: stringToBeReturned
							},
							detail: {
								ExceptionDetail: {
									HelpLink: {},
									InnerException: {},
									Message: {
										value: stringToBeReturned
									},
									StackTrace: {
										value:
											'   at Horizon.Business.HorizonCase.AssertMetadataIsValid(HorizonMetadata metadata, Int32 caseTemplateDataId)\r\n   at Horizon.Business.AppealCase.Create(String caseType, String LPACode, DateTime dateOfReceipt, CaseLocation location, HorizonMetadata metadata, List`1 documents)\r\n   at Horizon.API.Horizon.CreateCase(String caseType, String LPACode, DateTime dateOfReceipt, CaseLocation location, HorizonMetadata metadata, List`1 documents)\r\n   at SyncInvokeCreateCase(Object , Object[] , Object[] )\r\n   at System.ServiceModel.Dispatcher.SyncMethodInvoker.Invoke(Object instance, Object[] inputs, Object[]& outputs)\r\n   at System.ServiceModel.Dispatcher.DispatchOperationRuntime.InvokeBegin(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage5(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage11(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.MessageRpc.Process(Boolean isOperationContextSet)'
									},
									Type: {
										value: 'System.InvalidOperationException'
									}
								}
							}
						}
					}
				}
			};
		}

		const data = {
			httpRequest: {
				method: 'POST',
				path: `${this.horizonEndpoint}/horizon`
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
		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);
	}

	async mockHorizonUploadDocumentResponse(statusCode, document) {
		let body = {};

		if (statusCode >= 500) {
			body = {
				Envelope: {
					Body: {
						Fault: {
							faultcode: {
								value: 'a:InternalServiceFault'
							},
							faultstring: {
								value: 'A mocked bad upload document response from Horizon'
							},
							detail: {
								ExceptionDetail: {
									HelpLink: {},
									InnerException: {},
									Message: {
										value: 'A mocked bad upload document response from Horizon'
									},
									StackTrace: {
										value:
											'   a big\r\n   old\r\n   stacktrace from\r\n	at Horizon.API.Horizon.AddDocuments(String caseReference, List`1 documents)\r\n   at SyncInvokeAddDocuments(Object , Object[] , Object[] )\r\n   at System.ServiceModel.Dispatcher.SyncMethodInvoker.Invoke(Object instance, Object[] inputs, Object[]& outputs)\r\n   at System.ServiceModel.Dispatcher.DispatchOperationRuntime.InvokeBegin(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage5(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage11(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.MessageRpc.Process(Boolean isOperationContextSet)'
									},
									Type: {
										value: 'System.Exception'
									}
								}
							}
						}
					}
				}
			};
		} else {
			body = {
				Envelope: {
					Body: {
						AddDocumentsResponse: {
							AddDocumentsResult: {
								HorizonAPIDocument: {
									Content: {},
									DocumentType: {
										value: 'Mocked DocType'
									},
									Filename: {
										value: document.name
									},
									IsPublished: {
										value: 'true'
									},
									Metadata: {
										Attributes: {
											AttributeValue: {
												Name: {
													value: 'Document:Document Type'
												},
												Value: {
													value: 'Initial Documents'
												}
											}
										}
									},
									NodeId: {
										value: '123MOCK'
									}
								}
							}
						}
					}
				}
			};
		}

		const data = {
			httpRequest: {
				method: 'POST',
				path: `${this.horizonEndpoint}/horizon`
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
		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);
	}

	async mockHorizonGetCaseResponse(finalCommentsDueDate, statusCode) {
		let body;

		if (statusCode == 200) {
			body = {
				Envelope: {
					Body: {
						GetCaseResponse: {
							GetCaseResult: {
								Metadata: {
									Attributes: [
										{
											Name: { value: 'Curb your' },
											Value: { value: 'enthusiasm' }
										}
									]
								}
							}
						}
					}
				}
			};

			if (finalCommentsDueDate) {
				body.Envelope.Body.GetCaseResponse.GetCaseResult.Metadata.Attributes.push({
					Name: { value: 'Case Document Dates:Final Comments Due Date' },
					Value: { value: finalCommentsDueDate.toISOString() }
				});
			}
		} else {
			body = {
				Envelope: {
					Body: {
						Fault: {
							faultcode: {
								value: 'a:InternalServiceFault'
							},
							faultstring: {
								value:
									'The case with reference 3218461 is not published and therefore, cannot be returned'
							},
							detail: {
								ExceptionDetail: {
									HelpLink: {},
									InnerException: {},
									Message: {
										value:
											'The case with reference 3218461 is not published and therefore, cannot be returned'
									},
									StackTrace: {
										value:
											'   at Horizon.API.Horizon.GetCase(String caseReference)\r\n   at SyncInvokeGetCase(Object , Object[] , Object[] )\r\n   at System.ServiceModel.Dispatcher.SyncMethodInvoker.Invoke(Object instance, Object[] inputs, Object[]& outputs)\r\n   at System.ServiceModel.Dispatcher.DispatchOperationRuntime.InvokeBegin(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage5(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage11(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.MessageRpc.Process(Boolean isOperationContextSet)'
									},
									Type: {
										value: 'System.Exception'
									}
								}
							}
						}
					}
				}
			};
		}

		const data = {
			httpRequest: {
				method: 'POST',
				path: `${this.horizonEndpoint}/horizon`
			},
			httpResponse: {
				statusCode: statusCode,
				body: body
			}
		};
		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);

		// logger.debug(response.data, 'Mock Horizon get case response');
	}

	async getRecordedRequestsForHorizon() {
		const contactAndOrgInteractions = await this.getResponsesForEndpoint(
			`${this.horizonEndpoint}/contacts`
		);
		const appealAndDocInteractions = await this.getResponsesForEndpoint(
			`${this.horizonEndpoint}/horizon`
		);

		return [...contactAndOrgInteractions, ...appealAndDocInteractions];
	}

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
		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);
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

		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);
	}
};
