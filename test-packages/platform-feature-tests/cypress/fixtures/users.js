export const users = {
	appeals: {
		appellant: {
			email: Cypress.env('APPELLANT_EMAIL'),
			id: 'appellant',
			typeName: 'Appellant'
		},
		authUser: {
			email: Cypress.env('AUTH_EMAIL'),
			id: 'auth-user',
			typeName: 'Auth User'
		},
		caseAdmin: {
			email: Cypress.env('CASE_ADMIN_EMAIL'),
			id: 'case-admin',
			typeName: 'Case admin'
		}
	}
};