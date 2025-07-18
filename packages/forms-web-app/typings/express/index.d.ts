import { AppealsApiClient } from '@pins/common/src/client/appeals-api-client';
import { DocumentsApiClient } from '@pins/common/src/client/documents-api-client';
import { Journey } from '@pins/dynamic-forms/src/journey';
import { JourneyResponse } from '@pins/dynamic-forms/src/journey-response';
import pino from 'pino';

declare global {
	namespace Express {
		interface Request {
			appealsApiClient: AppealsApiClient;
			docsApiClient?: DocumentsApiClient;
			logger: pino.Logger;
		}
		interface Locals {
			journey: Journey;
			journeyResponse: JourneyResponse;
		}
	}
}
