const path = require('path');
import { GenericContainer, StartedTestContainer } from 'testcontainers/';

let startedContainer: StartedTestContainer;

const startAppContainer = async () => {
	const buildContext = path.resolve(__dirname, '../../');

	const containerToStart = await GenericContainer.fromDockerfile(buildContext).build();

	startedContainer = await containerToStart.withExposedPorts(3000).start();
};

const stopAppContainer = async () => {
	await startedContainer.stop();
};

module.exports = {
	startAppContainer,
	stopAppContainer
};
