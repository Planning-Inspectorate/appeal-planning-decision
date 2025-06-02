import type { IncomingMessage } from 'http';
import type { lifetimeDependencies, requestDependencies } from '../../src/dependencies.js';

declare module 'http' {
	interface IncomingMessage {
		dependencies?: lifetimeDependencies & requestDependencies;
	}
}
