import { AppealsApiClient } from '@pins/common/src/client/appeals-api-client';
import { DocumentsApiClient } from '@pins/common/src/client/documents-api-client';
import { Journey } from 'src/dynamic-forms/journey';
import { JourneyResponse } from 'src/dynamic-forms/journey-response';

declare global {
	namespace Express {
		interface Request {
			appealsApiClient: AppealsApiClient;
			docsApiClient: DocumentsApiClient;
		}
		interface Locals {
			journey: Journey;
			journeyResponse: JourneyResponse;
		}
	}
}
