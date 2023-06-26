module.exports = (statusOfOriginalApplication) => {
	cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
	cy.advanceToNextPage();
	cy.get('#local-planning-department')
		.type('System Test Borough Council')
		.get('#local-planning-department__option--0')
		.click();
	cy.advanceToNextPage();
	cy.get('#type-of-planning-application').click();
	cy.advanceToNextPage();
	cy.get('#site-selection-7').click();
	cy.advanceToNextPage();

	let grantedOrRefusedId = '';
	if (statusOfOriginalApplication === 'refused') {
		grantedOrRefusedId = '#granted-or-refused-2';
	} else if (statusOfOriginalApplication === 'no decision') {
		grantedOrRefusedId = '#granted-or-refused-4';
	}
	cy.get(grantedOrRefusedId).click();
	cy.advanceToNextPage();

	let currentDate = new Date();
	cy.get('#decision-date-day').type(currentDate.getDate());
	cy.get('#decision-date-month').type(currentDate.getMonth() + 1);
	cy.get('#decision-date-year').type(currentDate.getFullYear());
	cy.advanceToNextPage();

	cy.get('#enforcement-notice-2').click();
	cy.advanceToNextPage();

	cy.advanceToNextPage('Continue to my appeal');

	cy.get('#application-number').type(`TEST-${Date.now()}`);
	cy.advanceToNextPage();

	cy.get('#email-address').type('appealplanningdecisiontest@planninginspectorate.gov.uk');
	cy.advanceToNextPage();

	cy.visit(
		`${Cypress.config('appeals_beta_base_url')}/full-appeal/submit-appeal/email-address-confirmed`
	);
	cy.advanceToNextPage();

	cy.advanceToNextPage();
};
