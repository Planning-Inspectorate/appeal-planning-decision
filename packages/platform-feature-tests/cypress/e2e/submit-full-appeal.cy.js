describe('empty spec', () => {
	it('passes', () => {
		///// START: initialise full appeal /////
		cy.visit('before-you-start');
		advanceToNextPage();
		cy.get('#local-planning-department')
			.type('System Test Borough Council')
			.get('#local-planning-department__option--0')
			.click();
		advanceToNextPage();
		cy.get('#type-of-planning-application').click();
		advanceToNextPage();
		cy.get('#site-selection-7').click();
		advanceToNextPage();
		cy.get('#granted-or-refused-2').click();
		advanceToNextPage();

		let currentDate = new Date();
		cy.get('#decision-date-day').type(currentDate.getDay());
		cy.get('#decision-date-month').type(currentDate.getMonth() + 1);
		cy.get('#decision-date-year').type(currentDate.getFullYear());
		advanceToNextPage();

		cy.get('#enforcement-notice-2').click();
		advanceToNextPage();

		advanceToNextPage('Continue to my appeal');

		cy.get('#application-number').type('12345');
		advanceToNextPage();

		cy.get('#email-address').type('test@example.com');
		advanceToNextPage();

		cy.visit('full-appeal/submit-appeal/email-address-confirmed');
		advanceToNextPage();

		advanceToNextPage();
		///// END: initialise full appeal /////

		///// START: contact details /////
		goToAppealSection('Provide your contact details');

		cy.get('#original-application-your-name').click();
		advanceToNextPage();

		cy.get('#appellant-name').type('Test Test');
		advanceToNextPage();
		///// END: contact details /////

		///// START: appeal site /////
		goToAppealSection('Tell us about the appeal site');

		cy.get('#site-address-line-one').type('Test Building');
		cy.get('#site-address-line-two').type('Test Street');
		cy.get('#site-town-city').type('Test city');
		cy.get('#site-county').type('Test County');
		cy.get('#site-postcode').type('DN16 2SE');
		advanceToNextPage();

		cy.get('#own-all-the-land').click(); //TODO: an appeal to click "no"?
		advanceToNextPage();

		cy.get('#agricultural-holding-2').click(); // TODO: an appeal to click "yes"?
		advanceToNextPage();

		cy.get('#visible-from-road').click(); // TODO: an appeal to click "no"?
		advanceToNextPage();

		cy.get('#health-safety-issues-2').click(); // TODO: an appeal to click "yes"?
		advanceToNextPage();
		///// END: contact details /////

		///// START: appeal decision type /////
		goToAppealSection('Tell us how you would prefer us to decide your appeal');

		cy.get('#procedure-type').click();
		advanceToNextPage();
		///// END: appeal decision type /////

		///// START: upload planning application documents /////
		goToAppealSection('Upload documents from your planning application');

		// Planning application form
		uploadFileFromFixturesDirectory('planning-application-form.pdf');
		advanceToNextPage();

		// Ownership certificate and agricultural land declaration
		cy.get('#did-you-submit-separate-certificate').click();
		advanceToNextPage();
		uploadFileFromFixturesDirectory('ownership-certificate-and-agricultural-land-declaration.pdf');
		advanceToNextPage();

		// Plans, drawings and supporting documents
		cy.get('#description-development-correct').click();
		advanceToNextPage();
		uploadFileFromFixturesDirectory('plans-drawings-and-supporting-documents.pdf');
		advanceToNextPage();

		// Design and access statement
		cy.get('#design-access-statement-submitted').click();
		advanceToNextPage();
		uploadFileFromFixturesDirectory('design-and-access-statement.pdf');
		advanceToNextPage();

		// Decision letter
		uploadFileFromFixturesDirectory('decision-letter.pdf');
		advanceToNextPage();
		///// END: upload planning application documents /////

		///// START: upload appeal documents /////
		goToAppealSection('Upload documents for your appeal');

		// Appeal statement
		uploadFileFromFixturesDirectory('appeal-statement-valid.pdf');
		cy.get('#does-not-include-sensitive-information').click();
		advanceToNextPage();

		// Plans drawings
		cy.get('#plans-drawings').click();
		advanceToNextPage();
		uploadFileFromFixturesDirectory('plans-drawings.jpeg');
		advanceToNextPage();

		// Planning obligation (full)
		cy.get('#plan-to-submit-planning-obligation').click();
		advanceToNextPage();
		cy.get('#planning-obligation-status').click(); // TODO: we'll need to select the other option here to submit a draft planning obligation too
		advanceToNextPage();
		uploadFileFromFixturesDirectory('planning-obligation.pdf');
		advanceToNextPage();

		// Other supporting documents
		cy.get('#supporting-documents').click();
		advanceToNextPage();
		uploadFileFromFixturesDirectory('other-supporting-docs.pdf');
		advanceToNextPage();
		///// END: upload appeal documents /////

		// ///// START: Check answers and submit /////
		goToAppealSection('Check your answers and submit your appeal');
		advanceToNextPage();
		advanceToNextPage('Confirm and submit appeal');
		// ///// END: Check answers and submit /////
	});
});

const advanceToNextPage = (text = 'Continue') => {
	cy.get('.govuk-button').contains(text).click();
};

const goToAppealSection = (sectionName) => {
	cy.get('.moj-task-list__task-name').contains(sectionName).click();
};

const uploadFileFromFixturesDirectory = (filename) => {
	cy.fixture(filename, { encoding: null }).as('file');
	cy.get('#file-upload').selectFile('@file', { action: 'drag-drop' });
};
