import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';

export class TestMessageQueue {
	private startedContainer: StartedTestContainer;

	
	static async create(): Promise<TestMessageQueue> {
		// We use Azure Service Bus in production however, there is no Docker image for this, and Microsoft
		// appear to have no plans to release one in future (see this LENGTHY thread here: 
		// https://github.com/Azure/azure-service-bus/issues/223). Since Azure Service Bus only uses 
		// AMQP protocol version 1.0 too, we need to use a broker that handles this protocol. Rabbit MQ's 
		// support at the time of writing is experimental, and its a pain trying to enable the relevant 
		// plugin via Docker so, we've decided to use Apache Active MQ instead.
		// 
		// Its not perfect, but its as close to an approximation of the system used in production as we can
		// get...
		let container = await new GenericContainer('rmohr/activemq')
			.withExposedPorts(5672)
			.withWaitStrategy(Wait.forLogMessage(/.*Apache ActiveMQ .* started/))
			.start();

		return new TestMessageQueue(container);
	}

	constructor(
		startedContainer: StartedTestContainer
	) {
		this.startedContainer = startedContainer;
	}

	/**
	 *
	 * @returns A fragment of JSON that can be used in the relevant section of JSON that can be
	 * used in the main app's configuration
	 */
	getTestConfigurationSettingsJSON() {
		return {
			connection: {
				host: 'localhost',
				hostname: 'local',
				port: this.startedContainer.getMappedPort(5672),
				transport: 'tcp',
				reconnect: false,
				reconnect_limit: 1,
				username: 'admin',
				password: 'admin'
			},
			queue: 'test'
		};
	}

	async teardown() {
		try {
			await this.startedContainer.stop();
		} catch (e) {
			console.log(e);
		}
	}
}