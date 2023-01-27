import { Interaction } from './interactions/interaction';
import { expect } from '@jest/globals';
import jp from 'jsonpath';
import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';
import axios from 'axios';
import logger from '../../../logger';
import { JsonPathExpression } from './json-path-expression';

/**
 * This class is intended to act as a mocking interface for all external APIs that the
 * Appeals API relies upon in order to deliver its functionality.
 *
 * We did try to use the npm server (https://www.npmjs.com/package/mockserver) and client
 * (https://www.npmjs.com/package/mockserver-client) for this however, when the tests run
 * on the Azure build pipeline, `localhost` can not be resolved, so the tests fail.
 */
export class MockedExternalApis {
	private baseUrl: string;
	private container: StartedTestContainer;

	private horizon: string = 'horizonMock';
	private horizonEndpoint: string = `/${this.horizon}`;
	private horizonUrl: string;

	private notify: string = 'notifyMock';
	private notifyEndpoint: string = `/${this.notify}/v2/notifications/email`; // Note that this is the full URL, known only to the Notify client which is provided by the Government
	private notifyUrl: string;

	private documentsApi: string = 'documentsMock';
	private documentsApiEndpoint: string = `/${this.documentsApi}/api/v1`;
	private documentsApiUrl: string;
	private documentInvolvementValues = ['Appellant', 'LPA', ''];

	///////////////////
	///// GENERAL /////
	///////////////////

	static async setup(): Promise<MockedExternalApis> {
		const startedContainer = await new GenericContainer('mockserver/mockserver')
			.withName('mockserver-for-appeals-api-test')
			.withExposedPorts(1080)
			.withWaitStrategy(Wait.forLogMessage(/.*started on port: 1080.*/))
			.start();

		return new MockedExternalApis(startedContainer);
	}

	private constructor(container: StartedTestContainer) {
		this.baseUrl = `http://${container.getHost()}:${container.getMappedPort(1080)}`;
		this.container = container;
		this.horizonUrl = `${this.baseUrl}/${this.horizon}`;
		this.notifyUrl = `${this.baseUrl}/${this.notify}`;
		this.documentsApiUrl = `${this.baseUrl}/${this.documentsApi}`;
	}

	getBaseUrl(): string {
		return `http://${this.baseUrl}`;
	}

	async clearAllMockedResponsesAndRecordedInteractions(): Promise<void> {
		await axios.put(`${this.baseUrl}/mockserver/reset`);
	}

	async checkInteractions(
		expectedHorizonInteractions: Array<Interaction>,
		expectedNotifyInteractions: Array<Interaction>
	) {
		const actualHorizonInteractions = await this.getRecordedRequestsForHorizon();
		const actualNotifyInteractions = await this.getRecordedRequestsForNotify();

		this.verifyInteractions(expectedHorizonInteractions, actualHorizonInteractions);
		this.verifyInteractions(expectedNotifyInteractions, actualNotifyInteractions);
	}

	async teardown(): Promise<void> {
		await this.container.stop();
	}

	private verifyInteractions(
		expectedInteractions: Array<Interaction>,
		actualInteractions: any
	): void {
		expect(actualInteractions.length).toEqual(expectedInteractions.length);

		for (let i in expectedInteractions) {
			const expectedInteraction = expectedInteractions[i];
			const actualInteraction = actualInteractions[i];

			const actualInteractionBody = this.getJsonFromRecordedRequest(actualInteraction);
			const allKeysFromActualInteractionBody = this.getAllKeysFromJson(actualInteractionBody);
			logger.debug(allKeysFromActualInteractionBody, 'Keys from actual interaction');
			expect(allKeysFromActualInteractionBody.length).toEqual(
				expectedInteraction.getNumberOfKeysExpectedInJson()
			);

			expectedInteraction
				.getJsonPathStringsToExpectedValues()
				.forEach((expectation: Interaction, jsonPathExpression: JsonPathExpression) => {
					const jsonKeyValue = jp.query(actualInteractionBody, jsonPathExpression.get())[0];
					logger.debug(
						`Check if '${jsonKeyValue}' obtained via JSON path '${jsonPathExpression.get()}' matches what's expected: '${expectation}'`
					);
					if (expectation instanceof RegExp) {
						expect(jsonKeyValue).toMatch(expectation);
					} else {
						expect(jsonKeyValue).toEqual(expectation);
					}
				});
		}
	}

	private async getResponsesForEndpoint(endpoint: string): Promise<Array<any>> {
		const data = {
			path: endpoint,
			method: 'POST'
		};
		const result = await axios.put(`${this.baseUrl}/mockserver/retrieve`, data);
		return result.data;
	}

