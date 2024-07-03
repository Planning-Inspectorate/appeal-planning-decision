import type { Api } from 'appeals-service-api';

export interface Row {
	keyText: string;
	valueText: string;
	condition: (caseData: Api.AppealCaseDetailed) => string | boolean | undefined;
	isEscaped?: boolean | undefined;
}

export type Rows = Array<Row>;
