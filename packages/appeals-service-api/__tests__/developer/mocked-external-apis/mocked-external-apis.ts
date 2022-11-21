import { Interaction } from "./interaction";
import { expect } from '@jest/globals'
import jp from 'jsonpath';
import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/'
import axios from 'axios';

const mockserver = require('mockserver-node');
var mockServer = require('mockserver-client'),
	mockServerClient = mockServer.mockServerClient;

export class MockedExternalApis {

    // private host: string = 'localhost';
    // private host: string;
    // private port: number;
    private baseUrl: string;
    private container: StartedTestContainer;

    private horizon: string = 'horizon';
    private horizonEndpoint: string = `/${this.horizon}`;
    private horizonUrl: string;

    private notify: string = 'notify';
    private notifyEndpoint: string = `/${this.notify}/v2/notifications/email`; // Note that this is the full URL, known only to the Notify client which is provided by the Government
    private notifyUrl: string;
    
    static async setup(): Promise<MockedExternalApis> {
        // await mockserver.start_mockserver({ serverPort: 1080, log_level: 'trace' });
        // return new MockedExternalApis(1080);
        const startedContainer = await new GenericContainer('mockserver/mockserver')
            .withName('mockserver-for-appeals-api-test')
            .withExposedPorts(1080)
            .withWaitStrategy(Wait.forLogMessage(/.*started on port: 1080.*/))
            .start();

        // const stream = await startedContainer.logs();
        // stream
        //     .on("data", line => console.log(line))
        //     .on("err", line => console.error(line))
        //     .on("end", () => console.log("Stream closed"));

        return new MockedExternalApis(startedContainer)
    }

    getBaseUrl(): string {
        return `http://${this.baseUrl}`;
    }

    ///////////////////
    ///// GENERAL /////
    ///////////////////
    
    // private constructor(port: number) {
    private constructor(container: StartedTestContainer) {
        // this.host = container.getHost();
        // this.port = container.getMappedPort(1080)
        this.baseUrl = `http://${container.getHost()}:${container.getMappedPort(1080)}`
        this.container = container;
        // this.port = port;
        // this.horizonBaseUrl = `http://${this.host}:${this.port}/${this.horizon}`
        // this.notifyBaseUrl = `http://${this.host}:${this.port}/${this.notify}`
        this.horizonUrl = `${this.baseUrl}${this.horizonEndpoint}`
        this.notifyUrl = `${this.baseUrl}/${this.notify}`
    }

    async clearAllMockedResponsesAndRecordedInteractions(): Promise<void> {
        // await mockServerClient(this.host, this.port).reset()
        await axios.put(`${this.baseUrl}/mockserver/reset`)
    }

    async checkInteractions(expectedHorizonInteractions: Array<Interaction>, expectedNotifyInteractions: Array<Interaction>) {
        const actualHorizonInteractions = await this.getRecordedRequestsForHorizon();
        const actualNotifyInteractions = await this.getRecordedRequestsForNotify();

        this.verifyInteractions(expectedHorizonInteractions, actualHorizonInteractions);
        this.verifyInteractions(expectedNotifyInteractions, actualNotifyInteractions);
    }
    
    async teardown(): Promise<void> {
        // await mockserver.stop_mockserver({ serverPort: this.port });
        await this.container.stop();
    }

    private verifyInteractions(expectedInteractions: Array<Interaction>, actualInteractions: any): void {
        expect(expectedInteractions.length).toEqual(actualInteractions.length);

        for (let i in expectedInteractions){
            const expectedInteraction = expectedInteractions[i];
            const actualInteraction = actualInteractions[i];

            const actualInteractionBody = this.getJsonFromRecordedRequest(actualInteraction);
            expect(expectedInteraction.getNumberOfKeysExpectedInJson()).toEqual(this.getAllKeysFromJson(actualInteractionBody).length)

            expectedInteraction
                .getJsonPathStringsToExpectedValues()
                .forEach((expectation, jsonPathExpression) => {
                    const jsonKeyValue = jp.query(actualInteractionBody, jsonPathExpression.get())[0]
                    if (expectation instanceof RegExp) {
                        expect(jsonKeyValue).toMatch(expectation)
                    } else {
                        expect(jsonKeyValue).toEqual(expectation)
                    }
                })
        }
    }
    
    private async getResponsesForEndpoint(endpoint: string): Promise<Array<any>> {
        // return await mockServerClient(this.host, this.port).retrieveRecordedRequests({
        //     "path": endpoint,
        //     "method": "POST"
        // })

        const data = {
            "path": endpoint,
            "method": "POST"
        }
        const result = await axios.put(`${this.baseUrl}/mockserver/retrieve`, data)
        return result.data
    }

    private getJsonFromRecordedRequest(request: any): any {
        return request.body.json
    }
    
    private getAllKeysFromJson = (json: any, keys: string[] = []) => {
        for (const key of Object.keys(json)) {
            keys.push(key)
            if (typeof json[key] == 'object'){
                this.getAllKeysFromJson(json[key], keys)
            }
        }
        return keys
    }

    ///////////////////
    ///// HORIZON /////
    ///////////////////

    getHorizonUrl(): string {
        return this.horizonUrl;
    }
 
    async mockHorizonResponse(body: any, statusCode: number): Promise<void>{
        // await mockServerClient(this.host, this.port).mockSimpleResponse(
        //     this.horizonEndpoint,
		// 	body,
		// 	statusCode
        // );
        const data = {
            "httpRequest" : {
                "method" : "POST",
                "path" : this.horizonEndpoint,
              },
              "httpResponse" : {
                "statusCode": statusCode,
                "body" : body
              }
        }
        await axios.put(`${this.baseUrl}/mockserver/expectation`, data)
    }

    private async getRecordedRequestsForHorizon(): Promise<Array<any>> {
        return await this.getResponsesForEndpoint(this.horizonEndpoint)
    }
        
    //////////////////
    ///// NOTIFY /////
    //////////////////

    getNotifyUrl(): string {
        return this.notifyUrl;
    }

    async mockNotifyResponse(body: any, statusCode: number): Promise<void> {
        // await mockServerClient(this.host, this.port).mockSimpleResponse(this.notifyEndpoint, body, statusCode);
        const data = {
            "httpRequest" : {
                "method" : "POST",
                "path" : this.notifyEndpoint,
              },
              "httpResponse" : {
                "statusCode": statusCode,
                "body" : body
              }
        }
        await axios.put(`${this.baseUrl}/mockserver/expectation`, data)
    }

    private async getRecordedRequestsForNotify(): Promise<Array<any>> {
        return await this.getResponsesForEndpoint(this.notifyEndpoint)
    }
}