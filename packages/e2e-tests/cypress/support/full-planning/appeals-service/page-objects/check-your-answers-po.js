export const getPageCaption = () => cy.get('[data-cy="caption"]');
export const getPageHeading = () =>  cy.get('[data-cy="page-title"]');
export const getSectionHeading = () =>  cy.get('[data-cy="your-contact-details"]');
export const getPlanningAppMadeInYourName = () =>  cy.findAllByText('Was the planning application made in your name?');
export const CheckYourAnswersLink = () =>  cy.get('[data-cy="submitYourAppealSection"]');
export const yourContactDetails = () => cy.get('.govuk-summary-list__key');



