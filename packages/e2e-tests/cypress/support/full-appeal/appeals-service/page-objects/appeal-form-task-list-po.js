export const applicationStatusText = () => cy.get('[data-cy=application-status]');
//status text for You have completed 0 of 5 tasks
export const applicationStatusDetailedText = () => cy.get('[data-cy=application-status-detailed]');
export const linkProvideYourContactDetails = () => cy.get('[data-cy=contactDetailsSection]');
export const statusProvideYourContactDetails = () => cy.get('[data-cy=task-list-item-contactDetailsSection]');
export const linkTellAboutTheAppealSite = () => cy.get('[data-cy=appealSiteSection]');
export const linkDecideYourAppeal = () => cy.get('[data-cy=appealDecisionSection]');
export const statusTellAboutTheAppealSite = () => cy.get('[data-cy=task-list-item-appealSiteSection]');
export const linkUploadDocsFromPlanningApplication = () => cy.get('[data-cy=planningApplicationDocumentsSection]');
export const statusUploadDocsFromPlanningApplication = () => cy.get('[data-cy=task-list-item-planningApplicationDocumentsSection]');
export const linkUploadDocsForYourAppeal = () => cy.get('[data-cy=appealDocumentsSection]');
export const statusUploadDocsForYourAppeal = () => cy.get('[data-cy=task-list-item-appealDocumentsSection]');
export const linkAppealDecisionSection = () => cy.get('[data-cy=appealDecisionSection]');
export const statusAppealDecisionSection = () => cy.get('[data-cy=task-list-item-appealDecisionSection]');
export const linkCheckYourAnswers = () => cy.get('[data-cy=submitYourAppealSection]');
export const statusCheckYourAnswers = () => cy.get('[data-cy=task-list-item-submitYourAppealSection]');
export const applicationStatus = () => cy.get('[data-cy=application-status]');
export const applicationStatusDetailed = () => cy.get('[data-cy=application-status-detailed]');
export const pageCaptionText = () => cy.get('.govuk-caption-l');









