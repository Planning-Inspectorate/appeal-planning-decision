export const applicationStatusText = () => cy.get('[data-cy=application-status]');
//status text for You have completed 0 of 5 tasks
export const applicationStatusDetailedText = () => cy.get('[data-cy=application-status-detailed]');
export const linkProvideYourContactDetails = () => cy.get('[data-cy=contactDetailsSection]');
export const statusProvideYourContactDetails = () => cy.get('[data-cy=task-list-item-contactDetailsSection] > .govuk-tag');
export const linkTellAboutTheAppealSite = () => cy.get('[data-cy=aboutAppealSiteSection]');
export const linkDecideYourAppeal = () => cy.get('[data-cy=appealDecisionSection]');
export const statusTellAboutTheAppealSite = () => cy.get('[data-cy=task-list-item-aboutAppealSiteSection] > .govuk-tag');
export const linkUploadDocsFromPlanningApplication = () => cy.get('[data-cy=task-list-item-planningApplicationDocumentsSection] > .govuk-tag');
export const statusUploadDocsFromPlanningApplication = () => cy.get('[data-cy=task-list-item-planningApplicationDocumentsSection] > .govuk-tag');
export const linkUploadDocsForYourAppeal = () => cy.get('[data-cy=appealDocumentsSection]');
export const statusUploadDocsForYourAppeal = () => cy.get('[data-cy=task-list-item-appealDocumentsSection] > .govuk-tag');
export const linkCheckYourAnswers = () => cy.get('[data-cy=submitYourAppealSection]')
export const statusCheckYourAnswers = () => cy.get('[data-cy=task-list-item-submitYourAppealSection] > .govuk-tag');
export const applicationStatus = () => cy.get('[data-cy=application-status]');
export const applicationStatusDetailed = () => cy.get('[data-cy=application-status-detailed]');









