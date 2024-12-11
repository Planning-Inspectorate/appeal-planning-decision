// @ts-nocheck
/// <reference types="cypress"/>
module.exports = (statusOfOriginalApplication) => {
	cy.goToAppealSection('Upload documents from your planning application');

	// Planning application form
	cy.uploadFileFromFixturesDirectory('planning-application-form.pdf');
	cy.advanceToNextPage();

	// Ownership certificate and agricultural land declaration
	cy.get('#did-you-submit-separate-certificate').click();
	cy.advanceToNextPage();
	cy.uploadFileFromFixturesDirectory('ownership-certificate-and-agricultural-land-declaration.pdf');
	cy.advanceToNextPage();

	// Plans, drawings and supporting documents
	cy.get('#description-development-correct').click();
	cy.advanceToNextPage();
	cy.uploadFileFromFixturesDirectory('plans-drawings-and-supporting-documents.pdf');
	cy.advanceToNextPage();

	// Design and access statement
	cy.get('#design-access-statement-submitted').click();
	cy.advanceToNextPage();
	cy.uploadFileFromFixturesDirectory('design-and-access-statement.pdf');
	cy.advanceToNextPage();

	// Final screen of section, if the original application was refused, you get a
	// decision letter upload screen, but if the application has had no decision you
	// get a "letter confirming your planning application" upload screen. The interaction
	// with this screen is the same in either case, we just upload a different document
	// depending upon what path we take.
	let grantedOrRefusedFilename = '';
	if (statusOfOriginalApplication === 'refused') {
		grantedOrRefusedFilename = 'decision-letter.pdf';
	} else if (statusOfOriginalApplication === 'no decision') {
		grantedOrRefusedFilename = 'letter-confirming-planning-application.pdf';
	}
	cy.uploadFileFromFixturesDirectory(grantedOrRefusedFilename);
	cy.advanceToNextPage();
};
