import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers/';
import { MockServerClient, mockServerClient } from 'mockserver-client/mockServerClient'

export class MockServerContainer {

	private container: StartedTestContainer;
	private port: number;
	private mockServerClient: MockServerClient;

    static async create(): Promise<MockServerContainer> {

		let container = await new GenericContainer('mockserver/mockserver')
			.withExposedPorts(1080)
			.withWaitStrategy(Wait.forLogMessage(/.*started on port:.*/))
			.start();

		// We need to get the exact port number since Testcontainers assigns a random port
		// (by design) on the host machine to map to the one you expose in the container
		// itself. See here for more https://www.testcontainers.org/features/networking/
		let port = container.getMappedPort(1080);

		return new MockServerContainer(container, port);
	}

	private constructor(container: StartedTestContainer, port: number){
		this.container = container;
		this.port = port;
		this.mockServerClient = mockServerClient('localhost', this.port);
	}

	getHorizonUrl(): string {
		return `http://127.0.0.1:${this.port}`;
	}

	getHorizonEndpoint(): string {
		return `/horizon`
	}

	getMockServerClient(): MockServerClient {
		return this.mockServerClient;
	}

	async teardown(){
		await this.container.stop();
	}
}