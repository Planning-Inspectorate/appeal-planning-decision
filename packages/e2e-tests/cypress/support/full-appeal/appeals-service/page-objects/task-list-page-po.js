export const applicationStatus = () => cy.get('[data-cy=application-status]');
export const applicationStatusDetailed = () => cy.get('[data-cy=application-status-detailed]');
export const contactDetailsLink = () => cy.get('[data-cy=contactDetailsSection]');
export const aboutAppealSiteSectionLink = () => cy.get('[data-cy=aboutAppealSiteSection]')
export const planningApplicationDocumentsLink = () => cy.get('[data-cy=planningApplicationDocumentsSection]');
export const appealDocumentsSectionLink = () => cy.get('[data-cy=appealDocumentsSection]');
export const checkYourAnswersLink = () => cy.get('[data-cy=submitYourAppealSection]');
export const pageCaptionText = () => cy.get('.govuk-caption-l');
export const noneOfTheseOption = () => cy.get('#site-selection-7');
export const grantedOrRefused = () => cy.get('#granted-or-refused-2');



