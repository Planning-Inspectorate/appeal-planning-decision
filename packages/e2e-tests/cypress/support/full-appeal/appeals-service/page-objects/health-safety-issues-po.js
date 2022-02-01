export const provideDetails = () => cy.get('#health-safety-issues-details').type(`{selectall}{backspace}The site has no mobile reception`);
export const errorMessageHealthSafetyIssuesDetails = () => cy.get('#health-safety-issues-details-error');
export const errorMessageHealthSafetyIssues = () => cy.get('#health-safety-issues-error');
