import type { Api } from 'appeals-service-api';

export type Section = Array<{
	heading: string;
	links: Array<{
		url: string;
		text: string;
		condition: (
			appealCase: Api.AppealCaseWithRule6Parties,
			userEmail: string | null
		) => boolean | undefined;
	}>;
}>;
