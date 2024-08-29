import { AppealsApiClient } from '@pins/common/src/client/appeals-api-client';
import { Journey } from 'src/dynamic-forms/journey';
import { JourneyResponse } from 'src/dynamic-forms/journey-response';

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
