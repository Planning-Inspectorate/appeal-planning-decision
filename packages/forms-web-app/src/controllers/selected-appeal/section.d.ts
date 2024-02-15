import { AppealCaseWithAppellant } from '@pins/common';

export type Section = Array<{
	heading: string;
	links: Array<{
		url: string;
		text: string;
		condition: (appealCase: AppealCaseWithAppellant) => boolean;
	}>;
}>;
