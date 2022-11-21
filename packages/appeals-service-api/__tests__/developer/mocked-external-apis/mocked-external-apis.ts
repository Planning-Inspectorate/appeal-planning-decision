import { Interaction } from "./interaction";
import { expect } from '@jest/globals'
import jp from 'jsonpath';

const mockserver = require('mockserver-node');
var mockServer = require('mockserver-client'),
	mockServerClient = mockServer.mockServerClient;

export class MockedExternalApis {

    private host: string = 'localhost';
    private port: number;

    private horizon: string = 'horizon';
    private horizonEndpoint: string = `/${this.horizon}`;
    private horizonBaseUrl: string;

    private notify: string = 'notify';
    private notifyEndpoint: string = `/${this.notify}/v2/notifications/email`;
    private notifyBaseUrl: string;
    
    static async setup(port = 1080): Promise<MockedExternalApis> {
        await mockserver.start_mockserver({ serverPort: port });
        return new MockedExternalApis(port);
    }

    ///////////////////
    ///// GENERAL /////
    ///////////////////
    
    private constructor(port: number) {
        this.port = port
        this.horizonBaseUrl = `http://${this.host}:${this.port}/${this.horizon}`
        this.notifyBaseUrl = `http://${this.host}:${this.port}/${this.notify}`
    }

    async clearAllMockedResponsesAndRecordedInteractions(): Promise<void> {
        await mockServerClient(this.host, this.port).reset()
    }

    async checkInteractions(expectedHorizonInteractions: Array<Interaction>, expectedNotifyInteractions: Array<Interaction>) {
        const actualHorizonInteractions = await this.getRecordedRequestsForHorizon();
        const actualNotifyInteractions = await this.getRecordedRequestsForNotify();

        this.verifyInteractions(expectedHorizonInteractions, actualHorizonInteractions);
        this.verifyInteractions(expectedNotifyInteractions, actualNotifyInteractions);
    }
    
    async teardown(): Promise<void> {
        await mockserver.stop_mockserver({ serverPort: this.port });
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
        return await mockServerClient(this.host, this.port).retrieveRecordedRequests({
            "path": endpoint,
            "method": "POST"
        })
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

    async mockHorizonResponse(body: any, statusCode: number): Promise<void>{
        await mockServerClient(this.host, this.port).mockSimpleResponse(
            this.horizonEndpoint,
			body,
			statusCode
        );
    }

    private async getRecordedRequestsForHorizon(): Promise<Array<any>> {
        return await this.getResponsesForEndpoint(this.horizonEndpoint)
    }
        
    //////////////////
    ///// NOTIFY /////
    //////////////////

    async mockNotifyResponse(body: any, statusCode: number): Promise<void> {
        await mockServerClient(this.host, this.port).mockSimpleResponse(this.notifyEndpoint, body, statusCode);
    }

    private async getRecordedRequestsForNotify(): Promise<Array<any>> {
        return await this.getResponsesForEndpoint(this.notifyEndpoint)
    }
}