export const getContinueButton = () => cy.get('button[data-cy=button-save-and-continue]');
export const getPageTitle = () => cy.title();
export const getPageHeading = () => cy.get('h1');
export const getErrorMessageSummary =()=> cy.get('.govuk-error-summary');
export const getAcceptAnalyticsCookies = () =>cy.get('[data-cy=cookie-banner-accept-analytics-cookies]');
export const getCookiesBannerAcceptedHideMessage = () =>cy.get('[data-cy=cookie-banner-accepted-hide-message]');
export const getBackLink = () => cy.get('.govuk-back-link');
export const getErrorMessageOnLabel = () => cy.get ('#householder-planning-permission-error');
