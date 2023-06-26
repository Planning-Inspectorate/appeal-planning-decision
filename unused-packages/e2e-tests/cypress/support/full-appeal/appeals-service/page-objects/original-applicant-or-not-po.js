export const originalApplicantYes = () => cy.get('#original-application-your-name');
export const originalApplicantNo = () => cy.get('#original-application-your-name-2');
export const buttonContinue = () => cy.get('[data-cy=button-continue]');
export const originalApplicationYourNameError = () =>
	cy.get('#original-application-your-name-error');
export const originalApplicantName = () => cy.get('#behalf-appellant-name');
export const applicantCompanyName = () => cy.get('#company-name');
export const behalfApplicantNameErrorMessage = () => cy.get('#behalf-appellant-name-error');
export const contactDetailsFullName = () => cy.get('#appellant-name');
export const contactDetailsCompanyName = () => cy.get('#appellant-company-name');
export const contactDetailsEmail = () => cy.get('#appellant-email');
export const fullnameErrorMessage = () => cy.get('#appellant-name-error');
export const EmailErrorMessage = () => cy.get('#appellant-email-error');
