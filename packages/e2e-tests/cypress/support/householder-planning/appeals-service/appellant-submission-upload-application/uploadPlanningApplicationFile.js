import 'cypress-file-upload';

export const uploadPlanningApplicationFile = (path) => {
  cy.get('#application-upload').attachFile({ filePath: path, encoding: 'binary' });
  cy.wait(Cypress.env('demoDelay'));
};
