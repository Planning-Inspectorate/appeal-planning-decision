import { summaryErrorMessage as summaryErrorMessageObject } from '../householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

export const validateErrorMessage = (
	errorMessage,
	errorMessageObjectId,
	summaryErrorMessageObjectId
) => {
	summaryErrorMessageObject(summaryErrorMessageObjectId).should('be.visible');
	cy.title().should('match', /^Error: /);
	cy.checkPageA11y();

	summaryErrorMessageObject(summaryErrorMessageObjectId)
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
};
