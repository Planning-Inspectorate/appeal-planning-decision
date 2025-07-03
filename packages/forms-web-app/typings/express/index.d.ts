import { AppealsApiClient } from '@pins/common/src/client/appeals-api-client';
import { Journey } from '@pins/dynamic-forms/src/journey';
import { JourneyResponse } from '@pins/dynamic-forms/src/journey-response';

declare global {
	namespace Express {
		interface Request {
			appealsApiClient: AppealsApiClient;
		}
		interface Locals {
			journey: Journey;
			journeyResponse: JourneyResponse;
		}
	}
}