	private getJsonFromRecordedRequest(request: any): any {
		return request.body.json;
	}

	private getAllKeysFromJson = (json: any, keys: string[] = []) => {
		if (json == null) {
			return keys;
		}
		for (const key of Object.keys(json)) {
			if (/^\d+$/.test(key) == false) {
				keys.push(key);
			}

			if (typeof json[key] == 'object') {
				this.getAllKeysFromJson(json[key], keys);
			}
		}
		return keys;
	};

	///////////////////
	///// HORIZON /////
	///////////////////

	getHorizonUrl(): string {
		return this.horizonUrl;
	}

	async mockHorizonCreateContactResponse(statusCode: number, idToReturn: string) {
		let body: any = {
			Envelope: {
				Body: {
					AddContactResponse: {
						AddContactResult: {
							value: idToReturn
						}
					}
				}
			}
		};

		if (statusCode >= 500) {
			body = { error: `mocked bad response, ID: ${idToReturn}` };
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

	async mockHorizonCreateAppealResponse(statusCode: number, caseReferenceToReturn: string) {
		let body: any = {
			Envelope: {
				Body: {
					CreateCaseResponse: {
						CreateCaseResult: {
							value: caseReferenceToReturn
						}
					}
				}
			}
		};

		if (statusCode >= 500) {
			body = { error: `mocked bad response, case ref: ${caseReferenceToReturn}` };
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

	async mockHorizonUploadDocumentResponse(statusCode: number, document: any) {
		let body: any = {};

		if (statusCode >= 500) {
			body = {
				Envelope: {
					Body: {
						Fault: {
							faultcode: {
								value: "a:InternalServiceFault"
							},
							faultstring: {
								value: "A mocked bad upload document response from Horizon"
							},
							detail: {
								ExceptionDetail: {
									HelpLink: {},
									InnerException: {},
									Message: {
										value: "A mocked bad upload document response from Horizon"
									},
									StackTrace: {
										value: "   a big\r\n   old\r\n   stacktrace from\r\n	at Horizon.API.Horizon.AddDocuments(String caseReference, List`1 documents)\r\n   at SyncInvokeAddDocuments(Object , Object[] , Object[] )\r\n   at System.ServiceModel.Dispatcher.SyncMethodInvoker.Invoke(Object instance, Object[] inputs, Object[]& outputs)\r\n   at System.ServiceModel.Dispatcher.DispatchOperationRuntime.InvokeBegin(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage5(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.ImmutableDispatchRuntime.ProcessMessage11(MessageRpc& rpc)\r\n   at System.ServiceModel.Dispatcher.MessageRpc.Process(Boolean isOperationContextSet)"
									},
									Type: {
										value: "System.Exception"
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

	async mockHorizonGetCaseResponse(
		finalCommentsDueDate: Date | undefined,
		statusCode: number
	): Promise<void> {
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
		const response = await axios.put(`${this.baseUrl}/mockserver/expectation`, data);

		logger.debug(response.data, 'Mock Horizon get case response');
	}

	private async getRecordedRequestsForHorizon(): Promise<Array<any>> {
		const contactAndOrgInteractions = await this.getResponsesForEndpoint(
			`${this.horizonEndpoint}/contacts`
		);
		const appealAndDocInteractions = await this.getResponsesForEndpoint(
			`${this.horizonEndpoint}/horizon`
		);

		appealAndDocInteractions.forEach((x) => logger.debug(x.body.json));

		return [...contactAndOrgInteractions, ...appealAndDocInteractions];
	}

	//////////////////
	///// NOTIFY /////
	//////////////////

	getNotifyUrl(): string {
		return this.notifyUrl;
	}

	async mockNotifyResponse(body: any, statusCode: number): Promise<void> {
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

	async getRecordedRequestsForNotify(): Promise<Array<any>> {
		return await this.getResponsesForEndpoint(this.notifyEndpoint);
	}

	/////////////////////////
	///// DOCUMENTS API /////
	/////////////////////////

	getDocumentsAPIUrl(): string {
		return this.documentsApiUrl;
	}

	async mockDocumentsApiResponse(
		statusCode: number,
		appealId: string,
		document: any,
		addDocumentGroupTypeToBody: boolean
	): Promise<void> {
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
		let data: any = {
			httpRequest: {
				method: 'GET',
				path: `${this.documentsApiEndpoint}/${appealId}/${document.id}/file`,
				queryStringParameters: [{ name: 'base64', values: ['true'] }]
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

		if (addDocumentGroupTypeToBody === false) {
			delete data.httpResponse.body.document_group_type;
		}

		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);
	}
}
