export const getPageTitle = () => cy.title();
export const getPageHeading = () => cy.get('h1');
export const getErrorMessageSummary =()=> cy.get('.govuk-error-summary');
export const getAcceptAnalyticsCookies = () =>cy.get('[data-cy=cookie-banner-accept-analytics-cookies]');
export const getCookiesBannerAcceptedHideMessage = () =>cy.get('[data-cy=cookie-banner-accepted-hide-message]');
export const getBackLink = () => cy.get('.govuk-back-link');
export const continueButton = () => cy.get('[data-cy=button-continue]');
export const getAppealDetailsSidebar = () => cy.get('table[data-cy="appealDetails"]');
export const getFileUploadButton = () => cy.get('#file-upload');
export const getSaveAndContinueButton = () => cy.get('[data-cy="button-save-and-continue"]');
export const confirmAndSubmitAppealButton = () => cy.get('[data-cy=accept-and-send]');
export const privacyNoticeLink = () => cy.findAllByText('Privacy Notice').should('have.attr','href');
export const termAndConditionsLink = () => cy.findAllByText('Terms and Conditions').should('have.attr','href');
export const declarationWarningText = () => cy.get('.govuk-warning-text__text');
export const appealSubmittedHeading = () => cy.get('.govuk-panel__title');
export const errorMessageConditionsHouseholder= () => cy.get('#conditions-householder-permission-error');

