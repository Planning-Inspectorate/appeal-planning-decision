import type { Api } from 'appeals-service-api';
import { AppealToUserRoles, LpaUserRole } from '../../constants';

export interface Section {
	heading: string;
	links: Array<{
		url: string;
		text: string;
		condition: (
			appealCase: Api.AppealCaseWithRule6Parties,
			userEmail?: string
		) => boolean | undefined;
	}>;
}

export type Sections = Array<Section>;

export type UserType = AppealToUserRoles | LpaUserRole;

export type UserSectionsDict = { [userType: UserType]: Sections };
