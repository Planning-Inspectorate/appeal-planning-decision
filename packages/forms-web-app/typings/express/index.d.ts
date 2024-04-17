import { AppealsApiClient } from '@pins/common/src/client/appeals-api-client';

declare global {
	namespace Express {
		interface Request {
			appealsApiClient: AppealsApiClient;
		}
	}
}
