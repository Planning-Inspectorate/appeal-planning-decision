import type { lifetimeDependencies, requestDependencies } from '../../src/dependencies.js';

declare global {
	namespace Express {
		interface Request {
			dependencies: lifetimeDependencies & requestDependencies;
		}
	}
}
