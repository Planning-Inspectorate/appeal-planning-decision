import { summaryFileUploadErrorMessage } from '../householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { clickSaveAndContinue } from './clickSaveAndContinue';

export const validateFileUploadErrorMessage = (errorMessage, errorMessageObjectId) => {
	summaryFileUploadErrorMessage().should('be.visible');
	cy.title().should('match', /^Error: /);
	cy.checkPageA11y();

	summaryFileUploadErrorMessage()
		.invoke('text')
		.then((text) => {
			expect(text).to.contain(errorMessage);
		});

	if (errorMessageObjectId) {
		cy.get(errorMessageObjectId)
			.should('be.visible')
			.invoke('text')
			.then((text) => {
				expect(text).to.contain(errorMessage);
			});
	}
	clickSaveAndContinue();
};
