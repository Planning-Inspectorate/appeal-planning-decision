import type { Api } from 'appeals-service-api';

export interface Row {
	keyText: string;
	valueText: string | undefined;
	shouldDisplay: boolean;
}

export type Rows = Array<Row>;
