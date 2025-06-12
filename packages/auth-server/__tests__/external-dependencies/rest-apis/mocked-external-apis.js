import { GenericContainer, Wait } from 'testcontainers';
import crypto from 'crypto';

/** @type {import('testcontainers').StartedTestContainer[]} */
const containers = [];

/**
 * This class is intended to act as a mocking interface for all external APIs that the
 * Appeals API relies upon in order to deliver its functionality.
 *
 * We did try to use the npm server (https://www.npmjs.com/package/mockserver) and client
 * (https://www.npmjs.com/package/mockserver-client) for this however, when the tests run
 * on the Azure build pipeline, `localhost` can not be resolved, so the tests fail.
 */
export class MockedExternalApis {
	baseUrl;
	container;

	notify = 'notifyMock';
	notifyEndpoint = `/${this.notify}/v2/notifications/email`; // Note that this is the full URL, known only to the Notify client
	notifyUrl;

	static async setup() {
		// support multiple instances with a random suffix
		const instance = crypto.randomBytes(8).toString('hex');
		const startedContainer = await new GenericContainer('mockserver/mockserver')
			.withName(`mockserver-for-appeals-api-test-${instance}`)
			.withExposedPorts(1081)
			.withEnvironment({ MOCKSERVER_SERVER_PORT: '1081' })
			.withWaitStrategy(Wait.forLogMessage(/.*started on port: 1081.*/))
			.start();

		const mock = new MockedExternalApis(startedContainer);

		process.env.SRV_NOTIFY_BASE_URL = mock.getNotifyUrl();

		containers.push(startedContainer);
		return mock;
	}

	constructor(container) {
		this.baseUrl = `http://${container.getHost()}:${container.getMappedPort(1081)}`;
		this.container = container;
		this.notifyUrl = `${this.baseUrl}/${this.notify}`;
	}

	getBaseUrl() {
		return `http://${this.baseUrl}`;
	}

	async teardown() {
		await this.container.stop();
	}

	//////////////////
	///// NOTIFY /////
	//////////////////
	getNotifyUrl() {
		return this.notifyUrl;
	}
}

export const teardownAPIs = async () => {
	await Promise.all(
		containers.map((c) => {
			console.log(`stopping ${c.getName()}`);
			c.stop();
		})
	);
};
