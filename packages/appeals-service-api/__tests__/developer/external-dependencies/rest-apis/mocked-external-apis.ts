import { Interaction } from './interaction';
import { expect } from '@jest/globals';
import jp from 'jsonpath';
import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';
import axios from 'axios';

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

	private horizon: string = 'horizon';
	private horizonEndpoint: string = `/${this.horizon}`;
	private horizonUrl: string;

	private notify: string = 'notify';
	private notifyEndpoint: string = `/${this.notify}/v2/notifications/email`; // Note that this is the full URL, known only to the Notify client which is provided by the Government
	private notifyUrl: string;

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
		this.horizonUrl = `${this.baseUrl}${this.horizonEndpoint}`;
		this.notifyUrl = `${this.baseUrl}/${this.notify}`;
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
			expect(expectedInteraction.getNumberOfKeysExpectedInJson()).toEqual(
				this.getAllKeysFromJson(actualInteractionBody).length
			);

			expectedInteraction
				.getJsonPathStringsToExpectedValues()
				.forEach((expectation, jsonPathExpression) => {
					const jsonKeyValue = jp.query(actualInteractionBody, jsonPathExpression.get())[0];
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
		for (const key of Object.keys(json)) {
			keys.push(key);
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
				path: this.horizonEndpoint
			},
			httpResponse: {
				statusCode: statusCode,
				body: body
			}
		};
		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);
	}

	private async getRecordedRequestsForHorizon(): Promise<Array<any>> {
		return await this.getResponsesForEndpoint(this.horizonEndpoint);
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
			}
		};
		await axios.put(`${this.baseUrl}/mockserver/expectation`, data);
	}

	async getRecordedRequestsForNotify(): Promise<Array<any>> {
		return await this.getResponsesForEndpoint(this.notifyEndpoint);
	}
}
