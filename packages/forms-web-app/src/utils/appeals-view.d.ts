import { Api } from 'appeals-service-api';

export interface AppealViewModel extends Api.AppealCaseDetailed {
	formattedAddress?: string;
	formattedCaseDecisionDate?: string;
	formattedDecisionColour?: string;
	status?: 'open' | 'closed' | 'decided';
}
