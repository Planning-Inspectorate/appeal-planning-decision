export const getPageTitle = () => cy.title();
export const getPageHeading = () => cy.get('h1');
export const getErrorMessageSummary =()=> cy.get('.govuk-error-summary');
export const getAcceptAnalyticsCookies = () =>cy.get('[data-cy=cookie-banner-accept-analytics-cookies]');
export const getCookiesBannerAcceptedHideMessage = () =>cy.get('[data-cy=cookie-banner-accepted-hide-message]');
export const getBackLink = () => cy.get('.govuk-back-link');
export const continueButton = () => cy.get('[data-cy=button-continue]');
export const getAppealDetailsSidebar = () => cy.get('table[data-cy="appealDetails"]');
