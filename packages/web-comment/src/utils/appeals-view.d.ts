import { Api } from 'appeals-service-api';

export interface AppealViewModel extends Api.AppealCaseWithAppellant {
	formattedAddress?: string;
	formattedCaseDecisionDate?: string;
	formattedDecisionColour?: string;
	status?: string;
}
