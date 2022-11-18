const mockserver = require('mockserver-node');
var mockServer = require('mockserver-client'),
	mockServerClient = mockServer.mockServerClient;

export class MockServer {

    static host: string = 'localhost';
    static port: number = 1080;
    static notify: string = 'notify';
    static notifyEndpoint: string = `/${MockServer.notify}/v2/notifications/email`;
    static notifyBaseUrl: string = `http://${MockServer.host}:${MockServer.port}/${MockServer.notify}`

    static async setup(): Promise<void> {
        await mockserver.start_mockserver({ serverPort: MockServer.port });
    }

    static async mockNotifyResponse(body: any, statusCode: number) {
        await mockServerClient(MockServer.host, MockServer.port).mockSimpleResponse(MockServer.notifyEndpoint, body, statusCode);
    }

    static async mockHorizonResponse(body: any, statusCode: number){
        await mockServerClient(MockServer.host, MockServer.port).mockSimpleResponse(
			'/horizon',
			body,
			statusCode
		);
    }

    static async getRecordedRequestsForNotify() {
        return await mockServerClient(MockServer.host, MockServer.port).retrieveRecordedRequests({
            "path": MockServer.notifyEndpoint,
            "method": "POST"
        })
    }

    static getBodiesFromNotifyRecordedRequests(notifyRecordedRequests: any) {
        return notifyRecordedRequests
            .filter((request: any) => request.path == MockServer.notifyEndpoint)
            .map((notifyRequest: any) => notifyRequest.body.json);
    }

    static async teardown(){
        mockserver.stop_mockserver({ serverPort: MockServer.port });
    }
}